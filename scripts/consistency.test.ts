/**
 * Consistency rules found by auditing every preview in both kits and themes: touch inputs stay
 * at 16px in both kits, and the examples take radii and weights from tokens, so Pro shows them
 * square and at most 600.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT } from "./tokens.ts";

const css = (kit: string, f: string) => readFileSync(join(ROOT, "packages", kit, "css", f), "utf8");

describe("touch inputs", () => {
  it("stay at least 16px in both kits (no zoom on focus)", () => {
    for (const kit of ["halo", "pro"]) {
      const block = css(kit, "06-responsive.css").split("@media (pointer: coarse)")[1] ?? "";
      expect(block, kit).toMatch(/font-size: max\(16px, 1em\)/);
    }
  });
});

describe("examples", () => {
  const dir = join(ROOT, "examples", "previews", "src");
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));

  it("take radii from tokens (phone mockups keep their device shape)", () => {
    const bad: string[] = [];
    for (const f of files)
      for (const m of readFileSync(join(dir, f), "utf8").matchAll(/borderRadius: (\d+)/g))
        if (!(f === "MobileScreens.tsx" && ["44", "36"].includes(m[1] ?? "")))
          bad.push(`${f}: ${m[0]}`);
    expect(bad).toEqual([]);
  });

  it("take font weights from tokens and keep font sizes on whole pixels", () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = readFileSync(join(dir, f), "utf8");
      for (const m of src.matchAll(/font: "(\d{3}) |fontWeight: \d{3}|\d+\.\d+px\/|"\d+\.5px/g))
        bad.push(`${f}: ${m[0]}`);
    }
    expect(bad).toEqual([]);
  });
});
