/**
 * Renders the brand images from the built site and app/icon.svg, with the preinstalled Chromium:
 *
 *   pnpm --filter docs build && node apps/docs/scripts/brand.ts
 *
 * - public/og/{home,halo,pro}.png   social cards (1200 × 630) from /og/<name>/, made of kit components
 * - public/icon-192.png, icon-512.png, icon-maskable.png   manifest icons
 * - app/apple-icon.png (180, full bleed), app/favicon.ico (16/32/48)
 *
 * The outputs are committed; run it again when the mark or the cards change.
 */
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const DOCS = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = join(DOCS, "../..");
const PORT = 4199;

const svg = readFileSync(join(DOCS, "app/icon.svg"), "utf8");
// full bleed: square corners (iOS and Android mask the icon themselves), glyph inside the safe zone
const bleed = (glyphScale: number) =>
  svg
    .replace(' rx="8"', "")
    .replace(
      /<path /,
      `<path transform="translate(16 16) scale(${glyphScale}) translate(-16 -16)" `,
    );

const server = spawn("node", [join(ROOT, "e2e/serve.mjs"), join(DOCS, "out"), String(PORT)], {
  stdio: "ignore",
});
const browser = await chromium.launch();
try {
  await new Promise((r) => setTimeout(r, 500));
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  mkdirSync(join(DOCS, "public/og"), { recursive: true });
  await page.setViewportSize({ width: 1200, height: 630 });
  for (const name of ["home", "halo", "pro"]) {
    await page.goto(`http://localhost:${PORT}/og/${name}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.locator(".og").screenshot({ path: join(DOCS, `public/og/${name}.png`) });
  }

  const render = async (markup: string, size: number, out: string) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${markup}`,
    );
    await page.screenshot({ path: out, omitBackground: true });
  };
  await render(svg, 192, join(DOCS, "public/icon-192.png"));
  await render(svg, 512, join(DOCS, "public/icon-512.png"));
  await render(bleed(0.8), 512, join(DOCS, "public/icon-maskable.png"));
  await render(bleed(0.9), 180, join(DOCS, "app/apple-icon.png"));
  const tmp = join(DOCS, ".brand-tmp");
  mkdirSync(tmp, { recursive: true });
  for (const s of [16, 32, 48]) await render(svg, s, join(tmp, `${s}.png`));
  execFileSync(
    "convert",
    [16, 32, 48].map((s) => join(tmp, `${s}.png`)).concat(join(DOCS, "app/favicon.ico")),
  );
  rmSync(tmp, { recursive: true, force: true });
  console.log("brand: og/home, og/halo, og/pro, manifest icons, apple-icon, favicon.ico");
} finally {
  await browser.close();
  server.kill();
}
