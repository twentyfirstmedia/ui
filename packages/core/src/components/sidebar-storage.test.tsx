// @vitest-environment jsdom
/** Sidebar storageKey: the collapsed state survives a reload, controlled or not, in StrictMode too. */
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Sidebar } from "./navigation.js";
import { AppShell } from "./shell.js";

const KEY = "admin-nav";
const GROUPS = [{ items: [{ id: "home", label: "Home", icon: "home" as const }] }];

beforeEach(() => localStorage.clear());
afterEach(cleanup);

const collapsed = (c: HTMLElement) =>
  c.querySelector(".tf-sidebar")!.classList.contains("collapsed");
const strict = (ui: React.ReactElement) => render(<React.StrictMode>{ui}</React.StrictMode>);

function Controlled() {
  const [value, setValue] = React.useState(false);
  return (
    <Sidebar groups={GROUPS} storageKey={KEY} collapsed={value} onCollapsedChange={setValue} />
  );
}

describe.each([
  ["uncontrolled", () => <Sidebar groups={GROUPS} storageKey={KEY} />],
  ["controlled", () => <Controlled />],
])("Sidebar storageKey (%s)", (_name, make) => {
  it("restores a stored collapsed state and does not overwrite it", async () => {
    localStorage.setItem(KEY, "1");
    const { container } = strict(make());
    await act(async () => {});
    expect(collapsed(container)).toBe(true);
    expect(localStorage.getItem(KEY)).toBe("1");
  });

  it("keeps a collapse across a reload", async () => {
    const first = strict(make());
    await act(async () => {});
    expect(collapsed(first.container)).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(localStorage.getItem(KEY)).toBe("1");
    first.unmount();

    const second = strict(make());
    await act(async () => {});
    expect(collapsed(second.container)).toBe(true);
    expect(localStorage.getItem(KEY)).toBe("1");
    // and expanding again is stored as well
    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(localStorage.getItem(KEY)).toBe("0");
    second.unmount();
    const third = strict(make());
    await act(async () => {});
    expect(collapsed(third.container)).toBe(false);
  });
});

describe("AppShell topbar with storageKey", () => {
  it("restores the collapsed sidebar and the short brand above it", async () => {
    localStorage.setItem(KEY, "1");
    const { container } = strict(
      <AppShell
        navigation="sidebar"
        topbar
        brand="Admin"
        sidebarGroups={GROUPS}
        dock={false}
        sidebar={{ storageKey: KEY }}
      >
        page
      </AppShell>,
    );
    await act(async () => {});
    expect(collapsed(container)).toBe(true);
    expect(container.querySelector(".tf-shell-bar-brand .tf-brand-mini")).toBeTruthy();
    expect(localStorage.getItem(KEY)).toBe("1");
  });
});
