#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { add } from "./add.js";
import { diff } from "./diff.js";
import { init } from "./init.js";
import { list } from "./list.js";
import { theme } from "./theme.js";
import { createServer, loadKnowledge, serveStdio } from "./mcp.js";
import { mcpInit, parseClients } from "./mcp-init.js";
import { consoleLogger, type Kit, type Logger, readConfig } from "./util.js";

const HELP = `twentyfirst-ui: set up and copy components of the Twentyfirst UI kits

Usage
  twentyfirst-ui init [--kit halo|pro] [--both] [--no-install] [--components components/ui]
  twentyfirst-ui add <Component…> [--overwrite]
  twentyfirst-ui list
  twentyfirst-ui diff <Component>
  twentyfirst-ui theme <preset|#colour[,#dark]|shadcn-theme.css> [--kit halo|pro] [--both] [--out app/theme.css]
      write a shadcn-style theme (presets: blue, violet, emerald, orange, rose, teal) and import it
  twentyfirst-ui mcp [--kit halo|pro]
      start the MCP server for coding agents (stdio)
  twentyfirst-ui mcp init [--client claude,cursor,vscode|all] [--kit halo|pro] [--no-rules]
      register the MCP server in .mcp.json, .cursor/mcp.json and .vscode/mcp.json
      and add the kit rules to AGENTS.md (and CLAUDE.md when it exists)

Options
  --cwd <dir>   run in another directory
  --kit         defaults to the kit in twentyfirst.json, else halo
`;

export function parseArgs(argv: string[]): {
  cmd: string;
  args: string[];
  flags: Record<string, string | boolean>;
} {
  const [cmd = "help", ...rest] = argv;
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i] as string;
    if (a.startsWith("--no-")) flags[a.slice(5)] = false;
    else if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      const next = rest[i + 1];
      if (v !== undefined) flags[k as string] = v;
      else if (
        next &&
        !next.startsWith("--") &&
        ["kit", "cwd", "components", "out", "client"].includes(k as string)
      ) {
        flags[k as string] = next;
        i++;
      } else flags[k as string] = true;
    } else args.push(a);
  }
  return { cmd, args, flags };
}

/** The kit from --kit, else twentyfirst.json, else halo. */
function resolveKit(flag: string | boolean | undefined, cwd: string): Kit {
  const kit = typeof flag === "string" ? flag : (readConfig(cwd)?.kit ?? "halo");
  if (kit !== "halo" && kit !== "pro") throw new Error(`--kit must be halo or pro, not ${kit}`);
  return kit;
}

/** Exit code; a promise while the MCP server runs (it resolves when stdin ends). */
export function run(argv: string[], log: Logger = consoleLogger): number | Promise<number> {
  const { cmd, args, flags } = parseArgs(argv);
  const cwd = resolve(typeof flags.cwd === "string" ? flags.cwd : process.cwd());
  try {
    switch (cmd) {
      case "init": {
        const kit = (flags.kit ?? "halo") as Kit;
        if (kit !== "halo" && kit !== "pro")
          throw new Error(`--kit must be halo or pro, not ${String(kit)}`);
        init({
          cwd,
          kit,
          both: flags.both === true,
          install: flags.install !== false,
          components: typeof flags.components === "string" ? flags.components : undefined,
          log,
        });
        return 0;
      }
      case "add":
        if (!args.length) throw new Error("Name at least one component: twentyfirst-ui add Button");
        add({ cwd, components: args, overwrite: flags.overwrite === true, log });
        return 0;
      case "list":
        list(cwd, log);
        return 0;
      case "diff":
        if (!args[0]) throw new Error("Name a component: twentyfirst-ui diff Button");
        diff(cwd, args[0], log);
        return 0;
      case "theme": {
        if (!args[0])
          throw new Error(
            "Name a preset, a colour or a shadcn theme file: twentyfirst-ui theme blue | #2563eb | theme.css",
          );
        const kit = typeof flags.kit === "string" ? resolveKit(flags.kit, cwd) : undefined;
        theme({
          cwd,
          source: args[0],
          kit,
          both: flags.both === true ? true : undefined,
          out: typeof flags.out === "string" ? flags.out : undefined,
          log,
        });
        return 0;
      }
      case "mcp": {
        const sub = args[0];
        const kit = resolveKit(flags.kit, cwd);
        if (sub === "init") {
          mcpInit({
            cwd,
            kit,
            clients: parseClients(flags.client),
            rules: flags.rules !== false,
            log,
          });
          return 0;
        }
        if (sub) throw new Error(`Unknown mcp command "${sub}". Use: twentyfirst-ui mcp [init]`);
        const server = createServer(loadKnowledge(), { kit });
        return serveStdio(server, { onError: (m) => log.warn(m) }).then(() => 0);
      }
      default:
        log.log(HELP);
        return cmd === "help" || flags.help ? 0 : 1;
    }
  } catch (e) {
    log.warn(`Error: ${(e as Error).message}`);
    return 1;
  }
}

const stderrLogger: Logger = {
  log: (m) => console.error(m),
  warn: (m) => console.error(m),
};

function isMain(): boolean {
  try {
    return (
      !!process.argv[1] &&
      realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])
    );
  } catch {
    return false;
  }
}

if (isMain()) {
  // the MCP server owns stdout; everything else goes to stderr there
  const argv = process.argv.slice(2);
  const log: Logger = argv[0] === "mcp" && argv[1] !== "init" ? stderrLogger : consoleLogger;
  void Promise.resolve(run(argv, log)).then((code) => process.exit(code));
}
