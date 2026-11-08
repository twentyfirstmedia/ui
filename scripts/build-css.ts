/**
 * Assembles the stylesheets the packages ship:
 *
 *   node scripts/build-css.ts halo|pro  → packages/<kit>/dist/{styles,scoped,tokens,tailwind,fonts}.css,
 *                                          tokens.json, fonts/*.woff2
 *   node scripts/build-css.ts themes    → packages/core/dist/themes.css (both kits) + fonts
 *
 * Component CSS lives in packages/<kit>/css/*.css, written unscoped (`.tf-btn { … }`).
 * - styles.css: the normal case, one kit, no data-kit attribute needed.
 * - scoped.css / themes.css: every rule scoped to `:where([data-kit="<kit>"])` (zero specificity)
 *   and keyframes prefixed with the kit, so both kits can be loaded at once and switched.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import postcss, { type Root } from "postcss";
import { KITS, type Kit, ROOT } from "./tokens.ts";

interface FontSource {
  /** npm package that holds the files (a devDependency of the kit). */
  pkg: string;
  /** CSS files of the package to read @font-face rules from. */
  css: string[];
  /** Family name the tokens use. */
  family: string;
}

/** Self-hosted fonts per kit: only the latin and latin-ext subsets, upright. */
export const FONTS: Record<Kit, FontSource[]> = {
  halo: [
    {
      pkg: "@fontsource-variable/plus-jakarta-sans",
      css: ["index.css"],
      family: "Plus Jakarta Sans",
    },
    {
      pkg: "@fontsource/ibm-plex-mono",
      css: ["500.css", "600.css", "700.css"],
      family: "IBM Plex Mono",
    },
  ],
  pro: [
    { pkg: "@fontsource-variable/geist", css: ["index.css"], family: "Geist" },
    { pkg: "@fontsource-variable/geist-mono", css: ["index.css"], family: "Geist Mono" },
  ],
};

const SUBSETS = /-(latin|latin-ext)-/;

/** Reads the @font-face rules of a kit's fonts and copies the woff2 files into outDir/fonts. */
function fonts(kit: Kit, outDir: string): string {
  const req = createRequire(join(ROOT, "packages", kit, "package.json"));
  const fontDir = join(outDir, "fonts");
  mkdirSync(fontDir, { recursive: true });
  let css = "";
  for (const src of FONTS[kit]) {
    const pkgDir = dirname(req.resolve(`${src.pkg}/package.json`));
    for (const file of src.css) {
      const root = postcss.parse(readFileSync(join(pkgDir, file), "utf8"));
      root.walkAtRules("font-face", (rule) => {
        let url = "";
        rule.walkDecls("src", (d) => {
          url = /url\(\.\/files\/([^)]+)\)/.exec(d.value)?.[1] ?? "";
        });
        if (!url || !SUBSETS.test(url) || url.includes("italic")) return;
        copyFileSync(join(pkgDir, "files", url), join(fontDir, url));
        rule.walkDecls((d) => {
          if (d.prop === "font-family") d.value = `"${src.family}"`;
          if (d.prop === "src") d.value = d.value.replace("./files/", "./fonts/");
        });
        css += rule.toString() + "\n";
      });
    }
    const license = ["LICENSE", "LICENSE.md", "OFL.txt"]
      .map((f) => join(pkgDir, f))
      .find(existsSync);
    if (license)
      copyFileSync(license, join(fontDir, `${src.family.replace(/\s+/g, "-")}-LICENSE.txt`));
  }
  return css;
}

/** Scopes rules to the kit and prefixes keyframe names. */
export function scope(kit: Kit, css: string, from?: string): string {
  const root: Root = postcss.parse(css, from ? { from } : undefined);
  const k = `:where([data-kit="${kit}"])`;
  const frames = new Map<string, string>();
  root.walkAtRules(/^(-webkit-)?keyframes$/, (at) => {
    const name = at.params.trim();
    const next = name.startsWith("tf-") ? `tf-${kit}-${name.slice(3)}` : `${kit}-${name}`;
    frames.set(name, next);
    at.params = next;
  });
  root.walkRules((rule) => {
    const parent = rule.parent;
    if (parent && parent.type === "atrule" && /keyframes$/.test((parent as { name: string }).name))
      return;
    rule.selectors = rule.selectors.flatMap((s) => {
      const t = s.trim();
      // `body` rules apply to the element carrying data-kit and, when that is <html>, to <body>.
      if (t === "body") return [k, `${k} body`];
      if (t === "html" || t === ":root") return [k];
      if (/^(html|body|:root)\b/.test(t)) return [t.replace(/^(html|body|:root)/, k)];
      return [`${k} ${t}`];
    });
  });
  if (frames.size) {
    const re = new RegExp(
      `(?<![\\w-])(${[...frames.keys()].map((n) => n.replace(/[-]/g, "\\-")).join("|")})(?![\\w-])`,
      "g",
    );
    root.walkDecls(/^(-webkit-)?animation(-name)?$/, (d) => {
      d.value = d.value.replace(re, (m) => frames.get(m) ?? m);
    });
  }
  return root.toString();
}

/** The kit's component CSS files, in name order (base.css first). */
export function componentFiles(kit: Kit): string[] {
  const dir = join(ROOT, "packages", kit, "css");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".css"))
    .sort((a, b) => (a === "base.css" ? -1 : b === "base.css" ? 1 : a.localeCompare(b)));
}

function componentCss(kit: Kit, scoped: boolean): string {
  return componentFiles(kit)
    .map((f) => {
      const p = join(ROOT, "packages", kit, "css", f);
      const css = readFileSync(p, "utf8");
      return `/* ${f} */\n${scoped ? scope(kit, css, p) : css}`;
    })
    .join("\n");
}

function generated(kit: Kit, file: string): string {
  return readFileSync(join(ROOT, "packages", kit, "generated", file), "utf8");
}

const banner = (what: string) => `/* Twentyfirst UI · ${what} */\n`;

function buildKit(kit: Kit): void {
  const out = join(ROOT, "packages", kit, "dist");
  mkdirSync(out, { recursive: true });
  const fontCss = fonts(kit, out);
  const tokens = generated(kit, "tokens.css");
  writeFileSync(join(out, "fonts.css"), banner(`${kit} fonts (self-hosted)`) + fontCss);
  writeFileSync(join(out, "tokens.css"), tokens);
  writeFileSync(join(out, "tailwind.css"), generated(kit, "tailwind.css"));
  copyFileSync(join(ROOT, "packages", kit, "tokens.json"), join(out, "tokens.json"));
  writeFileSync(
    join(out, "styles.css"),
    [
      banner(`${kit} styles: fonts, tokens, components`),
      fontCss,
      tokens,
      componentCss(kit, false),
    ].join("\n"),
  );
  writeFileSync(
    join(out, "scoped.css"),
    [
      banner(`${kit} styles scoped to [data-kit="${kit}"]`),
      fontCss,
      generated(kit, "tokens.scoped.css"),
      componentCss(kit, true),
    ].join("\n"),
  );
}

function buildThemes(): void {
  const out = join(ROOT, "packages", "core", "dist");
  mkdirSync(out, { recursive: true });
  let css = banner('both kits; switch with data-kit="halo|pro"');
  for (const kit of KITS) css += fonts(kit, out);
  for (const kit of KITS) css += "\n" + generated(kit, "tokens.scoped.css");
  for (const kit of KITS) css += "\n" + componentCss(kit, true);
  writeFileSync(join(out, "themes.css"), css);
}

const target = process.argv[2];
if (target === "themes") buildThemes();
else if (target === "halo" || target === "pro") buildKit(target);
else if (target) {
  console.error(`unknown target ${target}`);
  process.exit(1);
}
