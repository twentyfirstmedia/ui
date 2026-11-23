// @vitest-environment jsdom
/** AppShell 0.11: the top bar across the frame in sidebar mode. */
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppShell } from "./shell.js";

afterEach(cleanup);

const GROUPS = [{ items: [{ id: "home", label: "Home", icon: "home" as const }] }];
const shell = (extra: Partial<React.ComponentProps<typeof AppShell>> = {}) => (
  <AppShell
    navigation="sidebar"
    brand="Admin"
    sidebarGroups={GROUPS}
    dock={false}
    topStart={<input aria-label="Search orders" />}
    topEnd={<button type="button">New order</button>}
    topExtra={<button type="button">Export</button>}
    {...extra}
  >
    page
  </AppShell>
);

describe("AppShell topbar", () => {
  it("puts brand, start and end into a bar on the frame", () => {
    const { container } = render(shell({ topbar: true }));
    const root = container.querySelector(".tf-shell")!;
    expect(root.classList).toContain("tf-shell-has-bar");
    const bar = screen.getByRole("banner");
    expect(bar.classList).toContain("tf-shell-bar");
    expect(within(bar).getByText("Admin").closest(".tf-shell-bar-brand")).toBeTruthy();
    expect(within(bar).getByRole("textbox", { name: "Search orders" })).toBeTruthy();
    const end = bar.querySelector(".tf-shell-bar-end")!;
    // topExtra moves into the bar's end, before topEnd
    expect(Array.from(end.querySelectorAll("button")).map((b) => b.textContent)).toEqual([
      "Export",
      "New order",
    ]);
    expect(container.querySelector(".tf-shell-tools")).toBeNull();
  });

  it("puts topbar content between start and end", () => {
    render(shell({ topbar: <span>Live</span> }));
    expect(screen.getByText("Live").closest(".tf-shell-bar-mid")).toBeTruthy();
  });

  it("keeps the old layout without the bar", () => {
    const { container } = render(shell());
    expect(screen.queryByRole("banner")).toBeNull();
    expect(container.querySelector(".tf-shell-has-bar")).toBeNull();
    expect(container.querySelector(".tf-shell-tools")!.textContent).toBe("Export");
    expect(container.querySelector(".tf-sidebar-head")!.textContent).toContain("Admin");
  });

  it("shows the collapsed brand when the sidebar collapses", () => {
    const { container } = render(shell({ topbar: true }));
    const brand = () => container.querySelector(".tf-shell-bar-brand .tf-brand")!;
    expect(brand().classList).not.toContain("tf-brand-mini");
    fireEvent.click(screen.getAllByRole("button", { name: "Collapse sidebar" })[0]!);
    expect(container.querySelector(".tf-sidebar")!.classList).toContain("collapsed");
    expect(brand().classList).toContain("tf-brand-mini");
    expect(brand().textContent).toBe("A");
  });

  it("follows a controlled collapsed sidebar", () => {
    const { container } = render(shell({ topbar: true, sidebar: { collapsed: true } }));
    expect(container.querySelector(".tf-sidebar")!.classList).toContain("collapsed");
    expect(container.querySelector(".tf-shell-bar-brand .tf-brand-mini")).toBeTruthy();
  });

  it("opens topStart over the bar from its icon button and closes it with Escape", async () => {
    const { container } = render(shell({ topbar: true }));
    const find = screen.getByRole("button", { name: "Search" });
    expect(find.getAttribute("aria-expanded")).toBe("false");
    await act(async () => {
      fireEvent.click(find);
    });
    expect(container.querySelector(".tf-shell")!.classList).toContain("tf-shell-find");
    const input = screen.getByRole("textbox", { name: "Search orders" });
    expect(document.activeElement).toBe(input);
    const close = screen.getByRole("button", { name: "Close search" });
    expect(close.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(container.querySelector(".tf-shell")!.classList).not.toContain("tf-shell-find");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Search" }));
  });

  it("uses topStartCompact on phones instead of the icon button", () => {
    render(
      shell({
        topbar: true,
        topStartCompact: <button type="button">Command palette</button>,
      }),
    );
    expect(screen.queryByRole("button", { name: "Search" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Command palette" }).closest(".tf-shell-bar-find"),
    ).toBeTruthy();
  });

  it("draws the brand dot unless brandDot is false", () => {
    const { container, rerender } = render(shell({ topbar: true }));
    expect(container.querySelectorAll(".tf-brand-dot").length).toBeGreaterThan(0);
    rerender(shell({ topbar: true, brandDot: false }));
    expect(container.querySelector(".tf-brand-dot")).toBeNull();
    rerender(shell({ brandDot: false }));
    expect(container.querySelector(".tf-brand-dot")).toBeNull();
    rerender(
      <AppShell brand="Admin" brandDot={false} dock={false}>
        page
      </AppShell>,
    );
    expect(container.querySelector(".tf-topbar .tf-brand")).toBeTruthy();
    expect(container.querySelector(".tf-brand-dot")).toBeNull();
  });
});
