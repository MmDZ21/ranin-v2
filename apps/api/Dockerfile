# syntax=docker/dockerfile:1
# Build from the REPO ROOT:  docker build -f apps/api/Dockerfile -t ranin-api .

# ---------- base ----------
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# OpenSSL is required by Prisma; build toolchain for native deps (argon2).
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl ca-certificates python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ---------- build (full deps; runs prisma generate + nest build) ----------
FROM base AS build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api ./apps/api
RUN pnpm install --frozen-lockfile --filter ./apps/api...
RUN pnpm --filter ./apps/api build

# ---------- runtime ----------
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
# pnpm keeps the package store at the root and per-package symlinks; copy both
# so module resolution (incl. the native argon2 binary) is preserved.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
WORKDIR /app/apps/api
EXPOSE 3333
# Provide env at runtime (see apps/api/.env.example). Health: GET /api/health
CMD ["node", "dist/main"]
