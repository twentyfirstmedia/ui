import { existsSync } from "node:fs";
import { loadCore } from "./source.js";
import { targetPath } from "./add.js";
import { type Logger, readConfig } from "./util.js";

export function list(cwd: string, log: Logger): Map<string, string[]> {
  const core = loadCore(cwd);
  const dir = readConfig(cwd)?.components ?? "components/ui";
  const groups = new Map<string, string[]>();
  for (const [name, file] of core.components) groups.set(file, [...(groups.get(file) ?? []), name]);
  for (const [file, names] of groups) {
    log.log(`${file}`);
    log.log(
      "  " +
        names
          .sort()
          .map((n) => (existsSync(targetPath(cwd, dir, n)) ? `${n} (added)` : n))
          .join(", "),
    );
  }
  return groups;
}
