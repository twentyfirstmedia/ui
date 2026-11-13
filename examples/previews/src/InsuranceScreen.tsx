import type * as React from "react";
import {
  AppShell,
  Button,
  ClaimTimeline,
  CoverageMatrix,
  DeadlineList,
  PageHeader,
  Panel,
  PolicyCard,
  Stagger,
} from "@twentyfirstmedia/ui-core";
import type { SidebarGroup } from "@twentyfirstmedia/ui-core";

const NAV: SidebarGroup[] = [
  {
    items: [
      { id: "today", label: "Today", icon: "sun" },
      { id: "assistant", label: "Assistant", icon: "sparkle", badge: "dot" },
    ],
  },
  {
    label: "Life",
    items: [
      { id: "health", label: "Health", icon: "heart" },
      { id: "habits", label: "Habits & journal", icon: "check" },
      { id: "money", label: "Money", icon: "wallet" },
      { id: "insurance", label: "Insurance", icon: "shield" },
      { id: "documents", label: "Documents", icon: "folder", count: 2 },
    ],
  },
];

/** Insurance for a household: policies, what is and is not covered, an open claim, renewals. */
export default function Preview() {
  return (
    <AppShell
      navigation="sidebar"
      brand="Life"
      sidebarGroups={NAV}
      active="insurance"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      dock={false}
      side={
        <Panel side title="Open claim">
          <ClaimTimeline
            title="Water damage in the kitchen"
            meta="Claim 2026-4418 · Nordhafen"
            amount={2340}
            steps={[
              { label: "Reported", date: new Date(2026, 9, 28), state: "done" },
              { label: "Assessor visit", date: new Date(2026, 10, 4), state: "done" },
              { label: "Decision", state: "current", note: "Usually within 10 working days" },
              { label: "Payout", state: "todo" },
            ]}
          />
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Insurance"
          subtitle="4 policies · €118 a month"
          actions={[
            <Button key="n" variant="primary" icon="plus">
              Add policy
            </Button>,
          ]}
        />
      </div>
      <Stagger
        className="tf-grid"
        style={
          {
            "--cols": "repeat(2, minmax(0, 1fr))",
            "--cols-sm": "1fr",
            gap: 16,
          } as React.CSSProperties
        }
      >
        <PolicyCard
          type="Household contents"
          insurer="Nordhafen Insurance"
          icon="home"
          coverage={65000}
          premium={{ amount: 9.8, period: "month" }}
          deductible={150}
          renews={new Date(2027, 2, 1)}
        />
        <PolicyCard
          type="Car (comprehensive)"
          insurer="Alpenland Direct"
          icon="key"
          tint="butter"
          coverage="Unlimited liability"
          premium={{ amount: 412, period: "year" }}
          deductible={300}
          status="expiring"
          renews={new Date(2026, 11, 31)}
        />
      </Stagger>
      <Panel title="Are we covered?" subtitle="1 gap, 2 partly">
        <CoverageMatrix
          rows={[
            {
              id: "liab",
              risk: "Damage to others",
              status: "covered",
              policy: "Personal liability",
              note: "Up to €10 m",
            },
            {
              id: "bike",
              risk: "Bike theft",
              status: "partial",
              policy: "Household contents",
              note: "Only up to €1,000",
            },
            {
              id: "work",
              risk: "Unable to work",
              status: "none",
              note: "The biggest gap for one income",
            },
            {
              id: "legal",
              risk: "Legal costs",
              status: "partial",
              policy: "Legal protection",
              note: "Traffic only",
            },
          ]}
        />
      </Panel>
      <Panel title="Renewals and notice periods">
        <DeadlineList
          today={new Date(2026, 10, 13)}
          items={[
            {
              id: "car",
              title: "Car insurance: switch by",
              kind: "Notice period",
              date: new Date(2026, 10, 30),
            },
            {
              id: "car2",
              title: "Car insurance renews",
              kind: "Renewal",
              date: new Date(2026, 11, 31),
              amount: 412,
            },
            {
              id: "home",
              title: "Household contents renews",
              kind: "Renewal",
              date: new Date(2027, 2, 1),
              amount: 117.6,
            },
          ]}
        />
      </Panel>
    </AppShell>
  );
}
