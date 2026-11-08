// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UIProvider } from "./provider.js";
import {
  THEME_PRESETS,
  brandTheme,
  foregroundFor,
  parseThemeCss,
  themeCss,
  themeStyle,
} from "./theme.js";

describe("shadcn-style themes", () => {
  it("reads a shadcn v4 theme: :root is light, .dark is dark, radius kept", () => {
    const t = parseThemeCss(`
      :root { --radius: 0.625rem; --primary: oklch(0.205 0 0); --muted-foreground: oklch(0.556 0 0); --unknown: 1px; }
      .dark { --primary: oklch(0.922 0 0); }
    `);
    expect(t.radius).toBe("0.625rem");
    expect(t.light).toEqual({
      primary: "oklch(0.205 0 0)",
      "muted-foreground": "oklch(0.556 0 0)",
    });
    expect(t.dark).toEqual({ primary: "oklch(0.922 0 0)" });
  });

  it("wraps shadcn v3 bare HSL channels", () => {
    expect(parseThemeCss(":root { --primary: 222.2 47.4% 11.2%; }").light?.primary).toBe(
      "hsl(222.2 47.4% 11.2%)",
    );
  });

  it("writes the selectors the kits use for light, dark and system", () => {
    const css = themeCss({ light: { primary: "red" }, dark: { primary: "blue" } }, { kit: "halo" });
    expect(css).toMatch(/^:root \{\n {2}--primary: red;/m);
    expect(css).toMatch(/\[data-theme="dark"\],\n\.dark \{\n {2}--primary: blue;/);
    expect(css).toMatch(/:root:not\(\[data-theme\]\) \{\n {4}--primary: blue;/);
    // Pro is dark by default: an element without data-theme gets the dark values
    expect(themeCss({ dark: { primary: "blue" } }, { kit: "pro" })).toMatch(
      /^:root:not\(\[data-theme\]\) \{\n {2}--primary: blue;/m,
    );
    expect(themeCss({ light: { primary: "red" } }, { kit: "pro", scoped: true })).toContain(
      '[data-kit="pro"][data-theme="light"],\n[data-kit="pro"] [data-theme="light"]',
    );
  });

  it("ignores names that are not theme variables", () => {
    expect(themeStyle({ primary: "red", nope: "x" } as never, "8px")).toEqual({
      "--primary": "red",
      "--radius": "8px",
    });
  });

  it("picks readable text for a brand colour", () => {
    expect(foregroundFor("#2563eb")).toBe("#ffffff");
    expect(foregroundFor("#fde047")).toBe("#111114");
    expect(foregroundFor("oklch(0.5 0.2 260)")).toBeUndefined();
    expect(brandTheme("#7c3aed").light).toMatchObject({ primary: "#7c3aed", ring: "#7c3aed" });
    for (const p of Object.values(THEME_PRESETS))
      expect(p.theme.light?.["primary-foreground"]).toBeTruthy();
  });

  it("UIProvider tokens set the variables on <html> and remove them again", () => {
    const { unmount } = render(
      <UIProvider tokens={{ primary: "rgb(1, 2, 3)" }}>
        <p>x</p>
      </UIProvider>,
    );
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe("rgb(1, 2, 3)");
    unmount();
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe("");
  });

  it("UIProvider tokens per mode follow the theme prop, and sit on the subtree", () => {
    const { container, rerender } = render(
      <UIProvider
        scope="subtree"
        theme="light"
        tokens={{ light: { primary: "red" }, dark: { primary: "blue" }, radius: "4px" }}
      >
        <p>x</p>
      </UIProvider>,
    );
    const box = container.firstElementChild as HTMLElement;
    expect(box.style.getPropertyValue("--primary")).toBe("red");
    expect(box.style.getPropertyValue("--radius")).toBe("4px");
    rerender(
      <UIProvider
        scope="subtree"
        theme="dark"
        tokens={{ light: { primary: "red" }, dark: { primary: "blue" } }}
      >
        <p>x</p>
      </UIProvider>,
    );
    expect(box.style.getPropertyValue("--primary")).toBe("blue");
  });
});
