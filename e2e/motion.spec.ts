import { expect, test, type Page } from "@playwright/test";
import { KITS } from "./pages";

/**
 * Motion levels in both kits on the Motion guide's demo: expressive staggers more than standard,
 * off stops everything, layers animate out before they leave, a reduced-motion setting always
 * wins, the header switch is remembered, and a Stagger below the fold waits to be seen.
 */
test.use({ baseURL: "http://localhost:4174" });

async function demo(page: Page, kit: string, level: "Off" | "Standard" | "Expressive") {
  await page.goto(`/${kit}/motion/`);
  await page.locator(".docs-preview .tf-stagger").first().waitFor();
  await page.getByRole("radio", { name: level, exact: true }).click();
  await page.locator(`.docs-preview [data-motion="${level.toLowerCase()}"]`).waitFor();
}

/** Delay and duration of the n-th card's entrance, in ms. */
function card(page: Page, n: number) {
  return page.evaluate((i) => {
    const el = document.querySelectorAll(".docs-preview .tf-stagger > *")[i] as Element;
    const cs = getComputedStyle(el);
    const ms = (v: string) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
    return {
      delay: ms(cs.animationDelay.split(",")[0] as string),
      duration: ms(cs.animationDuration.split(",")[0] as string),
    };
  }, n);
}

for (const kit of KITS)
  test.describe(kit, () => {
    test("expressive staggers longer and further than standard", async ({ page }) => {
      await demo(page, kit, "Standard");
      const std = await card(page, 3);
      await demo(page, kit, "Expressive");
      const exp = await card(page, 3);
      expect(exp.delay).toBeGreaterThan(std.delay);
      expect(exp.duration).toBeGreaterThan(std.duration);
    });

    test("off: nothing moves", async ({ page }) => {
      await demo(page, kit, "Off");
      const running = await page.evaluate(
        () =>
          document
            .querySelector(".docs-preview [data-motion]")!
            .getAnimations({ subtree: true })
            .filter((a) => {
              const t = a.effect?.getComputedTiming();
              return t && Number(t.duration) > 1;
            }).length,
      );
      expect(running).toBe(0);
      // values show at once
      await expect(page.locator(".docs-preview .tf-stat-value").first()).toHaveText("1,284");
    });

    test("a drawer animates out before it leaves", async ({ page }) => {
      await demo(page, kit, "Expressive");
      await page.getByRole("button", { name: "Drawer", exact: true }).click();
      const wrap = page.locator(".tf-drawer-wrap");
      await expect(wrap).toBeVisible();
      await page.waitForTimeout(500);
      await page.locator(".tf-drawer").getByRole("button", { name: "Close" }).click();
      await expect(wrap).toHaveAttribute("data-closing", "");
      expect(await wrap.evaluate((el) => (el as HTMLElement).inert)).toBe(true);
      await expect(wrap).toHaveCount(0);
    });

    test("a reduced-motion setting wins over expressive", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await demo(page, kit, "Expressive");
      const enter = await page.evaluate(() =>
        getComputedStyle(document.querySelector(".docs-preview [data-motion]")!)
          .getPropertyValue("--dur-enter")
          .trim(),
      );
      expect(parseFloat(enter)).toBe(0);
      await page.getByRole("button", { name: "Drawer", exact: true }).click();
      await page.locator(".tf-drawer").getByRole("button", { name: "Close" }).click();
      await expect(page.locator(".tf-drawer-wrap")).toHaveCount(0);
    });

    test("the header switch sets the level for the whole site and is remembered", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`/${kit}/`);
      await page
        .locator(".docs-prefs")
        .getByRole("button", { name: /^Motion:/ })
        .click();
      await page.getByRole("menuitemradio", { name: "Expressive" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-motion", "expressive");
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-motion", "expressive");
    });

    test("a Stagger below the fold waits until it scrolls into view", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 260 });
      await page.goto(`/${kit}/motion/`);
      const group = page.locator(".docs-preview .tf-stagger").first();
      await expect(group).toHaveAttribute("data-reveal", "waiting");
      await group.scrollIntoViewIfNeeded();
      await expect(group).not.toHaveAttribute("data-reveal", "waiting");
    });
  });
