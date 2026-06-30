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
# NEXT_PUBLIC_* are inlined into the client bundle at build time. SESSION_SECRET_KEY
# / BACKEND_URL only satisfy the build-time module guard — real values are read
# from the runtime environment by the server.
ARG NEXT_PUBLIC_API_URL=http://localhost:3333/api
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG BACKEND_URL=http://localhost:3333/api
ARG SESSION_SECRET_KEY=build-time-placeholder-override-at-runtime
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    BACKEND_URL=$BACKEND_URL \
    SESSION_SECRET_KEY=$SESSION_SECRET_KEY
RUN pnpm --filter ./apps/web build

# ---------- runtime (Next standalone) ----------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
EXPOSE 3000
# Provide SESSION_SECRET_KEY, BACKEND_URL, NEXT_PUBLIC_* at runtime.
CMD ["node", "apps/web/server.js"]
