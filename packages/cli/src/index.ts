#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { add } from "./add.js";
import { diff } from "./diff.js";
import { init } from "./init.js";
import { list } from "./list.js";
import { consoleLogger, type Kit, type Logger } from "./util.js";

const HELP = `twentyfirst-ui: set up and copy components of the Twentyfirst UI kits

Usage
  twentyfirst-ui init [--kit halo|pro] [--both] [--locale de-DE] [--no-install] [--components components/ui]
  twentyfirst-ui add <Component…> [--overwrite]
  twentyfirst-ui list
  twentyfirst-ui diff <Component>

Options
  --cwd <dir>   run in another directory
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
        ["kit", "locale", "cwd", "components"].includes(k as string)
      ) {
        flags[k as string] = next;
        i++;
      } else flags[k as string] = true;
    } else args.push(a);
  }
  return { cmd, args, flags };
}

export function run(argv: string[], log: Logger = consoleLogger): number {
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
          locale: typeof flags.locale === "string" ? flags.locale : undefined,
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
      default:
        log.log(HELP);
        return cmd === "help" || flags.help ? 0 : 1;
    }
  } catch (e) {
    log.warn(`Error: ${(e as Error).message}`);
    return 1;
  }
}

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
  process.exit(run(process.argv.slice(2)));
}
