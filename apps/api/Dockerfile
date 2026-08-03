# syntax=docker/dockerfile:1
# Build from the REPO ROOT:  docker build -f apps/api/Dockerfile -t ranin-api .

# ---------- base ----------
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# OpenSSL is required by Prisma; build toolchain for native deps (argon2).
RUN set -eux; \
    for attempt in 1 2 3; do \
      if apt-get update \
        && apt-get install -y --no-install-recommends \
          openssl ca-certificates python3 make g++; then \
        break; \
      fi; \
      if [ "$attempt" = 3 ]; then exit 1; fi; \
      rm -rf /var/lib/apt/lists/*; \
      sleep 5; \
    done; \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ---------- build (full deps; runs prisma generate + nest build) ----------
FROM base AS build
# Build-time-only placeholder: prisma.config.ts calls env('DATABASE_URL') and
# throws synchronously if it's unset, which would fail `pnpm install`'s
# postinstall (`prisma generate`) before any app code compiles. The real
# DATABASE_URL is supplied at `docker run` time via --env-file.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api ./apps/api
RUN pnpm install --frozen-lockfile --filter ./apps/api...
RUN pnpm --filter ./apps/api build

# ---------- runtime ----------
# Fresh base (not `FROM base`) so the build toolchain (python3 make g++,
# needed only to compile argon2's native binding) never ships in the
# production image — only the already-compiled output is copied in below.
FROM node:22-slim AS runner
ENV NODE_ENV=production
# OpenSSL is required by Prisma's query engine/TLS at runtime.
RUN set -eux; \
    for attempt in 1 2 3; do \
      if apt-get update \
        && apt-get install -y --no-install-recommends \
          openssl ca-certificates; then \
        break; \
      fi; \
      if [ "$attempt" = 3 ]; then exit 1; fi; \
      rm -rf /var/lib/apt/lists/*; \
      sleep 5; \
    done; \
    rm -rf /var/lib/apt/lists/*; \
    groupadd -r app; \
    useradd -r -g app app
WORKDIR /app
# pnpm keeps the package store at the root and per-package symlinks; copy both
# so module resolution (incl. the native argon2 binary) is preserved.
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=app:app /app/apps/api/dist ./apps/api/dist
COPY --from=build --chown=app:app /app/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=app:app /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=build --chown=app:app /app/apps/api/prisma ./apps/api/prisma
WORKDIR /app/apps/api
USER app
EXPOSE 3333
# Provide env at runtime (see apps/api/.env.example). Health: GET /api/health
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || '3333') + '/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/main"]
