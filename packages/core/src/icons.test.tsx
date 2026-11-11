// @vitest-environment jsdom
/** The icon library: registration, filled brand logos, unknown names, categories. */
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Icon } from "./Icon.js";
import {
  ICON_CATEGORIES,
  ICON_LIBRARY,
  brandGithub,
  fingerprint,
  keyRound,
  scanFace,
} from "./icon-library.js";
import { ICON_PATHS, iconData, registerIcons } from "./icons.js";

afterEach(cleanup);

const path = (c: HTMLElement) => c.querySelector("path")?.getAttribute("d");

describe("icon library", () => {
  it("adds names next to the kit's own, without replacing any", () => {
    for (const name of Object.keys(ICON_LIBRARY)) expect(name in ICON_PATHS, name).toBe(false);
    expect(Object.keys(ICON_LIBRARY).length).toBeGreaterThan(500);
  });

  it("lists every kit and library icon in exactly one category", () => {
    const listed = Object.values(ICON_CATEGORIES).flat();
    expect(new Set(listed).size).toBe(listed.length);
    expect(listed.sort()).toEqual(
      [...Object.keys(ICON_PATHS), ...Object.keys(ICON_LIBRARY)].sort(),
    );
  });

  it("has passkey and social icons", () => {
    for (const name of [
      "fingerprint",
      "scanFace",
      "keyRound",
      "shieldCheck",
      "brandX",
      "brandInstagram",
      "brandFacebook",
      "brandYoutube",
      "brandTiktok",
      "brandWhatsapp",
      "brandGithub",
    ])
      expect(name in ICON_LIBRARY, name).toBe(true);
  });

  it("shows a registered icon by name; brand logos are filled", () => {
    registerIcons({ fingerprint, scanFace, keyRound, brandGithub });
    const { container, rerender } = render(<Icon name="fingerprint" />);
    expect(path(container)).toBe(fingerprint);
    expect(container.querySelector("svg")?.getAttribute("fill")).toBe("none");
    expect(container.querySelector("svg")?.getAttribute("stroke")).toBe("currentColor");
    rerender(<Icon name="brandGithub" label="GitHub" />);
    expect(path(container)).toBe(brandGithub.d);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("fill")).toBe("currentColor");
    expect(svg.getAttribute("stroke")).toBe("none");
    expect(svg.getAttribute("aria-label")).toBe("GitHub");
  });

  it("keeps the kit's drawings and takes your own", () => {
    registerIcons({ check: "M0 0h1", mine: "M4 4h16" } as Record<string, string>);
    expect(iconData("check")).toBe(ICON_PATHS.check);
    expect(iconData("mine")).toBe("M4 4h16");
  });

  it("warns once about a name nobody registered and draws a placeholder", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <>
        {/* @ts-expect-error: not an icon name */}
        <Icon name="nothingHere" />
        {/* @ts-expect-error: not an icon name */}
        <Icon name="nothingHere" />
      </>,
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain('"nothingHere"');
    expect(path(container)).toBe(ICON_PATHS.sparkle);
    warn.mockRestore();
  });
});
