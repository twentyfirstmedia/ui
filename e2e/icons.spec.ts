import { expect, test } from "@playwright/test";
import { ICON_PATHS } from "../packages/core/dist/icons.js";
import { KITS, previewPages } from "./pages";

/**
 * Icons sit exactly in the middle: every drawing is centred on its 24px grid (play is centred
 * optically on its centroid), and every icon-only box (icon buttons, tinted icons, rail, dock)
 * centres its icon to the half pixel.
 */
test.use({ baseURL: "http://localhost:4174", reducedMotion: "reduce" });

test("every icon drawing is centred on the 24px grid", async ({ page }) => {
  const off = await page.evaluate(
    (paths) => {
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      document.body.appendChild(svg);
      const out: string[] = [];
      for (const [name, d] of Object.entries(paths)) {
        const el = document.createElementNS(ns, "path");
        el.setAttribute("d", d);
        svg.appendChild(el);
        const bb = el.getBBox();
        el.remove();
        const dx = bb.x + bb.width / 2 - 12,
          dy = bb.y + bb.height / 2 - 12;
        if (name === "play") continue;
        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05)
          out.push(`${name} ${dx.toFixed(2)},${dy.toFixed(2)}`);
      }
      return out;
    },
    ICON_PATHS as Record<string, string>,
  );
  expect(off).toEqual([]);
});

for (const kit of KITS)
  test.describe(`${kit} icon boxes`, () => {
    for (const path of ["", ...previewPages])
      test(`centred on /${kit}/${path}`, async ({ page }) => {
        await page.goto(`/${kit}/${path ? `${path}/` : ""}`);
        await page.waitForTimeout(250);
        const off = await page.evaluate(() => {
          const out: string[] = [];
          for (const el of document.querySelectorAll("body *")) {
            if (el.closest("svg") || el.closest("td, th")) continue;
            const svgs = el.querySelectorAll("svg");
            if (svgs.length !== 1 || (el.textContent || "").trim()) continue;
            const r = el.getBoundingClientRect();
            if (r.width < 12 || r.width > 72 || r.height > 72) continue;
            const cs = getComputedStyle(el);
            const boxed =
              cs.backgroundColor !== "rgba(0, 0, 0, 0)" ||
              cs.borderTopWidth !== "0px" ||
              cs.boxShadow !== "none";
            if (!boxed) continue;
            const s = (svgs[0] as SVGSVGElement).getBoundingClientRect();
            const dx = s.left + s.width / 2 - (r.left + r.width / 2),
              dy = s.top + s.height / 2 - (r.top + r.height / 2);
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)
              out.push(`${el.getAttribute("class")} ${dx.toFixed(1)},${dy.toFixed(1)}`);
          }
          return [...new Set(out)];
        });
        expect(off).toEqual([]);
      });
  });
