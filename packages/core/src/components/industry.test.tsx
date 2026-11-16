// @vitest-environment jsdom
/** Industry CRM: buyer matching, viewings, conflict checks. */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConflictCheck, MatchList, ViewingList } from "./industry.js";

afterEach(cleanup);

describe("industry CRM components", () => {
  it("MatchList sorts by score, says what is missed and contacts", () => {
    const contact = vi.fn();
    render(
      <MatchList
        contactLabel="Send exposé"
        onContact={contact}
        matches={[
          { id: "a", name: "Stein", score: 61, criteria: [{ label: "Balcony", met: false }] },
          {
            id: "b",
            name: "Kaya",
            score: 94,
            criteria: [
              { label: "3+ rooms", met: true },
              { label: "Lift", met: false },
            ],
          },
        ]}
      />,
    );
    const rows = within(screen.getByRole("list", { name: "Matches" })).getAllByRole("listitem");
    expect(rows[0]!.textContent).toContain("Kaya");
    expect(screen.getByText("94% match")).toBeTruthy();
    expect(screen.getByText("1 of 2 criteria")).toBeTruthy();
    expect(screen.getAllByText(/not met/)).toHaveLength(2);
    fireEvent.click(screen.getAllByRole("button", { name: "Send exposé" })[0]!);
    expect(contact).toHaveBeenCalledWith("b");
  });

  it("ViewingList orders by date and offers the next step", () => {
    const confirm = vi.fn();
    const feedback = vi.fn();
    render(
      <ViewingList
        onConfirm={confirm}
        onFeedback={feedback}
        viewings={[
          {
            id: "2",
            at: new Date(2026, 10, 19, 18),
            name: "Brenner",
            state: "requested",
            attendees: 2,
          },
          {
            id: "1",
            at: new Date(2026, 10, 12, 17),
            name: "Stein",
            state: "done",
            feedback: { rating: 4 },
          },
          { id: "3", at: new Date(2026, 10, 14, 11), name: "Weber", state: "done" },
        ]}
      />,
    );
    const rows = screen.getAllByRole("listitem");
    expect(rows.map((r) => within(r).getByText(/Brenner|Stein|Weber/).textContent)).toEqual([
      "Stein",
      "Weber",
      "Brenner",
    ]);
    expect(screen.getByRole("img", { name: "Rated 4 of 5" })).toBeTruthy();
    expect(screen.getByText(/2 people/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(confirm).toHaveBeenCalledWith("2");
    expect(screen.getAllByRole("button", { name: "Add feedback" })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Add feedback" }));
    expect(feedback).toHaveBeenCalledWith("3");
  });

  it("ConflictCheck summarises hits, lists conflicts first and records the decision", () => {
    const decide = vi.fn();
    const { rerender } = render(
      <ConflictCheck
        parties={["Hartmann", "Elbe Logistik"]}
        checkedAt={new Date(2026, 10, 16, 9, 30)}
        onDecide={decide}
        hits={[
          { id: "1", party: "Kai Petersen", role: "Opposing party", level: "possible" },
          { id: "2", party: "Elbe Logistik", role: "Former client", level: "conflict" },
        ]}
      />,
    );
    expect(screen.getByText("1 conflict, 1 possible")).toBeTruthy();
    const hits = screen.getAllByRole("listitem").filter((li) => li.className.startsWith("is-"));
    expect(hits[0]!.textContent).toContain("Former client");
    fireEvent.click(screen.getByRole("button", { name: "Decline matter" }));
    expect(decide).toHaveBeenCalledWith("declined");
    rerender(
      <ConflictCheck
        parties={["Velo Werk"]}
        hits={[]}
        checkedAt={new Date(2026, 10, 16)}
        decision="cleared"
      />,
    );
    expect(screen.getByText("No conflicts found")).toBeTruthy();
    expect(screen.getByText("Cleared to proceed")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
