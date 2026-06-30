# VPS Deployment Guide (off Liara → self-managed Iranian VPS)

This guide is for running the **ranin-v2** monorepo (Next.js `apps/web` + NestJS `apps/api`)
on a single fixed-resource VPS, migrating away from Liara. The site is a showcase store:
product catalog + contact form, **no payment gateway, no transactions**.

Everything below is grounded in the actual code (file:line references included), not generic advice.

---

## 0. What the project actually is

- **apps/api** (NestJS): builds with `nest build` (`prebuild`/`postinstall` run `prisma generate`) → `dist/main.js`, runs with `node dist/main`. Port from `PORT` (default 3333), global prefix `/api`. PostgreSQL via Prisma 7 (driver adapter + `pg` Pool). **No migration history → use `prisma db push`**.
- **apps/web** (Next 16): `next build` → `next start`, port 3000. `NEXT_PUBLIC_*` vars are **baked into the bundle at build time**.
- **Storage**: S3-compatible (Liara) used only for admin image uploads.
- **What's NOT there**: no payment gateway, no email/SMTP, no queues/cron/websockets, no other external APIs. So the VPS only needs: 2× Node + Postgres + Nginx + somewhere to keep images.

---

## 1. Storage / S3 — exactly from the code, then the decision

**Where and how it's used:**

| Concern | File | What |
|---|---|---|
| S3 client | `apps/api/src/lib/s3.client.ts` | `S3Client` with `forcePathStyle:true` + `endpoint=LIARA_ENDPOINT` (exactly MinIO-shaped) |
| Write | `apps/api/src/uploads/uploads.service.ts` | only `PutObjectCommand`; builds absolute URL `${LIARA_ENDPOINT}/${bucket}/${key}` |
| Upload endpoint | `apps/api/src/uploads/uploads.controller.ts` | `POST /api/admin/uploads/file` — **ADMIN-only**, 5 MB cap, image/pdf only |
| Web side | `apps/web/actions/upload.ts` + `components/ui/image-upload.tsx` | client → server action → same API endpoint |
| Serving to users | `apps/web/next.config.ts` (`remotePatterns`) | images load **directly browser → storage host** via `next/image` |

**The facts that drive the decision:**
- Only `PutObjectCommand` is used. `@aws-sdk/s3-request-presigner` and `multer-s3` are in `package.json` but **never imported in source** (dead deps). No presigned URLs, no `GetObject`, no `Delete`, no listing.
- Pattern: **write = rare, admin-only**; **read = public, browser-direct to the storage host** (the API never proxies images).
- Volume: a small catalog (~8 products / 6 categories in the seed), each file ≤5 MB.
- URLs are stored **absolute** in the DB — but since the site **never went live, there's no real data** (the seed uses `/images/relay.png`). So the storage migration is **clean** — no old URLs to rewrite.

### ✅ Primary recommendation: local filesystem + Nginx
Usage is genuinely light, the only S3 op is `PutObject`, and **none of S3's value-adds (presign/lifecycle/etc.) are used**. Upside: one fewer service, backup = a single folder, faster/simpler serving with no public-bucket policy to misconfigure. The code change is **small and contained to one file**.

Rewrite `apps/api/src/uploads/uploads.service.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/var/www/ranin/uploads';
const PUBLIC_BASE = process.env.UPLOAD_PUBLIC_BASE || '/uploads';

interface MulterFile { originalname: string; mimetype: string; size: number; buffer: Buffer; }

@Injectable()
export class UploadsService {
  async uploadFile(file: MulterFile, folder = 'products'): Promise<string> {
    const ext = extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '');
    const name = `${randomUUID()}${ext}`;
    await mkdir(join(UPLOAD_DIR, folder), { recursive: true });
    await writeFile(join(UPLOAD_DIR, folder, name), file.buffer);
    return `${PUBLIC_BASE}/${folder}/${name}`;   // relative, same-origin
  }
}
```
Because it returns a **relative** URL (`/uploads/...`), `next/image` treats it as same-origin and **needs no `remotePatterns`**. Then: delete `s3.client.ts`, remove the four `LIARA_*` entries from `env.validation.ts`, and drop the unused `@aws-sdk/*` + `multer-s3` deps.

### Alternative with zero code change: MinIO on the same VPS
Since the S3 client is already `forcePathStyle:true` + custom endpoint (MinIO-shaped), you just change `LIARA_ENDPOINT=http://127.0.0.1:9000`, the keys and bucket, make the bucket **public-read**, and put it behind Nginx — **zero code changes**. Cost: an extra stateful service to run/secure/back up, plus the risk of misconfiguring the public-read policy. For this volume it's over-engineered.

> External object storage (e.g. ArvanCloud S3) is also S3-compatible (env-only change), but it's a poorer fit for a "fixed-resource / self-contained" requirement.

**Recommendation: filesystem + Nginx** — one file changed in exchange for dropping the entire S3 dependency and making backups trivial. For this "write-rarely / read-publicly" pattern it's clearly worth it.

---

## 2. Liara dependencies (what breaks on a raw VPS)

- **No Liara config files exist**: no `liara.json`, no `Procfile`, no `.liaraignore` (globbed the whole repo). So there's no buildpack/start config to port — build/start is entirely up to you on the VPS.
- **Liara-specific env** (declared **`.required()`** in `apps/api/src/config/env.validation.ts:22-25` → the API **won't boot** if any are missing):
  `LIARA_ENDPOINT`, `LIARA_BUCKET_NAME`, `LIARA_ACCESS_KEY`, `LIARA_SECRET_KEY`.
  → If you choose the filesystem path, **remove these four from `env.validation.ts`** or the API will refuse to start.
- **Hardcoded endpoint**: `storage.iran.liara.space` in `apps/web/next.config.ts:21-22` (`remotePatterns`) and `apps/api/.env.example`. Remove it (filesystem) or replace with the real host (MinIO).
- **Managed assumptions you now provide yourself**: managed Postgres (→ local Postgres, `DATABASE_URL=localhost`); HTTPS/domain (→ Nginx + certbot); platform-injected `PORT` (code reads `PORT`/3333 and 3000 → set it yourself).

---

## 3. Deployment layout on the VPS (step by step)

### 3.1 Prerequisites
```bash
# Node 22 (both apps need ≥20.9; 22 is safest / matches root engines + .nvmrc)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
sudo corepack enable
# native build toolchain — argon2 & sharp compile natively; without this, pnpm install fails
sudo apt install -y build-essential python3 openssl postgresql nginx
sudo npm i -g pm2
```

### 3.2 Database
```bash
sudo -u postgres psql -c "CREATE USER ranin WITH PASSWORD 'STRONG_PASS';"
sudo -u postgres psql -c "CREATE DATABASE ranin OWNER ranin;"
# DATABASE_URL=postgresql://ranin:STRONG_PASS@127.0.0.1:5432/ranin?schema=public
```

### 3.3 Code + env + build
```bash
git clone <repo> /var/www/ranin && cd /var/www/ranin
pnpm install --frozen-lockfile          # postinstall → prisma generate

# apps/api/.env:  NODE_ENV=production, PORT=3333,
#   DATABASE_URL=..., JWT_SECRET=..., REFRESH_JWT_SECRET=..., JWT_EXPIRES_IN=15m,
#   REFRESH_JWT_EXPIRES_IN=30d, CORS_ORIGINS=https://your-domain,
#   UPLOAD_DIR=/var/www/ranin/uploads        (filesystem path)
# apps/web/.env  (NEXT_PUBLIC_* are baked at BUILD time → must be set before build):
#   NEXT_PUBLIC_API_URL=https://your-domain/api
#   NEXT_PUBLIC_SITE_URL=https://your-domain
#   BACKEND_URL=http://127.0.0.1:3333/api    (server-side, internal & fast)
#   SESSION_SECRET_KEY=<48 random bytes>

pnpm --filter ./apps/api exec prisma db push   # no migration history → db push
pnpm --filter ./apps/api build
pnpm --filter ./apps/web build

sudo mkdir -p /var/www/ranin/uploads && sudo chown -R $USER:www-data /var/www/ranin/uploads
```
> **Critical:** any time you change a `NEXT_PUBLIC_*` value you must **re-run `next build`** — they're baked into the bundle.

### 3.4 Process management (pm2)
`ecosystem.config.js` at the repo root:
```js
module.exports = {
  apps: [
    { name: 'ranin-api', cwd: './apps/api', script: 'dist/main.js', env: { NODE_ENV: 'production' } },
    { name: 'ranin-web', cwd: './apps/web', script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000', env: { NODE_ENV: 'production' } },
  ],
};
```
```bash
pm2 start ecosystem.config.js && pm2 save && pm2 startup   # auto-start on boot
```
> `cwd` matters: the API loads `.env` relative to its cwd (`apps/api/.env`). Run **a single API instance (fork mode, not cluster)** — the rate limiter is in-memory with no shared store, so cluster mode breaks it. `enableShutdownHooks` is on in code, so pm2 reloads drain the Postgres pool cleanly.

### 3.5 Nginx (reverse proxy in front of both + serving uploads)
```nginx
server {
  listen 80; server_name your-domain.com;
  client_max_body_size 6m;                       # matches the 5 MB upload cap

  location /uploads/ { alias /var/www/ranin/uploads/; expires 30d; access_log off; }

  location /api/ {                                # API is on the /api prefix → don't strip it
    proxy_pass http://127.0.0.1:3333;
    proxy_set_header Host $host; proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  location / {                                    # everything else → Next
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host; proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
```bash
sudo certbot --nginx -d your-domain.com          # HTTPS
```

### 3.6 Daily backup
`/usr/local/bin/ranin-backup.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
D=$(date +%F); OUT=/var/backups/ranin; mkdir -p "$OUT"
PGPASSWORD=STRONG_PASS pg_dump -U ranin -h 127.0.0.1 ranin | gzip > "$OUT/db-$D.sql.gz"
tar czf "$OUT/uploads-$D.tar.gz" -C /var/www/ranin uploads     # filesystem path only
find "$OUT" -type f -mtime +14 -delete                         # keep 14 days
```
```bash
chmod +x /usr/local/bin/ranin-backup.sh
echo "0 3 * * * root /usr/local/bin/ranin-backup.sh" | sudo tee /etc/cron.d/ranin-backup
```
> For the MinIO path, back up MinIO's data dir (or `mc mirror`) instead of the `tar`. Either way, periodically copy backups **off this VPS**.

---

## 4. Other things to know / prevent before launch

1. **🔴 `trust proxy` is not set — the biggest gotcha behind Nginx.** `apps/api/src/main.ts` has no `app.set('trust proxy', …)`. Behind Nginx, `req.ip` becomes Nginx's IP (127.0.0.1), and since the global `ThrottlerGuard` keys on IP, **all users are counted as one** → the 5/min login limit applies to the whole site and users lock each other out. One-line fix in `main.ts`:
   ```ts
   app.set('trust proxy', 1); // behind one reverse proxy (Nginx)
   ```
2. **🔴 `env.validation.ts` requires `LIARA_*`** — on the filesystem path, if you don't remove those four, **the API won't boot**.
3. **🔴 Rotate the committed live secrets.** `apps/api/.env` contains a **real `LIARA_ACCESS_KEY`/`LIARA_SECRET_KEY` + DB password**. Revoke/rotate the Liara key regardless of migration (it's exposed), and generate fresh secrets on the VPS:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```
   (each ≥16 chars, or the `constants.ts`/Joi guards block boot).
4. **🟠 Create a real admin.** The ADMIN role can only be set via seed/DB (the create-user endpoint forces `USER` by design). Either edit `apps/api/prisma/seed.ts` with your own email/password, or insert directly in the DB with an argon2 hash (same `hashSecret`).
5. **🟡 Contact form sends no email** — leads only land in the DB; the admin must check `/dashboard`. If you want notifications, that has to be added (there's no email infra at all).
6. **🟡 CORS**: everything is same-origin behind one domain, so it's fine — just set `CORS_ORIGINS=https://your-domain` (if empty, client-side fetches like search get blocked). Cookies use `secure` only in production, so **HTTPS is required** for login/session to work.
7. **🟡 `next/image`**: on the same-origin filesystem path no `remotePatterns` is needed; remove the `liara.space` host. (If you serve uploads from a subdomain instead, add that host.)
8. **🟡 Don't ship these to the server**: a ~622 MB `apps.zip` at the repo root (not a runtime dependency, just weight) and a stale standalone build with a baked `.env` under `apps/web/.next/standalone/...`. Build fresh on the VPS.
9. **🟡 Firewall**: only `80/443` public; keep `3000/3333/5432` (and `9000` if MinIO) bound to `127.0.0.1` (`ufw allow 80,443`).
10. **🟡 Health check**: `GET /api/health` runs `SELECT 1` and returns 503 if the DB is down — wire it into pm2/Nginx monitoring (Liara did this automatically).
11. **🟡 Prisma 7**: when running `db push`/`seed`, `DATABASE_URL` must be in the environment (the CLI no longer auto-loads `.env`; `prisma.config.ts` loads `dotenv`, so run these from inside `apps/api`).

---

## 5. Code changes to make before deploying (filesystem path)

If you go with **filesystem + Nginx**, these are the in-repo edits (all on `apps/api` + one web config):

1. Rewrite `apps/api/src/uploads/uploads.service.ts` to write to disk + return a relative `/uploads/...` URL (see §1).
2. Delete `apps/api/src/lib/s3.client.ts`.
3. Remove the four `LIARA_*` entries from `apps/api/src/config/env.validation.ts`; add optional `UPLOAD_DIR` / `UPLOAD_PUBLIC_BASE` if you want them validated.
4. Drop unused deps: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `multer-s3` from `apps/api/package.json`.
5. Remove the `liara.space` `remotePatterns` from `apps/web/next.config.ts` (same-origin relative URLs need none).
6. Update `apps/api/.env.example` (drop `LIARA_*`, add `UPLOAD_DIR`).
7. Add `app.set('trust proxy', 1);` in `apps/api/src/main.ts`.

For the **MinIO path**: no code changes — set `LIARA_ENDPOINT`/keys/bucket to MinIO, make the bucket public-read, replace the `next.config.ts` image host, and still add the `trust proxy` line from §4.1.
