import * as React from "react";
import {
  AppShell,
  BudgetList,
  Button,
  InsightCard,
  NetWorthCard,
  PageHeader,
  Panel,
  Segmented,
  Stagger,
  SubscriptionList,
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

/** Household money: net worth, budgets, subscriptions and what the assistant noticed. */
export default function Preview() {
  const [month, setMonth] = React.useState("November");
  return (
    <AppShell
      navigation="sidebar"
      brand="Life"
      sidebarGroups={NAV}
      active="money"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      dock={false}
      side={
        <Panel side title="Subscriptions" subtitle="5 active">
          <SubscriptionList
            onManage={() => {}}
            items={[
              {
                id: "stream",
                name: "Streaming",
                icon: "play",
                amount: 13.99,
                period: "month",
                next: new Date(2026, 10, 18),
              },
              {
                id: "music",
                name: "Music",
                icon: "monitor",
                amount: 10.99,
                period: "month",
                next: new Date(2026, 10, 21),
              },
              {
                id: "cloud",
                name: "Cloud storage",
                icon: "folder",
                amount: 99,
                period: "year",
                next: new Date(2027, 2, 4),
              },
              {
                id: "gym",
                name: "Gym",
                icon: "zap",
                amount: 34.9,
                period: "month",
                next: new Date(2026, 11, 1),
              },
              {
                id: "news",
                name: "News",
                icon: "book",
                amount: 2.5,
                period: "week",
                status: "trial",
              },
            ]}
          />
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Money"
          subtitle="All accounts · updated 08:12"
          actions={[
            <Segmented
              key="m"
              label="Month"
              options={["October", "November"]}
              value={month}
              onChange={setMonth}
            />,
            <Button key="a" variant="secondary" icon="plus">
              Add account
            </Button>,
          ]}
        />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <NetWorthCard
          change={1240}
          changeLabel="since October"
          history={[38200, 38900, 39400, 39100, 40300, 41000, 41800, 42900]}
          assets={[
            { label: "Current account", value: 4820, icon: "card" },
            { label: "Savings", value: 12600, icon: "wallet" },
            { label: "ETF portfolio", value: 31450, icon: "chart" },
          ]}
          liabilities={[{ label: "Car loan", value: 11200, icon: "key" }]}
        />
        <InsightCard
          tone="highlight"
          icon="repeat"
          meta="Money · subscriptions"
          title="You pay for two music services"
          sources={[{ title: "Bank account · 6 months", icon: "card" }]}
          why="Two different music subscriptions have been charged every month since May."
          acceptLabel="Cancel one"
          onAccept={() => {}}
          onSnooze={() => {}}
          onDismiss={() => {}}
        >
          Keeping one of them saves €131.88 a year.
        </InsightCard>
        <Panel title="Budgets" subtitle="17 days left in November">
          <BudgetList
            onSelect={() => {}}
            categories={[
              {
                id: "food",
                label: "Groceries",
                icon: "cart",
                tint: "mint",
                spent: 312,
                limit: 450,
              },
              {
                id: "eat",
                label: "Eating out",
                icon: "star",
                tint: "butter",
                spent: 168,
                limit: 180,
              },
              { id: "move", label: "Transport", icon: "map", tint: "sky", spent: 96, limit: 120 },
              {
                id: "fun",
                label: "Fun & hobbies",
                icon: "sparkle",
                tint: "lilac",
                spent: 142,
                limit: 100,
              },
            ]}
          />
        </Panel>
      </Stagger>
    </AppShell>
  );
}
