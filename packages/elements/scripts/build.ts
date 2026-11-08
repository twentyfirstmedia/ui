/**
 * Bundles the elements (React, ReactDOM and ui-core included) and copies the generated types and
 * manifests (run scripts/generate.ts first; `pnpm build` does both):
 *
 *   dist/elements.js                   ESM, for <script type="module"> and bundlers
 *   dist/elements.global.js            IIFE for a classic <script>, global `TwentyfirstElements`
 *   dist/elements.d.ts                 types (HTMLElementTagNameMap)
 *   dist/custom-elements.json          Custom Elements Manifest
 *   dist/vscode.html-custom-data.json  VS Code HTML custom data
 */
import { build, type BuildOptions } from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const HERE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(HERE, "dist");
const pkg = JSON.parse(readFileSync(join(HERE, "package.json"), "utf8")) as { version: string };

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const common: BuildOptions = {
  entryPoints: [join(HERE, "src/index.ts")],
  bundle: true,
  minify: true,
  target: "es2022",
  platform: "browser",
  legalComments: "eof",
  logLevel: "warning",
  define: {
    "process.env.NODE_ENV": '"production"',
    __VERSION__: JSON.stringify(pkg.version),
  },
};
await Promise.all([
  build({ ...common, format: "esm", outfile: join(DIST, "elements.js") }),
  build({
    ...common,
    format: "iife",
    globalName: "TwentyfirstElements",
    outfile: join(DIST, "elements.global.js"),
  }),
]);

for (const f of ["elements.d.ts", "custom-elements.json", "vscode.html-custom-data.json"])
  copyFileSync(
    join(HERE, "src/generated", f),
    join(DIST, f === "elements.d.ts" ? "elements.d.ts" : f),
  );

const size = (f: string) => {
  const buf = readFileSync(join(DIST, f));
  return `${(buf.length / 1024).toFixed(0)} kB (${(gzipSync(buf).length / 1024).toFixed(0)} kB gzip)`;
};
console.log(
  `elements: dist/elements.js ${size("elements.js")}, dist/elements.global.js ${size("elements.global.js")}`,
);
