# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

pnpm monorepo ("ranin-v2") for an e-commerce site selling industrial electrical protection relays. Two apps under `apps/` (workspaces are `apps/*`):

- `apps/api` — NestJS 11 + Prisma 7 (PostgreSQL) backend
- `apps/web` — Next.js 16 (App Router, React 19, Tailwind v4) frontend

## Commands

The root `package.json` has convenience scripts that fan out with pnpm filters; you can also run commands inside each app directory.

From the repo root:

- `pnpm db:up` / `pnpm db:down` — start/stop the docker-compose Postgres
- `pnpm dev:api` / `pnpm dev:web` — run an app in watch/dev mode
- `pnpm build` — build both apps (`pnpm -r build`)
- `pnpm lint` / `pnpm typecheck` — across both apps
- `pnpm test` — API Jest tests
- `pnpm db:migrate` (dev) / `pnpm db:deploy` (prod) / `pnpm db:seed`

From `apps/api`: `pnpm start:dev`, `pnpm test` (single: `pnpm test -- -t "name"` or a spec path), `pnpm test:e2e` (needs a DB), `pnpm lint` (eslint `--fix`), `pnpm build` (runs `prisma generate` via `prebuild`).

From `apps/web`: `pnpm dev` / `pnpm build` (Turbopack, default in Next 16), `pnpm lint`, `pnpm typecheck`, `pnpm test` (Vitest).

## Prisma (api)

- The client is generated to `apps/api/src/generated` and imported with **relative paths** (e.g. `import { Product } from '../generated/client'`, enums from `'../generated/enums'`). The directory is gitignored and regenerated via the `postinstall`/`prebuild` `prisma generate` step.
- **Prisma 7 specifics:** config lives in `apps/api/prisma.config.ts` (schema path, seed command, datasource URL). The CLI no longer auto-loads `.env` — `prisma.config.ts` imports `dotenv/config`. The datasource `url` is **not** in `schema.prisma` (it's in the config); the runtime connects via the `@prisma/adapter-pg` driver adapter in `src/prisma/prisma.service.ts`. `driverAdapters` is GA (no preview flag). No migration history yet — use `prisma db push`.

## Auth

- API: Passport strategies (JWT, local, refresh) in `apps/api/src/auth`; passwords + refresh tokens hashed with argon2 (`src/common/security/hashing.ts`). RBAC via `@Roles(Role.ADMIN)` + `RolesGuard`; `User.role` defaults to `USER`. Login/refresh return the user's role; the JWT strategy loads it from the DB.
- Web: session is a `jose`-signed (HS256) cookie holding `{ accessToken, refreshToken, user }`. `apps/web/proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`) verifies the cookie, gates `/dashboard` to `role === "ADMIN"`, and refreshes the access token when expired.

## Code style

- API formatting (Prettier, `apps/api/.prettierrc`): single quotes, trailing commas everywhere. `pnpm format`. ESLint (recommended + typescript-eslint + prettier) is enabled; `no-explicit-any` is off, `no-unsafe-argument`/`no-floating-promises` are warnings.
- Web ESLint is pinned to v9 (eslint-config-next 16's plugins don't support ESLint 10 yet) using the native flat config. The API uses ESLint 10.
- TypeScript 6 in both apps. The API tsconfig sets `ignoreDeprecations: "6.0"` (keeps `moduleResolution: node`) and an explicit `types` array (TS 6 defaults `types` to empty).

## Environment

- Env files are gitignored: `apps/api/.env` and `apps/web/.env` (see the committed `.env.example` files). Required vars are validated at boot (Joi for the API; fail-fast guards in `apps/web/lib/constants.ts`). See `DEPLOY.md`.
- S3 uploads use an S3-compatible store (Liara) — `LIARA_*` vars in `apps/api/src/uploads` / `src/lib`.
