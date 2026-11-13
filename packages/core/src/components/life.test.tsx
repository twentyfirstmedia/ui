// @vitest-environment jsdom
/** Life components: habits, mood, vitals, rings, sleep, medication, journal, goals, insights, consent. */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ActivityRings,
  ConsentList,
  GoalCard,
  HabitTracker,
  InsightCard,
  JournalEntry,
  MedicationList,
  MoodPicker,
  SleepChart,
  VitalTile,
} from "./life.js";

afterEach(cleanup);

describe("life components", () => {
  it("HabitTracker names past days and toggles today", () => {
    const toggle = vi.fn();
    render(
      <HabitTracker
        dayLabels={["Mon", "Tue", "Wed"]}
        onToggle={toggle}
        habits={[
          { id: "walk", label: "Walk", days: [true, false, null], streak: 4, goal: "20 min" },
        ]}
      />,
    );
    const list = screen.getByRole("list", { name: "Habits" });
    expect(within(list).getByRole("img", { name: "Mon Done" })).toBeTruthy();
    expect(within(list).getByRole("img", { name: "Tue Missed" })).toBeTruthy();
    expect(screen.getByText("4-day streak")).toBeTruthy();
    const today = screen.getByRole("button", { name: "Mark Walk done today" });
    expect(today.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(today);
    expect(toggle).toHaveBeenCalledWith("walk", true);
  });

  it("MoodPicker is a radio group with words, also when compact", () => {
    const change = vi.fn();
    const { rerender } = render(<MoodPicker onChange={change} />);
    expect(screen.getByRole("group", { name: "How are you feeling?" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: /Good/ }));
    expect(change).toHaveBeenCalledWith(4);
    rerender(<MoodPicker compact value={2} />);
    expect((screen.getByRole("radio", { name: "Low" }) as HTMLInputElement).checked).toBe(true);
  });

  it("VitalTile says whether the value is in its range", () => {
    const { rerender } = render(
      <VitalTile label="Pulse" value={58} unit="bpm" normal={[50, 80]} />,
    );
    expect(screen.getByText("In range")).toBeTruthy();
    expect(screen.getByText("Normal 50–80")).toBeTruthy();
    rerender(<VitalTile label="Pulse" value={92} unit="bpm" normal={[50, 80]} />);
    expect(screen.getByText("Above range")).toBeTruthy();
    rerender(<VitalTile label="Weight" value={74.25} digits={1} unit="kg" />);
    expect(screen.getByText("74.3")).toBeTruthy();
    expect(screen.queryByText(/range/)).toBeNull();
  });

  it("ActivityRings describe every ring", () => {
    render(
      <ActivityRings
        rings={[
          { label: "Move", value: 420, goal: 600, unit: "kcal" },
          { label: "Stand", value: 9, goal: 12, unit: "h" },
        ]}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Activity: Move 420 of 600 kcal, Stand 9 of 12 h" }),
    ).toBeTruthy();
  });

  it("SleepChart totals the stages", () => {
    const t0 = new Date(2026, 10, 12, 23, 0).getTime();
    const m = 60000;
    render(
      <SleepChart
        segments={[
          { stage: "light", start: t0, end: t0 + 60 * m },
          { stage: "deep", start: t0 + 60 * m, end: t0 + 150 * m },
          { stage: "awake", start: t0 + 150 * m, end: t0 + 160 * m },
        ]}
      />,
    );
    expect(screen.getByText("Asleep 2 h 30 min")).toBeTruthy();
    expect(screen.getByRole("img").getAttribute("aria-label")).toContain("Deep 1 h 30 min");
  });

  it("MedicationList shows statuses in words and marks a dose taken", () => {
    const take = vi.fn();
    render(
      <MedicationList
        onTake={take}
        items={[
          { id: "a", name: "Vitamin D", time: "07:30", status: "taken" },
          { id: "b", name: "Ramipril", dose: "5 mg", time: "13:00", status: "due" },
          { id: "c", name: "Magnesium", time: "22:00", status: "upcoming" },
        ]}
      />,
    );
    expect(screen.getByText("Taken")).toBeTruthy();
    expect(screen.getByText("Due")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Mark Magnesium as taken" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Mark Ramipril as taken" }));
    expect(take).toHaveBeenCalledWith("b");
  });

  it("JournalEntry and GoalCard show date, mood and progress", () => {
    render(
      <>
        <JournalEntry date={new Date(2026, 10, 12)} mood={4} title="Good walk" tags={["Walk"]}>
          Text
        </JournalEntry>
        <GoalCard
          title="Fund"
          value={3100}
          target={5000}
          format="money"
          due={new Date(2027, 5, 1)}
        />
      </>,
    );
    expect(screen.getByText("Thursday, November 12")).toBeTruthy();
    expect(screen.getByText("Good")).toBeTruthy();
    const bar = screen.getByRole("progressbar", { name: "Fund" });
    expect(bar.getAttribute("aria-valuenow")).toBe("62");
    expect(bar.getAttribute("aria-valuetext")).toBe("€3,100 of €5,000");
    expect(screen.getByText("By Jun 2027")).toBeTruthy();
  });

  it("InsightCard folds out its reason and runs its actions", () => {
    const accept = vi.fn();
    const dismiss = vi.fn();
    render(
      <InsightCard
        title="Bill went up"
        why="Debit rose from €84 to €99."
        sources={[{ title: "Bank" }]}
        acceptLabel="Compare"
        onAccept={accept}
        onDismiss={dismiss}
      >
        Save €140 a year.
      </InsightCard>,
    );
    expect(screen.getByRole("region", { name: "Bill went up" })).toBeTruthy();
    expect(screen.queryByText("Debit rose from €84 to €99.")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Why am I seeing this/ }));
    expect(screen.getByText("Debit rose from €84 to €99.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Compare" }));
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(accept).toHaveBeenCalled();
    expect(dismiss).toHaveBeenCalled();
  });

  it("ConsentList switches scopes, keeps required ones and revokes", () => {
    const change = vi.fn();
    const revoke = vi.fn();
    render(
      <ConsentList
        onScopeChange={change}
        onRevoke={revoke}
        connectors={[
          {
            id: "bank",
            name: "Bank",
            scopes: [
              { id: "bal", label: "Balances", granted: true, required: true },
              { id: "tx", label: "Transactions", granted: false },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByRole("list", { name: "Data access" })).toBeTruthy();
    expect(screen.getByText("Required")).toBeTruthy();
    expect(screen.getByText("Not used yet")).toBeTruthy();
    fireEvent.click(screen.getByRole("switch", { name: "Bank: Transactions" }));
    expect(change).toHaveBeenCalledWith("bank", "tx", true);
    fireEvent.click(screen.getByRole("button", { name: "Revoke access" }));
    expect(revoke).toHaveBeenCalledWith("bank");
  });
});
