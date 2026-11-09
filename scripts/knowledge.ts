/**
 * Collects the docs as data (packages/cli/src/knowledge.ts describes the shape): guides from
 * apps/docs/content, component and pattern pages from examples/previews with their descriptions,
 * props from ui-core's types.ts, exports, icons and both kits' tokens.
 *
 *   node scripts/knowledge.ts <out.json>   writes the file (the CLI bundles it for the MCP server)
 *
 * The docs build imports buildKnowledge() directly.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import {
  summaryOf,
  type Entry,
  type Guide,
  type KitInfo,
  type KitName,
  type Knowledge,
  type Prop,
  type Token,
} from "../packages/cli/src/knowledge.ts";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE =
  (process.env.DOCS_SITE_URL ?? "https://ui.twentyfirst.media") +
  (process.env.DOCS_BASE_PATH ?? "");

/** Guides in sidebar order; changelog comes from the package changelog. */
export const GUIDE_ORDER = [
  "introduction",
  "installation",
  "cli",
  "theming",
  "themes",
  "motion",
  "text",
  "ai",
  "html",
  "status-and-approvals",
];

export function humanize(name: string): string {
  return name
    .replace(/Screen$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}

// ── props from types.ts ──
export function readProps(): Record<string, Prop[]> {
  const typesFile = join(ROOT, "packages/core/src/components/types.ts");
  const sf = ts.createSourceFile(
    typesFile,
    readFileSync(typesFile, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const props: Record<string, Prop[]> = {};
  const docOf = (n: ts.Node) =>
    ts
      .getJSDocCommentsAndTags(n)
      .map((d) => (typeof d.comment === "string" ? d.comment : ""))
      .join(" ")
      .trim();
  sf.forEachChild((n) => {
    if (!ts.isInterfaceDeclaration(n) || !n.name.text.endsWith("Props")) return;
    const list: Prop[] = [];
    for (const m of n.members) {
      if (!ts.isPropertySignature(m) || !m.name) continue;
      list.push({
        name: m.name.getText(sf).replace(/^"|"$/g, ""),
        type: m.type ? m.type.getText(sf).replace(/\s+/g, " ") : "unknown",
        optional: !!m.questionToken,
        doc: docOf(m),
      });
    }
    const heritage = (n.heritageClauses ?? []).flatMap((h) => h.types.map((t) => t.getText(sf)));
    if (heritage.some((h) => h.includes("FieldProps")))
      list.push(
        { name: "label", type: "string", optional: true, doc: "" },
        { name: "hint", type: "string", optional: true, doc: "" },
        { name: "error", type: "string", optional: true, doc: "" },
      );
    if (heritage.some((h) => h.includes("BaseProps")))
      list.push(
        {
          name: "className",
          type: "string",
          optional: true,
          doc: "Extra class on the root element.",
        },
        {
          name: "style",
          type: "CSSProperties",
          optional: true,
          doc: "Inline style on the root element.",
        },
      );
    const seen = new Set<string>();
    props[n.name.text.replace(/Props$/, "")] = list.filter(
      (p) => !seen.has(p.name) && seen.add(p.name),
    );
  });
  return props;
}

// ── examples and descriptions ──
interface RawExample {
  name: string;
  group: string;
  width: number;
  height: number;
  components: string[];
}
export interface Example extends RawExample {
  code: string;
}
export function readExamples(): Example[] {
  const dir = join(ROOT, "examples/previews/src");
  return (JSON.parse(readFileSync(join(dir, "previews.json"), "utf8")) as RawExample[]).map(
    (e) => ({
      ...e,
      code: readFileSync(join(dir, `${e.name}.tsx`), "utf8"),
    }),
  );
}

export function readReadmes(): Record<string, string> {
  const readmes: Record<string, string> = {};
  const refDir = join(ROOT, "reference/halo/design-system/components");
  for (const name of readdirSync(refDir)) {
    const p = join(refDir, name, "README.md");
    if (existsSync(p))
      readmes[name] = readFileSync(p, "utf8")
        .replace(/^# .*\n+/, "")
        .replace(/FollowerPilot/g, "admin")
        .replace(/Capitaso/g, "real-estate")
        .replace(/\bHalo\.(\w+)/g, "$1")
        .replace(/(^|[^\w-])ha-/g, "$1tf-")
        // the label system is gone: built-in text is English, overridable through props
        .replace(/^- All texts come from labels \(see Labels\);\s*/gm, "- ")
        .replace(
          /^- A–D wording can be changed per app\./gm,
          "- The A–D wording can be changed through `options`.",
        );
  }
  const ownDir = join(ROOT, "examples/previews/readme");
  if (existsSync(ownDir))
    for (const f of readdirSync(ownDir).filter((x) => x.endsWith(".md")))
      readmes[f.replace(/\.md$/, "")] = readFileSync(join(ownDir, f), "utf8").replace(
        /^# .*\n+/,
        "",
      );
  return readmes;
}

/** Component file → exported names, from ui-core's components/index.ts. */
export function readExports(): Record<string, string[]> {
  const index = readFileSync(join(ROOT, "packages/core/src/components/index.ts"), "utf8");
  const groups: Record<string, string[]> = {};
  for (const m of index.matchAll(/export \{([^}]*)\} from "\.\/([\w-]+)\.js";/g))
    groups[m[2] as string] = (m[1] as string)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  return groups;
}

function readUtilities(): string[] {
  const index = readFileSync(join(ROOT, "packages/core/src/index.ts"), "utf8");
  const names: string[] = [];
  for (const m of index.matchAll(/export \{([^}]*)\} from "\.\/[\w-]+\.js";/g))
    for (const n of (m[1] as string).split(",").map((x) => x.trim()))
      if (n && !n.startsWith("type ")) names.push(n);
  return names;
}

function readIcons(): string[] {
  const src = readFileSync(join(ROOT, "packages/core/src/icons.ts"), "utf8");
  return [...src.matchAll(/^ {2}(\w+):/gm)].map((m) => m[1] as string);
}

// ── guides ──
function frontmatter(text: string): { data: Record<string, string>; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n+/.exec(text);
  if (!m) return { data: {}, body: text };
  const data: Record<string, string> = {};
  for (const line of (m[1] as string).split("\n")) {
    const i = line.indexOf(":");
    if (i > 0)
      data[line.slice(0, i).trim()] = line
        .slice(i + 1)
        .trim()
        .replace(/^"(.*)"$/, "$1");
  }
  return { data, body: text.slice(m[0].length) };
}

export function readGuides(): Guide[] {
  const dir = join(ROOT, "apps/docs/content");
  const guides: Guide[] = GUIDE_ORDER.map((slug) => {
    const { data, body } = frontmatter(readFileSync(join(dir, `${slug}.md`), "utf8"));
    return {
      slug,
      title: data.title ?? humanize(slug),
      description: data.description ?? "",
      markdown: body,
    };
  });
  const log = join(ROOT, "packages/core/CHANGELOG.md");
  guides.push({
    slug: "changelog",
    title: "Changelog",
    description:
      "What changed in each release of the Halo and Pro kits, the shared core, the CLI and the custom elements. All five packages are versioned together.",
    markdown: existsSync(log)
      ? readFileSync(log, "utf8").replace(/^# .*\n+/, "")
      : "No release yet. The first release is 0.1.0; every later change is described with a changeset and listed here.",
  });
  return guides;
}

// ── kits ──
function readKit(name: KitName): KitInfo {
  const t = JSON.parse(readFileSync(join(ROOT, `packages/${name}/tokens.json`), "utf8")) as Record<
    string,
    unknown
  >;
  const tokens: Record<string, Token[]> = {};
  for (const g of ["color", "shadow", "component", "space", "radius", "motion", "size"])
    tokens[g] = (t[g] as Token[] | undefined) ?? [];
  return {
    name,
    label: name === "halo" ? "Halo" : "Pro",
    package: `@twentyfirstmedia/${name}`,
    tagline:
      name === "halo"
        ? "Soft, rounded and light-first: big white cards on a warm canvas, five pastel tints and ink as the only accent."
        : "Sharp, dense and dark-first: monochrome cells on a hairline grid, square corners, Geist, and colour only for state.",
    defaultTheme: String(t.defaultTheme ?? "light"),
    defaultDensity: String(t.defaultDensity ?? "comfortable"),
    tokens,
  };
}

export function buildKnowledge(): Knowledge {
  const examples = readExamples();
  const readmes = readReadmes();
  const toEntry = (e: Example, kind: "components" | "patterns"): Entry => {
    const description = readmes[e.name] ?? "";
    const parts = e.components.filter((c) => c !== "Icon");
    const fallback =
      kind === "patterns"
        ? `A complete screen built from ${parts.slice(0, 4).join(", ")}${parts.length > 4 ? ` and ${parts.length - 4} more components` : ""}.`
        : "";
    return {
      name: e.name,
      title: humanize(e.name),
      group: e.group,
      summary: summaryOf(description) || fallback,
      description,
      components: e.components,
      code: e.code,
      path: `${kind}/${e.name}`,
    };
  };
  const patterns = examples.filter((e) => e.group === "Pages").map((e) => toEntry(e, "patterns"));
  // the real-estate pattern is composed of four component examples
  const reParts = ["ListingCard", "MapView", "ValuationCard", "Gallery"]
    .map((n) => examples.find((e) => e.name === n))
    .filter((e): e is Example => !!e);
  const reText =
    "A listing search page: results toolbar with bulk actions, listings as cards or rows, a map with price pins, valuation, energy class and the photo gallery.";
  patterns.push({
    name: "real-estate",
    title: "Real estate",
    group: "Pages",
    summary: reText,
    description: reText,
    components: [...new Set(reParts.flatMap((e) => e.components))],
    code: reParts.map((e) => `// ── ${e.name} ──\n${e.code.trim()}`).join("\n\n"),
    path: "patterns/real-estate",
  });
  const pkg = JSON.parse(readFileSync(join(ROOT, "packages/core/package.json"), "utf8")) as {
    version: string;
  };
  return {
    version: pkg.version,
    site: SITE,
    kits: [readKit("halo"), readKit("pro")],
    guides: readGuides(),
    components: examples.filter((e) => e.group !== "Pages").map((e) => toEntry(e, "components")),
    patterns,
    props: readProps(),
    exports: readExports(),
    utilities: readUtilities(),
    icons: readIcons(),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = process.argv[2];
  if (!out) throw new Error("usage: node scripts/knowledge.ts <out.json>");
  const k = buildKnowledge();
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(resolve(out), JSON.stringify(k));
  console.log(
    `knowledge: ${k.components.length} components, ${k.patterns.length} patterns, ${k.guides.length} guides → ${out}`,
  );
}
