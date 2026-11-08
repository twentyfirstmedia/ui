import { existsSync } from "node:fs";
import { join, relative } from "node:path";
import { buildCopy, loadCore } from "./source.js";
import { type Logger, kebab, readConfig, write } from "./util.js";

export interface AddOptions {
  cwd: string;
  components: string[];
  overwrite?: boolean;
  log: Logger;
}

export function targetPath(cwd: string, dir: string, name: string): string {
  return join(cwd, dir, `${kebab(name)}.tsx`);
}

export function add(o: AddOptions): string[] {
  const cfg = readConfig(o.cwd);
  const dir = cfg?.components ?? "components/ui";
  const core = loadCore(o.cwd);
  const written: string[] = [];
  for (const name of o.components) {
    const copy = buildCopy(core, name);
    const path = targetPath(o.cwd, dir, name);
    if (existsSync(path) && !o.overwrite) {
      o.log.warn(`  · ${relative(o.cwd, path)} exists; use --overwrite to replace it`);
      continue;
    }
    write(path, copy.content);
    written.push(path);
    o.log.log(`  ✓ ${relative(o.cwd, path)}`);
  }
  if (written.length)
    o.log.log(
      `\nImport from the copy instead of the package, e.g. import { ${o.components[0]} } from "@/${dir}/${kebab(o.components[0] as string)}";`,
    );
  return written;
}
