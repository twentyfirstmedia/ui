// @vitest-environment jsdom
/**
 * Runs every preview script of the reference (reference/halo/design-system/components/*\/preview.html)
 * against the ported components: `window.Halo` is replaced by this package's exports. Each preview
 * must render without throwing and without React errors. This keeps the port faithful to the
 * reference usage of every component.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import * as ReactDOM from "react-dom";
import { act } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import * as Core from "./index.js";

const DIR = join(__dirname, "../../../reference/halo/design-system/components");
const previews = existsSync(DIR)
  ? readdirSync(DIR).filter(
      (d) =>
        existsSync(join(DIR, d, "preview.html")) &&
        readFileSync(join(DIR, d, "preview.html"), "utf8").includes("<script>"),
    )
  : [];

beforeAll(() => {
  (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
  window.matchMedia ??= ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView ??= () => {};
});

const roots: ReactDOMClient.Root[] = [];
afterEach(() => {
  act(() => roots.splice(0).forEach((r) => r.unmount()));
  document.body.innerHTML = "";
  Core.toast.clear?.();
});

function scripts(html: string): string[] {
  return [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1] as string);
}

describe("reference previews render with the ported components", () => {
  it.each(previews)("%s", async (name) => {
    const html = readFileSync(join(DIR, name, "preview.html"), "utf8");
    document.body.innerHTML = '<div id="root"></div>';
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...a: unknown[]) => {
      errors.push(a.map(String).join(" "));
    });
    const createRoot = (el: Element) => {
      const r = ReactDOMClient.createRoot(el);
      roots.push(r);
      return {
        render: (node: React.ReactNode) => act(() => r.render(node)),
        unmount: () => r.unmount(),
      };
    };
    const Halo = {
      ...Core,
      mountPage(App: () => React.ReactNode, el?: Element) {
        createRoot(el || (document.getElementById("root") as Element)).render(
          React.createElement(App),
        );
      },
    };
    const win = Object.assign(Object.create(window), {
      Halo,
      React,
      ReactDOM: { ...ReactDOM, createRoot },
    });
    for (const code of scripts(html)) {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const run = new Function("window", "React", "ReactDOM", code);
      await act(async () => {
        run(win, React, { ...ReactDOM, createRoot });
      });
    }
    spy.mockRestore();
    expect(errors, errors.join("\n")).toEqual([]);
    expect(document.getElementById("root")?.childNodes.length).toBeGreaterThan(0);
  });
});
