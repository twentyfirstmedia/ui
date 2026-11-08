/**
 * `twentyfirst-ui mcp init`: registers the MCP server with the coding agents of a project and
 * writes the kit rules into AGENTS.md (and CLAUDE.md when it exists).
 */
import { join } from "node:path";
import { agentRules, type KitName } from "./knowledge.js";
import { SERVER_NAME } from "./mcp.js";
import { type Logger, read, write } from "./util.js";

export type Client = "claude" | "cursor" | "vscode";
export const CLIENTS: Client[] = ["claude", "cursor", "vscode"];

interface ClientConfig {
  label: string;
  file: string;
  /** Top-level key that holds the servers. */
  key: "mcpServers" | "servers";
  entry(kit: KitName): Record<string, unknown>;
}

export const serverArgs = (kit: KitName) => ["-y", "@twentyfirstmedia/ui", "mcp", "--kit", kit];

const CONFIGS: Record<Client, ClientConfig> = {
  claude: {
    label: "Claude Code",
    file: ".mcp.json",
    key: "mcpServers",
    entry: (kit) => ({ command: "npx", args: serverArgs(kit) }),
  },
  cursor: {
    label: "Cursor",
    file: ".cursor/mcp.json",
    key: "mcpServers",
    entry: (kit) => ({ command: "npx", args: serverArgs(kit) }),
  },
  vscode: {
    label: "VS Code",
    file: ".vscode/mcp.json",
    key: "servers",
    entry: (kit) => ({ type: "stdio", command: "npx", args: serverArgs(kit) }),
  },
};

export const RULES_START = "<!-- twentyfirst-ui:start -->";
export const RULES_END = "<!-- twentyfirst-ui:end -->";

export function rulesBlock(kit: KitName): string {
  return `${RULES_START}\n## Twentyfirst UI\n\n${agentRules(kit)}\n${RULES_END}`;
}

/** Reads `--client claude,cursor` (or `all`); no value means all clients. */
export function parseClients(value: string | boolean | undefined): Client[] {
  if (value === undefined || value === true || value === "all") return [...CLIENTS];
  if (value === false) return [];
  const list = value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (list.includes("all")) return [...CLIENTS];
  const bad = list.filter((c) => !(CLIENTS as string[]).includes(c));
  if (bad.length || !list.length)
    throw new Error(
      `--client takes ${CLIENTS.join(", ")} or all (comma-separated), not ${bad.join(", ") || "nothing"}`,
    );
  return [...new Set(list as Client[])];
}

function writeIfChanged(path: string, content: string, name: string, log: Logger): void {
  const before = read(path);
  if (before === content) {
    log.log(`  unchanged  ${name}`);
    return;
  }
  write(path, content);
  log.log(`  ${before === null ? "created" : "updated"}    ${name}`);
}

function writeClientConfig(cwd: string, client: Client, kit: KitName, log: Logger): void {
  const cfg = CONFIGS[client];
  const path = join(cwd, cfg.file);
  const raw = read(path);
  let data: Record<string, unknown> = {};
  if (raw !== null && raw.trim()) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error(
        `${cfg.file} is not valid JSON (${(e as Error).message}); fix it and rerun.`,
        {
          cause: e,
        },
      );
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
      throw new Error(`${cfg.file} must hold a JSON object.`);
    data = parsed as Record<string, unknown>;
  }
  const existing = data[cfg.key];
  const servers =
    typeof existing === "object" && existing !== null && !Array.isArray(existing)
      ? (existing as Record<string, unknown>)
      : {};
  data[cfg.key] = { ...servers, [SERVER_NAME]: cfg.entry(kit) };
  writeIfChanged(path, `${JSON.stringify(data, null, 2)}\n`, `${cfg.file} (${cfg.label})`, log);
}

/** Puts the rules block into the file: replaces an existing block, else appends one. */
export function withRules(content: string | null, kit: KitName): string {
  const block = rulesBlock(kit);
  if (content === null || !content.trim()) return `${block}\n`;
  const start = content.indexOf(RULES_START);
  const end = content.indexOf(RULES_END, start);
  if (start >= 0 && end > start)
    return content.slice(0, start) + block + content.slice(end + RULES_END.length);
  return `${content.replace(/\s*$/, "")}\n\n${block}\n`;
}

export interface McpInitOptions {
  cwd: string;
  kit: KitName;
  clients: Client[];
  rules: boolean;
  log: Logger;
}

export function mcpInit({ cwd, kit, clients, rules, log }: McpInitOptions): void {
  log.log(`Setting up the ${SERVER_NAME} MCP server (${kit} kit):`);
  for (const c of clients) writeClientConfig(cwd, c, kit, log);
  if (rules) {
    for (const file of ["AGENTS.md", "CLAUDE.md"]) {
      const path = join(cwd, file);
      const content = read(path);
      if (file === "CLAUDE.md" && content === null) continue;
      writeIfChanged(path, withRules(content, kit), `${file} (rules)`, log);
    }
  }
  log.log(
    `Done. Restart your agent or reload its MCP servers; the server runs \`npx ${serverArgs(kit).join(" ")}\` and needs the same NPM_TOKEN as the install.`,
  );
}
