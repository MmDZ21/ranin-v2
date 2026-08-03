import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Prisma 7: connection URLs are no longer allowed in schema.prisma — they live
// here (used by Migrate/CLI). The runtime connects via the pg driver adapter in
// src/prisma/prisma.service.ts. The CLI also no longer auto-loads .env, hence
// `import 'dotenv/config'`. The package.json "prisma" seed key is deprecated too.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node --transpile-only prisma/seed.ts',
  },
});
