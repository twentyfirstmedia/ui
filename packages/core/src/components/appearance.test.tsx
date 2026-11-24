// @vitest-environment jsdom
/** AppearanceProvider, AppearanceMenu, appearanceScript and SearchTrigger. */
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AppearanceMenu,
  AppearanceProvider,
  SearchTrigger,
  appearanceScript,
  parseAppearance,
} from "./appearance.js";

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  for (const a of ["data-kit", "data-theme", "data-density", "data-surface", "data-motion"])
    document.documentElement.removeAttribute(a);
});

const open = () => fireEvent.click(screen.getByRole("button", { name: "Appearance" }));
const root = (c: HTMLElement) => c.firstElementChild as HTMLElement;

describe("AppearanceProvider and AppearanceMenu", () => {
  it("changes the look from the menu and keeps it in this browser", async () => {
    const { container } = render(
      <AppearanceProvider scope="subtree" kits={["halo", "pro"]} storageKey="look">
        <AppearanceMenu />
      </AppearanceProvider>,
    );
    expect(root(container).dataset.kit).toBe("halo");
    open();
    const dialog = screen.getByRole("dialog");
    await act(async () => {
      fireEvent.click(within(dialog).getByRole("radio", { name: "Pro" }));
    });
    await act(async () => {
      fireEvent.click(within(dialog).getByRole("radio", { name: "Dark" }));
    });
    fireEvent.click(within(dialog).getByRole("radio", { name: "Compact" }));
    fireEvent.click(within(dialog).getByRole("radio", { name: "Off" }));
    fireEvent.click(within(dialog).getByRole("switch", { name: "Glass surfaces" }));
    const el = root(container);
    expect([el.dataset.kit, el.dataset.theme, el.dataset.density, el.dataset.motion]).toEqual([
      "pro",
      "dark",
      "compact",
      "off",
    ]);
    expect(el.dataset.surface).toBe("glass");
    expect(JSON.parse(localStorage.getItem("look")!)).toEqual({
      kit: "pro",
      theme: "dark",
      density: "compact",
      surface: "glass",
      motion: "off",
    });
    // "Auto" density leaves the kit's own
    fireEvent.click(within(dialog).getAllByRole("radio", { name: "Auto" })[1]!);
    expect(root(container).dataset.density).toBeUndefined();
  });

  it("restores the stored look and hides the style row with one kit", () => {
    localStorage.setItem("look", JSON.stringify({ theme: "dark", motion: "nope" }));
    const { container } = render(
      <AppearanceProvider scope="subtree" storageKey="look">
        <AppearanceMenu />
      </AppearanceProvider>,
    );
    expect(root(container).dataset.theme).toBe("dark");
    expect(root(container).dataset.motion).toBe("standard");
    open();
    expect(screen.queryByRole("radiogroup", { name: "Style" })).toBeNull();
    expect(screen.getByRole("radiogroup", { name: "Theme" })).toBeTruthy();
  });

  it("reports changes for an account and takes a value of its own", () => {
    const save = vi.fn();
    render(
      <AppearanceProvider
        scope="subtree"
        storageKey={false}
        initial={{ theme: "light" }}
        onChange={save}
      >
        <AppearanceMenu hint="Saved for your account" />
      </AppearanceProvider>,
    );
    open();
    expect(screen.getByText("Saved for your account")).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Lively" }));
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ theme: "light", motion: "expressive" }),
      { motion: "expressive" },
    );
    expect(localStorage.length).toBe(0);
  });

  it("works controlled with chosen rows", () => {
    const change = vi.fn();
    render(
      <AppearanceMenu
        value={{ theme: "light", density: "auto", surface: "solid", motion: "standard" }}
        onChange={change}
        rows={["theme"]}
      />,
    );
    open();
    expect(screen.queryByRole("switch")).toBeNull();
    fireEvent.click(screen.getByRole("radio", { name: "Dark" }));
    expect(change).toHaveBeenCalledWith({ theme: "dark" });
  });
});

describe("appearance helpers", () => {
  it("parses stored values and drops what is not valid", () => {
    expect(parseAppearance({ kit: "pro", theme: "x", density: "compact" })).toEqual({
      kit: "pro",
      theme: "system",
      density: "compact",
      surface: "solid",
      motion: "standard",
    });
  });

  it("puts the stored look on <html> before the first paint", () => {
    localStorage.setItem(
      "look",
      JSON.stringify({ kit: "pro", theme: "dark", density: "auto", surface: "glass" }),
    );
    new Function(appearanceScript("look"))();
    const d = document.documentElement;
    expect([d.dataset.kit, d.dataset.theme, d.dataset.surface, d.dataset.density]).toEqual([
      "pro",
      "dark",
      "glass",
      undefined,
    ]);
  });
});

describe("SearchTrigger", () => {
  it("opens the search on click and on ⌘K, but not while typing", () => {
    const openSearch = vi.fn();
    render(
      <>
        <SearchTrigger
          placeholder="Search orders"
          shortcut="⌘K"
          bindShortcut
          onClick={openSearch}
        />
        <input aria-label="Note" />
      </>,
    );
    const button = screen.getByRole("button", { name: "Search orders" });
    expect(button.getAttribute("aria-keyshortcuts")).toBe("Meta+K Control+K");
    fireEvent.click(button);
    fireEvent.keyDown(document.body, { key: "k", metaKey: true });
    expect(openSearch).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Note" }), { key: "k", ctrlKey: true });
    expect(openSearch).toHaveBeenCalledTimes(2);
  });
});
