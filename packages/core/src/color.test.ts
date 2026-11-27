import { describe, expect, it } from "vitest";
import { contrastRatio, formatOklch, hexToOklch, parseHex, wcagLevel } from "./color.js";

describe("color", () => {
  it("parses short and long hex", () => {
    expect(parseHex("#fff")).toEqual([255, 255, 255]);
    expect(parseHex("2563eb")).toEqual([37, 99, 235]);
    expect(parseHex("red")).toBeUndefined();
  });
  it("computes WCAG contrast", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
    expect(wcagLevel(4.54)).toBe("AA");
    expect(wcagLevel(7.1)).toBe("AAA");
    expect(wcagLevel(3.2)).toBe("AA Large");
    expect(wcagLevel(2)).toBe("Fail");
  });
  it("converts to OKLCH", () => {
    const white = hexToOklch("#ffffff");
    expect(white?.l).toBeCloseTo(1, 3);
    expect(white?.c).toBeCloseTo(0, 3);
    const red = hexToOklch("#ff0000");
    expect(red?.l).toBeCloseTo(0.628, 2);
    expect(red?.c).toBeCloseTo(0.2577, 3);
    expect(red?.h).toBeCloseTo(29.23, 1);
    expect(formatOklch("#2563eb")).toBe("oklch(54.6% 0.215 262.9)");
  });
});
