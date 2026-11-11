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
