// @vitest-environment jsdom
/** The app frame: routes in AppShell, the tab bar with "More", NotificationCenter, Stepper, InputGroup. */
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { UIProvider } from "../provider.js";
import {
  AppShell,
  AppearanceMenu,
  AppearanceProvider,
  InputGroup,
  MobileTabBar,
  NotificationCenter,
  Stepper,
  appearanceScript,
  matchPath,
  parseAppearance,
} from "./index.js";
import type { NotificationItem, SidebarGroup } from "./types.js";

beforeAll(() => {
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
  Element.prototype.scrollIntoView ??= () => {};
});
afterEach(cleanup);

/** A router link stand-in: marks itself so tests can see it was used. */
const RouterLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => <a ref={ref} data-router="" {...props} />);

const GROUPS: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home", href: "/" },
      {
        id: "approvals",
        label: "Approvals",
        icon: "check",
        href: "/approvals",
        count: 3,
        countTone: "signal",
      },
      { id: "agents", label: "Agents", icon: "bot", href: "/agents" },
      { id: "mail", label: "Mail", icon: "mail", href: "/mail" },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: "settings",
        href: "/settings",
        items: [{ id: "billing", label: "Billing", href: "/settings/billing" }],
      },
      { id: "team", label: "Team", icon: "users", href: "/team" },
    ],
  },
];

describe("matchPath", () => {
  const pages = [{ href: "/" }, { href: "/settings" }, { href: "/settings/billing?tab=1" }];
  it("finds the longest match, / only exactly", () => {
    expect(matchPath("/settings/billing/invoices", pages)?.href).toBe("/settings/billing?tab=1");
    expect(matchPath("/settings/", pages)?.href).toBe("/settings");
    expect(matchPath("/", pages)?.href).toBe("/");
    expect(matchPath("/settingsx", pages)).toBeUndefined();
    expect(matchPath("/mail", pages)).toBeUndefined();
  });
});

describe("AppShell routes", () => {
  it("marks the page of the path and links through the provider's linkAs", () => {
    render(
      <UIProvider scope="subtree" linkAs={RouterLink}>
        <AppShell
          navigation="sidebar"
          sidebarGroups={GROUPS}
          pathname="/settings/billing"
          dock={false}
        >
          <p>Page</p>
        </AppShell>
      </UIProvider>,
    );
    const nav = document.querySelector(".tf-sidebar") as HTMLElement;
    const billing = within(nav).getByRole("link", { name: "Billing" });
    expect(billing.getAttribute("aria-current")).toBe("page");
    expect(billing.hasAttribute("data-router")).toBe(true);
    expect(
      within(nav)
        .getByRole("link", { name: /Approvals/ })
        .querySelector(".signal"),
    ).toBeTruthy();
  });

  it("does the same with the top navigation", () => {
    render(
      <AppShell
        nav={[
          { id: "home", label: "Home", icon: "home", href: "/" },
          {
            id: "inbox",
            label: "Inbox",
            icon: "inbox",
            href: "/inbox",
            count: 2,
            countTone: "signal",
          },
        ]}
        pathname="/inbox/42"
        linkAs={RouterLink}
        dock={false}
      />,
    );
    const inbox = screen.getByRole("link", { name: /Inbox/ });
    expect(inbox.getAttribute("aria-current")).toBe("page");
    expect(inbox.hasAttribute("data-router")).toBe(true);
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBeNull();
  });

  it("has a skip link to the main content", () => {
    render(<AppShell navigation="sidebar" sidebarGroups={GROUPS} dock={false} mainId="content" />);
    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip.getAttribute("href")).toBe("#content");
    expect(document.getElementById("content")?.tagName).toBe("MAIN");
  });

  it("puts the bell and the look menu in the top bar", () => {
    render(
      <AppShell
        navigation="sidebar"
        topbar
        sidebarGroups={GROUPS}
        dock={false}
        appearance
        notifications={{ items: [{ id: 1, icon: "bell", title: "Approved", unread: true }] }}
      />,
    );
    expect(screen.getByRole("button", { name: "Notifications, 1 unread" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Appearance" })).toBeTruthy();
  });

  it("offers a tab bar with the rest behind More", () => {
    const pick = vi.fn();
    render(
      <AppShell
        navigation="sidebar"
        sidebarGroups={GROUPS}
        dock={false}
        tabBar={3}
        active="team"
        onNavigate={pick}
      />,
    );
    const bar = document.querySelector(".tf-shell-tabbar") as HTMLElement;
    expect(
      within(bar)
        .getAllByRole("link")
        .map((a) => a.textContent),
    ).toEqual(["Home", "3Approvals", "Agents"]);
    const more = within(bar).getByRole("button", { name: "More" });
    expect(more.getAttribute("aria-current")).toBe("page");
    fireEvent.click(more);
    const sheet = screen.getByRole("dialog", { name: "More pages" });
    expect(within(sheet).getByRole("link", { name: "Team" }).getAttribute("aria-current")).toBe(
      "page",
    );
    expect(within(sheet).getByText("Settings", { selector: ".tf-tabbar-more-label" })).toBeTruthy();
    fireEvent.click(within(sheet).getByRole("link", { name: "Billing" }));
    expect(pick).toHaveBeenCalledWith("billing");
  });
});

describe("MobileTabBar", () => {
  it("renders link tabs and a More sheet that adds up the counts", () => {
    render(
      <MobileTabBar
        linkAs={RouterLink}
        items={[{ id: "home", label: "Home", icon: "home", href: "/" }]}
        more={[
          { id: "a", label: "Approvals", icon: "check", href: "/a", count: 2, countTone: "signal" },
          { id: "b", label: "Billing", icon: "card", href: "/b", count: 1 },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Home" }).hasAttribute("data-router")).toBe(true);
    const more = screen.getByRole("button", { name: /More/ });
    expect(more.querySelector(".tf-dotcount.signal")?.textContent).toBe("3");
  });
});

const NOTES: NotificationItem[] = [
  {
    id: 1,
    icon: "check",
    title: "Approval waiting",
    unread: true,
    date: "2026-04-16T09:00:00",
    href: "/approvals/1",
  },
  { id: 2, icon: "mail", title: "New mail", unread: true, date: "2026-04-16T08:00:00" },
  { id: 3, icon: "bot", title: "Run finished", date: "2026-04-15T17:00:00" },
];

describe("NotificationCenter", () => {
  it("shows the unread count, groups by day and links to the item", () => {
    const readAll = vi.fn();
    const opened = vi.fn();
    render(
      <NotificationCenter
        items={NOTES}
        now="2026-04-16T12:00:00"
        onReadAll={readAll}
        onOpen={opened}
        linkAs={RouterLink}
      />,
    );
    const bell = screen.getByRole("button", { name: "Notifications, 2 unread" });
    expect(bell.parentElement?.querySelector(".tf-dotcount")?.textContent).toBe("2");
    fireEvent.click(bell);
    const dialog = screen.getByRole("dialog", { name: "Notifications" });
    expect(
      within(dialog)
        .getAllByRole("separator")
        .map((s) => s.getAttribute("aria-label")),
    ).toEqual(["Today", "Yesterday"]);
    const link = within(dialog).getByRole("link", { name: /Approval waiting/ });
    expect(link.getAttribute("href")).toBe("/approvals/1");
    fireEvent.click(within(dialog).getByRole("button", { name: "Mark all read" }));
    expect(readAll).toHaveBeenCalled();
    fireEvent.click(link);
    expect(opened).toHaveBeenCalledWith(NOTES[0]);
    // opening an item closes the panel
    expect(screen.queryByRole("dialog", { name: "Notifications" })).toBeNull();
  });

  it("is controlled and speaks German", () => {
    render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{
          notifications: "Mitteilungen",
          notificationsUnread: (_n, f) => `Mitteilungen, ${f} ungelesen`,
          markAllRead: "Alle gelesen",
          today: "Heute",
          yesterday: "Gestern",
          all: "Alle",
          unread: "Ungelesen",
        }}
      >
        <NotificationCenter open items={NOTES} unread={1200} now="2026-04-16T12:00:00" />
      </UIProvider>,
    );
    expect(screen.getByRole("button", { name: "Mitteilungen, 1.200 ungelesen" })).toBeTruthy();
    const dialog = screen.getByRole("dialog", { name: "Mitteilungen" });
    expect(within(dialog).getByText("Heute")).toBeTruthy();
    expect(within(dialog).getByText("Alle gelesen")).toBeTruthy();
    expect(dialog.textContent).not.toMatch(/Notifications|Mark all read|Today/);
    expect(screen.getByText("99+")).toBeTruthy();
  });
});

describe("Stepper", () => {
  const steps = [
    { label: "Account" },
    { label: "Workspace", description: "Name and address" },
    { label: "Invite" },
    { label: "Done" },
  ];
  it("derives the states from current and lets done steps be revisited", () => {
    const go = vi.fn();
    const { container } = render(<Stepper steps={steps} current={2} onStepClick={go} />);
    const items = [...container.querySelectorAll("li")];
    expect(items.map((li) => li.className.replace("tf-step ", ""))).toEqual([
      "done",
      "done",
      "current",
      "upcoming",
    ]);
    expect(items[2]?.getAttribute("aria-current")).toBe("step");
    fireEvent.click(screen.getByRole("button", { name: "Workspace, done Name and address" }));
    expect(go).toHaveBeenCalledWith(1);
    expect(screen.queryByRole("button", { name: /Invite/ })).toBeNull();
    expect(container.querySelector(".tf-stepper-compact")?.textContent).toContain("Step 3 of 4");
  });
  it("shows an error state and German words", () => {
    render(
      <UIProvider
        scope="subtree"
        messages={{
          steps: "Schritte",
          stepOf: (n, t) => `Schritt ${n} von ${t}`,
          stepError: "fehlerhaft",
        }}
      >
        <Stepper steps={[{ label: "Konto", state: "error" }, { label: "Team" }]} current={1} />
      </UIProvider>,
    );
    const nav = screen.getByRole("navigation", { name: "Schritte" });
    expect(nav.textContent).toContain("Konto, fehlerhaft");
    expect(nav.textContent).toContain("Schritt 2 von 2");
    expect(nav.textContent).not.toMatch(/Step|needs attention/);
  });
});

describe("InputGroup", () => {
  it("reads text affixes with the field and keeps controls in the group", () => {
    const change = vi.fn();
    render(
      <InputGroup
        label="Website"
        id="site"
        start="https://"
        end={<button type="button">Copy</button>}
        hint="Without www"
        onChange={change}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Website" });
    expect(input.getAttribute("aria-describedby")).toBe("site-start site-msg");
    expect(screen.getByText("https://").id).toBe("site-start");
    expect(screen.getByRole("button", { name: "Copy" }).closest(".tf-inputgroup")).toBeTruthy();
    fireEvent.change(input, { target: { value: "acme.com" } });
    expect(change).toHaveBeenCalled();
  });
  it("marks an error", () => {
    const { container } = render(<InputGroup label="Price" end="€" error="Enter a price" />);
    expect(container.querySelector(".tf-inputgroup.invalid")).toBeTruthy();
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });
});

describe("AppearanceMenu brand colour", () => {
  it("picks a preset, previews on hover and keeps it", async () => {
    const preview = vi.fn();
    const { container } = render(
      <AppearanceProvider scope="subtree" storageKey="look" onPreview={preview}>
        <AppearanceMenu />
      </AppearanceProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Appearance" }));
    const dialog = screen.getByRole("dialog");
    const violet = within(dialog).getByRole("radio", { name: "Violet" });
    fireEvent.pointerEnter(violet.parentElement!);
    expect(preview).toHaveBeenLastCalledWith({ brand: "violet" });
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--primary")).not.toBe("");
    fireEvent.pointerLeave(within(dialog).getByRole("radiogroup", { name: "Colour" }));
    expect(preview).toHaveBeenLastCalledWith(null);
    expect(root.style.getPropertyValue("--primary")).toBe("");
    await act(async () => {
      fireEvent.click(violet);
    });
    expect(JSON.parse(localStorage.getItem("look")!).brand).toBe("violet");
    expect(root.style.getPropertyValue("--primary")).not.toBe("");
    fireEvent.click(within(dialog).getByRole("radio", { name: "Default" }));
    expect(root.style.getPropertyValue("--primary")).toBe("");
  });

  it("parses brand values and writes them in the head script", () => {
    expect(parseAppearance({ brand: "teal" }).brand).toBe("teal");
    expect(parseAppearance({ brand: "#0f766e" }).brand).toBe("#0f766e");
    expect(parseAppearance({ brand: "red; x" }).brand).toBeUndefined();
    const script = appearanceScript("look");
    localStorage.setItem("look", JSON.stringify({ theme: "light", brand: "#0f766e" }));
    new Function(script)();
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe("#0f766e");
    expect(document.documentElement.style.getPropertyValue("--primary-foreground")).toBe("#ffffff");
    localStorage.setItem("look", JSON.stringify({ theme: "light", brand: "teal" }));
    document.documentElement.removeAttribute("style");
    new Function(script)();
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe("#0f766e");
    document.documentElement.removeAttribute("style");
    localStorage.clear();
  });
});
