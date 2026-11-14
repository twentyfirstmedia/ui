import * as React from "react";
import {
  AgentActivity,
  AppShell,
  ApprovalCard,
  PageHeader,
  Panel,
  Segmented,
  Stagger,
} from "@twentyfirstmedia/ui-core";
import type { AgentAction, SidebarGroup } from "@twentyfirstmedia/ui-core";
import "./_connectors";

const NAV: SidebarGroup[] = [
  {
    items: [
      { id: "today", label: "Today", icon: "sun" },
      { id: "assistant", label: "Assistant", icon: "sparkle" },
    ],
  },
  {
    label: "Agents",
    items: [
      { id: "connections", label: "Connections", icon: "link" },
      { id: "activity", label: "Activity", icon: "list", badge: "1" },
      { id: "access", label: "Data access", icon: "shield" },
    ],
  },
];

const now = new Date(2026, 10, 14, 9, 30);
const at = (day: number, h: number, m: number) => new Date(2026, 10, 14 + day, h, m);

const ITEMS: AgentAction[] = [
  {
    id: "1",
    service: { name: "N26", icon: "brandN26" },
    agent: "Money agent",
    text: "Wants to cancel the second music subscription (€10.99 a month)",
    at: at(0, 9, 12),
    kind: "money",
    state: "waiting",
  },
  {
    id: "2",
    service: { name: "tado°", icon: "brandTado" },
    agent: "Home agent",
    text: "Turned the heating down to 17 °C: nobody is home",
    at: at(0, 8, 41),
    kind: "act",
  },
  {
    id: "3",
    service: { name: "Tesla", icon: "brandTesla" },
    agent: "Home agent",
    text: "Started charging to 80 % for tomorrow's drive to Hamburg",
    at: at(0, 7, 58),
    kind: "act",
  },
  {
    id: "4",
    service: { name: "Gmail", icon: "brandGmail" },
    agent: "Assistant",
    text: "Read 14 new emails and filed 3 invoices to Drive",
    at: at(0, 7, 5),
    kind: "read",
  },
  {
    id: "5",
    service: { name: "Google Calendar", icon: "brandGooglecalendar" },
    agent: "Assistant",
    text: "Moved the dentist to Friday, 10:00",
    detail: "The old slot clashed with your flight to Dubai.",
    at: at(-1, 18, 20),
    kind: "act",
    state: "undone",
  },
  {
    id: "6",
    service: { name: "Spotify", icon: "brandSpotify" },
    agent: "Assistant",
    text: "Looked up what you played this week for the weekly review",
    at: at(-1, 17, 2),
    kind: "read",
  },
];

/** What agents did across your services, what waits for you, filtered by kind. */
export default function Preview() {
  const [kind, setKind] = React.useState("all");
  const items = ITEMS.filter((i) => kind === "all" || i.kind === kind);
  return (
    <AppShell
      navigation="sidebar"
      brand="Life"
      sidebarGroups={NAV}
      active="activity"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      dock={false}
      side={
        <Panel side title="Waiting for you" subtitle="1 decision">
          <ApprovalCard
            compact
            family="money"
            agent="Money agent"
            age="18 min"
            title="Cancel Apple Music"
            text="You pay for Spotify and Apple Music. Cancelling Apple Music saves €131.88 a year."
            onDecide={() => {}}
          />
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader title="Activity" subtitle="Everything your agents read and did" />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <Segmented
          label="Show"
          value={kind}
          onChange={setKind}
          options={[
            { value: "all", label: "All" },
            { value: "act", label: "Changes" },
            { value: "money", label: "Money" },
            { value: "read", label: "Reads" },
          ]}
        />
        <Panel>
          <AgentActivity items={items} now={now} onUndo={() => {}} onReview={() => {}} />
        </Panel>
      </Stagger>
    </AppShell>
  );
}
