// @vitest-environment jsdom
/** Sales and agency: quote, signatures, sequence, forecast, call, booking, time, timesheet, Gantt. */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BookingSlots,
  CallPanel,
  Forecast,
  Gantt,
  QuoteBuilder,
  SequenceSteps,
  SignatureStatus,
  TimeTracker,
  Timesheet,
} from "./sales.js";

afterEach(cleanup);
const now = new Date(2026, 10, 16, 9, 30);

describe("sales and agency components", () => {
  it("QuoteBuilder adds up lines, discounts, optional extras and VAT", () => {
    const change = vi.fn();
    const lines = [
      { id: "a", name: "Design", quantity: 10, unitPrice: 100 },
      { id: "b", name: "Build", quantity: 10, unitPrice: 100, discount: 10 },
      { id: "c", name: "Care", quantity: 1, unitPrice: 500, optional: true },
    ];
    render(<QuoteBuilder lines={lines} taxRate={19} onChange={change} />);
    expect(screen.getByText("Subtotal").nextSibling?.textContent).toBe("€2,000");
    expect(screen.getByText("Discounts").nextSibling?.textContent).toBe("−€100");
    expect(screen.getByText("VAT 19%").nextSibling?.textContent).toBe("€361");
    expect(screen.getAllByText("Total").at(-1)!.nextSibling?.textContent).toBe("€2,261");
    fireEvent.click(screen.getByRole("checkbox", { name: "Include Care" }));
    expect(change).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: "c", selected: true })]),
    );
    fireEvent.change(screen.getByRole("spinbutton", { name: "Qty of Design" }), {
      target: { value: "12" },
    });
    expect(change).toHaveBeenLastCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: "a", quantity: 12 })]),
    );
  });

  it("SignatureStatus counts signers and reminds the ones who have it", () => {
    const remind = vi.fn();
    render(
      <SignatureStatus
        document="Agreement.pdf"
        ordered
        onRemind={remind}
        signers={[
          { id: "1", name: "Mara", state: "signed" },
          { id: "2", name: "Lena", state: "viewed" },
          { id: "3", name: "Henrik", state: "waiting" },
        ]}
      />,
    );
    expect(screen.getByRole("progressbar", { name: "1 of 3 signed" })).toBeTruthy();
    expect(screen.getByText("Viewed")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Remind Henrik" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Remind Lena" }));
    expect(remind).toHaveBeenCalledWith("2");
  });

  it("SequenceSteps shows days once and rates in words", () => {
    const select = vi.fn();
    render(
      <SequenceSteps
        onSelect={select}
        steps={[
          {
            id: "1",
            day: 1,
            type: "email",
            title: "Intro",
            stats: { sent: 200, opened: 96, replied: 20 },
          },
          { id: "2", day: 1, type: "call", title: "Call" },
          { id: "3", day: 4, type: "wait", title: "Wait" },
        ]}
      />,
    );
    expect(screen.getAllByText("Day 1")).toHaveLength(1);
    expect(screen.getByText("48% opened")).toBeTruthy();
    expect(screen.getByText("10% replied")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Call/ }));
    expect(select).toHaveBeenCalledWith("2");
  });

  it("Forecast shows attainment, the gap and a total row", () => {
    render(
      <Forecast
        rows={[
          { id: "a", name: "Mara", quota: 100000, won: 80000, commit: 10000, bestCase: 5000 },
          { id: "b", name: "Lea", quota: 50000, won: 60000, commit: 0, bestCase: 0 },
        ]}
      />,
    );
    expect(screen.getByText(/80% of quota · €20,000 to go/)).toBeTruthy();
    expect(screen.getByText(/120% of quota · €10,000 over quota/)).toBeTruthy();
    expect(screen.getByText("Total")).toBeTruthy();
    expect(
      screen.getByRole("img", {
        name: /Won €80,000, Commit €10,000, Best case €5,000, Quota €100,000/,
      }),
    ).toBeTruthy();
  });

  it("CallPanel shows the timer and toggles with fixed labels", () => {
    const mute = vi.fn();
    const end = vi.fn();
    render(
      <CallPanel
        name="Lena"
        state="active"
        startedAt={new Date(now.getTime() - 125000)}
        now={now}
        onMute={mute}
        onEnd={end}
      />,
    );
    expect(screen.getByText("2:05")).toBeTruthy();
    const btn = screen.getByRole("button", { name: "Mute" });
    expect(btn.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(btn);
    expect(mute).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole("button", { name: "End call" }));
    expect(end).toHaveBeenCalled();
  });

  it("BookingSlots picks a day and a time", () => {
    const change = vi.fn();
    render(
      <BookingSlots
        onChange={change}
        days={[
          { date: new Date(2026, 10, 17), slots: [] },
          { date: new Date(2026, 10, 18), slots: ["09:00", "10:30"] },
        ]}
      />,
    );
    const days = within(screen.getByRole("group", { name: "Day" })).getAllByRole("button");
    expect((days[0] as HTMLButtonElement).disabled).toBe(true);
    expect(days[1]!.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "10:30" }));
    expect(change).toHaveBeenCalledWith({ date: new Date(2026, 10, 18), time: "10:30" });
  });

  it("TimeTracker runs a clock and sums today's entries", () => {
    const stop = vi.fn();
    render(
      <TimeTracker
        running
        startedAt={new Date(now.getTime() - 60000 * 15)}
        now={now}
        onStop={stop}
        entries={[{ id: "1", project: "A", minutes: 90 }]}
      />,
    );
    expect(screen.getByRole("timer").textContent).toBe("15:00");
    expect(screen.getByText("Today 1:45")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));
    expect(stop).toHaveBeenCalled();
  });

  it("Timesheet totals rows and days and edits a cell", () => {
    const change = vi.fn();
    render(
      <Timesheet
        weekStart={new Date(2026, 10, 16)}
        target={8}
        onChange={change}
        rows={[
          { id: "a", project: "Nordhafen", hours: [4, 6, 0, 0, 0, 0, 0] },
          { id: "b", project: "Velo", hours: [4, 1, 0, 0, 0, 0, 0] },
        ]}
      />,
    );
    const foot = screen.getAllByRole("row").at(-1)!;
    expect(
      within(foot)
        .getAllByRole("cell")
        .map((c) => c.textContent),
    ).toEqual(["8", "7Below 8", "Below 8", "Below 8", "Below 8", "", "", "15"]);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Hours for Velo on Tuesday" }), {
      target: { value: "2.5" },
    });
    expect(change).toHaveBeenCalledWith("b", 1, 2.5);
  });

  it("Gantt reads out ranges, progress and milestones", () => {
    const open = vi.fn();
    render(
      <Gantt
        today={new Date(2026, 10, 16)}
        onOpen={open}
        tasks={[
          {
            id: "1",
            name: "Design",
            start: new Date(2026, 10, 9),
            end: new Date(2026, 10, 20),
            progress: 70,
          },
          { id: "2", name: "Launch", start: new Date(2026, 11, 14), milestone: true },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Design, Nov 9 to Nov 20, 70% done" }));
    expect(open).toHaveBeenCalledWith("1");
    expect(screen.getByRole("button", { name: "Launch, milestone on Dec 14" })).toBeTruthy();
    expect(screen.getByText("Today")).toBeTruthy();
  });
});
