import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { componentFiles, scope } from "./build-css.ts";
import { KITS, ROOT } from "./tokens.ts";

const read = (kit: string, f: string) =>
  readFileSync(join(ROOT, "packages", kit, "css", f), "utf8");

/** Colour literals are not allowed in component CSS: tokens only. */
const COLOUR =
  /#[0-9a-f]{3,8}\b|(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|(?<![\w-])(?:white|black|red|green|blue|gray|grey|orange|yellow|purple|pink|silver)(?![\w-])|%23[0-9a-f]{3,8}/i;

describe("component css", () => {
  it("contains no colour literals", () => {
    for (const kit of KITS) {
      for (const f of componentFiles(kit)) {
        const lines = read(kit, f)
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .split("\n");
        lines.forEach((line, i) => {
          expect(COLOUR.test(line), `${kit}/css/${f}:${i + 1}: ${line.trim()}`).toBe(false);
        });
      }
    }
  });

  it("scopes rules to the kit and prefixes keyframes", () => {
    const out = scope(
      "halo",
      "body { margin: 0 } .tf-btn, .tf-chip:hover { color: var(--ink) } @media (max-width: 600px) { .tf-x { gap: 0 } } @keyframes tf-in { from { opacity: 0 } } .tf-y { animation: tf-in 1s both }",
    );
    expect(out).toContain(
      ':where([data-kit="halo"]), :where([data-kit="halo"]) body { margin: 0 }',
    );
    expect(out).toContain(
      ':where([data-kit="halo"]) .tf-btn, :where([data-kit="halo"]) .tf-chip:hover',
    );
    expect(out).toContain(':where([data-kit="halo"]) .tf-x');
    expect(out).toContain("@keyframes tf-halo-in { from { opacity: 0 } }");
    expect(out).toContain("animation: tf-halo-in 1s both");
  });
});
