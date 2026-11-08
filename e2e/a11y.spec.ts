import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { KITS, THEMES, guidePages, previewPages } from "./pages";

/** Phase 8: axe without violations on every docs page, both kits, light and dark. */
test.use({ baseURL: "http://localhost:4174", reducedMotion: "reduce" });

for (const kit of KITS)
  for (const theme of THEMES)
    test.describe(`${kit} ${theme}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.addInitScript(
          ([k, t]) => localStorage.setItem(`docs-theme-${k}`, t as string),
          [kit, theme],
        );
      });
      for (const path of [...guidePages, ...previewPages])
        test(`axe /${kit}/${path}`, async ({ page }) => {
          await page.goto(`/${kit}/${path ? `${path}/` : ""}`);
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          await page.waitForTimeout(400);
          // e-mail previews render untrusted HTML in a sandboxed iframe, which axe cannot enter
          const r = await new AxeBuilder({ page })
            .exclude("iframe[sandbox]")
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();
          const summary = r.violations.map(
            (v) => `${v.id}: ${v.nodes.length}× ${v.nodes[0]?.target.join(" ")} — ${v.help}`,
          );
          expect(summary).toEqual([]);
        });
    });
