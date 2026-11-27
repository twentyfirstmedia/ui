/**
 * Colour maths for palettes shown as data (PaletteSwatches): WCAG 2 contrast and OKLCH from hex.
 * Plain functions, no DOM: usable on the server and in tests.
 */

/** `#rgb` or `#rrggbb` → [r, g, b] in 0–255, or undefined for anything else. */
export function parseHex(hex: string): [number, number, number] | undefined {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return undefined;
  const h =
    (m[1] as string).length === 3
      ? [...(m[1] as string)].map((c) => c + c).join("")
      : (m[1] as string);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

const linear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance of a hex colour (0 black … 1 white). */
export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return NaN;
  const [r, g, b] = rgb.map(linear) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two hex colours (1 … 21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (Number.isNaN(la) || Number.isNaN(lb)) return NaN;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** The WCAG level a contrast ratio reaches for normal text ("AA Large" only counts for 18px+/bold 14px+). */
export type WcagLevel = "AAA" | "AA" | "AA Large" | "Fail";
export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

/** OKLCH of a hex colour: lightness 0–1, chroma, hue in degrees (0 for greys). */
export function hexToOklch(hex: string): { l: number; c: number; h: number } | undefined {
  const rgb = parseHex(hex);
  if (!rgb) return undefined;
  const [r, g, b] = rgb.map(linear) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.sqrt(A * A + B * B);
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h: c < 0.0002 ? 0 : h };
}

/** CSS `oklch()` for a hex colour, e.g. `oklch(54.6% 0.215 262.9)`. */
export function formatOklch(hex: string): string {
  const o = hexToOklch(hex);
  if (!o) return "";
  const r = (n: number, d: number) => Number(n.toFixed(d));
  return `oklch(${r(o.l * 100, 1)}% ${r(o.c, 3)} ${r(o.h, 1)})`;
}
