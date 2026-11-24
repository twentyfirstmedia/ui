// @vitest-environment jsdom
/** Sidebar parents: a parent that is a page itself (label link + chevron button) and a parent
 *  without a page of its own (one button), expanded, collapsed and in the phone drawer. */
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Sidebar } from "./navigation.js";
import type { SidebarGroup } from "./types.js";

let phone = false;
beforeEach(() => {
  phone = false;
  window.matchMedia = ((q: string) => ({
    matches: phone && q.includes("max-width"),
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});
afterEach(cleanup);

const GROUPS: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home", href: "/" },
      {
        id: "orders",
        label: "Orders",
        icon: "cart",
        href: "/orders",
        count: 12,
        items: [
          { id: "smm", label: "SMM Orders", href: "/orders/smm" },
          { id: "refunds", label: "Refunds", href: "/orders/refunds" },
        ],
      },
      {
        id: "team",
        label: "Team",
        icon: "users",
        items: [
          { id: "members", label: "Members", href: "/team/members" },
          { id: "roles", label: "Roles", href: "/team/roles" },
        ],
      },
    ],
  },
];
const nav = () => screen.getByRole("navigation", { name: "Sidebar" });
const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>((props, ref) => (
  <a
    ref={ref}
    data-router=""
    {...props}
    onClick={(e) => (e.preventDefault(), props.onClick?.(e))}
  />
));

describe("a parent that is a page itself", () => {
  it("splits into a link to its page and a chevron button for its pages", () => {
    const pick = vi.fn();
    render(<Sidebar groups={GROUPS} linkAs={RouterLink} onPick={pick} />);
    const link = within(nav()).getByRole("link", { name: /^Orders/ });
    expect(link.getAttribute("href")).toBe("/orders");
    expect(link.hasAttribute("data-router")).toBe(true);
    expect(link.textContent).toContain("12");
    const toggle = within(nav()).getByRole("button", { name: "Show Orders pages" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    const list = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    expect(list.hidden).toBe(true);

    // the chevron only toggles
    fireEvent.click(toggle);
    expect(pick).not.toHaveBeenCalled();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.getAttribute("aria-label")).toBe("Hide Orders pages");
    expect(list.hidden).toBe(false);
    expect(within(list).getByRole("link", { name: "SMM Orders" })).toBeTruthy();
    fireEvent.click(toggle);
    expect(list.hidden).toBe(true);

    // the label navigates
    fireEvent.click(link);
    expect(pick).toHaveBeenCalledWith("orders");
  });

  it("is current on its own page and contains the current page when a child is", () => {
    const { rerender } = render(<Sidebar groups={GROUPS} current="orders" />);
    const link = () => within(nav()).getByRole("link", { name: /^Orders/ });
    expect(link().getAttribute("aria-current")).toBe("page");
    expect(link().classList).not.toContain("has-current");
    // its own page opens it
    expect(
      within(nav())
        .getByRole("button", { name: "Hide Orders pages" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    rerender(<Sidebar groups={GROUPS} current="smm" />);
    expect(link().getAttribute("aria-current")).toBeNull();
    expect(link().classList).toContain("has-current");
    expect(
      within(nav()).getByRole("link", { name: "SMM Orders" }).getAttribute("aria-current"),
    ).toBe("page");
  });

  it("opens on navigation without shutting parents the reader opened", () => {
    const { rerender } = render(<Sidebar groups={GROUPS} current="home" />);
    fireEvent.click(within(nav()).getByRole("button", { name: /Team/ }));
    expect(within(nav()).getByRole("link", { name: "Members" })).toBeTruthy();
    // navigating to a child of Orders opens Orders, Team stays open
    rerender(<Sidebar groups={GROUPS} current="refunds" />);
    expect(within(nav()).getByRole("button", { name: "Hide Orders pages" })).toBeTruthy();
    expect(within(nav()).getByRole("link", { name: "Members" })).toBeTruthy();
    // shutting it by hand stays shut until the next navigation into it
    fireEvent.click(within(nav()).getByRole("button", { name: "Hide Orders pages" }));
    expect(within(nav()).getByRole("button", { name: "Show Orders pages" })).toBeTruthy();
    rerender(<Sidebar groups={GROUPS} current="orders" />);
    expect(within(nav()).getByRole("button", { name: "Hide Orders pages" })).toBeTruthy();
  });

  it("collapsed: the icon opens the page, → opens a flyout with the page first", async () => {
    const pick = vi.fn();
    render(<Sidebar defaultCollapsed groups={GROUPS} onPick={pick} />);
    const link = within(nav()).getByRole("link", { name: /^Orders/ });
    expect(within(nav()).queryByRole("button", { name: /Orders pages/ })).toBeNull();
    link.focus();
    await act(async () => {
      fireEvent.keyDown(link, { key: "ArrowRight" });
    });
    const fly = screen.getByRole("group", { name: "Orders" });
    const entries = within(fly).getAllByRole("link");
    expect(entries.map((e) => e.textContent?.replace(/\d+$/, ""))).toEqual([
      "Orders",
      "SMM Orders",
      "Refunds",
    ]);
    expect(entries[0]!.getAttribute("href")).toBe("/orders");
    expect(document.activeElement).toBe(entries[0]);
    fireEvent.click(entries[2]!);
    expect(pick).toHaveBeenCalledWith("refunds");
    fireEvent.click(link);
    expect(pick).toHaveBeenLastCalledWith("orders");
  });

  it("phone drawer: the label navigates and closes, the chevron only toggles", () => {
    phone = true;
    const open = vi.fn();
    render(<Sidebar groups={GROUPS} mobileOpen onMobileOpenChange={open} />);
    fireEvent.click(within(nav()).getByRole("button", { name: "Show Orders pages" }));
    expect(open).not.toHaveBeenCalled();
    expect(within(nav()).getByRole("link", { name: "Refunds" })).toBeTruthy();
    fireEvent.click(within(nav()).getByRole("link", { name: /^Orders/ }));
    expect(open).toHaveBeenLastCalledWith(false);
  });
});

describe("a parent without a page of its own", () => {
  it("keeps one button for the whole row that toggles its pages", () => {
    const pick = vi.fn();
    render(<Sidebar groups={GROUPS} onPick={pick} />);
    expect(within(nav()).queryByRole("link", { name: /^Team/ })).toBeNull();
    const row = within(nav()).getByRole("button", { name: /Team/ });
    expect(row.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(row);
    expect(row.getAttribute("aria-expanded")).toBe("true");
    expect(within(nav()).getByRole("link", { name: "Roles" })).toBeTruthy();
    expect(pick).not.toHaveBeenCalled();
  });

  it("collapsed: the icon opens the flyout with a title and the children only", async () => {
    render(<Sidebar defaultCollapsed groups={GROUPS} />);
    const row = within(nav()).getByRole("button", { name: /Team/ });
    await act(async () => {
      fireEvent.keyDown(row, { key: "ArrowRight" });
    });
    const fly = screen.getByRole("group", { name: "Team" });
    expect(fly.querySelector(".tf-sidebar-flytitle")?.textContent).toBe("Team");
    expect(
      within(fly)
        .getAllByRole("link")
        .map((e) => e.textContent),
    ).toEqual(["Members", "Roles"]);
  });
});
