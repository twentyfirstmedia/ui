// Bundles the example into dist/ with both kits' CSS (themes.css) and the self-hosted fonts.
import { build } from "esbuild";
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const core = dirname(require.resolve("@twentyfirstmedia/ui-core/package.json"));
mkdirSync("dist", { recursive: true });
await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  format: "esm",
  outfile: "dist/main.js",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});
cpSync(join(core, "dist", "themes.css"), "dist/themes.css");
cpSync(join(core, "dist", "fonts"), "dist/fonts", { recursive: true });
writeFileSync(
  "dist/index.html",
  `<!doctype html>
<html lang="en" data-kit="halo" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kit switch</title>
<link rel="stylesheet" href="themes.css">
</head>
<body><div id="root"></div><script type="module" src="main.js"></script></body>
</html>
`,
);
