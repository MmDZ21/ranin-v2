#!/usr/bin/env node
/**
 * PostToolUse(Write|Edit) hook: format edited apps/api TypeScript files with
 * Prettier, using the project's own Prettier install and .prettierrc.
 *
 * Reads the hook payload (JSON) on stdin, extracts the edited file path, and
 * only touches *.ts / *.tsx files under apps/api. Never blocks an edit: any
 * problem is swallowed and the process exits 0.
 */
const fs = require('fs');
const path = require('path');

// .claude/hooks/format-api.cjs -> repo root is two levels up.
const root = path.resolve(__dirname, '..', '..');
const apiDir = path.join(root, 'apps', 'api');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

(async () => {
  try {
    const raw = readStdin();
    if (!raw.trim()) return;

    const payload = JSON.parse(raw);
    const filePath =
      payload?.tool_input?.file_path || payload?.tool_response?.filePath;
    if (!filePath) return;

    const abs = path.resolve(filePath);

    // Only format TypeScript files inside apps/api.
    if (!/\.(ts|tsx)$/i.test(abs)) return;
    const rel = path.relative(apiDir, abs);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return;
    if (!fs.existsSync(abs)) return;

    const prettier = require(path.join(apiDir, 'node_modules', 'prettier'));
    const source = fs.readFileSync(abs, 'utf8');
    const config = (await prettier.resolveConfig(abs)) || {};
    const formatted = await prettier.format(source, {
      ...config,
      filepath: abs,
    });
    if (formatted !== source) fs.writeFileSync(abs, formatted);
  } catch {
    // Never block an edit on a formatting failure.
  }
})();
