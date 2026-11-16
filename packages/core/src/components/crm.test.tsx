// @vitest-environment jsdom
/** CRM: record header, fields, timeline, deals and pipeline, tasks, lead score, merge, import. */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DealCard,
  ImportMapper,
  LeadScore,
  MergeRecords,
  Pipeline,
  PropertyList,
  RecordHeader,
  RecordTimeline,
  TaskList,
} from "./crm.js";

afterEach(cleanup);
const now = new Date(2026, 10, 16, 9, 30);

describe("CRM components", () => {
  it("RecordHeader shows status, owner, facts and runs its actions", () => {
    const email = vi.fn();
    render(
      <RecordHeader
        title="Lena Hartmann"
        subtitle="Head of Operations"
        status={{ label: "Customer", tone: "success" }}
        owner="Mara Ellis"
        actions={[{ label: "Email", icon: "mail", primary: true, onClick: email }]}
        facts={[{ label: "Open deals", value: "€78,000" }]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Lena Hartmann" })).toBeTruthy();
    expect(screen.getByText("Customer")).toBeTruthy();
    expect(screen.getByText("Owner Mara Ellis")).toBeTruthy();
    expect(screen.getByText("€78,000")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Email" }));
    expect(email).toHaveBeenCalled();
  });

  it("PropertyList formats by type and edits in place", () => {
    const change = vi.fn();
    render(
      <PropertyList
        onChange={change}
        fields={[
          { id: "email", label: "Email", type: "email", value: "lena@example.com" },
          { id: "value", label: "Value", type: "money", value: 42000 },
          { id: "phone", label: "Phone", type: "phone", value: "" },
          { id: "id", label: "ID", value: "C-17", readOnly: true },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "lena@example.com" }).getAttribute("href")).toBe(
      "mailto:lena@example.com",
    );
    expect(screen.getByText(/€42,000/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Edit ID" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Edit Phone" }));
    const input = screen.getByRole("textbox", { name: "Phone" });
    fireEvent.change(input, { target: { value: "+49 40 1234" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(change).toHaveBeenCalledWith("phone", "+49 40 1234");
    fireEvent.click(screen.getByRole("button", { name: "Edit Email" }));
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Email" }), { key: "Escape" });
    expect(change).toHaveBeenCalledTimes(1);
  });

  it("RecordTimeline groups by day, keeps pinned on top, filters and adds", () => {
    const add = vi.fn();
    render(
      <RecordTimeline
        now={now}
        onAdd={add}
        entries={[
          { id: "1", type: "note", title: "Prefers calls", at: new Date(2026, 9, 1), pinned: true },
          { id: "2", type: "email", title: "Proposal sent", at: new Date(2026, 10, 16, 8) },
          { id: "3", type: "call", title: "Intro call", at: new Date(2026, 10, 15, 14) },
        ]}
      />,
    );
    expect(screen.getByRole("region", { name: "Pinned" })).toBeTruthy();
    expect(
      within(screen.getByRole("region", { name: "Today" })).getByText("Proposal sent"),
    ).toBeTruthy();
    expect(
      within(screen.getByRole("region", { name: "Yesterday" })).getByText("Intro call"),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Call" }));
    expect(screen.queryByText("Proposal sent")).toBeNull();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Call back Friday" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(add).toHaveBeenCalledWith("note", "Call back Friday");
  });

  it("DealCard marks stale deals and moves through its menu", () => {
    const move = vi.fn();
    render(
      <DealCard
        deal={{
          id: "d1",
          title: "Renewal",
          value: 36000,
          probability: 80,
          daysInStage: 21,
          next: "Send contract",
        }}
        stages={[
          { id: "a", label: "Proposal" },
          { id: "b", label: "Won" },
        ]}
        onMove={move}
      />,
    );
    expect(screen.getByText(/Stale/)).toBeTruthy();
    expect(screen.getByText("Next: Send contract")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Move Renewal" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Won" }));
    expect(move).toHaveBeenCalledWith("d1", "b");
  });

  it("Pipeline sums each stage and weights it by probability", () => {
    render(
      <Pipeline
        stages={[
          {
            id: "p",
            label: "Proposal",
            probability: 50,
            deals: [
              { id: "1", title: "A", value: 10000 },
              { id: "2", title: "B", value: 30000 },
            ],
          },
          { id: "w", label: "Won", probability: 100, deals: [] },
        ]}
      />,
    );
    const stage = screen.getByRole("listitem", { name: "Proposal" });
    expect(within(stage).getByText("2 deals")).toBeTruthy();
    expect(within(stage).getByText(/€40,000.*€20,000 weighted/)).toBeTruthy();
    expect(within(screen.getByRole("listitem", { name: "Won" })).getByText("0 deals")).toBeTruthy();
  });

  it("TaskList groups by due date and completes tasks", () => {
    const toggle = vi.fn();
    render(
      <TaskList
        today={now}
        onToggle={toggle}
        tasks={[
          { id: "1", title: "Late", due: new Date(2026, 10, 12) },
          { id: "2", title: "Now", due: now, priority: "high" },
          { id: "3", title: "Later", due: new Date(2026, 10, 20) },
          { id: "4", title: "Someday" },
          { id: "5", title: "Done one", done: true },
        ]}
      />,
    );
    expect(within(screen.getByRole("region", { name: "Overdue" })).getByText("Late")).toBeTruthy();
    expect(within(screen.getByRole("region", { name: "Today" })).getByText("Now")).toBeTruthy();
    expect(
      within(screen.getByRole("region", { name: "Upcoming" })).getByText("Later"),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox", { name: "Complete Now" }));
    expect(toggle).toHaveBeenCalledWith("2", true);
  });

  it("LeadScore grades and explains", () => {
    const { rerender } = render(<LeadScore score={86} />);
    expect(screen.getByRole("img", { name: "Lead score 86 Hot" })).toBeTruthy();
    rerender(<LeadScore score={20} reasons={[{ text: "No reply in 30 days", points: -10 }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Lead score 20 Cold" }));
    expect(screen.getByText("No reply in 30 days")).toBeTruthy();
  });

  it("MergeRecords picks a value per differing field and merges", () => {
    const merge = vi.fn();
    render(
      <MergeRecords
        onMerge={merge}
        fields={[
          { id: "name", label: "Name" },
          { id: "phone", label: "Phone" },
        ]}
        records={[
          { id: "a", title: "Record A", values: { name: "Nordhafen", phone: "040 1" } },
          { id: "b", title: "Record B", values: { name: "Nordhafen", phone: "040 2" } },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "Keep Phone from Record B" }));
    fireEvent.click(screen.getByRole("button", { name: "Merge records" }));
    expect(merge).toHaveBeenCalledWith(expect.objectContaining({ phone: "b" }));
  });

  it("ImportMapper says what is missing and maps columns", () => {
    const change = vi.fn();
    const props = {
      columns: [
        { name: "E-Mail", samples: ["a@example.com"] },
        { name: "Firma", samples: ["Nordhafen"] },
      ],
      fields: [
        { id: "email", label: "Email", required: true },
        { id: "company", label: "Company" },
      ],
      onChange: change,
      rows: 1204,
      problems: [{ row: 12, message: "invalid email" }],
    };
    const { rerender } = render(<ImportMapper {...props} mapping={{}} />);
    expect(screen.getByText("Still to map: Email")).toBeTruthy();
    expect(screen.getByText("1,204 rows")).toBeTruthy();
    expect(screen.getByText("Row 12: invalid email")).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", { name: "Import as: E-Mail" }), {
      target: { value: "email" },
    });
    expect(change).toHaveBeenCalledWith({ "E-Mail": "email" });
    rerender(<ImportMapper {...props} mapping={{ "E-Mail": "email" }} />);
    expect(screen.getByText("Ready to import")).toBeTruthy();
  });
});
