import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { KITS, THEMES } from "./pages";

/**
 * `<UIProvider floating="solid">`: on glass, menus, popovers, select lists, hover cards, the
 * navigation menu and the bulk action bar are solid (the popover colour, no blur); dialogs,
 * drawers and the command palette keep their glass.
 */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOLID = ["tf-popover", "tf-menu", "tf-hovercard", "tf-selectmenu-list", "tf-navmenu-panel"];

for (const kit of KITS)
  for (const theme of THEMES)
    test(`floating="solid" in ${kit} ${theme}`, async ({ page }) => {
      const css = readFileSync(join(ROOT, "packages", kit, "dist", "styles.css"), "utf8");
      const layers = (pre: string) =>
        SOLID.map((c) => `<div id="${pre}-${c}" class="${c}">Item</div>`).join("") +
        `<div id="${pre}-modal" class="tf-modal">Dialog</div>` +
        `<div class="tf-shell"><div id="${pre}-bulkbar" class="tf-bulkbar">2 selected</div></div>`;
      await page.setContent(
        `<!doctype html><html data-kit="${kit}" data-theme="${theme}" data-surface="glass"><head><style>${css}</style></head>
        <body>
          <div>${layers("glass")}</div>
          <div data-floating="solid">${layers("solid")}<i id="popover" style="background: var(--popover)"></i></div>
        </body></html>`,
      );
      const m = await page.evaluate(
        (ids) => {
          const st = (id: string) => getComputedStyle(document.getElementById(id)!);
          const read = (id: string) => [st(id).backgroundColor, st(id).backdropFilter];
          return {
            popover: st("popover").backgroundColor,
            glass: Object.fromEntries(ids.map((c) => [c, read(`glass-${c}`)])),
            solid: Object.fromEntries(ids.map((c) => [c, read(`solid-${c}`)])),
            modal: read("solid-modal"),
          };
        },
        [...SOLID, "bulkbar"],
      );
      for (const c of SOLID) expect(m.glass[c]![1], `${c} is glass by default`).toContain("blur(");
      // the bulk bar takes the glass frame's translucent fill by default
      expect(m.glass.bulkbar![0]).not.toBe(m.popover);
      for (const c of [...SOLID, "bulkbar"])
        expect(m.solid[c], `${c} is solid with floating="solid"`).toEqual([m.popover, "none"]);
      expect(m.modal[1], "dialogs keep their glass").toContain("blur(");
    });
