import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the docs site: axe and screenshots of every preview,
 * in both kits, light and dark, at 390 and 1440 px (docs app: phase 7), plus the runtime kit switch
 * of examples/kit-switch and the custom elements in examples/html (plain HTML, no build step).
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { trace: "off" },
  webServer: [
    {
      command: "node e2e/serve.mjs examples/kit-switch/dist 4173",
      port: 4173,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "node e2e/serve.mjs apps/docs/out 4174",
      port: 4174,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "node e2e/serve.mjs examples/html/dist 4175",
      port: 4175,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
