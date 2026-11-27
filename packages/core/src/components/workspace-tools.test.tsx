// @vitest-environment jsdom
/** FileBrowser, InvoiceEditor, ImportSuggestions, PeriodLock, ExportDialog (accounting), PaletteSwatches, AssetCard. */
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { UIProvider } from "../provider.js";
import {
  AssetCard,
  ExportDialog,
  FileBrowser,
  ImportSuggestions,
  InvoiceEditor,
  PaletteSwatches,
  PeriodLock,
} from "./index.js";
import type { FileBrowserItem, InvoiceDraft } from "./types.js";

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

const ITEMS: FileBrowserItem[] = [
  { id: "f1", name: "Contracts", kind: "folder", count: 4 },
  { id: "a", name: "offer.pdf", size: 412000, modified: "2026-04-14", preview: "/offer.pdf" },
  { id: "b", name: "photo.png", size: 2400000, preview: "/photo.png" },
  { id: "c", name: "notes.doc", size: 96000 },
];
const FOLDERS = [
  {
    id: "root",
    name: "All files",
    children: [
      { id: "f1", name: "Contracts" },
      { id: "f2", name: "Receipts" },
    ],
  },
];

describe("FileBrowser", () => {
  it("opens folders, previews files and navigates by breadcrumb", () => {
    const nav = vi.fn();
    render(
      <FileBrowser
        items={ITEMS}
        path={[
          { id: "root", name: "All files" },
          { id: "f9", name: "Q2" },
        ]}
        onNavigate={nav}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open folder Contracts" }));
    expect(nav).toHaveBeenCalledWith("f1");
    fireEvent.click(screen.getByRole("button", { name: "All files" }));
    expect(nav).toHaveBeenLastCalledWith("root");
    fireEvent.click(screen.getByText("photo.png"));
    const drawer = screen.getByRole("dialog", { name: "photo.png" });
    expect(within(drawer).getByRole("img", { name: "photo.png" })).toBeTruthy();
    fireEvent.click(within(drawer).getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByText("offer.pdf"));
    expect(screen.getByTitle("Preview of offer.pdf").tagName).toBe("IFRAME");
  });

  it("searches, selects with Space and the bulk bar, and trashes after asking", () => {
    const trash = vi.fn();
    render(<FileBrowser items={ITEMS} onTrash={trash} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "pdf" } });
    expect(screen.queryByText("notes.doc")).toBeNull();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
    const open = screen.getByText("notes.doc").closest("button") as HTMLButtonElement;
    fireEvent.keyDown(open, { key: " " });
    expect(screen.getByText("1 selected")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Move to trash" }));
    expect(screen.getByRole("alertdialog", { name: "Move 1 item to the trash?" })).toBeTruthy();
    fireEvent.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Move to trash" }),
    );
    expect(trash).toHaveBeenCalledWith(["c"]);
  });

  it("renames in place with F2 and moves through the folder picker", () => {
    const rename = vi.fn();
    const move = vi.fn();
    render(
      <FileBrowser
        items={ITEMS}
        onRename={rename}
        onMove={move}
        folders={FOLDERS}
        defaultView="list"
      />,
    );
    const open = screen.getByText("notes.doc").closest("button") as HTMLButtonElement;
    fireEvent.keyDown(open, { key: "F2" });
    const input = screen.getByRole("textbox", { name: "New name for notes.doc" });
    fireEvent.change(input, { target: { value: "minutes.doc" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(rename).toHaveBeenCalledWith("c", "minutes.doc");
    fireEvent.click(screen.getByRole("checkbox", { name: "Select offer.pdf" }));
    fireEvent.click(screen.getByRole("button", { name: "Move" }));
    const dialog = screen.getByRole("dialog", { name: "Move 1 item" });
    fireEvent.click(within(dialog).getByText("Receipts"));
    fireEvent.click(within(dialog).getByRole("button", { name: "Move here" }));
    expect(move).toHaveBeenCalledWith(["a"], "f2");
  });

  it("uploads picked files and shows progress in parts", () => {
    const upload = vi.fn();
    const { container } = render(
      <FileBrowser
        items={[]}
        onUpload={upload}
        uploads={[{ id: "u", name: "video.mp4", size: 52000000, progress: 40, part: 3, parts: 8 }]}
      />,
    );
    expect(screen.getByText("This folder is empty")).toBeTruthy();
    expect(screen.getByText(/Part 3 of 8 · 40%/)).toBeTruthy();
    const file = new File(["x"], "a.txt", { type: "text/plain" });
    fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, {
      target: { files: [file] },
    });
    expect(upload).toHaveBeenCalledWith([file]);
  });

  it("speaks German through messages", () => {
    render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{
          newFolder: "Neuer Ordner",
          upload: "Hochladen",
          itemsN: (n) => `${n} Einträge`,
        }}
      >
        <FileBrowser items={ITEMS} onCreateFolder={() => {}} onUpload={() => {}} />
      </UIProvider>,
    );
    expect(screen.getByText("Neuer Ordner")).toBeTruthy();
    expect(screen.getByText("Hochladen")).toBeTruthy();
    expect(screen.getAllByText("4 Einträge").length).toBe(2);
    expect(screen.getByText(/412 kB/)).toBeTruthy();
    expect(screen.queryByText("New folder")).toBeNull();
  });
});

describe("InvoiceEditor", () => {
  const start: InvoiceDraft = {
    customer: "n",
    lines: [
      { id: "1", description: "Team plan", quantity: 40, price: 24, vat: 19 },
      { id: "2", description: "Workshop", quantity: 1, price: 650, vat: 7 },
    ],
  };
  it("computes totals per rate and updates the preview", () => {
    const change = vi.fn();
    render(
      <InvoiceEditor
        defaultValue={start}
        onChange={change}
        customers={[{ id: "n", name: "Northwind" }]}
        preview={{ number: 2097 }}
      />,
    );
    const totals = screen.getByLabelText("Totals");
    expect(within(totals).getByText("VAT 19% on €960.00")).toBeTruthy();
    expect(within(totals).getByText("€1,837.90")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "Qty 1" }), { target: { value: "10" } });
    expect(change).toHaveBeenLastCalledWith(
      expect.objectContaining({
        lines: [expect.objectContaining({ quantity: 10 }), start.lines[1]],
      }),
    );
    expect(within(totals).getByText("€981.10")).toBeTruthy();
    expect(screen.getAllByText("Northwind").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Add line" }));
    expect(screen.getByRole("textbox", { name: "Description 3" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Remove line 3" }));
    expect(screen.queryByRole("textbox", { name: "Description 3" })).toBeNull();
  });

  it("reads German decimals and writes German money", () => {
    render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{
          invoiceQuantity: "Menge",
          total: "Gesamt",
          invoiceAddLine: "Position hinzufügen",
        }}
      >
        <InvoiceEditor defaultValue={start} preview={false} />
      </UIProvider>,
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Menge 2" }), {
      target: { value: "1,5" },
    });
    expect(screen.getByText("Gesamt")).toBeTruthy();
    expect(screen.getByText(/^2\.185,65\s€$/)).toBeTruthy();
    expect(screen.getByText("Position hinzufügen")).toBeTruthy();
    expect(screen.queryByText("Add line")).toBeNull();
  });
});

describe("ImportSuggestions", () => {
  const lines = [
    {
      id: "1",
      date: "2026-10-02",
      text: "AWS EMEA 1002",
      counterparty: "Amazon Web Services",
      amount: -412.3,
      suggestion: { category: "Hosting", booking: "4930 ← 1200", confidence: 0.94 },
    },
    {
      id: "2",
      date: "2026-10-03",
      text: "Payout",
      amount: 2318.4,
      suggestion: { category: "Revenue" },
    },
    { id: "3", date: "2026-10-03", text: "Payout", amount: 2318.4, state: "duplicate" as const },
    { id: "4", date: "2026-10-04", text: "Coffee", amount: -4.2 },
  ];
  it("preselects suggestions and confirms the selection in one step", async () => {
    let done: () => void = () => {};
    const confirm = vi.fn(() => new Promise<void>((r) => (done = r)));
    render(<ImportSuggestions lines={lines} onConfirm={confirm} />);
    expect(screen.getByText("2 selected")).toBeTruthy();
    expect(screen.getByText("94% sure")).toBeTruthy();
    const payouts = screen.getAllByRole("checkbox", {
      name: "Select Payout",
    }) as HTMLInputElement[];
    expect(payouts.map((c) => [c.checked, c.disabled])).toEqual([
      [true, false],
      [false, true],
    ]);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all" }));
    expect(screen.getByText("3 selected")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Book 3 lines" }));
    expect(confirm).toHaveBeenCalledWith(["1", "2", "4"]);
    expect(screen.getByRole("button", { name: "Booking…" })).toHaveProperty("disabled", true);
    await act(async () => done());
    expect(screen.getByRole("button", { name: "Book 3 lines" })).toBeTruthy();
  });
});

describe("PeriodLock", () => {
  it("locks after the confirmation and waits for the promise", async () => {
    let done: () => void = () => {};
    const lock = vi.fn(() => new Promise<void>((r) => (done = r)));
    const changed = vi.fn();
    render(<PeriodLock period="October 2026" onLock={lock} onLockedChange={changed} stepUp />);
    expect(screen.getByText("Open")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Lock" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm with passkey" }));
    expect(lock).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Working…" })).toBeTruthy();
    await act(async () => done());
    expect(changed).toHaveBeenCalledWith(true);
    expect(screen.getByText("Locked")).toBeTruthy();
  });
  it("formats the month in German", () => {
    render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{ periodOpen: "Offen", periodLock: "Sperren" }}
      >
        <PeriodLock month="2026-10-15" />
      </UIProvider>,
    );
    expect(screen.getByText("Oktober 2026")).toBeTruthy();
    expect(screen.getByText("Offen")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sperren" })).toBeTruthy();
  });
});

describe("ExportDialog (accounting)", () => {
  it("shows the pre-check, keeps Export off while settings are missing and passes the lock", () => {
    const exp = vi.fn();
    const { rerender } = render(
      <ExportDialog
        inline
        title="DATEV export"
        formats={["DATEV"]}
        ranges={false}
        check={{ count: 128, sum: 48210.5, drafts: 2 }}
        missing={[{ label: "Consultant number", href: "/settings/datev" }]}
        lockPeriod
        onExport={exp}
      />,
    );
    expect(screen.getByText("128 bookings")).toBeTruthy();
    expect(screen.getByText("€48,210.50")).toBeTruthy();
    expect(screen.getByText("2 drafts are left out")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Fix" }).getAttribute("href")).toBe("/settings/datev");
    expect(screen.getByRole("button", { name: "Export" })).toHaveProperty("disabled", true);
    rerender(
      <ExportDialog
        inline
        title="DATEV export"
        formats={["DATEV"]}
        ranges={false}
        check={{ count: 128, sum: 48210.5 }}
        lockPeriod
        onExport={exp}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Export" }));
    expect(exp).toHaveBeenCalledWith(
      expect.objectContaining({ format: "DATEV", lock: true }),
      expect.any(Function),
    );
  });
});

describe("PaletteSwatches", () => {
  it("shows HEX, OKLCH and the WCAG contrast on light and dark", () => {
    render(<PaletteSwatches colors={[{ name: "Ink", value: "#111114", role: "Text" }]} />);
    expect(screen.getByText("#111114")).toBeTruthy();
    expect(screen.getByText(/^oklch\(/)).toBeTruthy();
    expect(screen.getByText("AAA")).toBeTruthy();
    expect(screen.getByText("Fails")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copy HEX #111114" })).toBeTruthy();
  });
});

describe("AssetCard", () => {
  const versions = [
    { id: "v1", src: "/a1.png", prompt: "A mug on a desk" },
    { id: "v2", src: "/a2.png", prompt: "A mug on a shelf", downloadHref: "/a2.png" },
  ];
  it("steps through versions, makes one current and regenerates with a prompt", () => {
    const current = vi.fn();
    const regen = vi.fn();
    render(
      <AssetCard
        title="Mug mockup"
        versions={versions}
        current={1}
        watermark
        onMakeCurrent={current}
        onRegenerate={regen}
      />,
    );
    expect(screen.getByLabelText("Version 2 of 2")).toBeTruthy();
    expect(screen.getByText("Watermark")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Download version 2" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Previous version" }));
    expect(screen.getByLabelText("Version 1 of 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Make current" }));
    expect(current).toHaveBeenCalledWith(0);
    fireEvent.click(screen.getByRole("button", { name: "Regenerate" }));
    const field = screen.getByRole("textbox", { name: "Prompt" });
    expect((field as HTMLTextAreaElement).value).toBe("A mug on a desk");
    fireEvent.change(field, { target: { value: "A mug in the sun" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate" }));
    expect(regen).toHaveBeenCalledWith("A mug in the sun");
  });
  it("shows the generating state", () => {
    render(<AssetCard title="Logo" versions={[{ id: "1" }]} state="generating" />);
    expect(screen.getAllByText("Generating").length).toBeGreaterThan(0);
  });
});
