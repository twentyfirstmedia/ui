/**
 * The CLI ships without a dependency on ui-core, so the few pure modules it shares (the theme
 * writer) are copied into packages/cli/src/shared at build and typecheck time (git-ignored).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(ROOT, "packages/cli/src/shared");
mkdirSync(out, { recursive: true });
for (const f of ["theme.ts"])
  writeFileSync(
    join(out, f),
    `/* Copied from packages/core/src/${f} by scripts/copy-shared.ts. Do not edit. */\n` +
      readFileSync(join(ROOT, "packages/core/src", f), "utf8"),
  );
