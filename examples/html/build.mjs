// Assembles dist/: the page as it is, the elements bundle and both kits' CSS (themes.css) with
// the self-hosted fonts. Nothing is compiled; served by e2e/serve.mjs for the e2e test.
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const pkg = (name) => dirname(require.resolve(`${name}/package.json`));
const core = pkg("@twentyfirstmedia/ui-core");
const elements = pkg("@twentyfirstmedia/elements");

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
cpSync("index.html", "dist/index.html");
for (const f of ["elements.js", "elements.global.js"])
  cpSync(join(elements, "dist", f), join("dist", f));
cpSync(join(core, "dist", "themes.css"), "dist/themes.css");
cpSync(join(core, "dist", "fonts"), "dist/fonts", { recursive: true });
