import { existsSync } from "node:fs";
import { join } from "node:path";
import { read } from "./util.js";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export interface Project {
  cwd: string;
  pm: PackageManager;
  /** main stylesheet that the app imports once */
  css: string | null;
  /** root layout (Next app router) */
  layout: string | null;
  usesTailwind: boolean;
  srcDir: boolean;
}

export function detect(cwd: string): Project {
  const pm: PackageManager = existsSync(join(cwd, "pnpm-lock.yaml"))
    ? "pnpm"
    : existsSync(join(cwd, "yarn.lock"))
      ? "yarn"
      : existsSync(join(cwd, "bun.lockb")) || existsSync(join(cwd, "bun.lock"))
        ? "bun"
        : "npm";
  const srcDir = existsSync(join(cwd, "src", "app")) || existsSync(join(cwd, "src", "index.css"));
  const base = srcDir ? join(cwd, "src") : cwd;
  const cssCandidates = [
    "app/globals.css",
    "styles/globals.css",
    "index.css",
    "app.css",
    "main.css",
  ].map((p) => join(base, p));
  const css = cssCandidates.find((p) => existsSync(p)) ?? null;
  const layout =
    ["app/layout.tsx", "app/layout.jsx"].map((p) => join(base, p)).find((p) => existsSync(p)) ??
    null;
  const usesTailwind = !!css && /@import\s+["']tailwindcss["']/.test(read(css) ?? "");
  return { cwd, pm, css, layout, usesTailwind, srcDir };
}

export function installCommand(pm: PackageManager, pkgs: string[]): string {
  const verb = pm === "npm" ? "install" : "add";
  return `${pm} ${verb} ${pkgs.join(" ")}`;
}
