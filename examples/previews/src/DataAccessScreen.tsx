import * as React from "react";
import {
  AppShell,
  ConsentList,
  InsightCard,
  KeyValue,
  PageHeader,
  Panel,
  Stagger,
  Switch,
} from "@twentyfirstmedia/ui-core";
import type { ConsentConnector, SidebarGroup } from "@twentyfirstmedia/ui-core";

const NAV: SidebarGroup[] = [
  {
    items: [
      { id: "today", label: "Today", icon: "sun" },
      { id: "assistant", label: "Assistant", icon: "sparkle" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "access", label: "Data access", icon: "shield" },
      { id: "notifications", label: "Notifications", icon: "bell" },
      { id: "account", label: "Account", icon: "user" },
    ],
  },
];

/** What the assistant may read and do, per connected source, and what it did with it. */
export default function Preview() {
  const [list, setList] = React.useState<ConsentConnector[]>([
    {
      id: "bank",
      name: "Bank account",
      icon: "card",
      purpose: "Finds bills, subscriptions and price changes; never moves money on its own.",
      lastUsed: new Date(2026, 10, 12),
      scopes: [
        { id: "balance", label: "Balances", granted: true, required: true, level: "read" },
        {
          id: "tx",
          label: "Transactions",
          description: "The last 12 months",
          granted: true,
          level: "read",
        },
        {
          id: "pay",
          label: "Prepare transfers",
          description: "You approve each one",
          granted: false,
          level: "money",
          asksFirst: true,
        },
      ],
    },
    {
      id: "health",
      name: "Health data",
      icon: "heartPulse",
      purpose: "Sleep, activity and vitals for your daily summary. Stays on this device.",
      lastUsed: new Date(2026, 10, 13),
      scopes: [
        { id: "sleep", label: "Sleep", granted: true },
        { id: "activity", label: "Activity", granted: true },
        { id: "vitals", label: "Heart rate and blood pressure", granted: false },
      ],
    },
    {
      id: "mail",
      name: "E-mail",
      icon: "mail",
      purpose: "Reads letters from insurers, landlords and authorities to track deadlines.",
      scopes: [
        { id: "read", label: "Read messages from known senders", granted: true },
        {
          id: "draft",
          label: "Draft replies",
          description: "Never sent without you",
          granted: false,
          level: "act",
          asksFirst: true,
        },
      ],
    },
  ]);
  return (
    <AppShell
      navigation="sidebar"
      brand="Life"
      sidebarGroups={NAV}
      active="access"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      dock={false}
      side={
        <Panel side title="This month" subtitle="What the assistant did">
          <KeyValue
            items={[
              ["Sources read", "214 times"],
              ["Insights shown", "9"],
              ["Actions you approved", "3"],
              ["Data sent outside the EU", "None"],
            ]}
          />
          <Switch defaultChecked>Ask before every new kind of action</Switch>
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader title="Data access" subtitle="You decide what the assistant can see and do" />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <InsightCard
          tone="info"
          icon="shield"
          title="E-mail was not used in 30 days"
          why="The assistant only reads mail to find deadlines. None of your current deadlines came from e-mail."
          acceptLabel="Revoke e-mail access"
          onAccept={() => setList((all) => all.filter((c) => c.id !== "mail"))}
          onDismiss={() => {}}
        >
          You can turn it off; deadlines from letters you upload still work.
        </InsightCard>
        <ConsentList
          connectors={list}
          onScopeChange={(c, s, granted) =>
            setList((all) =>
              all.map((x) =>
                x.id === c
                  ? { ...x, scopes: x.scopes.map((y) => (y.id === s ? { ...y, granted } : y)) }
                  : x,
              ),
            )
          }
          onRevoke={(c) => setList((all) => all.filter((x) => x.id !== c))}
        />
      </Stagger>
    </AppShell>
  );
}
