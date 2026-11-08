import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DE, EN, enJson, placeholders } from "./labels.ts";

const en = JSON.parse(readFileSync(EN, "utf8")) as Record<string, string>;
const de = JSON.parse(readFileSync(DE, "utf8")) as Record<string, string>;

describe("labels", () => {
  it("en.json lists every key used in the source", () => {
    expect(readFileSync(EN, "utf8"), "run `pnpm labels`").toBe(enJson());
  });

  it("de.json covers every key, with no stale ones", () => {
    expect(
      Object.keys(en).filter((k) => !(k in de)),
      "missing in de.json",
    ).toEqual([]);
    expect(
      Object.keys(de).filter((k) => !(k in en)),
      "not used any more",
    ).toEqual([]);
  });

  it("German texts are filled and keep the placeholders", () => {
    for (const [k, v] of Object.entries(de)) {
      expect(v.trim(), k).not.toBe("");
      expect(placeholders(v), k).toEqual(placeholders(k));
    }
  });
});
