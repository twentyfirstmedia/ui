import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { KITS } from "./pages";

/**
 * The shadcn bridge (`@twentyfirstmedia/ui-core/shadcn.css`) gives fields the kit's horizontal
 * padding, but a field that sets a side itself keeps it: shadcn search fields put an icon in front
 * with `pl-9`, and the icon must not sit on the placeholder. Tailwind's utilities are emulated in
 * `@layer utilities`, where Tailwind v4 puts them; the bridge is unlayered.
 */
const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "packages", "core", "dist");
const css = (f: string) => readFileSync(join(DIST, f), "utf8");

const UTILITIES = `@layer utilities {
  .px-3 { padding-inline: 12px }
  .pl-9 { padding-left: 36px }
  .ps-10 { padding-inline-start: 40px }
  .pr-10 { padding-right: 40px }
  .p-0 { padding: 0 }
  @media (min-width: 1px) { .md\\:pl-9 { padding-left: 36px } }
}`;

const FIELDS = `
  <input id="plain" data-slot="input" class="h-9 px-3">
  <input id="search" data-slot="input" class="h-9 w-full px-3 pl-9">
  <input id="logical" data-slot="input" class="px-3 ps-10">
  <input id="variant" data-slot="input" class="px-3 md:pl-9">
  <input id="action" data-slot="input" class="px-3 pr-10">
  <input id="bare" data-slot="input" class="p-0">
  <input id="hook" data-slot="input" data-icon="leading">
  <textarea id="area" data-slot="textarea" class="px-3 pl-9"></textarea>
  <button id="trigger" data-slot="select-trigger" class="px-3 pl-9">All</button>
  <span id="probe" style="padding-left: var(--density-pad-x); padding-right: calc(var(--density-control) * 0.5 + 16px)"></span>`;

for (const kit of KITS)
  for (const density of ["comfortable", "compact"])
    test(`shadcn fields keep their own padding in ${kit} (${density})`, async ({ page }) => {
      await page.setContent(
        `<!doctype html><html><head>
          <style>${UTILITIES}</style>
          <style>${css("themes.css")}</style>
          <style>${css("shadcn.css")}</style>
        </head><body>
          <div data-kit="${kit}" data-density="${density}">${FIELDS}</div>
          <div id="outside"><input id="host" data-slot="input" class="px-3"></div>
        </body></html>`,
      );
      const pad = await page.evaluate(() => {
        const read = (id: string) => {
          const s = getComputedStyle(document.getElementById(id)!);
          return { left: s.paddingLeft, right: s.paddingRight };
        };
        const ids = [
          "plain",
          "search",
          "logical",
          "variant",
          "action",
          "bare",
          "hook",
          "area",
          "trigger",
          "probe",
          "host",
        ];
        return Object.fromEntries(ids.map((id) => [id, read(id)]));
      });
      const kitPad = pad.probe!.left; // --density-pad-x of this kit and density
      const iconPad = pad.probe!.right; // room for a leading icon
      expect(kitPad).not.toBe("0px");
      // a plain field gets the kit's padding on both sides (over shadcn's px-3)
      expect(pad.plain).toEqual({ left: kitPad, right: kitPad });
      // a field with its own start padding keeps it; the other side is the kit's
      expect(pad.search).toEqual({ left: "36px", right: kitPad });
      expect(pad.logical).toEqual({ left: "40px", right: kitPad });
      expect(pad.variant).toEqual({ left: "36px", right: kitPad });
      expect(pad.area).toEqual({ left: "36px", right: kitPad });
      expect(pad.trigger).toEqual({ left: "36px", right: kitPad });
      // its own end padding (an action at the end) and p-* (both sides) too
      expect(pad.action).toEqual({ left: kitPad, right: "40px" });
      expect(pad.bare).toEqual({ left: "0px", right: "0px" });
      // fields without Tailwind ask for icon room with data-icon
      expect(pad.hook).toEqual({ left: iconPad, right: kitPad });
      // outside [data-kit] the bridge changes nothing
      expect(pad.host).toEqual({ left: "12px", right: "12px" });
    });
