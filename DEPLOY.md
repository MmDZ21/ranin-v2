# Deployment Guide

This monorepo has two deployable apps:

- **`apps/api`** — NestJS API (needs PostgreSQL + S3-compatible storage)
- **`apps/web`** — Next.js 16 frontend (talks to the API)

## 1. Prerequisites

- Node.js ≥ 22, pnpm ≥ 10 (`corepack enable`)
- A PostgreSQL database
- S3-compatible object storage (the app is configured for Liara) for uploads

## 2. Environment variables

Copy the examples and fill in real values. **Generate strong secrets** — never
ship the placeholder dev values.

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Generate a secret:
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Required (validated at boot — the app fails fast if any are missing):

- **API:** `DATABASE_URL`, `JWT_SECRET`, `REFRESH_JWT_SECRET`, `LIARA_ENDPOINT`,
  `LIARA_BUCKET_NAME`, `LIARA_ACCESS_KEY`, `LIARA_SECRET_KEY`, `CORS_ORIGINS`
  (the web app's public origin), `PORT`.
- **Web:** `SESSION_SECRET_KEY` (≥16 chars), `BACKEND_URL` (server→API),
  `NEXT_PUBLIC_API_URL` (browser→API), `NEXT_PUBLIC_SITE_URL` (canonical origin).

## 3. Local database (development / CI)

```bash
pnpm db:up          # docker-compose Postgres on :5432
pnpm db:migrate     # or: pnpm --filter ./apps/api exec prisma db push
pnpm db:seed
```

This repo has no migration history yet, so production schema setup uses
`prisma db push`:

```bash
pnpm --filter ./apps/api exec prisma db push   # applies schema.prisma to the DB
```

> Prisma 7: the CLI no longer auto-loads `.env` and connection URLs are read
> from `apps/api/prisma.config.ts` (which loads `dotenv`). Ensure `DATABASE_URL`
> is set in the environment when running migrate/seed commands.

## 4. Deploy the API

**Option A — Docker** (build from the repo root):

```bash
docker build -f apps/api/Dockerfile -t ranin-api .
docker run -p 3333:3333 --env-file apps/api/.env ranin-api
```

**Option B — Node host** (Railway / Fly / VPS / Liara):

```bash
pnpm install --frozen-lockfile       # runs prisma generate via postinstall
pnpm --filter ./apps/api build
pnpm --filter ./apps/api exec prisma db push
NODE_ENV=production node apps/api/dist/main
```

Health check: `GET /api/health` (returns 200 + `{"status":"ok"}` when the DB is
reachable). API docs (non-production only): `GET /api/docs`.

## 5. Deploy the web app

**Recommended — Vercel:** import the repo, set the project root to `apps/web`,
add the web env vars, and deploy. Turbopack builds are the default.

**Docker** (Next standalone output is enabled):

```bash
docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api \
  --build-arg NEXT_PUBLIC_SITE_URL=https://example.com \
  -t ranin-web .
docker run -p 3000:3000 --env-file apps/web/.env ranin-web
```

> `NEXT_PUBLIC_*` are baked into the client bundle at build time; pass them as
> `--build-arg`. Server-only secrets (`SESSION_SECRET_KEY`, `BACKEND_URL`) are
> read from the runtime environment.

## 6. CI

`.github/workflows/ci.yml` runs on every PR and push to `main`: it spins up a
Postgres service, then lints, type-checks, tests (incl. an API e2e health
check), and builds both apps.
