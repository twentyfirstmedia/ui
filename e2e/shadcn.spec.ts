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

/** shadcn's switch, v3 (44×24, 2px border, 20px thumb, translate-x-5) and v4 (2rem × 1.15rem). */
const SWITCH_UTILITIES = `@layer utilities {
  .sw3 { display: inline-flex; height: 24px; width: 44px; align-items: center; border: 2px solid transparent; border-radius: 9999px; box-shadow: 0 1px 2px rgb(0 0 0 / .2) }
  .sw3t { display: block; height: 20px; width: 20px; border-radius: 9999px; box-shadow: 0 4px 6px rgb(0 0 0 / .2); transform: translateX(0) }
  .sw3t[data-state="checked"] { transform: translateX(20px) }
  .sw4 { display: inline-flex; height: 1.15rem; width: 2rem; align-items: center; border: 1px solid transparent; border-radius: 9999px }
  .sw4t { display: block; height: 1rem; width: 1rem; border-radius: 9999px; translate: 0 0 }
  .sw4t[data-state="checked"] { translate: calc(100% - 2px) 0 }
}`;
const shadcnSwitch = (id: string, v: 3 | 4, on: boolean) =>
  `<button id="${id}" role="switch" data-slot="switch" data-state="${on ? "checked" : "unchecked"}" class="sw${v}"><span data-slot="switch-thumb" data-state="${on ? "checked" : "unchecked"}" class="sw${v}t"></span></button>`;

for (const kit of KITS)
  test(`the bridged switch has the kit's geometry in ${kit}`, async ({ page }) => {
    const kitCss = readFileSync(join(DIST, "..", "..", kit, "dist", "styles.css"), "utf8");
    await page.setContent(
      `<!doctype html><html><head>
        <style>${SWITCH_UTILITIES}</style>
        <style>${kitCss}</style>
        <style>${css("shadcn.css")}</style>
        <style>*{transition:none!important}</style>
      </head><body>
        <div data-kit="${kit}" data-theme="light">
          ${shadcnSwitch("v3off", 3, false)} ${shadcnSwitch("v3on", 3, true)}
          ${shadcnSwitch("v4off", 4, false)} ${shadcnSwitch("v4on", 4, true)}
          <input id="kitoff" type="checkbox" class="tf-switch">
          <input id="kiton" type="checkbox" class="tf-switch" checked>
          <div data-surface="glass">${shadcnSwitch("glass", 4, true)}<span id="card" style="color: var(--card)"></span></div>
        </div>
      </body></html>`,
    );
    const m = await page.evaluate(() => {
      const box = (el: Element) => el.getBoundingClientRect();
      // the radius as drawn: a percentage of the size, never more than half of it
      const drawn = (r: string, size: number) =>
        Math.min(r.endsWith("%") ? (parseFloat(r) / 100) * size : parseFloat(r), size / 2);
      const bridged = (id: string) => {
        const t = document.getElementById(id)!;
        const k = t.firstElementChild!;
        const a = box(t),
          b = box(k);
        return {
          w: a.width,
          h: a.height,
          thumb: [b.width, b.height],
          x: b.left - a.left,
          y: b.top - a.top,
          bg: getComputedStyle(k).backgroundColor,
          shadow: getComputedStyle(k).boxShadow,
          radius: drawn(getComputedStyle(k).borderTopLeftRadius, b.width),
          trackRadius: drawn(getComputedStyle(t).borderTopLeftRadius, a.height),
        };
      };
      // the kit's own switch: the knob is ::after, placed by left/top and transform
      const kitSwitch = (id: string) => {
        const t = document.getElementById(id)!;
        const c = getComputedStyle(t),
          k = getComputedStyle(t, "::after");
        const shift = k.transform === "none" ? 0 : new DOMMatrix(k.transform).m41;
        const border = parseFloat(c.borderLeftWidth);
        return {
          w: box(t).width,
          h: box(t).height,
          thumb: [parseFloat(k.width), parseFloat(k.height)],
          x: border + parseFloat(k.left) + shift,
          y: parseFloat(c.borderTopWidth) + parseFloat(k.top),
          bg: k.backgroundColor,
          radius: drawn(k.borderTopLeftRadius, parseFloat(k.width)),
          trackRadius: drawn(c.borderTopLeftRadius, box(t).height),
        };
      };
      return {
        v3off: bridged("v3off"),
        v3on: bridged("v3on"),
        v4off: bridged("v4off"),
        v4on: bridged("v4on"),
        kitoff: kitSwitch("kitoff"),
        kiton: kitSwitch("kiton"),
        glass: bridged("glass").bg,
        card: getComputedStyle(document.getElementById("card")!).color,
      };
    });
    for (const v of ["v3", "v4"] as const) {
      for (const [state, ref] of [
        ["off", m.kitoff],
        ["on", m.kiton],
      ] as const) {
        const b = m[`${v}${state}`];
        const what = `${kit} shadcn ${v} ${state}`;
        expect([b.w, b.h], `${what}: track`).toEqual([ref.w, ref.h]);
        expect(b.thumb, `${what}: thumb`).toEqual(ref.thumb);
        expect(b.x, `${what}: thumb x`).toBeCloseTo(ref.x, 1);
        expect(b.y, `${what}: thumb y`).toBeCloseTo(ref.y, 1);
        expect(b.bg, `${what}: thumb colour`).toBe(ref.bg);
        expect(b.radius, `${what}: thumb radius`).toBe(ref.radius);
        expect(b.trackRadius, `${what}: track radius`).toBe(ref.trackRadius);
        expect(b.shadow, `${what}: no shadow`).toBe("none");
      }
    }
    // on glass the knob stays solid
    expect(m.glass).toBe(m.card);
  });
