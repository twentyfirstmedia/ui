// @vitest-environment jsdom
/** Sidebar: links, badges, collapsed tooltips and flyouts, persistence, ⌘B, the phone drawer,
 *  item menus, collapsible groups, UserMenu and the AppShell with a sidebar. */
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Sidebar, UserMenu } from "./navigation.js";
import { AppShell } from "./shell.js";
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
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const nav = () => screen.getByRole("navigation", { name: "Sidebar" });

describe("Sidebar items", () => {
  it("renders links, external links, badges, counts and disabled items", () => {
    const pick = vi.fn();
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
      (props, ref) => <a ref={ref} data-router="" {...props} />,
    );
    render(
      <Sidebar
        current="home"
        onPick={pick}
        linkAs={RouterLink}
        groups={[
          {
            items: [
              { id: "home", label: "Home", icon: "home", href: "#home" },
              { id: "docs", label: "Docs", icon: "book", href: "https://x.test", external: true },
              { id: "inbox", label: "Inbox", icon: "mail", count: 4 },
              { id: "news", label: "News", icon: "bell", badge: "dot" },
              { id: "beta", label: "Beta", icon: "sparkle", badge: "New" },
              { id: "api", label: "API", icon: "code", disabled: true },
            ],
          },
        ]}
      />,
    );
    const home = within(nav()).getByRole("link", { name: "Home" });
    expect(home.getAttribute("href")).toBe("#home");
    expect(home.hasAttribute("data-router")).toBe(true);
    expect(home.getAttribute("aria-current")).toBe("page");
    fireEvent.click(home);
    expect(pick).toHaveBeenCalledWith("home");

    const docs = within(nav()).getByRole("link", { name: /Docs/ });
    expect(docs.getAttribute("target")).toBe("_blank");
    expect(docs.getAttribute("rel")).toContain("noopener");
    expect(docs.textContent).toContain("(opens in a new tab)");

    const inbox = within(nav()).getByRole("button", { name: /Inbox/ });
    expect(inbox.querySelector(".tf-sidebar-count")?.textContent).toBe("4");
    expect(within(nav()).getByRole("button", { name: /News/ }).textContent).toContain(
      "New activity",
    );
    expect(within(nav()).getByRole("button", { name: /Beta/ }).textContent).toContain("New");
    expect(within(nav()).getByRole("button", { name: "API" }).hasAttribute("disabled")).toBe(true);
  });

  it("opens an item's menu and runs its action", () => {
    const rename = vi.fn();
    render(
      <Sidebar
        groups={[
          {
            items: [
              {
                id: "launch",
                label: "Launch",
                icon: "sparkle",
                actions: [{ label: "Rename", icon: "edit", onClick: rename }],
              },
            ],
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "More actions for Launch" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Rename/ }));
    expect(rename).toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("collapses a group and runs its action", () => {
    const add = vi.fn();
    render(
      <Sidebar
        groups={[
          {
            label: "Projects",
            collapsible: true,
            action: { label: "New project", onClick: add },
            items: [{ label: "Launch", icon: "sparkle" }],
          },
          {
            label: "Archive",
            collapsible: true,
            defaultOpen: false,
            items: [{ label: "Old", icon: "archive" }],
          },
        ]}
      />,
    );
    expect(screen.queryByRole("button", { name: "Old" })).toBeNull();
    const projects = screen.getByRole("button", { name: "Projects" });
    expect(projects.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(projects);
    expect(projects.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("button", { name: "Launch" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(screen.getByRole("button", { name: "Old" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "New project" }));
    expect(add).toHaveBeenCalled();
  });
});

describe("Sidebar collapsed", () => {
  const groups: SidebarGroup[] = [
    {
      items: [
        { id: "inbox", label: "Inbox", icon: "mail", count: 3 },
        {
          id: "billing",
          label: "Billing",
          icon: "card",
          items: [
            { id: "invoices", label: "Invoices", icon: "file" },
            { id: "payouts", label: "Payouts", icon: "download" },
          ],
        },
      ],
    },
  ];

  it("shows a label as a tooltip on focus", () => {
    const { baseElement } = render(<Sidebar defaultCollapsed groups={groups} />);
    fireEvent.focus(within(nav()).getByRole("button", { name: /Inbox/ }));
    const tip = baseElement.querySelector(".tf-sidebar-tip");
    expect(tip?.textContent).toContain("Inbox");
    expect(tip?.getAttribute("aria-hidden")).toBe("true");
  });

  it("opens a flyout with the nested pages from the keyboard and returns the focus", async () => {
    const pick = vi.fn();
    render(<Sidebar defaultCollapsed groups={groups} onPick={pick} />);
    const billing = within(nav()).getByRole("button", { name: /Billing/ });
    expect(billing.getAttribute("aria-haspopup")).toBe("true");
    billing.focus();
    await act(async () => {
      fireEvent.keyDown(billing, { key: "ArrowRight" });
    });
    const fly = screen.getByRole("group", { name: "Billing" });
    expect(document.activeElement?.textContent).toBe("Invoices");
    fireEvent.keyDown(fly, { key: "ArrowDown" });
    expect(document.activeElement?.textContent).toBe("Payouts");
    fireEvent.keyDown(fly, { key: "Escape" });
    expect(screen.queryByRole("group", { name: "Billing" })).toBeNull();
    expect(document.activeElement).toBe(billing);

    await act(async () => {
      fireEvent.keyDown(billing, { key: "ArrowRight" });
    });
    fireEvent.click(screen.getByRole("button", { name: "Payouts" }));
    expect(pick).toHaveBeenCalledWith("payouts");
    expect(screen.queryByRole("group", { name: "Billing" })).toBeNull();
  });

  it("remembers the state with storageKey", () => {
    localStorage.setItem("side", "1");
    render(<Sidebar storageKey="side" groups={groups} />);
    expect(nav().className).toContain("collapsed");
    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(nav().className).not.toContain("collapsed");
    expect(localStorage.getItem("side")).toBe("0");
  });

  it("toggles with ⌘B / Ctrl+B, but not while typing", () => {
    render(
      <>
        <input aria-label="Name" />
        <Sidebar shortcut groups={groups} />
      </>,
    );
    fireEvent.keyDown(document.body, { key: "b", ctrlKey: true });
    expect(nav().className).toContain("collapsed");
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Name" }), { key: "b", metaKey: true });
    expect(nav().className).toContain("collapsed");
    fireEvent.keyDown(document.body, { key: "B", metaKey: true });
    expect(nav().className).not.toContain("collapsed");
    expect(
      screen.getByRole("button", { name: "Collapse sidebar" }).getAttribute("aria-keyshortcuts"),
    ).toBeTruthy();
  });
});

describe("Sidebar on phones", () => {
  it("opens as a drawer, keeps the focus inside and returns it on Escape", () => {
    phone = true;
    const { container } = render(
      <Sidebar
        defaultCollapsed
        groups={[
          {
            items: [
              { label: "Home", icon: "home" },
              { label: "Inbox", icon: "mail" },
            ],
          },
        ]}
      />,
    );
    // never collapsed to icons on a phone
    expect(nav().className).not.toContain("collapsed");
    const menu = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(menu);
    expect(nav().className).toContain("open");
    expect(container.querySelector(".tf-sidebar-scrim")).toBeTruthy();
    expect(document.activeElement?.textContent).toBe("Home");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(nav().className).not.toContain("open");
    expect(document.activeElement).toBe(menu);
  });

  it("closes the drawer after a pick and on the scrim", () => {
    phone = true;
    const onOpen = vi.fn();
    const { container, rerender } = render(
      <Sidebar
        mobileOpen
        onMobileOpenChange={onOpen}
        groups={[{ items: [{ label: "Home", icon: "home" }] }]}
      />,
    );
    fireEvent.click(within(nav()).getByRole("button", { name: "Home" }));
    expect(onOpen).toHaveBeenLastCalledWith(false);
    rerender(
      <Sidebar
        mobileOpen
        onMobileOpenChange={onOpen}
        groups={[{ items: [{ label: "Home", icon: "home" }] }]}
      />,
    );
    onOpen.mockClear();
    fireEvent.click(container.querySelector(".tf-sidebar-scrim") as HTMLElement);
    expect(onOpen).toHaveBeenLastCalledWith(false);
  });
});

describe("UserMenu", () => {
  it("opens the account menu; compact keeps the name as the label", () => {
    const out = vi.fn();
    const { rerender } = render(
      <UserMenu
        name="Mara Ellis"
        email="mara@halo.app"
        items={[{ label: "Sign out", icon: "logout", onClick: out }]}
      />,
    );
    const trigger = screen.getByRole("button", { name: /Mara Ellis/ });
    expect(trigger.textContent).toContain("mara@halo.app");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("menuitem", { name: /Sign out/ }));
    expect(out).toHaveBeenCalled();
    rerender(<UserMenu name="Mara Ellis" compact items={[]} />);
    expect(screen.getByRole("button", { name: "Account: Mara Ellis" })).toBeTruthy();
  });
});

describe("AppShell with a sidebar", () => {
  it("renders the groups, the workspace switcher and the account, and navigates", () => {
    const go = vi.fn();
    render(
      <AppShell
        navigation="sidebar"
        active="invoices"
        onNavigate={go}
        dock={false}
        user={{ name: "Mara Ellis" }}
        userMenu={[{ label: "Sign out", icon: "logout" }]}
        workspaces={{
          items: [{ id: "halo", name: "Halo Studio" }],
          value: "halo",
        }}
        sidebarGroups={[
          {
            label: "Finance",
            items: [
              { id: "invoices", label: "Invoices", icon: "file" },
              { id: "reports", label: "Reports", icon: "chart" },
            ],
          },
        ]}
      >
        <p>Page</p>
      </AppShell>,
    );
    const side = nav();
    expect(side.className).toContain("shell");
    expect(
      within(side).getByRole("button", { name: "Invoices" }).getAttribute("aria-current"),
    ).toBe("page");
    fireEvent.click(within(side).getByRole("button", { name: "Reports" }));
    expect(go).toHaveBeenCalledWith("reports");
    expect(within(side).getByRole("button", { name: /Halo Studio/ })).toBeTruthy();
    expect(within(side).getByRole("button", { name: /Mara Ellis/ })).toBeTruthy();
    expect(screen.getByText("Page")).toBeTruthy();
  });
});

describe("Sidebar for filters", () => {
  it("is an aside with checkbox and radio options, free content and no collapse", () => {
    const pickType = vi.fn();
    const pickRooms = vi.fn();
    render(
      <Sidebar
        as="aside"
        groups={[
          {
            label: "Type",
            items: [
              {
                id: "flat",
                label: "Apartment",
                count: 12,
                checked: true,
                onCheckedChange: pickType,
              },
              { id: "house", label: "House", count: 3, checked: false, onCheckedChange: pickType },
            ],
          },
          {
            label: "Rooms",
            select: "single",
            items: [
              { id: "r1", label: "1+", checked: true, onCheckedChange: pickRooms },
              { id: "r2", label: "2+", checked: false, onCheckedChange: pickRooms },
            ],
          },
          { label: "Price", content: <input aria-label="Max price" /> },
        ]}
      />,
    );
    const aside = screen.getByRole("complementary", { name: "Filters" });
    expect(screen.queryByRole("navigation")).toBeNull();
    const house = within(aside).getByRole("checkbox", { name: /House/ });
    expect(within(aside).getByRole("checkbox", { name: /Apartment/ })).toHaveProperty(
      "checked",
      true,
    );
    fireEvent.click(house);
    expect(pickType).toHaveBeenCalledWith(true);
    const two = within(aside).getByRole("radio", { name: "2+" });
    fireEvent.click(two);
    expect(pickRooms).toHaveBeenCalledWith(true);
    expect(within(aside).getByRole("group", { name: "Rooms" })).toBeTruthy();
    expect(within(aside).getByRole("textbox", { name: "Max price" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Collapse sidebar" })).toBeNull();
    expect(screen.getByRole("button", { name: "Filters" })).toBeTruthy();
  });
});
