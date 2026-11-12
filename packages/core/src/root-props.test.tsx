// @vitest-environment jsdom
/**
 * Every component puts `className` and `style` on its root element. The reference previews are
 * rendered with each component wrapped so that it receives a probe class and a probe custom
 * property; every component that rendered must show both somewhere in the document.
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
        d !== "Labels" &&
        existsSync(join(DIR, d, "preview.html")) &&
        readFileSync(join(DIR, d, "preview.html"), "utf8").includes("<script>"),
    )
  : [];

/**
 * Not checked: providers and helpers without an element of their own, overlays that render
 * nothing until opened, and components whose root is another component's portal.
 */
const EXEMPT = new Set([
  "UIProvider",
  "Portal",
  "Icon",
  "Stagger",
  "Reveal",
  "Presence",
  "Backdrop",
  "Ambient",
  "Toaster",
  "ToastItem",
  "ConfirmDialog",
  "ShortcutsOverlay",
  "ExportDialog",
  "CodeViewer",
  "StockBadge",
  "Modal",
  "Drawer",
  "CommandPalette",
  "Tooltip",
  "HoverCard",
  "ContextMenu",
]);

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

type AnyComponent = (props: Record<string, unknown>) => React.ReactNode;

function probed(used: Set<string>) {
  const out: Record<string, unknown> = { ...Core };
  for (const [name, value] of Object.entries(Core)) {
    if (!/^[A-Z]/.test(name) || typeof value !== "function" || EXEMPT.has(name)) continue;
    const Orig = value as AnyComponent;
    const Wrapped = (props: Record<string, unknown>) => {
      used.add(name);
      return React.createElement(Orig, {
        ...props,
        className: [props.className, `probe-${name}`].filter(Boolean).join(" "),
        style: { ...(props.style as object), [`--probe-${name}`]: "1" },
      });
    };
    // keep static members such as `ProductArt.kinds`
    out[name] = Object.assign(Wrapped, Orig);
  }
  return out;
}

describe("className and style reach the root element", () => {
  it.each(previews)("%s", async (name) => {
    const html = readFileSync(join(DIR, name, "preview.html"), "utf8");
    document.body.innerHTML = '<div id="root"></div>';
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const used = new Set<string>();
    const createRoot = (el: Element) => {
      const r = ReactDOMClient.createRoot(el);
      roots.push(r);
      return {
        render: (node: React.ReactNode) => act(() => r.render(node)),
        unmount: () => r.unmount(),
      };
    };
    const Halo = {
      ...probed(used),
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
    const missing: string[] = [];
    for (const c of used) {
      const el = document.querySelector(`.probe-${c}`) as HTMLElement | null;
      if (!el) missing.push(`${c}: className`);
      else if (!document.querySelector(`[style*="--probe-${c}"]`)) missing.push(`${c}: style`);
    }
    expect(missing).toEqual([]);
  });
});
