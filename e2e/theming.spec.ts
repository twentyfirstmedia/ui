import { expect, test, type Page } from "@playwright/test";
import { KITS, previewPages } from "./pages";

/**
 * shadcn-style theming reaches every component. A test theme sets every theme variable
 * (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border,
 * input, ring, chart-1…5, sidebar-*) to unmistakable colours with a plain `:root` rule, the way
 * an app pastes a shadcn theme. Then no element of any preview may keep a colour of the kit's
 * default theme: that would be a part that ignores the theme.
 *
 * Deliberately outside the theme, and skipped: meaning colours (tints, statuses, diffs) and
 * whatever is drawn on the dark app frame, on paper (e-mail, invoice), on photos or count badges.
 */
test.use({ baseURL: "http://localhost:4174", reducedMotion: "reduce" });

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
];

/** Distinct, saturated colours no kit uses: one per variable. */
const testTheme = () =>
  THEME_VARS.map((v, i) => `--${v}: hsl(${(i * 47) % 360} 85% ${i % 2 ? 38 : 62}%);`).join(" ");

/** Tokens whose colours mean something (state, category) and stay when the theme changes. */
const MEANING =
  /^--((sky|mint|lilac|butter|blush)(-ink)?|(ok|info|warn|signal|idle)(-bg)?|diff-.*|chart-(sky|mint|lilac|butter|blush))$/;
/** Grounds outside the theme: the dark app frame, paper, media, count badges, scrims. */
const OUTSIDE =
  /^--(frame|frame-strong|frame-hover|frame-active|media-scrim|lightbox|serp-chip|count|scrim|scrim-strong)$/;

/** Every colour token of the page's kit, resolved through one probe element each. */
function tokenColours(page: Page): Promise<Record<string, string>> {
  return page.evaluate(() => {
    const names = new Set<string>();
    const walk = (list: CSSRuleList) => {
      for (const r of Array.from(list)) {
        if (r instanceof CSSGroupingRule) walk(r.cssRules);
        if (r instanceof CSSStyleRule && r.selectorText.startsWith(":where("))
          for (const p of Array.from(r.style)) if (p.startsWith("--")) names.add(p);
      }
    };
    for (const sheet of Array.from(document.styleSheets))
      try {
        walk(sheet.cssRules);
      } catch {
        /* cross-origin sheet */
      }
    const host = document.querySelector<HTMLElement>(".docs-preview-inner") ?? document.body;
    const probes = [...names].map((n) => {
      const el = document.createElement("i");
      el.style.setProperty("color", `var(${n}, transparent)`);
      host.appendChild(el);
      return [n, el] as const;
    });
    const out: Record<string, string> = {};
    for (const [n, el] of probes) {
      const c = getComputedStyle(el).color;
      if (c && c !== "rgba(0, 0, 0, 0)") out[n] = c;
      el.remove();
    }
    return out;
  });
}

/** What every element of the previews draws, in document order ("" where nothing counts). */
function snapshot(page: Page, outside: string[]): Promise<string[][]> {
  return page.evaluate((outsideList) => {
    const props = [
      "color",
      "background-color",
      "border-top-color",
      "border-right-color",
      "border-bottom-color",
      "border-left-color",
      "outline-color",
      "fill",
      "stroke",
    ];
    const outsideBg = new Set(outsideList);
    // the ground an element is drawn on; translucent overlays (hover, active) count as the
    // ground below them when that is outside the theme
    const ground = (el: Element | null): string => {
      for (let a: Element | null = el; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.backgroundImage !== "none" || a.tagName === "IMG") return "image";
        if (cs.backgroundColor !== "rgba(0, 0, 0, 0)") return cs.backgroundColor;
      }
      return "";
    };
    const drawn = (el: Element, cs: CSSStyleDeclaration, p: string, v: string): boolean => {
      if (!v || cs.display === "none" || cs.visibility === "hidden") return false;
      if (p.startsWith("border-"))
        return parseFloat(cs.getPropertyValue(p.replace("color", "width"))) > 0;
      if (p === "outline-color")
        return cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
      if (p === "background-color") return v !== "rgba(0, 0, 0, 0)";
      if (p === "color")
        return Array.from(el.childNodes).some((n) => n.nodeType === 3 && !!n.textContent?.trim());
      return el instanceof SVGElement;
    };
    const out: string[][] = [];
    for (const box of Array.from(document.querySelectorAll<HTMLElement>(".docs-preview-inner")))
      for (const el of [box, ...Array.from(box.querySelectorAll("*"))]) {
        const cs = getComputedStyle(el);
        const own = ground(el);
        const below = ground(el.parentElement);
        const off = (g: string) => g === "image" || outsideBg.has(g);
        const skip =
          off(own) ||
          off(below) ||
          !!el.closest(
            // paper is white like a default card and the before/after slider sits on a photo, so they are
            // named here instead of matched
            ".tf-colorf-sw, iframe, .tf-mailprev-frame, .tf-adprev-card, .tf-2fa-qr, [class*='paper'], [class^='tf-ba-']",
          );
        const cls = (el.getAttribute("class") || el.tagName.toLowerCase())
          .split(" ")
          .slice(0, 2)
          .join(".");
        out.push(
          props.map((p) => {
            const v = cs.getPropertyValue(p);
            return !skip && drawn(el, cs, p, v) ? `${cls}|${p}|${v}` : "";
          }),
        );
      }
    return out;
  }, outside);
}

for (const kit of KITS)
  for (const mode of ["light", "dark"] as const)
    test.describe(`${kit} ${mode}: a shadcn theme reaches every component`, () => {
      for (const path of [...previewPages, "status-and-approvals"])
        test(`/${kit}/${path}`, async ({ page }) => {
          await page.addInitScript(
            ([k, m]) => localStorage.setItem(`docs-theme-${k}`, m as string),
            [kit, mode],
          );
          await page.goto(`/${kit}/${path}/`, { waitUntil: "networkidle" });
          await expect(page.locator(".docs-preview-inner").first()).toHaveAttribute(
            "data-theme",
            mode,
          );
          // colours animate when tokens change: read end states, not frames of a fade
          await page.addStyleTag({
            content:
              "*, *::before, *::after { transition: none !important; animation: none !important; }",
          });
          await page.waitForTimeout(300);
          const outsideOf = (t: Record<string, string>) =>
            Object.entries(t)
              .filter(([n]) => OUTSIDE.test(n))
              .map(([, v]) => v);
          const before = await tokenColours(page);
          const d = await snapshot(page, outsideOf(before));
          // in <body>: React owns <head> and may reconcile a style tag there away
          await page.evaluate((css) => {
            const st = document.createElement("style");
            st.textContent = css;
            document.body.appendChild(st);
          }, `:root, [data-kit], [data-theme] { ${testTheme()} }`);
          await page.waitForTimeout(100);
          const after = await tokenColours(page);
          const t = await snapshot(page, outsideOf(after));

          // default colours of every token the theme changes, minus meaning colours that
          // happen to share a value with one
          const themed = new Set(
            Object.entries(before)
              .filter(([n, v]) => after[n] !== v)
              .map(([, v]) => v),
          );
          expect(themed.size).toBeGreaterThan(10);
          for (const [n, v] of Object.entries(after))
            if (MEANING.test(n) && before[n] === v) themed.delete(v);

          const ignored = new Set<string>();
          for (let i = 0; i < d.length; i++)
            for (let j = 0; j < (d[i] ?? []).length; j++) {
              const a = d[i]?.[j];
              if (!a || a !== t[i]?.[j]) continue;
              if (themed.has(a.split("|")[2] ?? "")) ignored.add(a);
            }
          expect([...ignored].sort()).toEqual([]);
        });
    });
