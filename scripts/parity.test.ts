/**
 * Halo and Pro are always 1:1: the same components, classes and tokens. These tests fail when one
 * kit styles a class the other does not, when the derived Pro structure is stale (a Halo CSS change
 * without `pnpm tokens`), or when the Pro look layer invents classes of its own.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { proStale } from "./pro-css.ts";
import { ROOT } from "./tokens.ts";

function classes(kit: string, filter: (f: string) => boolean = () => true): Set<string> {
  const dir = join(ROOT, "packages", kit, "css");
  const out = new Set<string>();
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".css") && filter(x))) {
    const css = readFileSync(join(dir, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const m of css.matchAll(/\.(tf-[\w-]+)/g)) out.add(m[1] as string);
  }
  return out;
}

describe("kit parity", () => {
  it("the derived Pro structure is up to date with the Halo CSS", () => {
    expect(proStale(), "run `pnpm tokens`").toEqual([]);
  });

  it("both kits style exactly the same classes", () => {
    const halo = classes("halo");
    const pro = classes("pro");
    expect([...pro].filter((c) => !halo.has(c)).sort(), "only in Pro").toEqual([]);
    expect([...halo].filter((c) => !pro.has(c)).sort(), "only in Halo").toEqual([]);
  });

  it("both kits ship the same component CSS files", () => {
    const list = (kit: string) =>
      readdirSync(join(ROOT, "packages", kit, "css")).filter((f) => /^0\d-.*\.css$/.test(f));
    expect(list("pro")).toEqual(list("halo"));
  });

  it("the Pro look layer only restyles classes Halo has", () => {
    const halo = classes("halo");
    const look = classes("pro", (f) => f === "90-pro-look.css");
    expect([...look].filter((c) => !halo.has(c)).sort()).toEqual([]);
  });
});
