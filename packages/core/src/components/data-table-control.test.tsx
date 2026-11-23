// @vitest-environment jsdom
/** DataTable 0.10: row links and row clicks, controlled sort and selection, stack, paging. */
import * as React from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "./data-table.js";
import type { DataColumn } from "./types.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

type Row = { id: number; name: string; total: number };
const ROWS: Row[] = [
  { id: 1, name: "Ada", total: 30 },
  { id: 2, name: "Ben", total: 10 },
  { id: 3, name: "Cleo", total: 50 },
  { id: 4, name: "Dev", total: 20 },
  { id: 5, name: "Eli", total: 40 },
];
const COLS: DataColumn<Row>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "total", label: "Total", sortable: true, align: "right" },
  {
    key: "act",
    label: "",
    render: () => (
      <button type="button" onClick={() => {}}>
        Refund
      </button>
    ),
  },
];
const bodyNames = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((r) => within(r).getAllByRole("cell")[0]!.textContent);

describe("DataTable rows as links", () => {
  it("makes the first cell a link and opens it from a click anywhere on the row", () => {
    const clicked = vi.fn((e: React.MouseEvent) => e.preventDefault());
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
      (props, ref) => <a ref={ref} {...props} onClick={clicked} />,
    );
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(
      <DataTable
        columns={COLS}
        rows={ROWS}
        selectable
        columnToggle={false}
        rowHref={(r) => `/orders/${r.id}`}
        linkAs={RouterLink}
      />,
    );
    const link = screen.getByRole("link", { name: "Ada" });
    expect(link.getAttribute("href")).toBe("/orders/1");
    const row = link.closest("tr")!;
    // a click on another cell follows the row's own link (client-side navigation)
    fireEvent.click(within(row).getByText("30"));
    expect(clicked).toHaveBeenCalledTimes(1);
    // ⌘/Ctrl-click and middle-click open a new tab
    fireEvent.click(within(row).getByText("30"), { ctrlKey: true });
    expect(open).toHaveBeenCalledWith("/orders/1", "_blank", "noopener");
    fireEvent(
      within(row).getByText("30"),
      new MouseEvent("auxclick", { bubbles: true, button: 1 }),
    );
    expect(open).toHaveBeenCalledTimes(2);
    // the row's own controls do their own thing
    fireEvent.click(within(row).getByRole("checkbox"));
    fireEvent.click(within(row).getByRole("button", { name: "Refund" }));
    expect(clicked).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledTimes(2);
  });

  it("calls onRowClick and makes rows reachable by keyboard without rowHref", () => {
    const onRow = vi.fn();
    render(<DataTable columns={COLS} rows={ROWS} columnToggle={false} onRowClick={onRow} />);
    const row = screen.getByText("Ben").closest("tr")!;
    expect(row.getAttribute("tabindex")).toBe("0");
    fireEvent.click(within(row).getByText("10"));
    expect(onRow).toHaveBeenLastCalledWith(ROWS[1], expect.anything());
    fireEvent.keyDown(row, { key: "Enter" });
    expect(onRow).toHaveBeenCalledTimes(2);
    fireEvent.click(within(row).getByRole("button", { name: "Refund" }));
    expect(onRow).toHaveBeenCalledTimes(2);
  });
});

describe("DataTable controlled sort and selection", () => {
  it("draws the sort it is given and leaves the order to the caller", () => {
    const change = vi.fn();
    render(
      <DataTable
        columns={COLS}
        rows={ROWS}
        columnToggle={false}
        sort={{ key: "total", dir: "desc" }}
        onSortChange={change}
      />,
    );
    expect(bodyNames()).toEqual(["Ada", "Ben", "Cleo", "Dev", "Eli"]);
    const th = screen.getByRole("columnheader", { name: /Total/ });
    expect(th.getAttribute("aria-sort")).toBe("descending");
    fireEvent.click(within(th).getByRole("button"));
    expect(change).toHaveBeenCalledWith(null);
    fireEvent.click(within(screen.getByRole("columnheader", { name: /Name/ })).getByRole("button"));
    expect(change).toHaveBeenLastCalledWith({ key: "name", dir: "asc" });
  });

  it("still sorts itself with defaultSort", () => {
    render(
      <DataTable
        columns={COLS}
        rows={ROWS}
        columnToggle={false}
        defaultSort={{ key: "total", dir: "asc" }}
      />,
    );
    expect(bodyNames()).toEqual(["Ben", "Dev", "Ada", "Eli", "Cleo"]);
  });

  it("takes selected keys from outside, also of rows not shown, and reports changes", () => {
    const change = vi.fn();
    const bulk = vi.fn();
    render(
      <DataTable
        columns={COLS}
        rows={ROWS.slice(0, 2)}
        selectable
        columnToggle={false}
        selected={[2, 99]}
        onSelectedChange={change}
        bulkActions={[{ label: "Export", onClick: bulk }]}
      />,
    );
    const boxes = screen.getAllByRole("checkbox", { name: "Select row" }) as HTMLInputElement[];
    expect(boxes.map((b) => b.checked)).toEqual([false, true]);
    expect(screen.getByText(/2 selected/)).toBeTruthy();
    fireEvent.click(boxes[0]!);
    expect(change).toHaveBeenCalledWith([2, 99, 1]);
    fireEvent.click(screen.getByRole("button", { name: "Export" }));
    expect(bulk).toHaveBeenCalledWith([ROWS[1]], expect.any(Function));
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(change).toHaveBeenLastCalledWith([]);
  });
});

describe("DataTable stack and paging", () => {
  it("labels every cell for the stacked cards", () => {
    const { container } = render(
      <DataTable columns={COLS} rows={ROWS} columnToggle={false} stack />,
    );
    expect(container.querySelector("table")!.classList).toContain("stack");
    expect(container.querySelector(".tf-table-stackbox")).toBeTruthy();
    expect(screen.getByText("Ada").closest("td")!.getAttribute("data-label")).toBe("Name");
  });

  it("pages itself, keeps the selection across pages and reports the page", () => {
    const pageChange = vi.fn();
    render(
      <DataTable
        columns={COLS}
        rows={ROWS}
        selectable
        columnToggle={false}
        pageSize={2}
        onPageChange={pageChange}
      />,
    );
    expect(bodyNames()).toEqual(["", ""]);
    expect(screen.getByText("Ada")).toBeTruthy();
    expect(screen.queryByText("Cleo")).toBeNull();
    expect(screen.getByText("1–2 of 5")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]!);
    fireEvent.click(screen.getByRole("button", { name: /2/ }));
    expect(pageChange).toHaveBeenCalledWith(2);
  });

  it("shows the given page of a server-side list with rowCount", () => {
    render(
      <DataTable
        columns={COLS}
        rows={ROWS.slice(2, 4)}
        columnToggle={false}
        pageSize={2}
        rowCount={5}
        page={2}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByText("Cleo")).toBeTruthy();
    expect(screen.getByText("Dev")).toBeTruthy();
    expect(screen.getByText("3–4 of 5")).toBeTruthy();
  });
});
