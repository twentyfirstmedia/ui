import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the docs site: axe and screenshots of every preview,
 * in both kits, light and dark, at 390 and 1440 px. The docs app is added in phase 7;
 * until then the suite only holds the smoke test in e2e/.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { trace: "off" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
