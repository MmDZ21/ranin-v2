# Stage 0 — baseline stabilization

Status: complete on 2026-08-03 (Asia/Tehran)

## Scope

- Branch: `prod-readiness`
- Baseline revision: `dea8936abf098738232832f299011da7b5881fd0`
- Local toolchain: Node 24.18.0 and pnpm 10.13.1
- Target toolchain: Node 22 in `.nvmrc`, CI, and both production images
- The worktree was already substantially dirty at the start. Existing user work was preserved.
- Nothing was staged or committed during Stage 0.

## Outcome

Stage 0 established a reproducible build/test baseline, repaired migration drift,
hardened authentication input validation, verified the primary desktop/mobile
journeys, and proved both production images can run against the seeded database.

Key corrections:

- Added a tracked-schema migration that changes the database default for
  `User.role` from `ADMIN` to `USER` and creates the nine indexes declared in
  `schema.prisma`.
- Changed CI database setup from `prisma db push` to `prisma migrate deploy`.
- Made API lint check-only and added a separate `lint:fix` command.
- Validated `LoginDto` before Passport/Argon2 work, including a regression test
  for oversized passwords.
- Made server-side catalog requests prefer `BACKEND_URL`; container rendering no
  longer calls the web container's own `127.0.0.1:3333`.
- Added bounded APT retries to the API image and made both image health checks
  honor runtime ports.
- Included Prisma config/schema/migrations in the API runtime image so the image
  can run `prisma migrate deploy` directly.
- Removed the fake build-session value from Docker `ARG`/`ENV` instructions;
  real session secrets remain runtime-only and the image build is scanner-clean.
- Made `apps/web/.env.example` trackable, added an LF/UTF-8 Git policy, converted
  the root README from UTF-16LE to UTF-8, and corrected deployment guidance.

## Verification matrix

| Check | Result | Evidence |
|---|---:|---|
| Monorepo type-check | Pass | API and web |
| API unit tests | Pass | 9 suites, 39 tests |
| Web unit tests | Pass | 3 files, 13 tests |
| Lint | Pass with warnings | 0 errors; 13 API warnings and 13 web warnings |
| API e2e | Pass | `GET /api/health`, 1 test |
| Monorepo production build | Pass | API and web; static generation had no fetch error with API available |
| Prisma validation | Pass | Schema valid |
| Fresh migration replay | Pass | All 5 migrations applied to a temporary database; schema diff was empty |
| Existing local DB baseline | Pass | Pre-baseline schema diff was empty; all 5 migrations resolved as applied |
| `prisma migrate deploy` | Pass | No pending migrations |
| API production image | Pass | Build, in-image migration status, health, and DB connectivity |
| Web production image | Pass | Build, health at runtime `PORT=3100`, `/products` HTTP 200 |
| Container catalog smoke | Pass | 9 seeded products; zero server fetch errors |
| Git whitespace check | Pass | No whitespace errors; line-ending normalization warnings are expected until files are re-added |

The local database was historically created with `db push`. It was baselined
only after `prisma migrate diff` reported `No difference detected`. For any
other existing database, follow the backup/clone/no-diff procedure in
`DEPLOY.md`; never copy the resolved state blindly.

## Browser baseline

The seeded production build was inspected in the in-app browser at desktop and
mobile widths. Home, catalog, login, and authenticated dashboard routes rendered
without overlap or console errors. The dashboard showed 9 products, 6
categories, 1 user, and no blog posts or leads.

| View | Desktop | Mobile |
|---|---|---|
| Home | [home-desktop.png](screenshots/home-desktop.png) | [home-mobile.png](screenshots/home-mobile.png) |
| Products | [products-desktop.png](screenshots/products-desktop.png) | [products-mobile.png](screenshots/products-mobile.png) |
| Dashboard | [dashboard-desktop.png](screenshots/dashboard-desktop.png) | [dashboard-mobile.png](screenshots/dashboard-mobile.png) |
| Login | [login-desktop.png](screenshots/login-desktop.png) | — |

Browser console warnings/errors observed during the journey: 0.

## Coarse navigation timings

These are local production-build wall timings, not Core Web Vitals and not a
substitute for a Chrome performance trace.

| Navigation | Observed wall time |
|---|---:|
| Public home, warm | 111 ms |
| Products shell | 151 ms |
| Products data visibly settled | approximately 856 ms |
| Dashboard, warm | 173 ms |
| Dashboard products, first visit | 224 ms |
| Dashboard categories, first visit | 157 ms |
| Dashboard products, warm | 139 ms |

## Carryover risks

1. Formal LCP/INP/CLS measurements remain pending because the Chrome DevTools
   performance connector was unavailable. Do not infer Core Web Vitals from the
   wall timings above.
2. CI can still build the web app without a reachable API because sitemap/catalog
   fetch failures degrade to empty data. A green offline build can therefore ship
   a static-only sitemap; CI should start a seeded API or explicitly assert sitemap
   contents.
3. Choose one canonical production topology before launch. `DEPLOY.md` favors a
   managed/Vercel path while `VPS-DEPLOY.md` describes a self-hosted path.
4. The active local API `.env` points at port 5434 while Compose exposes Postgres
   on 5432. Stage 0 used an explicit 5432 override and did not rewrite ignored
   secret-bearing env files.
5. Local Node is 24 while CI/images target Node 22. Final release verification
   should also run locally under Node 22.
6. Automated coverage remains narrow: e2e covers health only; catalog, auth form,
   dashboard CRUD, lead, accessibility, visual regression, and performance gates
   are still missing.
7. Existing lint warnings include unsafe API arguments and React effect/render
   patterns. They do not fail the gate but should be burned down.
8. Follow-up API review items include unpublished-product exposure through the
   public SKU route, validating the exact trusted-proxy hop count, bounded
   pagination, and category-cycle behavior.
9. Seeded products currently render without real product imagery; this is a
   content-quality gap rather than a runtime failure.

## Checkpoint handoff

The new migration and several other required files are untracked. A future
`git commit -am` would omit them. Explicitly review and include the migration,
`.gitattributes`, `apps/web/.env.example`, regression tests, and this Stage 0
evidence. Exclude `.codex/hooks.json`; it contains a machine-specific absolute
path. No Stage 0 files have been staged or committed yet.
