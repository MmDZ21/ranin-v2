# Dashboard Performance Plan

> Diagnosis + prioritized fixes for slow dashboard page loads.
> Created 2026-07-01. Based on a cross-layer audit (auth, web data-fetching, API/DB, rendering) plus first-hand code review. UI-only; no fixes applied yet.

## TL;DR

1. **Most likely the whole story:** the app is running in **dev mode** (`next dev` + Turbopack). Next 16 compiles each route the *first* time you visit it, so "different pages are slow" is usually first-visit compilation, not an app bug. **Confirm before optimizing** (see Phase 0).
2. **Real residual cost (persists in production):** every `/dashboard` route is dynamic SSR with **zero caching**, so each navigation blocks on a server render + fresh API round-trips. There is no `loading.tsx`, the session cookie is verified ~12× per home navigation, the API reloads the user from Postgres on every request, and edit pages fetch sequentially.
3. **Bonus correctness bug:** the product list calls the public, published-only, capped-at-20 endpoint instead of the admin one.

Confirmed **NOT** causes (ruled out — don't spend time here):
- Proxy makes **no** network call on normal navigations (only refreshes on token expiry, ~once/hour). `apps/web/proxy.ts:29,37,45`
- Fonts are non-blocking (`display: swap`), loaded once. `apps/web/app/layout.tsx:12`
- `swiper` / `motion` are route-scoped to public pages, **not** in the dashboard bundle.
- `SidebarProvider` / `DirectionProvider` / `AppSidebar` do **not** re-mount or re-fetch between dashboard pages.
- The recent UI refactor (`nav-main` `usePathname`, `DashboardBreadcrumb`) is client-only and adds **zero** server/network latency.

---

## Phase 0 — Confirm the cause (do this first, 5 min)

The single highest-value step. Everything below is only worth doing if prod is still slow.

- [ ] Visit a dashboard page, navigate away, come back. If the **second visit is fast**, it's dev-mode compilation.
- [ ] Benchmark a real build instead of `next dev`:
  ```
  pnpm --filter ./apps/web build && pnpm --filter ./apps/web start
  ```
- [ ] Watch the dev server log — a slow first hit prints `Compiling /dashboard/...`; the fast second hit does not.

If production navigation is acceptable, **stop here**. The rest is optimization for the genuinely-dynamic prod path.

---

## Phase 1 — Web quick wins (low risk, high felt-impact)

### 1.1 Add `loading.tsx` skeletons per dashboard segment  ·  impact: **high (perceived)**  ·  risk: low
Dynamic routes block on the full server render + API before anything paints. A `loading.tsx` streams an instant skeleton while data resolves, so navigation *feels* immediate.
- Add `app/dashboard/loading.tsx` (a generic skeleton: `PageHeader` placeholder + card/table shimmer).
- Optionally per-segment: `app/dashboard/products/loading.tsx`, `.../blog/loading.tsx`, etc.
- Optionally wrap the data-fetching body of each page in `<Suspense>` so the shell paints first.
- **Verify:** navigate between pages — the sidebar/header stay, a skeleton shows immediately, content streams in.

### 1.2 Memoize `getSession()` with React `cache()`  ·  impact: medium  ·  risk: low
`getSession()` re-reads `cookies()` + `jwtVerify` on every call and is invoked ~12× per home navigation (layout once; each of 5 parallel actions calls `requireAdminSession→getSession` **and** `authFetch→getSession`).
- File: `apps/web/lib/session.ts:33-47`
- Wrap the cookie read + verify in `import { cache } from 'react'` so it runs once per request:
  ```ts
  import { cache } from 'react'
  const readSession = cache(async (): Promise<Session | null> => {
    const jwt = (await cookies()).get('session')
    if (!jwt) return null
    try { return (await jwtVerify<Session>(jwt.value, ENCODED_KEY, { algorithms: ['HS256'] })).payload }
    catch { redirect('/auth/login') }
  })
  export const getSession = () => readSession()
  ```
- **Verify:** behavior unchanged; ~12 verifies/nav collapse to ~1.

### 1.3 Optionally thread the session into `authFetch`  ·  impact: low  ·  risk: low
Each action calls `requireAdminSession()` (loads session) then `authFetch()` (loads it again).
- Files: `apps/web/lib/requireAdmin.ts:4`, `apps/web/lib/authFetch.ts:8`
- Pass the already-loaded session into `authFetch(url, opts, session)` so it skips its own `getSession()`. (Redundant once 1.2 lands, but explicit is cheaper still.)

### 1.4 Parallelize sequential fetch waterfalls  ·  impact: medium  ·  risk: low
Edit pages fetch independent data serially, doubling TTFB.
- File: `apps/web/app/dashboard/products/[id]/edit/page.tsx:12-13`
  ```ts
  const [product, categories] = await Promise.all([getProduct(id), getCategories()])
  if (!product) notFound()
  ```
- Audit other `*/[id]/edit/page.tsx` for the same pattern as they grow.

### 1.5 Add a fetch timeout  ·  impact: medium  ·  risk: low
No timeout means a stalled API hangs the RSC render indefinitely (undici has no default).
- Files: `apps/web/lib/authFetch.ts:13,26`, `apps/web/lib/fetchClient.ts:21`
- Add `signal: AbortSignal.timeout(8000)` to the fetch options and surface a clean error/fallback.

---

## Phase 2 — Cache read-mostly data (medium risk, needs invalidation discipline)

### 2.1 Tag-cache slow-changing reads  ·  impact: medium  ·  risk: medium
No read is cached; categories (rarely change) are re-fetched every navigation.
- Files: `apps/web/lib/authFetch.ts:13`, `apps/web/actions/dashboard/categories.ts`
- Wrap category reads with `next: { tags: ['categories'] }` (or `unstable_cache`), and call `revalidateTag('categories')` in the create/update/delete category actions (they already `revalidatePath`).
- Keep `no-store` for data that must be real-time (leads, live counts).
- **Verify:** category list served from cache between navigations; a create/edit invalidates it.

---

## Phase 3 — API / DB (higher effort, correctness-sensitive; separate reviewed pass)

### 3.1 Stop reloading the user from Postgres on every request  ·  impact: medium  ·  risk: medium
`JwtStrategy.validate → validateJwtUser → UserService.findById` runs a `User` SELECT on **every** guarded request; a dashboard page hitting ~5 endpoints = ~5 extra SELECTs per load.
- Files: `apps/api/src/auth/strategies/jwt.strategy.ts:28`, `apps/api/src/auth/auth.service.ts:74`, `apps/api/src/user/user.service.ts:37`
- Option A: put `role`/`email`/`name` in the JWT claims and skip the DB lookup.
- Option B: memoize `validateJwtUser` behind a short-TTL cache (30–60s) keyed by `userId` (keep if per-request revocation is required).

### 3.2 Real server-side pagination on list endpoints  ·  impact: medium (grows with data)  ·  risk: medium
`categories`/`users` `findMany` with no `take`/`skip` return the whole table; `products`/`blog`/`leads` are hard-capped at 20 with no page controls, so older rows are unreachable.
- Files: `apps/api/src/user/user.service.ts:50`, `apps/api/src/categories/categories.service.ts:30,39,211`, `apps/api/src/common/dto/pagination.dto.ts:10`, plus the matching `actions/dashboard/*.ts`
- Have the dashboard actions accept `page`/`limit`, forward `?limit=&offset=`, return a total count, and switch the `DataTable`s to server-side pagination.

### 3.3 Text-search indexes  ·  impact: low (grows with data)  ·  risk: medium
Product + lead search use `contains` (ILIKE `'%q%'`) across many columns with no trigram/FTS index → sequential scans.
- Files: `apps/api/src/products/products.service.ts:215`, `apps/api/src/leads/leads.service.ts:152`, `apps/api/prisma/schema.prisma`
- Add `pg_trgm` GIN indexes on searched columns (e.g. `CREATE EXTENSION IF NOT EXISTS pg_trgm; CREATE INDEX product_name_trgm ON "Product" USING gin (name gin_trgm_ops);`) or a `tsvector` FTS column. Ship the change through a reviewed Prisma migration.

### 3.4 Index the admin default sort  ·  impact: low  ·  risk: low
Admin lists `ORDER BY createdAt desc`, but `Product` only has `@@index([published, createdAt])` (unusable when `published` isn't filtered) and `BlogPost` has no `createdAt` index → full scan + in-memory sort.
- File: `apps/api/prisma/schema.prisma`
- Add `@@index([createdAt])` to `Product` and `BlogPost`, or align the admin sort with existing composite indexes.

### 3.5 Housekeeping  ·  impact: low  ·  risk: low
- Make the pg pool size env-driven (`DATABASE_POOL_MAX`); current hard `max: 10` is a global concurrency ceiling. `apps/api/src/prisma/prisma.service.ts:25`
- Drop success `logger.log` calls on hot public read paths (keep warn/error). `apps/api/src/categories/categories.service.ts:33,58,224`
- Confirm `NEXT_PUBLIC_API_DELAY_MS` is `0`/unset in every deployed env (it injects an artificial `sleep`). `apps/web/lib/fetchClient.ts:14` — currently `0` locally.

---

## Phase 4 — Correctness bugs surfaced by the audit (not strictly perf, but fix soon)

### 4.1 Product list hits the wrong endpoint  ·  impact: high (data correctness)
`getProducts()` fetches `/products` = the **public, published-only, limit-20** endpoint, so the admin table shows ≤20 products and hides drafts.
- File: `apps/web/actions/dashboard/products.ts:14`
- Point it at `/products/admin/all` with explicit pagination params (ties into 3.2).

### 4.2 Home stat cards are wrong  ·  impact: medium
Counts are `array.length` of the capped/unbounded list responses, so `products`/`posts`/`leads` max out at "۲۰" and `categories`/`users` ship the whole table just to measure length.
- File: `apps/web/app/dashboard/page.tsx:29-34`
- Add lightweight count endpoints (or reuse `/leads/stats`, `apps/api/src/leads/leads.service.ts:175`) backed by `prisma.count()`.

---

## Suggested order

1. **Phase 0** — confirm dev-mode vs a real bottleneck.
2. If prod is still slow: **1.1** (skeletons) + **1.2** (cache session) — biggest felt + cheapest.
3. **1.4 / 1.5**, then **2.1**.
4. **Phase 4** correctness fixes (can go anytime; independent of perf).
5. **Phase 3** as a dedicated, reviewed API/DB pass.

## Verification per change
- Web: `pnpm --filter ./apps/web typecheck && pnpm --filter ./apps/web lint && pnpm --filter ./apps/web build`
- Measure with a production build (`next start`), not `next dev`.
- Spot-check navigation: shell stays, skeleton shows instantly, content streams; second visit not meaningfully faster than first (i.e. compilation no longer the variable).
