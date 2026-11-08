import { expect, test } from "@playwright/test";

test("browser renders a page", async ({ page }) => {
  await page.setContent("<main><h1>Twentyfirst UI</h1></main>");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Twentyfirst UI");
});
