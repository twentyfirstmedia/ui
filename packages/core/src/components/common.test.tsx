// @vitest-environment jsdom
import * as React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UIProvider } from "../provider.js";
import { BulkActionBar, DaySeparator, Highlight, highlightParts } from "./index.js";

afterEach(cleanup);

describe("BulkActionBar", () => {
  it("hides at 0 and runs actions and clear", () => {
    const { container, rerender } = render(<BulkActionBar count={0} actions={[]} />);
    expect(container.firstChild).toBeNull();
    const archive = vi.fn();
    const clear = vi.fn();
    rerender(
      <BulkActionBar
        count={3}
        onClear={clear}
        actions={[{ label: "Archive", icon: "archive", onClick: archive }]}
      />,
    );
    expect(screen.getByRole("toolbar", { name: "Bulk actions" })).toBeTruthy();
    expect(screen.getByText("3 selected")).toBeTruthy();
    fireEvent.click(screen.getByText("Archive"));
    fireEvent.click(screen.getByText("Clear"));
    expect(archive).toHaveBeenCalledOnce();
    expect(clear).toHaveBeenCalledOnce();
  });

  it("speaks German through messages", () => {
    render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{
          bulkActions: "Aktionen für die Auswahl",
          clear: "Aufheben",
          selectedCount: (_n, f) => `${f} ausgewählt`,
        }}
      >
        <BulkActionBar count={1200} onClear={() => {}} />
      </UIProvider>,
    );
    expect(screen.getByRole("toolbar", { name: "Aktionen für die Auswahl" })).toBeTruthy();
    expect(screen.getByText("1.200 ausgewählt")).toBeTruthy();
    expect(screen.getByText("Aufheben")).toBeTruthy();
  });
});

describe("DaySeparator", () => {
  const now = "2026-04-16T12:00:00";
  it("says today, yesterday or the date", () => {
    render(
      <>
        <DaySeparator date="2026-04-16T08:00:00" now={now} />
        <DaySeparator date="2026-04-15T23:00:00" now={now} />
        <DaySeparator date="2026-04-13T08:00:00" now={now} />
        <DaySeparator label="New messages" tone="accent" />
      </>,
    );
    const names = screen.getAllByRole("separator").map((el) => el.getAttribute("aria-label"));
    expect(names).toEqual(["Today", "Yesterday", "Monday, April 13", "New messages"]);
  });

  it("formats the date in the provider's locale", () => {
    render(
      <UIProvider scope="subtree" locale="de-DE" messages={{ today: "Heute" }}>
        <DaySeparator date="2026-04-16T08:00:00" now={now} />
        <DaySeparator date="2026-04-13T08:00:00" now={now} />
      </UIProvider>,
    );
    expect(screen.getByText("Heute")).toBeTruthy();
    expect(screen.getByText("Montag, 13. April")).toBeTruthy();
  });
});

describe("Highlight", () => {
  it("marks every word of the query, case-insensitive", () => {
    const { container } = render(
      <Highlight text="Invoice for the hiring plan" query="invoice PLAN" />,
    );
    expect([...container.querySelectorAll("mark")].map((m) => m.textContent)).toEqual([
      "Invoice",
      "plan",
    ]);
  });
  it("prefers longer terms and escapes regex characters", () => {
    expect(highlightParts("a+b in invoices", ["in", "invoice", "a+b"])).toEqual([
      { text: "a+b", hit: true },
      { text: " ", hit: false },
      { text: "in", hit: true },
      { text: " ", hit: false },
      { text: "invoice", hit: true },
      { text: "s", hit: false },
    ]);
  });
});
