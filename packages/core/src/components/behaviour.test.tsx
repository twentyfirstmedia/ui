// @vitest-environment jsdom
/** Keyboard paths and core behaviour of the components the plan names as important. */
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { setLabels } from "../i18n.js";
import { toast } from "../toast-store.js";
import { UIProvider } from "../provider.js";
import { ApprovalCard, ApprovalInbox } from "./approvals.js";
import { Combobox, DatePicker, OtpInput } from "./forms.js";
import { DataTable } from "./data-table.js";
import { ConfirmDialog, Toaster } from "./feedback.js";
import { RangeSlider } from "./admin.js";
import { Pagination } from "./navigation.js";
import { Tooltip } from "./overlays.js";

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
});

afterEach(() => {
  cleanup();
  toast.clear();
  setLabels({}, true);
  vi.useRealTimers();
});

describe("ApprovalCard", () => {
  it("answers A–D from the keyboard; B asks for the change first", () => {
    const onDecide = vi.fn();
    render(
      <ApprovalCard
        title="Send the reminder mail"
        agent="Mail agent"
        family="comms"
        onDecide={onDecide}
      />,
    );
    const card = screen.getByRole("group", { name: "Send the reminder mail" });
    fireEvent.keyDown(card, { key: "a" });
    expect(onDecide).toHaveBeenLastCalledWith("A", undefined);
    fireEvent.keyDown(card, { key: "B" });
    const box = screen.getByPlaceholderText("What should change?");
    fireEvent.change(box, { target: { value: "Shorter subject" } });
    fireEvent.click(screen.getByRole("button", { name: /B · Send/ }));
    expect(onDecide).toHaveBeenLastCalledWith("B", "Shorter subject");
  });

  it("collapses to one line once decided", () => {
    render(<ApprovalCard title="Pay invoice" decision={{ key: "C", by: "Robin", at: "09:14" }} />);
    expect(screen.getByText("Robin · 09:14")).toBeTruthy();
    expect(screen.queryByRole("group")).toBeNull();
  });
});

describe("ApprovalInbox", () => {
  it("lists the oldest first and moves with J and K", () => {
    function Inbox() {
      const [sel, setSel] = useState<string | number>("b");
      return (
        <ApprovalInbox
          selected={sel}
          onSelect={setSel}
          items={[
            { id: "a", title: "Newer", ageMin: 5 },
            { id: "b", title: "Older", ageMin: 50 },
          ]}
        />
      );
    }
    render(<Inbox />);
    const list = screen.getByRole("listbox");
    const titles = within(list)
      .getAllByRole("option")
      .map((o) => o.textContent);
    expect(titles[0]).toContain("Older");
    fireEvent.keyDown(list, { key: "j" });
    expect(within(list).getAllByRole("option")[1]?.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(list, { key: "k" });
    expect(within(list).getAllByRole("option")[0]?.getAttribute("aria-selected")).toBe("true");
  });
});

describe("Combobox", () => {
  it("filters, moves with the arrows and picks with Enter", () => {
    const onChange = vi.fn();
    render(
      <Combobox label="Team" options={["Design", "Engineering", "Growth"]} onChange={onChange} />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "gr" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("Growth");
  });

  it("removes the last token with Backspace in multi mode", () => {
    const onChange = vi.fn();
    render(
      <Combobox multiple options={["A", "B"]} defaultValue={["A", "B"]} onChange={onChange} />,
    );
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith(["A"]);
  });
});

describe("DataTable", () => {
  const rows = [
    { id: 1, name: "Clara", seats: 5 },
    { id: 2, name: "Ava", seats: 3 },
  ];
  it("sorts by a column and hands selected rows to bulk actions", () => {
    const bulk = vi.fn();
    render(
      <DataTable
        rows={rows}
        selectable
        bulkActions={[{ label: "Remove", onClick: bulk }]}
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "seats", label: "Seats", sortable: true },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Name/ }));
    const body = screen.getAllByRole("row").slice(1);
    expect(body[0]?.textContent).toContain("Ava");
    fireEvent.click(screen.getByLabelText("Select all rows"));
    fireEvent.click(screen.getByRole("button", { name: /Remove/ }));
    expect(bulk.mock.calls[0]?.[0]).toHaveLength(2);
  });
});

describe("Toaster", () => {
  it("shows a toast with Undo and closes it afterwards", () => {
    const undo = vi.fn();
    render(
      <UIProvider scope="subtree">
        <Toaster />
      </UIProvider>,
    );
    act(() => {
      toast({ text: "Invoice deleted", undo });
    });
    expect(screen.getByText("Invoice deleted")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalled();
    expect(screen.queryByText("Invoice deleted")).toBeNull();
  });
});

describe("ConfirmDialog", () => {
  it("enables the confirm button only once the word is typed", () => {
    const onConfirm = vi.fn();
    render(
      <UIProvider scope="subtree">
        <ConfirmDialog
          open
          title="Delete workspace"
          confirmText="DELETE"
          confirmLabel="Delete"
          danger
          onConfirm={onConfirm}
          onCancel={() => {}}
        />
      </UIProvider>,
    );
    const btn = screen.getByRole("button", { name: "Delete" }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "DELETE" } });
    expect(btn.disabled).toBe(false);
    fireEvent.click(btn);
    expect(onConfirm).toHaveBeenCalled();
    expect(screen.getByRole("alertdialog").getAttribute("aria-labelledby")).toBeTruthy();
  });
});

describe("OtpInput", () => {
  it("moves to the next box and reports the full code", () => {
    const done = vi.fn();
    render(<OtpInput length={4} onComplete={done} />);
    const boxes = screen.getAllByRole("textbox");
    ["1", "2", "3", "4"].forEach((d, i) =>
      fireEvent.change(boxes[i] as HTMLElement, { target: { value: d } }),
    );
    expect(done).toHaveBeenCalledWith("1234");
  });
});

describe("DatePicker", () => {
  it("opens a calendar and picks a day", () => {
    const onChange = vi.fn();
    render(<DatePicker label="Due" today={new Date(2026, 3, 14)} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Due" }));
    const days = screen.getAllByRole("button").filter((b) => b.textContent === "20");
    fireEvent.click(days[0] as HTMLElement);
    const picked = onChange.mock.calls[0]?.[0] as Date;
    expect(picked.getDate()).toBe(20);
  });
});

describe("RangeSlider", () => {
  it("keeps the low end below the high end", () => {
    const onChange = vi.fn();
    render(
      <RangeSlider label="Price" min={0} max={100} defaultValue={[20, 80]} onChange={onChange} />,
    );
    const [lo] = screen.getAllByRole("slider");
    fireEvent.change(lo as HTMLElement, { target: { value: "30" } });
    expect(onChange).toHaveBeenLastCalledWith([30, 80]);
  });
});

describe("Tooltip", () => {
  it("starts open with defaultOpen and closes with Escape", () => {
    render(
      <Tooltip label="Copy share link" shortcut="⌘L" defaultOpen>
        <button type="button">Share</button>
      </Tooltip>,
    );
    const btn = screen.getByRole("button", { name: "Share" });
    expect(screen.getByRole("tooltip").textContent).toContain("Copy share link");
    expect(btn.getAttribute("aria-describedby")).toBe(screen.getByRole("tooltip").id);
    fireEvent.keyDown(btn, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});

describe("labels", () => {
  it("translate aria labels", () => {
    render(
      <UIProvider labels={{ Pagination: "Seitennavigation", "Next page": "Nächste Seite" }}>
        <Pagination total={5} />
      </UIProvider>,
    );
    expect(screen.getByRole("navigation", { name: "Seitennavigation" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Nächste Seite" })).toBeTruthy();
  });
});
