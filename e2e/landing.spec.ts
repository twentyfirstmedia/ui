import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { KITS, THEMES } from "./pages";

/**
 * The landing page: axe in both kits × light/dark, no sideways scroll on phones, and the kit
 * switch restyles the whole page without a reload, keeping state and remembering the choice.
 */
test.use({ baseURL: "http://localhost:4174", reducedMotion: "reduce" });

for (const kit of KITS)
  for (const theme of THEMES)
    test(`axe on the landing page, ${kit} ${theme}`, async ({ page }) => {
      await page.addInitScript(
        ([k, t]) => {
          localStorage.setItem("docs-landing-kit", k as string);
          localStorage.setItem(`docs-theme-${k}`, t as string);
        },
        [kit, theme],
      );
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator("html")).toHaveAttribute("data-kit", kit);
      await page.waitForTimeout(400);
      const r = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        r.violations.map((v) => `${v.id}: ${v.nodes[0]?.target.join(" ")} — ${v.help}`),
      ).toEqual([]);
    });

for (const width of [320, 390])
  for (const kit of KITS)
    test(`the landing page fits ${width}px in ${kit}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.addInitScript((k) => localStorage.setItem("docs-landing-kit", k), kit);
      await page.goto("/");
      await page.waitForTimeout(300);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      ).toBeLessThanOrEqual(0);
    });

test("the kit switch restyles the page in place and is remembered", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-kit", "halo");
  // state survives the switch: answer the approval first
  await page
    .getByRole("button", { name: /Yes, run it as shown/ })
    .first()
    .click();
  const markup = await page.locator(".lp-hero-copy h1").innerHTML();
  await page
    .getByRole("radiogroup", { name: "Switch the kit of this page" })
    .getByText("Pro")
    .click();
  await expect(html).toHaveAttribute("data-kit", "pro");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: /Yes, run it as shown/ })).toHaveCount(0);
  expect(await page.locator(".lp-hero-copy h1").innerHTML()).toBe(markup);
  await expect(page.locator(".lp-install").first()).toContainText("--kit pro");
  await expect(page.getByRole("link", { name: "Get started" })).toHaveAttribute(
    "href",
    "/pro/installation/",
  );
  await page.reload();
  await expect(html).toHaveAttribute("data-kit", "pro");
  expect(errors).toEqual([]);
});

test("the parity demo shows both kits at once", async ({ page }) => {
  await page.goto("/");
  const frames = page.locator(".lp-parity-inner");
  await expect(frames).toHaveCount(2);
  await expect(frames.nth(0)).toHaveAttribute("data-kit", "halo");
  await expect(frames.nth(1)).toHaveAttribute("data-kit", "pro");
  const radius = (i: number) =>
    frames
      .nth(i)
      .locator(".tf-btn-primary")
      .evaluate((b) => getComputedStyle(b).borderRadius);
  expect(await radius(0)).not.toBe(await radius(1));
});
