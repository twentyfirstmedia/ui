import { expect, test } from "@playwright/test";

/** Phase 7: docs chrome — routes for both kits, live kit switch, search and theme. */
test.use({ baseURL: "http://localhost:4174" });

test("the root forwards to the Halo docs", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/halo\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Soft, calm interfaces.");
});

test("the kit switch shows the same page in the other kit", async ({ page }) => {
  await page.goto("/halo/components/DataTable/");
  await expect(page.locator("html")).toHaveAttribute("data-kit", "halo");
  await page.getByRole("radio", { name: "Pro" }).click();
  await expect(page).toHaveURL(/\/pro\/components\/DataTable\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-kit", "pro");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Data Table");
});

test("⌘K opens the search and navigates", async ({ page }) => {
  await page.goto("/halo/");
  await page.keyboard.press("ControlOrMeta+k");
  const dialog = page.getByRole("dialog", { name: "Command palette" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox").fill("approval card");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/halo\/components\/ApprovalCard\/$/);
});

test("the theme switch changes the colours and is remembered", async ({ page }) => {
  await page.goto("/halo/components/ApprovalCard/");
  await expect(page.getByText("Yes, run it as shown").first()).toBeVisible();
  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("component pages show the code and the props", async ({ page }) => {
  await page.goto("/pro/components/Card/");
  await page.getByRole("radio", { name: "Code" }).check();
  await expect(page.getByText('from "@twentyfirstmedia/ui-core"')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Props" })).toBeVisible();
  await expect(page.locator("#props-Card")).toBeVisible();
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("the menu opens as a drawer, closes with Escape and on navigation", async ({ page }) => {
    await page.goto("/halo/");
    const nav = page.getByRole("navigation", { name: "Docs" });
    await expect(nav).toBeHidden();
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(nav).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
    await page.getByRole("button", { name: "Menu" }).click();
    await nav.getByRole("link", { name: "Data Table" }).click();
    await expect(page).toHaveURL(/\/halo\/components\/DataTable\/$/);
    await expect(nav).toBeHidden();
  });

  test("no docs page is wider than the screen", async ({ page }) => {
    for (const path of [
      "/halo/",
      "/pro/components/DataTable/",
      "/halo/patterns/Dashboard/",
      "/pro/theming/",
    ]) {
      await page.goto(path);
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(over, path).toBeLessThanOrEqual(0);
    }
  });
});
