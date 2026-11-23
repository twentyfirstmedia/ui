import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import { KITS, THEMES } from "./pages";

/**
 * AppShell `topbar` in sidebar mode: the brand above the sidebar is exactly as wide as it
 * (expanded and collapsed), frame, bar and sidebar are one surface (an L), the sheet sits under
 * the bar and beside the sidebar; with `fill` bar and sidebar stay while the page scrolls; on
 * phones the bar is the sidebar's bar with the end actions and a search button.
 */
test.use({ baseURL: "http://localhost:4174", reducedMotion: "reduce" });

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DENSITIES = ["comfortable", "compact"] as const;

async function open(page: Page, kit: string, theme: string, density: string) {
  await page.addInitScript(
    ([k, t]) => localStorage.setItem(`docs-theme-${k}`, t as string),
    [kit, theme],
  );
  await page.goto(`/${kit}/components/AppShell/`);
  await page.waitForSelector(".docs-preview .tf-shell-bar");
  // the static page paints the kit's default theme until the docs apply the stored one
  await page.waitForSelector(`.docs-preview [data-theme="${theme}"] .tf-shell-bar`);
  await page.evaluate((d) => {
    const shell = document.querySelector(".docs-preview .tf-shell")!;
    for (let a: Element | null = shell; a; a = a.parentElement)
      if (a.hasAttribute("data-density")) a.setAttribute("data-density", d);
    document.documentElement.setAttribute("data-density", d);
  }, density);
  await page.waitForTimeout(200);
}

/** Boxes and the colour each part of the L shows (its own fill, or the frame under it). */
function measure(page: Page) {
  return page.evaluate(() => {
    const q = (s: string) => document.querySelector<HTMLElement>(`.docs-preview ${s}`)!;
    const shell = q(".tf-shell");
    const box = (el: HTMLElement) => el.getBoundingClientRect().toJSON() as DOMRect;
    const fill = (el: HTMLElement): string => {
      for (let a: HTMLElement | null = el; a; a = a.parentElement) {
        const bg = getComputedStyle(a).backgroundColor;
        if (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
      }
      return "";
    };
    const bar = q(".tf-shell-bar"),
      brand = q(".tf-shell-bar-brand"),
      side = q(".tf-sidebar"),
      sheet = q(".tf-sheet");
    const probe = document.createElement("span");
    probe.style.color = "var(--on-frame)";
    shell.appendChild(probe);
    const onFrame = getComputedStyle(probe).color;
    probe.remove();
    return {
      bar: box(bar),
      brand: box(brand),
      side: box(side),
      sheet: box(sheet),
      barFill: fill(bar),
      brandFill: fill(brand),
      sideFill: fill(side),
      sheetFill: fill(sheet),
      barColor: getComputedStyle(bar).color,
      onFrame,
      sheetRadius: getComputedStyle(sheet).borderTopLeftRadius,
      sideHeadShown:
        getComputedStyle(q(".tf-sidebar")).display !== "none" &&
        !!side.querySelector(".tf-sidebar-head") &&
        getComputedStyle(side.querySelector(".tf-sidebar-head")!).display !== "none",
    };
  });
}

for (const kit of KITS)
  for (const theme of THEMES)
    for (const density of DENSITIES)
      test.describe(`${kit} ${theme} ${density}`, () => {
        test("desktop: brand column, one L, sheet under the bar", async ({ page }) => {
          await page.setViewportSize({ width: 1440, height: 900 });
          await open(page, kit, theme, density);
          // bar, brand and sidebar show the same frame colour (once the theme has settled)
          await expect
            .poll(async () => {
              const c = await measure(page);
              return c.barFill === c.sideFill && c.brandFill === c.sideFill;
            })
            .toBe(true);
          const m = await measure(page);
          // the brand is the sidebar's column
          expect(Math.abs(m.brand.left - m.side.left)).toBeLessThanOrEqual(0.5);
          expect(Math.abs(m.brand.width - m.side.width)).toBeLessThanOrEqual(0.5);
          expect(m.sideHeadShown, "the brand is not repeated in the sidebar").toBe(false);
          // bar, brand and sidebar show the same frame colour, the bar's text is on-frame
          expect(m.barFill).toBe(m.sideFill);
          expect(m.brandFill).toBe(m.sideFill);
          // Halo: the dark frame around a light sheet; Pro: bg-100 with a hairline to the sheet
          if (kit === "halo") expect(m.sheetFill).not.toBe(m.sideFill);
          expect(m.barColor).toBe(m.onFrame);
          // the sheet starts under the bar and right of the sidebar
          expect(m.sheet.top).toBeGreaterThanOrEqual(m.bar.bottom - 0.5);
          expect(m.sheet.top - m.bar.bottom).toBeLessThanOrEqual(1.5);
          expect(m.sheet.left).toBeGreaterThanOrEqual(m.side.right - 0.5);
          expect(m.sheet.left - m.side.right).toBeLessThanOrEqual(1.5);
          if (kit === "halo") expect(parseFloat(m.sheetRadius)).toBeGreaterThan(0);
          // collapsed: the brand follows the sidebar to its icon width
          await page
            .locator(".docs-preview")
            .getByRole("button", { name: "Collapse sidebar" })
            .click();
          await expect
            .poll(async () => {
              const c = await measure(page);
              return Math.abs(c.brand.width - c.side.width) <= 0.5 && c.side.width < 100;
            })
            .toBe(true);
          const c = await measure(page);
          expect(c.sheet.left - c.side.right).toBeLessThanOrEqual(1.5);
          expect(c.sheet.left).toBeGreaterThanOrEqual(c.side.right - 0.5);
        });

        test("fill: bar and sidebar stay while the sheet scrolls", async ({ page }) => {
          await page.setViewportSize({ width: 1440, height: 800 });
          await open(page, kit, theme, density);
          // the preview's markup on its own page, as the whole page
          const html = await page.evaluate(
            () => document.querySelector(".docs-preview .tf-shell")!.outerHTML,
          );
          const css = readFileSync(join(ROOT, "packages", kit, "dist", "styles.css"), "utf8");
          await page.setContent(
            `<!doctype html><html data-kit="${kit}" data-theme="${theme}" data-density="${density}"><head><style>${css}</style><style>body{margin:0}</style></head><body>${html}</body></html>`,
          );
          await page.evaluate(() => {
            const shell = document.querySelector(".tf-shell")!;
            shell.classList.add("tf-shell-fill");
            const tall = document.createElement("div");
            tall.style.height = "2400px";
            shell.querySelector(".tf-main")!.appendChild(tall);
            window.scrollTo(0, 900);
          });
          await page.waitForTimeout(100);
          const r = await page.evaluate(() => {
            const b = (s: string) => document.querySelector(s)!.getBoundingClientRect();
            return {
              y: window.scrollY,
              bar: b(".tf-shell-bar").top,
              barH: b(".tf-shell-bar").height,
              side: b(".tf-sidebar").top,
              sheet: b(".tf-sheet").top,
            };
          });
          expect(r.y).toBeGreaterThan(800);
          expect(Math.abs(r.bar)).toBeLessThanOrEqual(0.5);
          expect(Math.abs(r.side - r.barH)).toBeLessThanOrEqual(0.5);
          expect(r.sheet).toBeLessThan(0);
        });

        test("phone: the sidebar's bar with the end actions, search over the bar", async ({
          page,
        }) => {
          await page.setViewportSize({ width: 390, height: 844 });
          await open(page, kit, theme, density);
          const preview = page.locator(".docs-preview");
          const menu = preview.getByRole("button", { name: "Open navigation" });
          const find = preview.getByRole("button", { name: "Search", exact: true });
          const end = preview.getByRole("button", { name: "New order" });
          await expect(menu).toBeVisible();
          await expect(find).toBeVisible();
          await expect(end).toBeVisible();
          const search = preview.getByRole("searchbox", { name: "Search orders" });
          await expect(search).toBeHidden();
          const [mb, fb, eb, sb] = await Promise.all([
            menu.boundingBox(),
            find.boundingBox(),
            end.boundingBox(),
            preview.locator(".tf-sheet").boundingBox(),
          ]);
          // one row: menu and brand at the start, search and actions at the end
          const mid = (b: { y: number; height: number } | null) => b!.y + b!.height / 2;
          expect(Math.abs(mid(mb) - mid(fb))).toBeLessThanOrEqual(2);
          expect(Math.abs(mid(mb) - mid(eb))).toBeLessThanOrEqual(2);
          expect(fb!.x).toBeLessThan(eb!.x);
          expect(sb!.y).toBeGreaterThanOrEqual(eb!.y + eb!.height);
          await find.click();
          await expect(search).toBeVisible();
          await expect(search).toBeFocused();
          await expect(menu).toBeHidden();
          await page.keyboard.press("Escape");
          await expect(search).toBeHidden();
          await expect(find).toBeFocused();
          await expect(menu).toBeVisible();
        });
      });
