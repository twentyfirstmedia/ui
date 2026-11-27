import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the docs site: axe and screenshots of every preview,
 * in both kits, light and dark, at 390 and 1440 px (docs app: phase 7), plus the runtime kit switch
 * of examples/kit-switch and the custom elements in examples/html (plain HTML, no build step).
 */
// Ports can move (E2E_KIT_PORT, E2E_DOCS_PORT, E2E_HTML_PORT) so several checkouts test side by side.
const KIT = Number(process.env.E2E_KIT_PORT ?? 4173);
const DOCS = Number(process.env.E2E_DOCS_PORT ?? 4174);
const HTML = Number(process.env.E2E_HTML_PORT ?? 4175);

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
      command: `node e2e/serve.mjs examples/kit-switch/dist ${KIT}`,
      port: KIT,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `node e2e/serve.mjs apps/docs/out ${DOCS}`,
      port: DOCS,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `node e2e/serve.mjs examples/html/dist ${HTML}`,
      port: HTML,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
