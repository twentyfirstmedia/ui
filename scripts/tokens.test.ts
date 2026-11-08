import { describe, expect, it } from "vitest";
import { KITS, readTokens, stale, tokenNames } from "./tokens.ts";

describe("tokens", () => {
  it("generated token files are up to date", () => {
    expect(stale(), "run `pnpm tokens`").toEqual([]);
  });

  it("both kits define exactly the same token names", () => {
    const [a, b] = KITS.map((k) => tokenNames(readTokens(k)).sort());
    expect(a).toEqual(b);
  });

  it("every token name is unique within a kit", () => {
    for (const kit of KITS) {
      const names = tokenNames(readTokens(kit));
      expect(names.length, kit).toBe(new Set(names).size);
    }
  });

  it("references point at tokens that exist", () => {
    for (const kit of KITS) {
      const t = readTokens(kit);
      const names = new Set(tokenNames(t));
      const json = JSON.stringify(t);
      for (const m of json.matchAll(/\{([\w-]+)\}/g))
        expect(names.has(m[1]!), `${kit}: {${m[1]}}`).toBe(true);
    }
  });
});
