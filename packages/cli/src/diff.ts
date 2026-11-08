import { relative } from "node:path";
import { buildCopy, loadCore } from "./source.js";
import { targetPath } from "./add.js";
import { type Logger, read, readConfig } from "./util.js";

/** Line diff (LCS) as unified-style lines prefixed with " ", "-" or "+". */
export function lineDiff(a: string[], b: string[]): string[] {
  const n = a.length,
    m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      (dp[i] as number[])[j] =
        a[i] === b[j]
          ? (dp[i + 1] as number[])[j + 1]! + 1
          : Math.max((dp[i + 1] as number[])[j]!, (dp[i] as number[])[j + 1]!);
  const out: string[] = [];
  let i = 0,
    j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push(" " + a[i]);
      i++;
      j++;
    } else if ((dp[i + 1] as number[])[j]! >= (dp[i] as number[])[j + 1]!) out.push("-" + a[i++]);
    else out.push("+" + b[j++]);
  }
  while (i < n) out.push("-" + a[i++]);
  while (j < m) out.push("+" + b[j++]);
  return out;
}

const body = (s: string) =>
  s.split("\n").filter((l) => !/^\/\* (\w+: copied from|`twentyfirst-ui diff)/.test(l));

/** Shows how the local copy differs from the current package source. Returns the number of changed lines. */
export function diff(cwd: string, name: string, log: Logger): number {
  const dir = readConfig(cwd)?.components ?? "components/ui";
  const path = targetPath(cwd, dir, name);
  const local = read(path);
  if (local == null)
    throw new Error(
      `${relative(cwd, path)} does not exist. Add it with \`twentyfirst-ui add ${name}\`.`,
    );
  const upstream = buildCopy(loadCore(cwd), name).content;
  const lines = lineDiff(body(upstream), body(local));
  const changed = lines.filter((l) => l[0] !== " ");
  if (!changed.length) {
    log.log(`${name}: no changes against the package.`);
    return 0;
  }
  log.log(`--- ${name} (package)\n+++ ${relative(cwd, path)} (yours)`);
  lines.forEach((l, k) => {
    const near = lines.slice(Math.max(0, k - 2), k + 3).some((x) => x[0] !== " ");
    if (near) log.log(l);
  });
  return changed.length;
}
