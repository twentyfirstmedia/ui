/**
 * Bundle size per component: bundles `import { X } from "@twentyfirstmedia/ui-core"` with React
 * external, minified, and reports the gzip size. Proves that the package tree-shakes.
 *
 *   node scripts/bundle.ts            table of every public component
 *   node scripts/bundle.ts Button …   only these
 */
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { ROOT } from "./tokens.ts";

const CORE = join(ROOT, "packages", "core");

export async function bundleSize(
  names: string[],
): Promise<{ bytes: number; gzip: number; code: string }> {
  const r = await build({
    stdin: {
      contents: `import { ${names.join(", ")} } from "@twentyfirstmedia/ui-core";\nconsole.log(${names.join(", ")});`,
      resolveDir: CORE,
      loader: "js",
    },
    bundle: true,
    minify: true,
    format: "esm",
    write: false,
    external: ["react", "react-dom", "react/jsx-runtime"],
    alias: { "@twentyfirstmedia/ui-core": join(CORE, "dist", "index.js") },
    logLevel: "silent",
  });
  const code = r.outputFiles[0]?.text ?? "";
  return { bytes: code.length, gzip: gzipSync(code).length, code };
}

export function publicComponents(): string[] {
  const index = readFileSync(join(CORE, "src", "components", "index.ts"), "utf8");
  return [...index.matchAll(/export \{([^}]*)\} from/g)].flatMap((m) =>
    (m[1] as string)
      .split(",")
      .map((x) => x.trim())
      .filter((x) => /^[A-Z]/.test(x)),
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const names = process.argv.slice(2).length ? process.argv.slice(2) : publicComponents();
  const all = await bundleSize(publicComponents());
  const rows: [string, number][] = [];
  for (const n of names) rows.push([n, (await bundleSize([n])).gzip]);
  rows.sort((a, b) => b[1] - a[1]);
  for (const [n, g] of rows) console.log(`${(g / 1024).toFixed(1).padStart(6)} KB  ${n}`);
  console.log(
    `\nall components together: ${(all.gzip / 1024).toFixed(1)} KB gzip (${(all.bytes / 1024).toFixed(0)} KB min)`,
  );
}
