# syntax=docker/dockerfile:1
# Build from the REPO ROOT:  docker build -f apps/web/Dockerfile -t ranin-web .
# (For most teams, deploying the web app to Vercel is simpler — see DEPLOY.md.)

FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ---------- build ----------
FROM base AS build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web ./apps/web
RUN pnpm install --frozen-lockfile --filter ./apps/web...
# NEXT_PUBLIC_* are inlined into the client bundle at build time. The fixed,
# non-secret session value below only satisfies the module guard during build.
# Supply the real SESSION_SECRET_KEY only at `docker run`/--env-file time.
ARG NEXT_PUBLIC_API_URL=http://localhost:3333/api
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG BACKEND_URL=http://localhost:3333/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    BACKEND_URL=$BACKEND_URL
RUN SESSION_SECRET_KEY=build-time-placeholder-override-at-runtime \
    pnpm --filter ./apps/web build

# ---------- runtime (Next standalone) ----------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN groupadd -r app && useradd -r -g app app
WORKDIR /app
COPY --from=build --chown=app:app /app/apps/web/.next/standalone ./
COPY --from=build --chown=app:app /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=app:app /app/apps/web/public ./apps/web/public
USER app
EXPOSE 3000
# Provide SESSION_SECRET_KEY and BACKEND_URL at runtime. NEXT_PUBLIC_* values
# are fixed at build time and must be passed as build arguments.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || '3000') + '/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "apps/web/server.js"]
