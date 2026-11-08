import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

export const SCOPE = "@twentyfirstmedia";
export const CONFIG_FILE = "twentyfirst.json";

export type Kit = "halo" | "pro";

export interface Config {
  kit: Kit;
  /** Load both kits (themes.css) and switch with data-kit at runtime. */
  both?: boolean;
  css?: string;
  components: string;
}

export function read(path: string): string | null {
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

export function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

export function readJson<T>(path: string): T | null {
  const s = read(path);
  return s ? (JSON.parse(s) as T) : null;
}

export function readConfig(cwd: string): Config | null {
  return readJson<Config>(join(cwd, CONFIG_FILE));
}

export function kebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

export interface Logger {
  log(msg: string): void;
  warn(msg: string): void;
}

export const consoleLogger: Logger = {
  log: (m) => console.log(m),
  warn: (m) => console.warn(m),
};
