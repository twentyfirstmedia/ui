// @vitest-environment jsdom
/** Money, insurance, deadlines and documents. */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BudgetList,
  ClaimTimeline,
  CoverageMatrix,
  DeadlineList,
  DocumentList,
  NetWorthCard,
  PolicyCard,
  SubscriptionList,
} from "./household.js";

afterEach(cleanup);
const today = new Date(2026, 10, 13);

describe("household components", () => {
  it("BudgetList says what is left or over and selects a category", () => {
    const pick = vi.fn();
    render(
      <BudgetList
        onSelect={pick}
        categories={[
          { id: "a", label: "Groceries", spent: 312, limit: 450 },
          { id: "b", label: "Fun", spent: 142, limit: 100 },
        ]}
      />,
    );
    expect(screen.getByText("€138 left")).toBeTruthy();
    expect(screen.getByText("€42 over")).toBeTruthy();
    expect(screen.getByRole("progressbar", { name: "Fun" }).getAttribute("aria-valuenow")).toBe(
      "100",
    );
    fireEvent.click(screen.getByRole("button", { name: /Groceries/ }));
    expect(pick).toHaveBeenCalledWith("a");
  });

  it("SubscriptionList totals active items per month and year", () => {
    const manage = vi.fn();
    render(
      <SubscriptionList
        onManage={manage}
        items={[
          { id: "m", name: "Music", amount: 10, period: "month" },
          { id: "c", name: "Cloud", amount: 120, period: "year" },
          { id: "x", name: "Old", amount: 50, period: "month", status: "cancelled" },
        ]}
      />,
    );
    expect(screen.getByText("€20.00 a month")).toBeTruthy();
    expect(screen.getByText("€240 a year")).toBeTruthy();
    expect(screen.getByText("Cancelled")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Manage Music" }));
    expect(manage).toHaveBeenCalledWith("m");
  });

  it("NetWorthCard subtracts liabilities from assets", () => {
    render(
      <NetWorthCard
        assets={[{ label: "Savings", value: 10000 }]}
        liabilities={[{ label: "Loan", value: 2500 }]}
        change={-300}
        changeLabel="since October"
      />,
    );
    expect(screen.getByText("€7,500")).toBeTruthy();
    expect(screen.getByText("-€300")).toBeTruthy();
  });

  it("DeadlineList counts days from today, sorts and marks done", () => {
    const done = vi.fn();
    const { container } = render(
      <DeadlineList
        today={today}
        onDone={done}
        items={[
          { id: "late", title: "Tax return", date: new Date(2026, 10, 10) },
          { id: "now", title: "Inspection", date: new Date(2026, 10, 13) },
          { id: "soon", title: "Cancel gym", date: new Date(2026, 10, 14) },
          { id: "far", title: "Passport", date: new Date(2027, 1, 14) },
        ]}
      />,
    );
    expect(screen.getByText("Overdue by 3 days")).toBeTruthy();
    expect(screen.getByText("Today")).toBeTruthy();
    expect(screen.getByText("Tomorrow")).toBeTruthy();
    expect(screen.getByText("In 93 days")).toBeTruthy();
    expect(container.querySelector(".tf-deadline")?.className).toContain("is-overdue");
    fireEvent.click(screen.getByRole("button", { name: "Mark Inspection done" }));
    expect(done).toHaveBeenCalledWith("now");
  });

  it("PolicyCard masks the number and names the status", () => {
    render(
      <PolicyCard
        type="Household contents"
        insurer="Nordhafen"
        coverage={65000}
        premium={{ amount: 9.8, period: "month" }}
        policyNumber="HR-2207-551938"
        maskNumber
        status="expiring"
        renews={new Date(2027, 2, 1)}
      />,
    );
    expect(screen.getByText("•••• 1938")).toBeTruthy();
    expect(screen.getByText("Expiring")).toBeTruthy();
    expect(screen.getByText("€65,000")).toBeTruthy();
    expect(screen.getByText("Renews Mar 1, 2027")).toBeTruthy();
  });

  it("CoverageMatrix is a captioned table with words for each status", () => {
    render(
      <CoverageMatrix
        rows={[
          { id: "a", risk: "Liability", status: "covered" },
          { id: "b", risk: "Bike theft", status: "partial" },
          { id: "c", risk: "Unable to work", status: "none" },
        ]}
      />,
    );
    const table = screen.getByRole("table", { name: "Coverage" });
    expect(table.textContent).toContain("Not covered");
    expect(screen.getByRole("rowheader", { name: /Bike theft/ })).toBeTruthy();
  });

  it("ClaimTimeline marks the current step", () => {
    render(
      <ClaimTimeline
        title="Water damage"
        amount={2340}
        steps={[
          { label: "Reported", state: "done", date: new Date(2026, 9, 28) },
          { label: "Decision", state: "current" },
        ]}
      />,
    );
    expect(screen.getByText("Decision").closest("li")?.getAttribute("aria-current")).toBe("step");
    expect(document.querySelector(".tf-claim-amount")?.textContent).toBe("Claimed€2,340");
  });

  it("DocumentList flags expired and expiring documents", () => {
    const open = vi.fn();
    render(
      <DocumentList
        today={today}
        onOpen={open}
        documents={[
          { id: "a", title: "Passport", expires: new Date(2026, 11, 2) },
          { id: "b", title: "Licence", expires: new Date(2026, 9, 1) },
          { id: "c", title: "ID card", expires: new Date(2031, 4, 1) },
        ]}
      />,
    );
    expect(screen.getByText("Expires in 19 days")).toBeTruthy();
    expect(screen.getByText("Expired")).toBeTruthy();
    expect(screen.getByText("Valid until May 2031")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Passport/ }));
    expect(open).toHaveBeenCalledWith("a");
  });
});
