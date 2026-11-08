/**
 * shadcn-style themes for both kits.
 *
 * The kits name their theme colours like shadcn/ui (`--primary`, `--muted-foreground`, …) and
 * define them with zero specificity, so a theme is any CSS that sets these variables. This module
 * writes that CSS with the selectors the kits use for light, dark and system, and resolves values
 * for `<UIProvider tokens>`. No imports: build scripts and the CLI load it too.
 */

/** The theme variables, in shadcn's order. */
export const THEME_VARS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const;

export type ThemeVar = (typeof THEME_VARS)[number];
/** Values per variable: any CSS colour (`#2563eb`, `oklch(0.55 0.2 260)`, `hsl(…)`). */
export type ThemeValues = Partial<Record<ThemeVar, string>>;

export interface ThemeInput {
  /** Values for light mode. */
  light?: ThemeValues;
  /** Values for dark mode; anything missing falls back to the kit's dark default. */
  dark?: ThemeValues;
  /** Base corner radius (`--radius`); the kit's scale derives from it. */
  radius?: string;
}

export interface ThemeCssOptions {
  /** The kit the theme is for; decides what an element without `data-theme` shows. Default "halo". */
  kit?: "halo" | "pro";
  /** Write it for `themes.css`, under `[data-kit="…"]` (both kits loaded). */
  scoped?: boolean;
}

/** Kit default: Halo follows the system, Pro is dark. */
const DEFAULT_MODE = { halo: "system", pro: "dark" } as const;

const isVar = (k: string): k is ThemeVar => (THEME_VARS as readonly string[]).includes(k);

const SERIES = ["sky", "mint", "butter", "lilac", "blush"] as const;

/**
 * Halo draws bars in soft fills of the series colours (`--chart-sky` …): a theme that changes the
 * series gets matching fills, mixed with the card in light mode and solid in dark mode.
 */
function withSeriesFills(
  values: ThemeValues | undefined,
  kit: "halo" | "pro",
  mode: "light" | "dark",
): Record<string, string> {
  const out: Record<string, string> = { ...(values ?? {}) } as Record<string, string>;
  if (kit !== "halo") return out;
  SERIES.forEach((tint, i) => {
    if (out[`chart-${i + 1}`])
      out[`chart-${tint}`] =
        mode === "light"
          ? `color-mix(in oklab, var(--chart-${i + 1}) 22%, var(--card))`
          : `var(--chart-${i + 1})`;
  });
  return out;
}

function decls(values: Record<string, string> | ThemeValues | undefined, indent: string): string {
  return Object.entries(values ?? {})
    .filter(([k, v]) => (isVar(k) || /^chart-[a-z]+$/.test(k)) && typeof v === "string" && v.trim())
    .map(([k, v]) => `${indent}--${k}: ${(v as string).trim()};`)
    .join("\n");
}

function rule(selectors: string[], body: string, indent = ""): string {
  return body ? `${indent}${selectors.join(",\n" + indent)} {\n${body}\n${indent}}\n` : "";
}

/**
 * The CSS for a theme. Light values apply to the page and to `[data-theme="light"]`; dark values to
 * `[data-theme="dark"]` (and shadcn's `.dark`), to `[data-theme="system"]` in a dark system theme,
 * and to an element without `data-theme` when the kit's default is dark (Pro) or follows the
 * system (Halo). Plain selectors, so the theme beats the kit's defaults in any order.
 */
export function themeCss(theme: ThemeInput, o: ThemeCssOptions = {}): string {
  const kit = o.kit ?? "halo";
  const mode = DEFAULT_MODE[kit];
  const k = o.scoped ? `[data-kit="${kit}"]` : ":root";
  const self = (attr: string) => (o.scoped ? [`${k}${attr}`, `${k} ${attr}`] : [attr]);
  const lightValues = withSeriesFills(theme.light, kit, "light");
  const darkValues = withSeriesFills(theme.dark, kit, "dark");
  const light = decls(lightValues, "  ");
  const dark = decls(darkValues, "  ");
  const darkIn = decls(darkValues, "    ");
  const lightIn = decls(lightValues, "    ");
  let css = "";
  if (theme.radius) css += rule([k], `  --radius: ${theme.radius.trim()};`);
  // what the page shows without data-theme
  css += rule(mode === "dark" ? [`${k}:not([data-theme])`] : [k], mode === "dark" ? dark : light);
  if (mode === "system" && darkIn)
    css += `@media (prefers-color-scheme: dark) {\n${rule([`${k}:not([data-theme])`], darkIn, "  ")}}\n`;
  if (darkIn)
    css += `@media (prefers-color-scheme: dark) {\n${rule(self('[data-theme="system"]'), darkIn, "  ")}}\n`;
  if (lightIn)
    css += `@media (prefers-color-scheme: light) {\n${rule(self('[data-theme="system"]'), lightIn, "  ")}}\n`;
  css += rule(self('[data-theme="light"]'), light);
  css += rule([...self(".light")], light);
  css += rule([...self('[data-theme="dark"]'), ...self(".dark")], dark);
  return css;
}

/** Variables and values of a theme for one mode, ready for an inline `style`. */
export function themeStyle(
  values: ThemeValues | undefined,
  radius?: string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values ?? {})) if (isVar(k) && v) out[`--${k}`] = v;
  if (radius) out["--radius"] = radius;
  return out;
}

/**
 * Reads a shadcn theme (the CSS ui.shadcn.com/themes, tweakcn and similar tools give you): the
 * variables under `:root` (light) and `.dark` (dark), plus `--radius`. Colours in shadcn v3's
 * bare-channel form (`222.2 84% 4.9%`) are wrapped in `hsl()`.
 */
export function parseThemeCss(css: string): ThemeInput {
  const out: ThemeInput = {};
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [...clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  for (const [, sel = "", body = ""] of blocks) {
    const s = sel.trim();
    const target: "light" | "dark" | null = /\.dark\b|\[data-theme=["']?dark/.test(s)
      ? "dark"
      : /:root|\[data-theme=["']?light|html|:host/.test(s)
        ? "light"
        : null;
    if (!target) continue;
    for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);?/g)) {
      const name = m[1] as string;
      let value = (m[2] as string).trim();
      if (name === "radius") {
        out.radius = value;
        continue;
      }
      if (!isVar(name)) continue;
      if (/^-?[\d.]+\s+[\d.]+%\s+[\d.]+%(\s*\/\s*[\d.]+%?)?$/.test(value)) value = `hsl(${value})`;
      (out[target] ??= {})[name] = value;
    }
  }
  return out;
}

/**
 * Readable text on a colour given as hex (`#2563eb`): near-black or white, whichever has more
 * contrast (WCAG). Other formats return undefined: pick the foreground yourself.
 */
export function foregroundFor(color: string): string | undefined {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return undefined;
  const h =
    (m[1] as string).length === 3
      ? [...(m[1] as string)].map((c) => c + c).join("")
      : (m[1] as string);
  const lum = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const L = 0.2126 * (lum[0] as number) + 0.7152 * (lum[1] as number) + 0.0722 * (lum[2] as number);
  const onWhite = 1.05 / (L + 0.05);
  const onBlack = (L + 0.05) / 0.05;
  return onBlack >= onWhite ? "#111114" : "#ffffff";
}

/**
 * A brand theme from one colour: primary, its text, the focus ring and the Sidebar's primary.
 * Everything else keeps the kit's look.
 */
export function brandTheme(color: string, dark?: string): ThemeInput {
  const fg = foregroundFor(color);
  const darkColor = dark ?? color;
  const darkFg = foregroundFor(darkColor);
  const set = (c: string, f: string | undefined): ThemeValues => ({
    primary: c,
    ...(f ? { "primary-foreground": f, "sidebar-primary-foreground": f } : {}),
    ring: c,
    "sidebar-primary": c,
    "sidebar-ring": c,
  });
  return { light: set(color, fg), dark: set(darkColor, darkFg) };
}

/**
 * Brand presets: a primary colour per mode with readable text, the focus ring and the Sidebar's
 * primary. They keep each kit's neutrals, so Halo stays warm and Pro stays monochrome.
 */
export const THEME_PRESETS: Record<string, { label: string; theme: ThemeInput }> = {
  blue: { label: "Blue", theme: brandTheme("#2563eb", "#60a5fa") },
  violet: { label: "Violet", theme: brandTheme("#7c3aed", "#a78bfa") },
  emerald: { label: "Emerald", theme: brandTheme("#047857", "#34d399") },
  orange: { label: "Orange", theme: brandTheme("#c2410c", "#fb923c") },
  rose: { label: "Rose", theme: brandTheme("#e11d48", "#fb7185") },
  teal: { label: "Teal", theme: brandTheme("#0f766e", "#2dd4bf") },
};
