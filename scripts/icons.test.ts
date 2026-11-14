import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { build } from "./icons.ts";
import { ROOT } from "./tokens.ts";

describe("icon library", () => {
  it("is generated from the pinned sources (run node scripts/icons.ts)", () => {
    expect(readFileSync(join(ROOT, "packages/core/src/icon-library.ts"), "utf8")).toBe(build());
  });
});

describe("icon notices", () => {
  it("ship with every package that bundles the icon library", () => {
    const core = readFileSync(join(ROOT, "packages/core/ICONS-LICENSE"), "utf8");
    expect(readFileSync(join(ROOT, "packages/elements/ICONS-LICENSE"), "utf8")).toBe(core);
    const el = JSON.parse(readFileSync(join(ROOT, "packages/elements/package.json"), "utf8"));
    expect(el.files).toContain("ICONS-LICENSE");
  });

  it("name the source of every logo drawn from a company's own artwork", () => {
    const index = JSON.parse(readFileSync(join(ROOT, "scripts/brands/index.json"), "utf8")) as {
      name: string;
      source: string;
    }[];
    const notice = readFileSync(join(ROOT, "packages/core/ICONS-LICENSE"), "utf8");
    for (const b of index) {
      expect(b.source, b.name).toBeTruthy();
      expect(notice, b.name).toContain(b.name);
    }
  });
});
