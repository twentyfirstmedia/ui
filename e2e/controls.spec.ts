import { expect, test, type Page } from "@playwright/test";
import { KITS, guidePages, previewPages } from "./pages";

/**
 * Controls share one height scale per kit, so a search field, a segmented control and an icon
 * button sitting in one row line up: Halo sm 32 / md 40 / lg 48, Pro sm 24 / md 28 / lg 34.
 * Checked on every docs page (the docs chrome uses the kit too). The dark top bar keeps the
 * reference's own 36 / 28 px items (`tf-nav-item`, `tf-topbtn`) and is not part of the scale.
 */
test.use({ baseURL: "http://localhost:4174", reducedMotion: "reduce" });

const SCALE: Record<string, number[]> = { halo: [32, 40, 48], pro: [24, 28, 34] };
const CONTROLS = [
  ".tf-btn",
  ".tf-iconbtn",
  ".tf-search",
  ".tf-seg",
  ".tf-tabs",
  ".tf-togglegroup",
  ".tf-toggle",
  ".tf-chip",
  ".tf-menubar",
  "input.tf-input",
  "select.tf-input",
  "button.tf-input",
  ".tf-inputwrap",
  ".tf-navmenu-trigger",
  ".tf-sidebar-item:not(.nested)",
  ".tf-variant",
].join(", ");

/** Controls off the scale of their own kit (the closest data-kit, so mixed pages work too). */
async function offScale(page: Page): Promise<string[]> {
  return page.evaluate(
    ([sel, scales]) => {
      const out: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(sel as string)) {
        // items inside a track (segments, tabs, toggles in a group) follow the track
        if (el.matches(".tf-toggle") && el.closest(".tf-togglegroup")) continue;
        // scaled-down demos (a screen behind a modal) are not real sizes
        let scaled = false;
        for (let a: HTMLElement | null = el; a; a = a.parentElement) {
          const t = getComputedStyle(a).transform;
          if ((t !== "none" && !/^matrix\(1, 0, 0, 1,/.test(t)) || getComputedStyle(a).zoom !== "1")
            scaled = true;
        }
        if (scaled) continue;
        const kit = el.closest("[data-kit]")?.getAttribute("data-kit") ?? "halo";
        const scale = (scales as Record<string, number[]>)[kit] ?? [];
        const h = Math.round(el.getBoundingClientRect().height);
        if (!h || scale.includes(h)) continue;
        out.push(
          `${kit} ${(el.getAttribute("class") || "").split(" ").slice(0, 3).join(".")} ${h}px`,
        );
      }
      return [...new Set(out)];
    },
    [CONTROLS, SCALE] as const,
  );
}

for (const kit of KITS)
  test.describe(`${kit} control heights`, () => {
    for (const path of ["", ...guidePages.filter(Boolean), ...previewPages])
      test(`on the scale on /${kit}/${path}`, async ({ page }) => {
        await page.goto(`/${kit}/${path ? `${path}/` : ""}`);
        await page.waitForTimeout(250);
        expect(await offScale(page)).toEqual([]);
      });
    test(`on the scale on the landing page in ${kit}`, async ({ page }) => {
      await page.addInitScript((k) => localStorage.setItem("docs-landing-kit", k), kit);
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-kit", kit);
      await page.waitForTimeout(250);
      expect(await offScale(page)).toEqual([]);
    });
  });
