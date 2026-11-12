// @vitest-environment jsdom
/** Fluid layouts: the props and markup that let controls shrink instead of overflowing. */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Breadcrumb, Pagination } from "./navigation.js";
import { ListRow, Table } from "./data-display.js";
import { SelectMenu } from "./select-menu.js";
import { ToggleGroup } from "./primitives.js";
import { Segmented } from "./forms.js";
import { CheckoutSteps } from "./commerce.js";
import { ChatMessage } from "./chat.js";
import { MobileTabBar } from "./app-chrome.js";
import { AppShell, SideRail, TopBar } from "./shell.js";

afterEach(cleanup);

describe("fluid controls", () => {
  it("ToggleGroup block fills the width; labels sit in an ellipsis span", () => {
    const { container } = render(
      <ToggleGroup
        label="Range"
        block
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
        ]}
      />,
    );
    expect(container.querySelector(".tf-togglegroup")?.className).toContain("block");
    expect(container.querySelector(".tf-toggle-label")?.textContent).toBe("Day");
  });

  it("Segmented and MobileTabBar labels can end in an ellipsis", () => {
    const { container } = render(
      <>
        <Segmented block options={["Monthly", "Yearly"]} />
        <MobileTabBar items={[{ id: "a", label: "Overview", icon: "home" }]} active="a" />
      </>,
    );
    expect(container.querySelector(".tf-seg-label")?.textContent).toBe("Monthly");
    expect(container.querySelector(".tf-tabbar-label")?.textContent).toBe("Overview");
  });

  it("CheckoutSteps compact keeps every label for screen readers", () => {
    render(<CheckoutSteps compact current={1} steps={["Cart", "Details", "Payment"]} />);
    const list = screen.getByRole("list");
    expect(list.className).toContain("compact");
    expect(screen.getByRole("button", { name: /Payment/ })).toBeTruthy();
  });

  it("source chips take a detail and keep the full title", () => {
    const { container } = render(
      <ChatMessage
        role="assistant"
        sources={[
          { title: "Bebauungspläne Hamburg, Stand 2026-10", detail: "© FHH, LGV" },
          { title: "Zensus 2022" },
        ]}
      >
        Answer
      </ChatMessage>,
    );
    const chips = container.querySelectorAll(".tf-source");
    expect(chips).toHaveLength(2);
    expect(chips[1]?.getAttribute("title")).toBe("Zensus 2022");
    expect(container.querySelector(".tf-source-title")?.textContent).toContain("Stand 2026-10");
  });

  it("TopBar and AppShell take a brand node; the account button names the full address", () => {
    render(
      <>
        <TopBar
          brand={
            <span>
              <b>Mark</b> Capitaso
            </span>
          }
          items={[{ label: "Map", icon: "map" }]}
          user={{ name: "Alexandra Wittgenstein", email: "alexandra@example.com" }}
        />
        <AppShell brand={<b>Logo</b>} dock={false}>
          <p>Page</p>
        </AppShell>
      </>,
    );
    expect(screen.getByText("Mark")).toBeTruthy();
    expect(screen.getByText("Logo")).toBeTruthy();
    expect(
      screen.getAllByRole("button", { name: /Alexandra Wittgenstein/ })[0]?.getAttribute("title"),
    ).toBe("Alexandra Wittgenstein · alexandra@example.com");
  });
});

describe("navigation and lists", () => {
  it("Breadcrumb renders links, buttons and plain text, and takes a label", () => {
    const go = vi.fn();
    render(
      <Breadcrumb
        label="Path"
        onNavigate={go}
        items={[{ label: "Home", href: "#home" }, "Listings", "Flat 4"]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Path" });
    expect(within(nav).getByRole("link", { name: "Home" }).getAttribute("href")).toBe("#home");
    fireEvent.click(within(nav).getByRole("button", { name: "Listings" }));
    expect(go).toHaveBeenCalledWith(1);
    expect(within(nav).getByText("Flat 4").getAttribute("aria-current")).toBe("page");
  });

  it("Pagination links pages, names the nav and disables the ends", () => {
    render(<Pagination label="Results pages" total={5} page={1} href={(n) => `?page=${n}`} />);
    const nav = screen.getByRole("navigation", { name: "Results pages" });
    expect(within(nav).getByRole("link", { name: "5" }).getAttribute("href")).toBe("?page=5");
    expect(
      (within(nav).getByRole("button", { name: "Previous page" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(within(nav).getByRole("link", { name: "Next page" }).getAttribute("href")).toBe(
      "?page=2",
    );
  });

  it("ListRow: link, static row, own buttons outside the hit area, line clamps", () => {
    const remove = vi.fn();
    const open = vi.fn();
    const { container } = render(
      <>
        <ListRow title="Linked" href="#a" />
        <ListRow title="Static" subtitle="Just text" subtitleLines={2} />
        <ListRow
          title="Saved search"
          titleLines={2}
          onClick={open}
          actions={<button onClick={remove}>Remove</button>}
        />
      </>,
    );
    expect(screen.getByRole("link", { name: /Linked/ }).className).toContain("tf-row-item");
    expect(screen.queryByRole("button", { name: /Static/ })).toBeNull();
    const hit = screen.getByRole("button", { name: /Saved search/ });
    expect(hit.className).toContain("tf-row-hit");
    expect(hit.contains(screen.getByRole("button", { name: "Remove" }))).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(remove).toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(container.querySelector(".tf-row-sub.clamp")).toBeTruthy();
  });

  it("SideRail expands with names and has a toggle", () => {
    const change = vi.fn();
    const { container } = render(
      <SideRail toggle onExpandedChange={change} top={[{ label: "Layers", icon: "layers" }]} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show names" }));
    expect(change).toHaveBeenCalledWith(true);
    expect(container.querySelector(".tf-rail")?.className).toContain("expanded");
    expect(container.querySelector(".tf-rail-label")?.textContent).toBe("Layers");
  });

  it("SelectMenu sm and Table stack", () => {
    const { container } = render(
      <>
        <SelectMenu label="Sort" size="sm" options={["Newest", "Price"]} />
        <Table stack columns={[{ key: "a", label: "Area" }]} rows={[{ a: "80 m²" }]} />
      </>,
    );
    expect(container.querySelector(".tf-selectmenu")?.className).toContain("sm");
    expect(container.querySelector("td")?.getAttribute("data-label")).toBe("Area");
    expect(container.querySelector(".tf-table")?.className).toContain("stack");
  });
});
