/**
 * The docs as data: guides, components, patterns, props, tokens and icons of both kits.
 *
 * One source for three readers: the docs site (Markdown version of every page, llms.txt,
 * llms-full.txt), the MCP server (`twentyfirst-ui mcp`) and agents reading either. The data is
 * collected at build time by scripts/knowledge.ts; this module only renders and searches it.
 * It has no imports, so node can also load it straight from scripts/.
 */

export type KitName = "halo" | "pro";

export interface Prop {
  name: string;
  type: string;
  optional: boolean;
  doc: string;
}

/** A component page or a pattern page of the docs. */
export interface Entry {
  name: string;
  title: string;
  group: string;
  /** First sentence of the description. */
  summary: string;
  /** Markdown. */
  description: string;
  /** Kit components the example uses (the props of these are documented on the page). */
  components: string[];
  /** The example, importing from @twentyfirstmedia/ui-core. */
  code: string;
  /** Path below /<kit>/, e.g. "components/Button". */
  path: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** Markdown with {{kit}}, {{Kit}}, {{other}}, {{Other}}, {{site}} placeholders. */
  markdown: string;
}

export type TokenValue = string | { light: string; dark: string };
export interface Token {
  name: string;
  value: TokenValue;
  usage?: string;
}

export interface KitInfo {
  name: KitName;
  label: string;
  package: string;
  tagline: string;
  defaultTheme: string;
  defaultDensity: string;
  tokens: Record<string, Token[]>;
}

export interface Knowledge {
  version: string;
  /** Site URL including the base path, without a trailing slash. */
  site: string;
  kits: KitInfo[];
  guides: Guide[];
  components: Entry[];
  patterns: Entry[];
  props: Record<string, Prop[]>;
  /** Source file → exported component names. */
  exports: Record<string, string[]>;
  /** Everything else the packages export: provider, hooks, formatters, Icon. */
  utilities: string[];
  icons: string[];
}

export const PRODUCT = "Twentyfirst UI";
export const TOKEN_GROUPS: { group: string; title: string }[] = [
  { group: "color", title: "Colour" },
  { group: "shadow", title: "Shadow" },
  { group: "component", title: "Component knobs" },
  { group: "space", title: "Spacing" },
  { group: "radius", title: "Radius" },
  { group: "motion", title: "Motion" },
  { group: "size", title: "Sizes" },
];

// ── small helpers ──

export function summaryOf(markdown: string): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#.*$/gm, "")
    .replace(/^\s*[-*] .*$/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  const m = /^(.+?[.!?])(\s|$)/.exec(text);
  return plain((m ? m[1] : text) ?? "").slice(0, 240);
}

/** Markdown inline syntax removed, for meta descriptions and one-line summaries. */
export function plain(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

export function kitInfo(k: Knowledge, kit: KitName): KitInfo {
  return (k.kits.find((x) => x.name === kit) ?? k.kits[0]) as KitInfo;
}

export function forKit(k: Knowledge, text: string, kit: KitName): string {
  const info = kitInfo(k, kit);
  const other = kitInfo(k, kit === "halo" ? "pro" : "halo");
  return text
    .replace(/\{\{kit\}\}/g, info.name)
    .replace(/\{\{Kit\}\}/g, info.label)
    .replace(/\{\{other\}\}/g, other.name)
    .replace(/\{\{Other\}\}/g, other.label)
    .replace(/\{\{site\}\}/g, k.site)
    .replace(/\{\{componentCount\}\}/g, String(Object.values(k.exports).flat().length))
    .replace(/\{\{componentPages\}\}/g, String(k.components.length))
    .replace(/\{\{patternCount\}\}/g, String(k.patterns.length))
    .replace(/\{\{rules\}\}/g, () => agentRules(kit));
}

/** Example code as an app writes it: imports from the kit package. */
export function appCode(code: string, kit: KitName): string {
  return code.replace(/(["'])@twentyfirstmedia\/ui-core\1/g, `$1@twentyfirstmedia/${kit}$1`);
}

export function pageUrl(k: Knowledge, kit: KitName, path: string): string {
  return `${k.site}/${kit}/${path ? `${path}/` : ""}`;
}

/** The Markdown twin of a page: /halo/components/Button/ → /halo/components/Button.md */
export function mdPath(kit: KitName, path: string): string {
  return `/${kit}/${path || "index"}.md`;
}
export function mdUrl(k: Knowledge, kit: KitName, path: string): string {
  return k.site + mdPath(kit, path);
}

const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const showValue = (v: TokenValue | undefined) =>
  v == null
    ? "–"
    : typeof v === "string"
      ? v
      : v.light === v.dark
        ? v.light
        : `${v.light} / ${v.dark}`;

/** Absolute links in Markdown that leaves the site. */
function absolute(k: Knowledge, md: string): string {
  return md.replace(/\]\((\/[^)]*)\)/g, (_m, href: string) => `](${k.site}${href})`);
}

// ── lookups ──

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function allEntries(k: Knowledge): Entry[] {
  return [...k.components, ...k.patterns];
}

/** An entry by page name, title or any component it documents ("tabpanel" finds Tabs). */
export function findEntry(k: Knowledge, name: string): Entry | undefined {
  const n = norm(name);
  const all = allEntries(k);
  return (
    all.find((e) => norm(e.name) === n || norm(e.title) === n) ??
    all.find((e) => norm(e.name) === `${n}screen`) ??
    all.find((e) => e.components.some((c) => norm(c) === n)) ??
    all.find((e) => norm(e.name).startsWith(n))
  );
}

export function findGuide(k: Knowledge, slug: string): Guide | undefined {
  const n = norm(slug);
  return k.guides.find(
    (g) => norm(g.slug) === n || norm(g.title) === n || norm(g.title).startsWith(n),
  );
}

export function exportedNames(k: Knowledge): Set<string> {
  return new Set([...Object.values(k.exports).flat(), ...k.utilities]);
}

// ── Markdown renderers ──

export function propsMarkdown(k: Knowledge, component: string): string {
  const list = k.props[component];
  if (!list?.length) return "";
  const rows = list.map(
    (p) =>
      `| \`${p.name}${p.optional ? "?" : ""}\` | \`${cell(p.type)}\` | ${cell(p.doc || (p.optional ? "" : "Required"))} |`,
  );
  return [`### ${component}`, "", "| Prop | Type | Notes |", "| --- | --- | --- |", ...rows].join(
    "\n",
  );
}

export function entryMarkdown(k: Knowledge, e: Entry, kit: KitName): string {
  const info = kitInfo(k, kit);
  const documented = e.components.filter((c) => k.props[c]);
  const isPattern = e.path.startsWith("patterns/");
  const out = [
    `# ${e.title}`,
    "",
    `> ${e.summary || `${e.group} in ${PRODUCT}.`}`,
    "",
    `${isPattern ? "Pattern" : `Component · ${e.group}`} · ${info.label} kit · [Live page](${pageUrl(k, kit, e.path)})`,
    "",
  ];
  if (e.description) out.push(absolute(k, e.description.trim()), "");
  out.push(
    isPattern ? "## Code" : "## Example",
    "",
    "```tsx",
    appCode(e.code, kit).trim(),
    "```",
    "",
  );
  if (documented.length) {
    out.push("## Props", "");
    for (const c of documented) out.push(propsMarkdown(k, c), "");
  }
  return out.join("\n").trim() + "\n";
}

export function tokensMarkdown(k: Knowledge, group?: string): string {
  const halo = kitInfo(k, "halo");
  const pro = kitInfo(k, "pro");
  const groups = TOKEN_GROUPS.filter((g) => !group || g.group === group);
  const out: string[] = [];
  for (const g of groups) {
    const proMap = new Map((pro.tokens[g.group] ?? []).map((t) => [t.name, t]));
    out.push(`## ${g.title}`, "", "| Token | Halo | Pro | Use |", "| --- | --- | --- | --- |");
    for (const t of halo.tokens[g.group] ?? []) {
      const p = proMap.get(t.name);
      out.push(
        `| \`--${t.name}\` | \`${cell(showValue(t.value))}\` | \`${cell(showValue(p?.value))}\` | ${cell(p?.usage || t.usage || "")} |`,
      );
    }
    out.push("");
  }
  return out.join("\n");
}

export function guideMarkdown(k: Knowledge, g: Guide, kit: KitName): string {
  let body = forKit(k, g.markdown, kit).trim();
  if (g.slug === "theming") body += "\n\n" + tokensMarkdown(k);
  return `# ${g.title}\n\n> ${forKit(k, g.description, kit)}\n\n${absolute(k, body)}\n`;
}

/** /halo/components.md: every component by group with its one-line summary. */
export function componentsIndexMarkdown(k: Knowledge, kit: KitName): string {
  const out = [
    `# All components`,
    "",
    `> ${k.components.length} component pages and ${k.patterns.length} patterns of the ${kitInfo(k, kit).label} kit. Every page has a live example, its code and the props.`,
    "",
  ];
  const groups = [...new Set(k.components.map((c) => c.group))];
  for (const g of groups) {
    out.push(`## ${g}`, "");
    for (const e of k.components.filter((c) => c.group === g))
      out.push(
        `- [${e.title}](${mdUrl(k, kit, e.path)}): ${e.summary}${e.components.length > 1 ? ` (${e.components.join(", ")})` : ""}`,
      );
    out.push("");
  }
  out.push("## Patterns", "");
  for (const e of k.patterns) out.push(`- [${e.title}](${mdUrl(k, kit, e.path)}): ${e.summary}`);
  out.push(
    "",
    "## Icons",
    "",
    `\`Icon name\` and every \`icon\` prop take one of: ${k.icons.map((i) => `\`${i}\``).join(", ")}.`,
    "",
  );
  return out.join("\n");
}

/** Rules an agent should follow when it writes code with the kits. */
export function agentRules(kit: KitName | "both" = "halo"): string {
  const pkg =
    kit === "both"
      ? "@twentyfirstmedia/halo` or `@twentyfirstmedia/pro"
      : `@twentyfirstmedia/${kit}`;
  return [
    `- Build UI from ${PRODUCT} components first; import them from \`${pkg}\`. Check names, props and examples with the \`twentyfirst-ui\` MCP server (\`get_component\`, \`search_docs\`) instead of guessing.`,
    "- Halo and Pro have the same components, props and markup. Never branch on the kit in code; switch looks with `data-kit` or `<UIProvider kit>`.",
    "- No colour literals or arbitrary Tailwind values: use tokens (`var(--surface)`, `bg-surface`, `text-ink`) so both kits, light and dark keep working.",
    "- Wrap the app once in `UIProvider` and import the kit's `styles.css` once (or `@twentyfirstmedia/ui-core/themes.css` for both kits).",
    "- Format numbers, money, percentages and dates with `formatNumber`, `formatMoney`, `formatPercent`, `formatDate`.",
    "- Icons: only names from `list_icons`; icon-only buttons need a `label`.",
    "- Before finishing, run `check_usage` from the MCP server on new code.",
  ].join("\n");
}

export function overviewMarkdown(k: Knowledge, kit: KitName): string {
  const g = k.guides.find((x) => x.slug === "introduction");
  return g ? guideMarkdown(k, g, kit) : `# ${PRODUCT}\n`;
}

/** llms.txt (llmstxt.org): what the kits are, then a link list of every page's Markdown. */
export function llmsTxt(k: Knowledge): string {
  const kit: KitName = "halo";
  const out = [
    `# ${PRODUCT}`,
    "",
    "> Two React UI kits with one component API: Halo (soft, rounded, light-first) and Pro (sharp, dense, hairline grid, dark-first). Same components, props and markup; only tokens and CSS differ, so an app can switch kits at runtime. MIT-licensed npm packages: `@twentyfirstmedia/halo`, `@twentyfirstmedia/pro`, CLI and MCP server `@twentyfirstmedia/ui`.",
    "",
    "Every page of the docs has a Markdown twin: append `.md` to the page path (`/halo/components/Tabs/` → `/halo/components/Tabs.md`). Halo and Pro pages differ only in the package name; the links below use Halo, replace `/halo/` with `/pro/` for Pro.",
    "",
    "Rules for code that uses the kits:",
    "",
    agentRules("both"),
    "",
    "## Docs",
    "",
  ];
  for (const g of k.guides)
    out.push(
      `- [${g.title}](${mdUrl(k, kit, g.slug === "introduction" ? "" : g.slug)}): ${plain(forKit(k, g.description, kit))}`,
    );
  out.push(
    `- [All components](${mdUrl(k, kit, "components")}): every component by group, and all icon names`,
  );
  out.push("", "## Components", "");
  for (const e of k.components) out.push(`- [${e.title}](${mdUrl(k, kit, e.path)}): ${e.summary}`);
  out.push("", "## Patterns", "");
  for (const e of k.patterns) out.push(`- [${e.title}](${mdUrl(k, kit, e.path)}): ${e.summary}`);
  out.push(
    "",
    "## Optional",
    "",
    `- [Everything in one file](${k.site}/llms-full.txt): all guides, components with examples and props, tokens`,
    `- [Pro docs](${k.site}/pro/): the same pages in the Pro look`,
    `- [Source](https://github.com/twentyfirstmedia/ui)`,
    "",
  );
  return out.join("\n");
}

/** llms-full.txt: every guide and every component page in one file (patterns are linked). */
export function llmsFull(k: Knowledge): string {
  const kit: KitName = "halo";
  const parts = [
    `# ${PRODUCT}: complete docs`,
    "",
    `> Version ${k.version}. Examples import from \`@twentyfirstmedia/halo\`; for Pro import the same names from \`@twentyfirstmedia/pro\`. Patterns (full screens) are linked at the end; their code is in each linked Markdown page.`,
    "",
  ];
  for (const g of k.guides) parts.push(demote(guideMarkdown(k, g, kit)), "");
  parts.push("# Components", "");
  for (const e of k.components) parts.push(demote(entryMarkdown(k, e, kit)), "");
  parts.push("# Patterns", "");
  for (const e of k.patterns) parts.push(`- [${e.title}](${mdUrl(k, kit, e.path)}): ${e.summary}`);
  parts.push("", "# Icons", "", k.icons.join(", "), "");
  return parts.join("\n");
}

/** One heading level down, so pages nest under the file's sections. */
function demote(md: string): string {
  let fence = false;
  return md
    .split("\n")
    .map((l) => {
      if (l.startsWith("```")) fence = !fence;
      return !fence && /^#{1,5} /.test(l) ? `#${l}` : l;
    })
    .join("\n");
}

// ── search ──

export interface Hit {
  kind: "component" | "pattern" | "guide" | "token" | "icon";
  name: string;
  title: string;
  summary: string;
  score: number;
}

const words = (q: string) =>
  q
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((w) => w.length > 1);

function score(terms: string[], fields: [string, number][]): number {
  let total = 0;
  for (const t of terms) {
    let best = 0;
    for (const [text, weight] of fields) {
      const s = text.toLowerCase();
      if (!s.includes(t)) continue;
      const exact = new RegExp(`(^|[^a-z0-9])${t.replace(/[-]/g, "\\-")}([^a-z0-9]|$)`).test(s);
      best = Math.max(best, weight * (exact ? 1 : 0.5));
    }
    total += best;
  }
  return total;
}

export function search(k: Knowledge, query: string, limit = 10): Hit[] {
  const terms = words(query);
  if (!terms.length) return [];
  const hits: Hit[] = [];
  for (const e of allEntries(k)) {
    const propNames = e.components.flatMap((c) => (k.props[c] ?? []).map((p) => p.name)).join(" ");
    const s = score(terms, [
      [e.name, 10],
      [e.title, 8],
      [e.components.join(" "), 6],
      [e.summary, 4],
      [e.group, 3],
      [e.description, 2],
      [propNames, 1],
    ]);
    if (s > 0)
      hits.push({
        kind: e.path.startsWith("patterns/") ? "pattern" : "component",
        name: e.name,
        title: e.title,
        summary: e.summary,
        score: s,
      });
  }
  for (const g of k.guides) {
    const s = score(terms, [
      [g.title, 8],
      [g.description, 4],
      [g.markdown, 1.5],
    ]);
    if (s > 0)
      hits.push({
        kind: "guide",
        name: g.slug,
        title: g.title,
        summary: plain(g.description),
        score: s,
      });
  }
  const halo = kitInfo(k, "halo");
  for (const list of Object.values(halo.tokens))
    for (const t of list) {
      const s = score(terms, [
        [t.name, 5],
        [t.usage ?? "", 1.5],
      ]);
      if (s > 0)
        hits.push({
          kind: "token",
          name: `--${t.name}`,
          title: `--${t.name}`,
          summary: t.usage ?? "",
          score: s * 0.8,
        });
    }
  for (const i of k.icons) {
    const s = score(terms, [[i, 3]]);
    if (s > 0)
      hits.push({
        kind: "icon",
        name: i,
        title: `Icon "${i}"`,
        summary: `<Icon name="${i}" />`,
        score: s * 0.5,
      });
  }
  return hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, limit);
}

// ── usage check ──

export interface Finding {
  line: number;
  severity: "error" | "warning";
  message: string;
}

const PASSTHROUGH = /^(key|ref|children|id|role|tabIndex|title|aria-[\w-]+|data-[\w-]+)$/;

/** Reads `<Name a="…" b={…}>` attributes, braces and strings included. */
function readTag(src: string, start: number): { attrs: string[]; end: number } {
  const attrs: string[] = [];
  let i = start;
  let depth = 0;
  let quote = "";
  let cur = "";
  let collecting = true;
  for (; i < src.length; i++) {
    const ch = src[i] as string;
    if (quote) {
      if (ch === quote) quote = "";
      continue;
    }
    if (depth > 0) {
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (ch === '"' || ch === "'" || ch === "`") quote = ch;
      continue;
    }
    if (ch === "{") {
      depth = 1;
      collecting = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      collecting = false;
      continue;
    }
    if (ch === ">" || (ch === "/" && src[i + 1] === ">")) break;
    if (/[\w-]/.test(ch)) {
      if (!collecting) {
        collecting = true;
        cur = "";
      }
      cur += ch;
    } else {
      if (cur && collecting) attrs.push(cur);
      cur = "";
      collecting = ch !== "=";
    }
  }
  if (cur && collecting) attrs.push(cur);
  return { attrs: attrs.filter((a) => !/^\d/.test(a)), end: i };
}

/**
 * A quick check of code that uses the kits: unknown components and props, missing required props,
 * unknown icon names, colour literals and arbitrary Tailwind values. Heuristic, not a type checker.
 */
export function checkUsage(k: Knowledge, code: string): Finding[] {
  const findings: Finding[] = [];
  const lineAt = (i: number) => code.slice(0, i).split("\n").length;
  const exported = exportedNames(k);
  const icons = new Set(k.icons);
  const imported = new Map<string, string>(); // local → exported name
  for (const m of code.matchAll(
    /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+["']@twentyfirstmedia\/(halo|pro|ui-core)["']/g,
  )) {
    for (const spec of (m[1] as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)) {
      if (spec.startsWith("type ")) continue;
      const [name, local] = spec.split(/\s+as\s+/).map((s) => s.trim()) as [string, string?];
      if (!exported.has(name) && !/^[A-Z]\w*Props$|^type$/.test(name)) {
        const guess = findEntry(k, name);
        findings.push({
          line: lineAt(m.index ?? 0),
          severity: "error",
          message: `\`${name}\` is not exported by the kits.${
            guess
              ? ` Did you mean ${
                  guess.components
                    .filter((c) => exported.has(c))
                    .slice(0, 3)
                    .join(", ") || guess.name
                }?`
              : " Use search_docs to find the right component."
          }`,
        });
      }
      imported.set(local ?? name, name);
    }
    if (m[2] === "ui-core")
      findings.push({
        line: lineAt(m.index ?? 0),
        severity: "warning",
        message:
          "App code imports from `@twentyfirstmedia/halo` or `@twentyfirstmedia/pro`; `ui-core` is the shared internal package.",
      });
  }
  for (const m of code.matchAll(/<([A-Z]\w*)(?=[\s/>])/g)) {
    const local = m[1] as string;
    const name = imported.get(local);
    if (!name) continue;
    const { attrs } = readTag(code, (m.index ?? 0) + m[0].length);
    const line = lineAt(m.index ?? 0);
    const list = k.props[name];
    if (list) {
      const known = new Set(list.map((p) => p.name));
      for (const a of attrs)
        if (!known.has(a) && !PASSTHROUGH.test(a))
          findings.push({
            line,
            severity: "warning",
            message: `\`${name}\` has no documented prop \`${a}\`. Props: ${list.map((p) => p.name).join(", ")}.`,
          });
      const spread = /\{\s*\.\.\./.test(
        code.slice(m.index ?? 0, (m.index ?? 0) + 400).split(">")[0] ?? "",
      );
      for (const p of list)
        if (!p.optional && p.name !== "children" && !attrs.includes(p.name) && !spread)
          findings.push({
            line,
            severity: "error",
            message: `\`${name}\` needs the prop \`${p.name}\` (${p.type}).`,
          });
    }
  }
  for (const m of code.matchAll(/\b(icon|iconRight|name)=["']([\w-]+)["']/g)) {
    const tagStart = code.lastIndexOf("<", m.index ?? 0);
    const tag = /^<(\w+)/.exec(code.slice(tagStart))?.[1] ?? "";
    if (m[1] === "name" && imported.get(tag) !== "Icon") continue;
    if (!icons.has(m[2] as string))
      findings.push({
        line: lineAt(m.index ?? 0),
        severity: "error",
        message: `Unknown icon "${m[2]}". Use list_icons for the valid names.`,
      });
  }
  for (const m of code.matchAll(
    /#[0-9a-fA-F]{3,8}\b(?![\w-]*["']?\s*:)|\b(rgba?|hsla?|oklch)\(/g,
  )) {
    const before = code.slice(Math.max(0, (m.index ?? 0) - 2), m.index ?? 0);
    if (/&$/.test(before)) continue; // HTML entity
    findings.push({
      line: lineAt(m.index ?? 0),
      severity: "warning",
      message: `Colour literal \`${m[0]}\`: use a token such as var(--accent), var(--ink) or var(--surface) so both kits and dark mode work.`,
    });
  }
  for (const m of code.matchAll(/\b[\w:-]+-\[[^\]\s]+\]/g))
    findings.push({
      line: lineAt(m.index ?? 0),
      severity: "warning",
      message: `Arbitrary Tailwind value \`${m[0]}\`: the kit preset maps every token, use those utilities instead.`,
    });
  return findings.sort((a, b) => a.line - b.line);
}
