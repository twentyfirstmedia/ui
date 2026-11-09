/**
 * Publishes every package under packages/ whose version is not on npm yet, then tags it.
 *
 *   node scripts/publish.ts [--dry-run]
 *
 * Run by the release workflow through changesets/action instead of `changeset publish`: pnpm packs
 * each package (which turns `workspace:*` into real versions) and the npm CLI publishes the
 * tarball, because only the npm CLI does npm's Trusted Publishing (OIDC, no token) and provenance.
 * With a Trusted Publisher configured on npmjs.com npm uses the workflow's identity; without one
 * it falls back to NODE_AUTH_TOKEN. The "New tag:" lines tell changesets/action which tags to push
 * and which GitHub releases to create.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");
/** Publish order: dependencies before the packages that need them. */
const ORDER = ["@twentyfirstmedia/ui-core", "@twentyfirstmedia/halo", "@twentyfirstmedia/pro"];

interface Pkg {
  dir: string;
  name: string;
  version: string;
}

function packages(): Pkg[] {
  const base = join(ROOT, "packages");
  return readdirSync(base)
    .map((d) => join(base, d))
    .filter((dir) => existsSync(join(dir, "package.json")))
    .map((dir) => {
      const json = JSON.parse(readFileSync(join(dir, "package.json"), "utf8")) as {
        name: string;
        version: string;
        private?: boolean;
      };
      return json.private ? null : { dir, name: json.name, version: json.version };
    })
    .filter((p): p is Pkg => p !== null)
    .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
}

function rank(name: string): number {
  const i = ORDER.indexOf(name);
  return i < 0 ? ORDER.length : i;
}

function isPublished(p: Pkg): boolean {
  try {
    const out = execFileSync("npm", ["view", `${p.name}@${p.version}`, "version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.trim() === p.version;
  } catch {
    return false; // E404: not on the registry yet
  }
}

function hasTag(tag: string): boolean {
  return (
    execFileSync("git", ["tag", "--list", tag], { cwd: ROOT, encoding: "utf8" }).trim() === tag
  );
}

const todo = packages().filter((p) => {
  const published = isPublished(p);
  if (published) console.log(`${p.name}@${p.version} is already on npm`);
  return !published;
});
if (!todo.length) console.log("Nothing to publish.");

const out = mkdtempSync(join(tmpdir(), "tf-publish-"));
try {
  for (const p of todo) {
    const dest = join(out, p.name.replace(/[@/]/g, "_"));
    execFileSync("pnpm", ["pack", "--pack-destination", dest], { cwd: p.dir, stdio: "inherit" });
    const tarball = readdirSync(dest).find((f) => f.endsWith(".tgz"));
    if (!tarball) throw new Error(`pnpm pack wrote no tarball for ${p.name}`);
    const args = ["publish", join(dest, tarball), "--access", "public"];
    // provenance needs the CI's OIDC identity; locally there is none
    if (process.env.GITHUB_ACTIONS === "true") args.push("--provenance");
    if (dryRun) args.push("--dry-run");
    execFileSync("npm", args, { cwd: p.dir, stdio: "inherit" });
    const tag = `${p.name}@${p.version}`;
    if (!dryRun && !hasTag(tag)) execFileSync("git", ["tag", tag], { cwd: ROOT });
    console.log(`New tag: ${tag}`);
  }
} finally {
  rmSync(out, { recursive: true, force: true });
}
