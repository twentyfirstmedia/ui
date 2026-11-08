import { expect, test } from "@playwright/test";

/**
 * Phase 4: an app loads both kits (themes.css) and switches between them at runtime with
 * data-kit. No reload, no console errors, the markup stays identical and React state survives.
 */
test.use({ baseURL: "http://localhost:4173" });

test("switches Halo ↔ Pro at runtime", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Clicked 0" })).toBeVisible();
  await page.evaluate(() => ((window as unknown as { marker: number }).marker = 42));
  await page.getByRole("button", { name: "Clicked 0" }).click();

  const html = page.locator("html");
  const font = () => page.evaluate(() => getComputedStyle(document.body).fontFamily);
  // everything below the switcher row: identical markup in both kits
  const markup = () =>
    page.locator("main").evaluate((el) =>
      [...el.children]
        .slice(1)
        .map((c) => c.outerHTML)
        .join(""),
    );
  const button = page.getByRole("button", { name: "Clicked 1" });
  const radius = () => button.evaluate((el) => getComputedStyle(el).borderRadius);

  await expect(html).toHaveAttribute("data-kit", "halo");
  await expect(page.getByText("$48,210")).toBeVisible(); // count-up finished
  expect(await font()).toContain("Plus Jakarta Sans");
  const haloMarkup = await markup();
  const haloRadius = await radius();

  await page.getByRole("radio", { name: "pro" }).check();
  await expect(html).toHaveAttribute("data-kit", "pro");
  expect(await font()).toContain("Geist");
  expect(await radius()).not.toBe(haloRadius);
  await expect(button).toBeVisible();
  expect(await markup()).toBe(haloMarkup);

  await page.getByRole("radio", { name: "dark" }).check();
  await expect(html).toHaveAttribute("data-theme", "dark");
  const bg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--surface").trim(),
  );
  expect(bg).not.toBe("");

  await page.getByRole("radio", { name: "light" }).check();
  await page.getByRole("radio", { name: "halo" }).check();
  await expect(html).toHaveAttribute("data-kit", "halo");
  expect(await radius()).toBe(haloRadius);

  expect(await page.evaluate(() => (window as unknown as { marker?: number }).marker)).toBe(42);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});
