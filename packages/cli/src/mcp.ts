/**
 * The MCP server (Model Context Protocol): `twentyfirst-ui mcp --kit halo`.
 *
 * Gives coding agents the kit docs of the installed version: tools, resources and prompts over
 * stdio (newline-delimited JSON-RPC 2.0). No dependencies and no network access: the docs come
 * from knowledge.json, which the build writes next to this file. Logs go to stderr only, stdout
 * belongs to the protocol.
 */
import { readFileSync } from "node:fs";
import {
  agentRules,
  allEntries,
  appCode,
  entryMarkdown,
  exportedNames,
  findEntry,
  findGuide,
  forKit,
  guideMarkdown,
  checkUsage,
  componentsIndexMarkdown,
  kitInfo,
  llmsFull,
  pageUrl,
  plain,
  propsMarkdown,
  search,
  tokensMarkdown,
  PRODUCT,
  TOKEN_GROUPS,
  type Entry,
  type KitName,
  type Knowledge,
  libraryIcons,
  ICON_LIBRARY_HOWTO,
} from "./knowledge.js";

export const SERVER_NAME = "twentyfirst-ui";
export const PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"] as const;
export const LATEST_PROTOCOL_VERSION = PROTOCOL_VERSIONS[0];
const SCHEME = `${SERVER_NAME}://`;
const MARKDOWN = "text/markdown";

// ── JSON-RPC ──

export type JsonRpcId = string | number | null;

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

export type JsonRpcResponse =
  | { jsonrpc: "2.0"; id: JsonRpcId; result: unknown }
  | { jsonrpc: "2.0"; id: JsonRpcId; error: JsonRpcError };

export const ErrorCode = {
  ParseError: -32700,
  InvalidRequest: -32600,
  MethodNotFound: -32601,
  InvalidParams: -32602,
  InternalError: -32603,
  ResourceNotFound: -32002,
} as const;

class RpcError extends Error {
  constructor(
    readonly code: number,
    message: string,
    readonly data?: unknown,
  ) {
    super(message);
  }
}

// ── MCP shapes ──

interface TextContent {
  type: "text";
  text: string;
}

export interface ToolResult {
  content: TextContent[];
  isError?: boolean;
}

interface JsonSchema {
  type: "object";
  properties: Record<string, Record<string, unknown>>;
  required?: string[];
  additionalProperties?: boolean;
}

interface Tool {
  name: string;
  title: string;
  description: string;
  inputSchema: JsonSchema;
  annotations: { title: string; readOnlyHint: true; openWorldHint: false };
}

interface Prompt {
  name: string;
  title: string;
  description: string;
  arguments: { name: string; description: string; required: boolean }[];
}

export interface ServerOptions {
  /** Kit the answers use unless a tool call names another. */
  kit: KitName;
}

export interface McpServer {
  /** Answers one JSON-RPC message; notifications and responses get null. */
  handle(message: unknown): Promise<JsonRpcResponse | null>;
}

/** Thrown inside a tool: becomes a result with isError, so the agent can correct itself. */
class ToolError extends Error {}

// ── helpers ──

const text = (t: string): ToolResult => ({ content: [{ type: "text", text: t }] });
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const json = (v: unknown) => JSON.stringify(v);

function stringArg(args: Record<string, unknown>, key: string, required: true): string;
function stringArg(
  args: Record<string, unknown>,
  key: string,
  required?: false,
): string | undefined;
function stringArg(args: Record<string, unknown>, key: string, required = false) {
  const v = args[key];
  if (v === undefined || v === null || v === "") {
    if (required) throw new ToolError(`Missing the required argument "${key}".`);
    return undefined;
  }
  if (typeof v !== "string") throw new ToolError(`The argument "${key}" must be a string.`);
  return v;
}

function kitArg(args: Record<string, unknown>, fallback: KitName): KitName {
  const v = stringArg(args, "kit");
  if (v === undefined) return fallback;
  const k = v.toLowerCase();
  if (k !== "halo" && k !== "pro")
    throw new ToolError(`"kit" must be "halo" or "pro", not "${v}".`);
  return k;
}

/** `import { A, B } from "@twentyfirstmedia/<kit>";` for the components a page documents. */
export function importLine(k: Knowledge, e: Entry, kit: KitName): string {
  const exported = exportedNames(k);
  const names = e.components.filter((c) => exported.has(c));
  return names.length ? `import { ${names.join(", ")} } from "${kitInfo(k, kit).package}";` : "";
}

/** Entry Markdown with an Import section before the example. */
function entryWithImport(k: Knowledge, e: Entry, kit: KitName): string {
  const md = entryMarkdown(k, e, kit);
  const line = importLine(k, e, kit);
  if (!line) return md;
  return md.replace(
    /\n## (Example|Code)\n/,
    (_m, h: string) => `\n## Import\n\n\`\`\`tsx\n${line}\n\`\`\`\n\n## ${h}\n`,
  );
}

/** Edit distance, for "did you mean" on typos. */
function distance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++)
      cur[j] = Math.min(
        (prev[j] ?? 0) + 1,
        (cur[j - 1] ?? 0) + 1,
        (prev[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    prev = cur;
  }
  return prev[b.length] ?? 0;
}

/** Close names for an unknown one: typos first, then search hits. */
function closest(k: Knowledge, query: string, kinds: ("component" | "pattern")[], limit = 5) {
  const n = norm(query);
  const pool = allEntries(k).filter((e) =>
    kinds.includes(e.path.startsWith("patterns/") ? "pattern" : "component"),
  );
  const names = new Map<string, string>();
  for (const e of pool) names.set(e.name, e.summary);
  if (kinds.includes("component"))
    for (const x of exportedNames(k))
      if (/^[A-Z]/.test(x) && !names.has(x)) names.set(x, "documented on the pages that use it");
  const typos = [...names.keys()]
    .map((name) => ({ name, d: distance(n, norm(name)) }))
    .filter((x) => x.d <= Math.max(1, Math.floor(n.length / 4)))
    .sort((a, b) => a.d - b.d)
    .map((x) => x.name);
  const hits = search(k, query, 50)
    .filter((h) => (kinds as string[]).includes(h.kind))
    .map((h) => h.name);
  return [...new Set([...typos, ...hits])]
    .slice(0, limit)
    .map((name) => `- ${name}: ${names.get(name) ?? ""}`)
    .join("\n");
}

function tokenGroupOf(k: Knowledge, name: string): string | undefined {
  const bare = name.replace(/^--/, "");
  const tokens = kitInfo(k, "halo").tokens;
  return Object.keys(tokens).find((g) => tokens[g]?.some((t) => t.name === bare));
}

/**
 * Docs of a component by name. A page of its own wins; a component without one (Button, Badge…)
 * gets its import, props and the example of the page that shows it best; else any page that
 * documents it (findEntry).
 */
export function componentDoc(k: Knowledge, name: string, kit: KitName): string | undefined {
  const n = norm(name);
  const all = allEntries(k);
  const own =
    all.find((e) => norm(e.name) === n || norm(e.title) === n) ??
    k.patterns.find((e) => norm(e.name) === `${n}screen`);
  if (own) return entryWithImport(k, own, kit);
  const exported = [...exportedNames(k)].find((x) => norm(x) === n && /^[A-Z]/.test(x));
  const pages = exported ? all.filter((e) => e.components.includes(exported)) : [];
  if (exported && (k.props[exported] || pages.length)) {
    const info = kitInfo(k, kit);
    const rank = (e: Entry) =>
      (norm(e.name).startsWith(n) ? 0 : 1000) +
      (e.path.startsWith("patterns/") ? 500 : 0) +
      e.components.length;
    const ranked = [...pages].sort((a, b) => rank(a) - rank(b));
    const best = ranked[0];
    const out = [
      `# ${exported}`,
      "",
      `> \`${exported}\` has no page of its own${best ? `; it is shown on ${ranked.length} page${ranked.length === 1 ? "" : "s"}, the example below is from ${best.title}` : ""}.`,
      "",
      `Component · ${info.label} kit${best ? ` · [Live page](${pageUrl(k, kit, best.path)})` : ""}`,
      "",
      "## Import",
      "",
      "```tsx",
      `import { ${exported} } from "${info.package}";`,
      "```",
      "",
    ];
    const props = propsMarkdown(k, exported);
    if (props) out.push("## Props", "", props.replace(/^### .*\n\n/, ""), "");
    if (best)
      out.push(
        `## Example (${best.title})`,
        "",
        "```tsx",
        appCode(best.code, kit).trim(),
        "```",
        "",
      );
    if (ranked.length > 1) {
      out.push("## Pages that show it", "");
      for (const e of ranked.slice(0, 8))
        out.push(
          `- ${e.name}: ${e.summary} (${e.path.startsWith("patterns/") ? "get_pattern" : "get_component"})`,
        );
      out.push("");
    }
    return out.join("\n").trim() + "\n";
  }
  const e = findEntry(k, name);
  return e ? entryWithImport(k, e, kit) : undefined;
}

function findPattern(k: Knowledge, name: string): Entry | undefined {
  const n = norm(name);
  const hit = k.patterns.find(
    (e) => norm(e.name) === n || norm(e.title) === n || norm(e.name) === `${n}screen`,
  );
  if (hit) return hit;
  const e = findEntry(k, name);
  return e && e.path.startsWith("patterns/") ? e : undefined;
}

// ── server ──

export function createServer(k: Knowledge, options: ServerOptions): McpServer {
  const defaultKit = options.kit;
  const groups = [...new Set(k.components.map((c) => c.group))];
  const guideSlugs = k.guides.map((g) => g.slug);
  const tokenGroups = TOKEN_GROUPS.map((g) => g.group);
  const info = kitInfo(k, defaultKit);

  const kitProp = {
    type: "string",
    enum: ["halo", "pro"],
    description: `Kit whose package name the code imports from. Defaults to "${defaultKit}". Both kits have the same components and props.`,
  };
  const annotations = (title: string) =>
    ({ title, readOnlyHint: true, openWorldHint: false }) as const;
  const tool = (
    name: string,
    title: string,
    description: string,
    properties: JsonSchema["properties"],
    required: string[] = [],
  ): Tool => ({
    name,
    title,
    description,
    inputSchema: {
      type: "object",
      properties,
      ...(required.length ? { required } : {}),
      additionalProperties: false,
    },
    annotations: annotations(title),
  });

  const tools: Tool[] = [
    tool(
      "search_docs",
      "Search the docs",
      `Search the ${PRODUCT} docs: components, patterns (full screens), guides, design tokens and icons. Returns ranked hits with the tool to call next. Use it whenever you are unsure which component fits a job (e.g. "approval", "date range", "file upload").`,
      {
        query: { type: "string", description: "What you are looking for, in plain words." },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          description: "Maximum number of hits (default 10).",
        },
      },
      ["query"],
    ),
    tool(
      "list_components",
      "List components",
      `List every ${PRODUCT} component page by group with a one-line summary, and the patterns (complete screens). Use it to get an overview before building.`,
      {
        group: {
          type: "string",
          enum: [...groups, "Patterns"],
          description: "Only this group. Omit for all.",
        },
      },
    ),
    tool(
      "get_component",
      "Get a component",
      `Get the docs of a ${PRODUCT} component: description, import line, example code and the props of every component on the page. Accepts a page name ("Tabs"), a title ("Date picker") or any component it documents ("TabPanel").`,
      {
        name: { type: "string", description: 'Component name, e.g. "Button" or "ApprovalCard".' },
        kit: kitProp,
      },
      ["name"],
    ),
    tool(
      "get_pattern",
      "Get a pattern",
      `Get a ${PRODUCT} pattern: a complete screen built from kit components (dashboard, settings, inbox, pricing…) with its full code. A good starting point for a new screen.`,
      {
        name: {
          type: "string",
          description: `Pattern name, one of: ${k.patterns.map((p) => p.name).join(", ")}.`,
        },
        kit: kitProp,
      },
      ["name"],
    ),
    tool(
      "get_guide",
      "Get a guide",
      `Get a guide of the ${PRODUCT} docs: introduction, installation, CLI, theming (with all tokens), AI agents and MCP, status and approvals, changelog.`,
      {
        topic: { type: "string", enum: guideSlugs, description: "The guide." },
        kit: kitProp,
      },
      ["topic"],
    ),
    tool(
      "get_tokens",
      "Get design tokens",
      `Get the design tokens (CSS custom properties) with their Halo and Pro values and what each is for. Use tokens instead of colour literals or arbitrary values.`,
      {
        group: {
          type: "string",
          enum: tokenGroups,
          description: "Only this group. Omit for all.",
        },
      },
    ),
    tool(
      "list_icons",
      "List icons",
      `List every valid icon name for \`<Icon name>\` and the \`icon\` props of ${PRODUCT} components: the kit's own set and the icon library (passkeys, social and brand logos and more, registered once with registerIcons).`,
      {},
    ),
    tool(
      "check_usage",
      "Check code",
      `Check code that uses ${PRODUCT}: unknown components and props, missing required props, unknown icon names, colour literals and arbitrary Tailwind values. Run it on new or changed code before finishing. Heuristic, not a type checker.`,
      { code: { type: "string", description: "The TSX/JSX source to check." } },
      ["code"],
    ),
  ];

  const prompts: Prompt[] = [
    {
      name: "build_screen",
      title: "Build a screen",
      description: `Build a screen with ${PRODUCT} components, starting from a pattern where one fits.`,
      arguments: [
        {
          name: "description",
          description: "What the screen shows and does.",
          required: true,
        },
      ],
    },
    {
      name: "review_ui",
      title: "Review UI code",
      description: `Review code against the ${PRODUCT} rules and run check_usage on it.`,
      arguments: [{ name: "code", description: "The code to review.", required: true }],
    },
  ];

  // ── tools ──

  const runTool: Record<string, (args: Record<string, unknown>) => string> = {
    search_docs(args) {
      const query = stringArg(args, "query", true);
      const rawLimit = args.limit;
      if (rawLimit !== undefined && (typeof rawLimit !== "number" || !Number.isFinite(rawLimit)))
        throw new ToolError('"limit" must be a number.');
      const limit = Math.min(50, Math.max(1, Math.round((rawLimit as number | undefined) ?? 10)));
      const hits = search(k, query, limit);
      if (!hits.length)
        return `No results for "${query}". Try other or fewer words, or call list_components for an overview.`;
      const next = (kind: string, name: string): string => {
        switch (kind) {
          case "component":
            return `get_component ${json({ name })}`;
          case "pattern":
            return `get_pattern ${json({ name })}`;
          case "guide":
            return `get_guide ${json({ topic: name })}`;
          case "token": {
            const group = tokenGroupOf(k, name);
            return `get_tokens ${json(group ? { group } : {})}`;
          }
          default:
            return `use <Icon name="${name}" /> or icon="${name}"`;
        }
      };
      return [
        `${hits.length} result${hits.length === 1 ? "" : "s"} for "${query}":`,
        "",
        ...hits.map(
          (h, i) =>
            `${i + 1}. [${h.kind}] ${h.title}${h.summary ? `: ${h.summary}` : ""}\n   → ${next(h.kind, h.name)}`,
        ),
        "",
        "Call the tool after the arrow for the full docs, example code and props.",
      ].join("\n");
    },

    list_components(args) {
      const want = stringArg(args, "group");
      const wantNorm = want === undefined ? undefined : norm(want);
      const isPatterns = wantNorm === "patterns" || wantNorm === "pattern" || wantNorm === "pages";
      const shown = want === undefined ? groups : groups.filter((g) => norm(g) === wantNorm);
      if (want !== undefined && !isPatterns && !shown.length)
        throw new ToolError(
          `Unknown group "${want}". Groups: ${[...groups, "Patterns"].join(", ")}.`,
        );
      const out: string[] = [];
      if (!isPatterns) {
        if (want === undefined)
          out.push(
            `# ${PRODUCT} components`,
            "",
            `${k.components.length} component pages and ${k.patterns.length} patterns. Call get_component with a name for its example and props.`,
            "",
          );
        for (const g of shown) {
          out.push(`## ${g}`, "");
          for (const e of k.components.filter((c) => c.group === g)) {
            const parts = e.components.length > 1 ? ` (${e.components.join(", ")})` : "";
            out.push(`- ${e.name}${parts}: ${e.summary}`);
          }
          out.push("");
        }
      }
      if (want === undefined || isPatterns) {
        out.push(
          "## Patterns",
          "",
          "Complete screens; call get_pattern with a name for the code.",
          "",
        );
        for (const e of k.patterns) out.push(`- ${e.name}: ${e.summary}`);
        out.push("");
      }
      return out.join("\n");
    },

    get_component(args) {
      const name = stringArg(args, "name", true);
      const kit = kitArg(args, defaultKit);
      const doc = componentDoc(k, name, kit);
      if (!doc) {
        const near = closest(k, name, ["component", "pattern"]);
        throw new ToolError(
          `No component named "${name}".${near ? ` Closest matches:\n${near}` : " Call list_components for all names or search_docs to search."}`,
        );
      }
      return doc;
    },

    get_pattern(args) {
      const name = stringArg(args, "name", true);
      const kit = kitArg(args, defaultKit);
      const e = findPattern(k, name);
      if (!e) {
        const comp = findEntry(k, name);
        const hint =
          comp && !comp.path.startsWith("patterns/")
            ? ` "${comp.name}" is a component: call get_component.`
            : "";
        throw new ToolError(
          `No pattern named "${name}".${hint} Patterns: ${k.patterns.map((p) => p.name).join(", ")}.`,
        );
      }
      return entryWithImport(k, e, kit);
    },

    get_guide(args) {
      const topic = stringArg(args, "topic", true);
      const kit = kitArg(args, defaultKit);
      const g = findGuide(k, topic);
      if (!g) throw new ToolError(`No guide "${topic}". Guides: ${guideSlugs.join(", ")}.`);
      return guideMarkdown(k, g, kit);
    },

    get_tokens(args) {
      const group = stringArg(args, "group");
      if (group !== undefined && !tokenGroups.includes(group))
        throw new ToolError(`Unknown token group "${group}". Groups: ${tokenGroups.join(", ")}.`);
      return [
        `# Design tokens${group ? `: ${TOKEN_GROUPS.find((g) => g.group === group)?.title}` : ""}`,
        "",
        "> CSS custom properties, the same names in both kits. Use them as `var(--name)` in CSS or through the Tailwind preset (`bg-primary`, `text-muted-foreground`, `bg-card`); never colour literals or arbitrary values. Values with a slash are light / dark.",
        "",
        tokensMarkdown(k, group),
      ].join("\n");
    },

    list_icons() {
      const lib = Object.entries(k.iconLibrary ?? {});
      return [
        `${k.icons.length} icons. Use them as \`<Icon name="…" />\` or in the \`icon\` prop of components; icon-only buttons need a \`label\`.`,
        "",
        k.icons.join(", "),
        "",
        `Icon library: ${libraryIcons(k).length} more. ${ICON_LIBRARY_HOWTO}`,
        "",
        ...lib.map(([cat, names]) => `- ${cat}: ${names.join(", ")}`),
      ].join("\n");
    },

    check_usage(args) {
      const code = stringArg(args, "code", true);
      const findings = checkUsage(k, code);
      if (!findings.length)
        return "No problems found: components, props, icons and styling look right. (This is a heuristic check; still run the type checker.)";
      const errors = findings.filter((f) => f.severity === "error").length;
      const warnings = findings.length - errors;
      const count = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
      return [
        `${count(errors, "error")}, ${count(warnings, "warning")}:`,
        "",
        ...findings.map((f) => `- Line ${f.line} · ${f.severity}: ${f.message}`),
        "",
        "Fix these, then run check_usage again. get_component shows the props of a component.",
      ].join("\n");
    },
  };

  function callTool(params: Record<string, unknown>): ToolResult {
    const name = params.name;
    if (typeof name !== "string") throw new RpcError(ErrorCode.InvalidParams, "Missing tool name");
    const fn = Object.hasOwn(runTool, name) ? runTool[name] : undefined;
    if (!fn)
      throw new RpcError(
        ErrorCode.InvalidParams,
        `Unknown tool: ${name}. Tools: ${tools.map((t) => t.name).join(", ")}`,
      );
    const args = params.arguments ?? {};
    if (!isObject(args))
      throw new RpcError(ErrorCode.InvalidParams, "Tool arguments must be an object");
    try {
      return text(fn(args));
    } catch (e) {
      if (e instanceof ToolError) return { ...text(e.message), isError: true };
      throw e;
    }
  }

  // ── resources ──

  interface Resource {
    uri: string;
    name: string;
    title: string;
    description: string;
    mimeType: string;
  }

  const resources: Resource[] = [
    {
      uri: `${SCHEME}llms-full`,
      name: "llms-full",
      title: `${PRODUCT}: complete docs`,
      description: "Every guide and component page with examples and props in one file.",
      mimeType: MARKDOWN,
    },
    {
      uri: `${SCHEME}components`,
      name: "components",
      title: "All components",
      description: "Every component by group with its summary, the patterns and all icon names.",
      mimeType: MARKDOWN,
    },
    {
      uri: `${SCHEME}tokens`,
      name: "tokens",
      title: "Design tokens",
      description: "Every token with its Halo and Pro value.",
      mimeType: MARKDOWN,
    },
    ...k.guides.map((g) => ({
      uri: `${SCHEME}guides/${g.slug}`,
      name: `guides/${g.slug}`,
      title: g.title,
      description: plain(forKit(k, g.description, defaultKit)),
      mimeType: MARKDOWN,
    })),
    ...allEntries(k).map((e) => ({
      uri: `${SCHEME}${e.path}`,
      name: e.path,
      title: e.title,
      description: e.summary,
      mimeType: MARKDOWN,
    })),
  ];

  const templates = [
    {
      uriTemplate: `${SCHEME}components/{name}`,
      name: "component",
      title: "Component docs",
      description: 'Docs of a component by name, e.g. "Button" or "TabPanel".',
      mimeType: MARKDOWN,
    },
    {
      uriTemplate: `${SCHEME}patterns/{name}`,
      name: "pattern",
      title: "Pattern",
      description: "A complete screen with its code.",
      mimeType: MARKDOWN,
    },
    {
      uriTemplate: `${SCHEME}guides/{slug}`,
      name: "guide",
      title: "Guide",
      description: `One of: ${guideSlugs.join(", ")}.`,
      mimeType: MARKDOWN,
    },
  ];

  function readResource(uri: string): string {
    if (!uri.startsWith(SCHEME)) throw notFound(uri);
    const path = uri.slice(SCHEME.length).replace(/\/+$/, "");
    const [kind, ...rest] = path.split("/");
    let name = rest.join("/");
    try {
      name = decodeURIComponent(name);
    } catch {
      throw notFound(uri);
    }
    switch (kind) {
      case "llms-full":
        return llmsFull(k);
      case "tokens":
        return runTool.get_tokens?.({}) ?? "";
      case "components": {
        if (!name) return componentsIndexMarkdown(k, defaultKit);
        const doc = componentDoc(k, name, defaultKit);
        if (doc) return doc;
        break;
      }
      case "patterns": {
        const e = name ? findPattern(k, name) : undefined;
        if (e) return entryWithImport(k, e, defaultKit);
        break;
      }
      case "guides": {
        const g = name ? findGuide(k, name) : undefined;
        if (g) return guideMarkdown(k, g, defaultKit);
        break;
      }
    }
    throw notFound(uri);
  }

  const notFound = (uri: string) =>
    new RpcError(ErrorCode.ResourceNotFound, `Resource not found: ${uri}`, { uri });

  // ── prompts ──

  function getPrompt(params: Record<string, unknown>) {
    const name = params.name;
    const args = isObject(params.arguments) ? params.arguments : {};
    const arg = (key: string) => {
      const v = args[key];
      if (typeof v !== "string" || !v.trim())
        throw new RpcError(ErrorCode.InvalidParams, `Missing the required argument "${key}"`);
      return v;
    };
    const message = (t: string) => ({
      role: "user" as const,
      content: { type: "text" as const, text: t },
    });
    if (name === "build_screen") {
      const description = arg("description");
      return {
        description: prompts[0]?.description,
        messages: [
          message(
            [
              `Build this screen with ${PRODUCT} (${info.label} kit, \`${info.package}\`):`,
              "",
              description,
              "",
              "Work like this:",
              "1. Plan the screen: list its regions and the UI parts each needs.",
              "2. Look for a pattern that is close (list_components with group Patterns, or search_docs) and start from its code with get_pattern.",
              "3. For every part, find the component with search_docs and read its props and example with get_component. Do not guess names or props.",
              "4. Write the code with kit components, tokens and the formatters; no custom markup where a component exists.",
              "5. Run check_usage on the finished code and fix every finding.",
              "",
              "Rules:",
              agentRules(defaultKit),
            ].join("\n"),
          ),
        ],
      };
    }
    if (name === "review_ui") {
      const code = arg("code");
      return {
        description: prompts[1]?.description,
        messages: [
          message(
            [
              `Review this code against the ${PRODUCT} rules (${info.label} kit, \`${info.package}\`).`,
              "",
              "1. Run check_usage on it and include every finding.",
              "2. Check the rules below by reading the code; look up components with get_component where the props or usage look off, and suggest kit components where the code rebuilds one by hand.",
              "3. Answer with a list of concrete problems (line, what, fix), most important first, then the corrected code.",
              "",
              "Rules:",
              agentRules(defaultKit),
              "",
              "```tsx",
              code,
              "```",
            ].join("\n"),
          ),
        ],
      };
    }
    throw new RpcError(
      ErrorCode.InvalidParams,
      `Unknown prompt: ${String(name)}. Prompts: ${prompts.map((p) => p.name).join(", ")}`,
    );
  }

  // ── dispatch ──

  const instructions = [
    `${PRODUCT} docs for coding agents. ${PRODUCT} is two React UI kits with one component API: Halo (soft, rounded, light-first) and Pro (sharp, dense, dark-first); this project uses ${info.label} (\`${info.package}\`). These kits are newer than most models' training data and their exact props matter, so look things up here instead of guessing: search_docs to find components, patterns, guides, tokens and icons; get_component for a component's import, example and props; get_pattern for complete screens; check_usage on the code you write.`,
    "",
    "Rules:",
    agentRules(defaultKit),
  ].join("\n");

  async function dispatch(method: string, params: Record<string, unknown>): Promise<unknown> {
    switch (method) {
      case "initialize": {
        const requested = params.protocolVersion;
        const protocolVersion =
          typeof requested === "string" &&
          (PROTOCOL_VERSIONS as readonly string[]).includes(requested)
            ? requested
            : LATEST_PROTOCOL_VERSION;
        return {
          protocolVersion,
          capabilities: { tools: {}, resources: {}, prompts: {} },
          serverInfo: { name: SERVER_NAME, title: PRODUCT, version: k.version },
          instructions,
        };
      }
      case "ping":
        return {};
      case "tools/list":
        return { tools };
      case "tools/call":
        return callTool(params);
      case "resources/list":
        return { resources };
      case "resources/templates/list":
        return { resourceTemplates: templates };
      case "resources/read": {
        const uri = params.uri;
        if (typeof uri !== "string") throw new RpcError(ErrorCode.InvalidParams, "Missing uri");
        return { contents: [{ uri, mimeType: MARKDOWN, text: readResource(uri) }] };
      }
      case "prompts/list":
        return { prompts };
      case "prompts/get":
        return getPrompt(params);
      default:
        throw new RpcError(ErrorCode.MethodNotFound, `Method not found: ${method}`);
    }
  }

  return {
    async handle(message) {
      if (!isObject(message) || message.jsonrpc !== "2.0")
        return rpcError(null, ErrorCode.InvalidRequest, "Invalid JSON-RPC 2.0 message");
      const hasId = "id" in message && message.id !== undefined;
      const id = (hasId ? message.id : null) as JsonRpcId;
      if (typeof message.method !== "string") {
        // a response to a request we never sent, or garbage
        return hasId && !("result" in message || "error" in message)
          ? rpcError(id, ErrorCode.InvalidRequest, "Missing method")
          : null;
      }
      if (!hasId) return null; // notification: initialized, cancelled, …
      if (typeof id !== "string" && typeof id !== "number")
        return rpcError(null, ErrorCode.InvalidRequest, "Invalid id");
      const params = message.params ?? {};
      if (!isObject(params))
        return rpcError(id, ErrorCode.InvalidParams, "params must be an object");
      try {
        return { jsonrpc: "2.0", id, result: await dispatch(message.method, params) };
      } catch (e) {
        if (e instanceof RpcError) return rpcError(id, e.code, e.message, e.data);
        return rpcError(id, ErrorCode.InternalError, (e as Error).message ?? String(e));
      }
    },
  };
}

function rpcError(id: JsonRpcId, code: number, message: string, data?: unknown): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: data === undefined ? { code, message } : { code, message, data },
  };
}

// ── IO ──

/** Loads the docs bundled with the CLI (dist/knowledge.json). */
export function loadKnowledge(url: URL = new URL("./knowledge.json", import.meta.url)): Knowledge {
  let raw: string;
  try {
    raw = readFileSync(url, "utf8");
  } catch {
    throw new Error(
      `The bundled docs are missing (${url.pathname}). Reinstall @twentyfirstmedia/ui, or in the repo run \`pnpm --filter @twentyfirstmedia/ui build\`.`,
    );
  }
  return JSON.parse(raw) as Knowledge;
}

/**
 * Serves newline-delimited JSON-RPC over stdin/stdout. Messages are answered in order; the
 * promise resolves when the input ends and every answer is written, or when the client closes the
 * output (EPIPE): then there is nobody left to answer, so the server stops quietly.
 */
export function serveStdio(
  server: McpServer,
  io: {
    input?: NodeJS.ReadableStream;
    output?: NodeJS.WritableStream;
    onError?: (msg: string) => void;
  } = {},
): Promise<void> {
  const input: NodeJS.ReadableStream = io.input ?? process.stdin;
  const output: NodeJS.WritableStream = io.output ?? process.stdout;
  const logError = io.onError ?? ((m: string) => process.stderr.write(`${m}\n`));
  let buffer = "";
  let queue: Promise<void> = Promise.resolve();
  let closed = false;

  const send = (v: unknown) =>
    new Promise<void>((resolve) => {
      if (closed) return resolve();
      output.write(`${JSON.stringify(v)}\n`, () => resolve());
    });

  const processLine = async (line: string) => {
    let msg: unknown;
    try {
      msg = JSON.parse(line);
    } catch {
      await send(rpcError(null, ErrorCode.ParseError, "Parse error"));
      return;
    }
    try {
      if (Array.isArray(msg)) {
        // JSON-RPC batch (allowed by protocol version 2025-03-26)
        if (!msg.length) {
          await send(rpcError(null, ErrorCode.InvalidRequest, "Empty batch"));
          return;
        }
        const answers = (await Promise.all(msg.map((m) => server.handle(m)))).filter(
          (a): a is JsonRpcResponse => a !== null,
        );
        if (answers.length) await send(answers);
      } else {
        const answer = await server.handle(msg);
        if (answer) await send(answer);
      }
    } catch (e) {
      logError(`twentyfirst-ui mcp: ${(e as Error).stack ?? String(e)}`);
    }
  };

  const flush = (final: boolean) => {
    if (closed) return;
    let i: number;
    while ((i = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, i).replace(/\r$/, "").trim();
      buffer = buffer.slice(i + 1);
      if (line) queue = queue.then(() => processLine(line));
    }
    if (final && buffer.trim()) {
      const line = buffer.trim();
      buffer = "";
      queue = queue.then(() => processLine(line));
    }
  };

  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      flush(true);
      void queue.then(resolve);
    };
    const decoder = new TextDecoder();
    input.on("data", (chunk: Buffer | string) => {
      buffer += typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true });
      flush(false);
    });
    input.on("end", finish);
    input.on("close", finish);
    input.on("error", (e: Error) => {
      logError(`twentyfirst-ui mcp: ${e.message}`);
      finish();
    });
    // the client went away: drop what is pending and end without an unhandled 'error'
    const stop = () => {
      if (closed) return;
      closed = true;
      buffer = "";
      done = true;
      input.removeAllListeners("data");
      resolve();
    };
    output.on("error", (e: NodeJS.ErrnoException) => {
      if (e.code !== "EPIPE" && e.code !== "ERR_STREAM_DESTROYED")
        logError(`twentyfirst-ui mcp: ${e.message}`);
      stop();
    });
    output.on("close", stop);
  });
}
