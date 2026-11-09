import { expect, test, type Page } from "@playwright/test";
import { KITS, THEMES } from "./pages";

/**
 * Glass surfaces (`surface="glass"`, `FloatingLayout`) in both kits, light and dark, on the map
 * pattern: they are translucent and blurred, text on them stays readable over any backdrop, and
 * reduced transparency, forced colours and a missing blur fall back to solid surfaces.
 */
test.use({ baseURL: "http://localhost:4174", reducedMotion: "reduce" });

/** Glass surfaces to check per pattern: UI over a map, and a whole app shell over Ambient. */
const PAGES = [
  {
    path: "patterns/MapScreen",
    glass: ".docs-preview .tf-floating :is(.tf-panel, .tf-dock, .tf-search, .tf-map-pop)",
    min: 4,
  },
  {
    path: "patterns/WellbeingScreen",
    glass: ".docs-preview .tf-shell, .docs-preview .tf-shell :is(.tf-stat, .tf-panel, .tf-dock)",
    min: 9,
  },
];

async function open(page: Page, kit: string, theme: string, path = PAGES[0]!.path) {
  await page.addInitScript(
    ([k, t]) => localStorage.setItem(`docs-theme-${k}`, t as string),
    [kit, theme],
  );
  await page.goto(`/${kit}/${path}/`);
  // the docs apply the saved theme to the preview once hydrated; measure after that
  await page.locator(`.docs-preview-inner[data-theme="${theme}"]`).waitFor();
  await page.locator(".docs-preview .tf-panel").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
}

/** Computed style facts of every glass surface in the preview. */
function surfaces(page: Page, sel: string) {
  return page.$$eval(sel, (els) =>
    els.map((el) => {
      const cs = getComputedStyle(el);
      const alpha = (c: string) => {
        const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, 1, 1);
        return Math.round(((ctx.getImageData(0, 0, 1, 1).data[3] ?? 255) / 255) * 100) / 100;
      };
      return {
        cls: el.className,
        alpha: alpha(cs.backgroundColor),
        filter: cs.backdropFilter || (cs as unknown as Record<string, string>).webkitBackdropFilter,
      };
    }),
  );
}

for (const kit of KITS)
  for (const theme of THEMES)
    test.describe(`${kit} ${theme}`, () => {
      for (const pg of PAGES) {
        test(`${pg.path.split("/")[1]}: glass surfaces are translucent and blurred`, async ({
          page,
        }) => {
          await open(page, kit, theme, pg.path);
          const list = await surfaces(page, pg.glass);
          expect(list.length).toBeGreaterThanOrEqual(pg.min);
          for (const s of list) {
            expect(s.alpha, s.cls).toBeGreaterThan(0.5);
            expect(s.alpha, s.cls).toBeLessThan(1);
            expect(s.filter, s.cls).toContain("blur");
          }
        });

        test(`${pg.path.split("/")[1]}: text on glass stays readable over any backdrop`, async ({
          page,
        }) => {
          await open(page, kit, theme, pg.path);
          const failures = await page.$$eval(pg.glass, (els) => {
            const rgba = (c: string) => {
              const ctx = document
                .createElement("canvas")
                .getContext("2d") as CanvasRenderingContext2D;
              ctx.clearRect(0, 0, 1, 1);
              ctx.fillStyle = c;
              ctx.fillRect(0, 0, 1, 1);
              const [r = 0, g = 0, b = 0, a = 0] = ctx.getImageData(0, 0, 1, 1).data;
              return [r, g, b, a / 255] as const;
            };
            const lum = ([r, g, b]: readonly number[]) =>
              [r, g, b]
                .map((v) => (v as number) / 255)
                .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
                .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i]!, 0);
            const ratio = (a: readonly number[], b: readonly number[]) => {
              const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p) as [number, number];
              return (x + 0.05) / (y + 0.05);
            };
            const over = (fill: readonly number[], back: number[]) =>
              back.map(
                (v, i) => (fill[i] as number) * (fill[3] as number) + v * (1 - (fill[3] as number)),
              );
            const out: string[] = [];
            for (const el of els) {
              // a tint (StatTile, tinted Card) is laid over the glass fill
              const base = rgba(getComputedStyle(el).backgroundColor);
              const tint = rgba(
                getComputedStyle(el).getPropertyValue("--glass-tinted") || "transparent",
              );
              const a = tint[3] + base[3] * (1 - tint[3]);
              const fill = [0, 1, 2].map((i) =>
                a
                  ? ((tint[i] as number) * tint[3] +
                      (base[i] as number) * base[3] * (1 - tint[3])) /
                    a
                  : 0,
              );
              fill.push(a);
              const fg = rgba(
                getComputedStyle(document.documentElement).getPropertyValue("--foreground"),
              );
              const page = rgba(getComputedStyle(document.body).backgroundColor);
              const backs: Record<string, number[]> = {
                white: [255, 255, 255],
                black: [0, 0, 0],
                grey: [128, 128, 128],
                page: [page[0], page[1], page[2]],
              };
              // every text drawn straight on the glass (no painted box of its own in between)
              const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
              for (let n = walker.nextNode(); n; n = walker.nextNode()) {
                if (!n.textContent?.trim()) continue;
                let p = n.parentElement as HTMLElement;
                const color = rgba(getComputedStyle(p).color);
                let own = false;
                for (; p && p !== el; p = p.parentElement as HTMLElement)
                  if (rgba(getComputedStyle(p).backgroundColor)[3] > 0) own = true;
                if (own || getComputedStyle(n.parentElement as HTMLElement).visibility === "hidden")
                  continue;
                const body = Math.abs(lum(color) - lum(fg)) < 0.02;
                for (const [name, back] of Object.entries(backs)) {
                  // body text: 4.5:1 over anything; secondary text: over mid tones and the page
                  if (!body && (name === "white" || name === "black")) continue;
                  const r = ratio(color, over(fill, back));
                  if (r < 4.5)
                    out.push(
                      `${el.className} "${n.textContent.trim().slice(0, 24)}" over ${name}: ${r.toFixed(2)}`,
                    );
                }
              }
            }
            return out;
          });
          expect(failures).toEqual([]);
        });

        test(`${pg.path.split("/")[1]}: reduced transparency and forced colours fall back to solid surfaces`, async ({
          page,
        }) => {
          await open(page, kit, theme, pg.path);
          const cdp = await page.context().newCDPSession(page);
          await cdp.send("Emulation.setEmulatedMedia", {
            features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
          });
          await page.waitForTimeout(400); // colour transitions settle
          for (const s of await surfaces(page, pg.glass)) {
            expect(s.alpha, s.cls).toBe(1);
            expect(s.filter, s.cls).toBe("none");
          }
          await cdp.send("Emulation.setEmulatedMedia", { features: [] });
          await page.emulateMedia({ forcedColors: "active" });
          await page.waitForTimeout(400);
          for (const s of await surfaces(page, pg.glass)) expect(s.filter, s.cls).toBe("none");
        });
      }

      test("floating layers take the stronger fill", async ({ page }) => {
        await open(page, kit, theme);
        const [panel, layer] = await page.evaluate(() => {
          const host = document.querySelector(".docs-preview .tf-floating") as HTMLElement;
          const pop = document.createElement("div");
          pop.className = "tf-popover";
          pop.textContent = "Menu";
          host.appendChild(pop);
          const a = (el: Element) => {
            const ctx = document
              .createElement("canvas")
              .getContext("2d") as CanvasRenderingContext2D;
            ctx.fillStyle = getComputedStyle(el).backgroundColor;
            ctx.fillRect(0, 0, 1, 1);
            return (ctx.getImageData(0, 0, 1, 1).data[3] ?? 255) / 255;
          };
          return [a(host.querySelector(".tf-panel") as Element), a(pop)];
        });
        expect(layer).toBeGreaterThan(panel);
        expect(layer).toBeLessThan(1);
      });

      test("glass works where data-surface sits on the data-kit element", async ({ page }) => {
        await open(page, kit, theme);
        const filter = await page.evaluate((k) => {
          const box = document.createElement("div");
          box.dataset.kit = k;
          box.dataset.surface = "glass";
          box.innerHTML = '<section class="tf-panel">Panel</section>';
          document.querySelector(".docs-preview")?.appendChild(box);
          return getComputedStyle(box.querySelector(".tf-panel") as Element).backdropFilter;
        }, kit);
        expect(filter).toContain("blur");
      });
    });
