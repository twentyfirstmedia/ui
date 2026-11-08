import { expect, test } from "@playwright/test";
import { KITS, THEMES, WIDTHS, previewPages } from "./pages";

/** Phase 8: a screenshot of every preview, both kits × light/dark × 390/1440 px. */
test.use({ baseURL: "http://localhost:4174", reducedMotion: "reduce" });

for (const kit of KITS)
  for (const theme of THEMES)
    for (const width of WIDTHS)
      test.describe(`${kit} ${theme} ${width}`, () => {
        test.use({ viewport: { width, height: 900 } });
        test.beforeEach(async ({ page }) => {
          await page.addInitScript(
            ([k, t]) => localStorage.setItem(`docs-theme-${k}`, t as string),
            [kit, theme],
          );
        });
        for (const path of previewPages)
          test(`/${kit}/${path}`, async ({ page }) => {
            await page.goto(`/${kit}/${path}/`);
            await page.waitForTimeout(400);
            await page.evaluate(() => document.fonts.ready);
            // previews can be taller than the window; grow the window so the whole preview is
            // painted (a composited preview box is only rendered inside the viewport)
            const h = await page.evaluate(() => document.documentElement.scrollHeight);
            if (h > 900) {
              await page.setViewportSize({ width, height: h });
              await page.waitForTimeout(200);
            }
            const previews = page.locator(".docs-preview");
            const n = await previews.count();
            for (let i = 0; i < n; i++) {
              await expect(previews.nth(i)).toHaveScreenshot(
                `${kit}-${theme}-${width}-${path.replace(/\//g, "-")}${n > 1 ? `-${i}` : ""}.png`,
                { animations: "disabled", caret: "hide", maxDiffPixelRatio: 0.02 },
              );
            }
          });
      });
