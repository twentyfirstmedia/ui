import { expect, test } from "@playwright/test";
import { KITS, guidePages, previewPages } from "./pages";

/**
 * Mobile first: at 320 and 390 px no docs page scrolls sideways and nothing inside a preview
 * sticks out of it. Wide content may scroll inside its own box (tables, code, kanban), and
 * fixed overlays may use the preview's padding, but nothing may push the layout wider.
 */
test.use({ baseURL: "http://localhost:4174", reducedMotion: "reduce" });

for (const width of [320, 390])
  for (const kit of KITS)
    test.describe(`${kit} at ${width}px`, () => {
      test.use({ viewport: { width, height: 844 } });
      for (const path of [...guidePages, ...previewPages])
        test(`fits /${kit}/${path}`, async ({ page }) => {
          await page.goto(`/${kit}/${path ? `${path}/` : ""}`);
          await page.waitForTimeout(300);
          const result = await page.evaluate(() => {
            const page = document.documentElement.scrollWidth - window.innerWidth;
            const out: string[] = [];
            for (const box of document.querySelectorAll<HTMLElement>(".docs-preview")) {
              const cs = getComputedStyle(box);
              const rect = box.getBoundingClientRect();
              const outer = rect.right - parseFloat(cs.borderRightWidth);
              const inner = outer - parseFloat(cs.paddingRight);
              const clipped = (el: Element) => {
                for (let a = el.parentElement; a && a !== box; a = a.parentElement)
                  if (
                    /(auto|scroll|hidden|clip)/.test(getComputedStyle(a).overflowX) &&
                    a.getBoundingClientRect().right <= inner + 1
                  )
                    return true;
                return false;
              };
              const fixed = (el: Element) => {
                for (let a: Element | null = el; a && a !== box; a = a.parentElement)
                  if (getComputedStyle(a).position === "fixed") return true;
                return false;
              };
              for (const el of box.querySelectorAll("*")) {
                const r = el.getBoundingClientRect();
                if (!r.width || clipped(el)) continue;
                const limit = fixed(el) ? outer : inner;
                if (r.right > limit + 1)
                  out.push(`${el.tagName.toLowerCase()}.${el.getAttribute("class") ?? ""}`);
              }
            }
            return { page, out: [...new Set(out)].slice(0, 5) };
          });
          expect(result.page, "page scrolls sideways").toBeLessThanOrEqual(0);
          expect(result.out, "elements stick out of the preview").toEqual([]);
        });
    });
