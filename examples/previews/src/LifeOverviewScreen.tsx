import * as React from "react";
import {
  ActivityRings,
  Ambient,
  AppShell,
  BudgetList,
  DeadlineList,
  InsightCard,
  MoodPicker,
  PageHeader,
  Panel,
  SearchField,
  Stagger,
  UIProvider,
} from "@twentyfirstmedia/ui-core";
import type { MoodLevel, SidebarGroup } from "@twentyfirstmedia/ui-core";

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

/** The start page of an AI-first life app in glass over ambient colour: what needs you today, across health, money and papers. */
export default function Preview() {
  const [mood, setMood] = React.useState<MoodLevel | null>(null);
  return (
    <UIProvider scope="subtree" surface="glass">
      <Ambient />
      <AppShell
        navigation="sidebar"
        brand="Life"
        sidebarGroups={NAV}
        active="today"
        user={{ name: "Mara Ellis", email: "mara@halo.app" }}
        dock={false}
        side={
          <Panel side title="Today">
            <MoodPicker compact value={mood} onChange={setMood} />
            <ActivityRings
              size={96}
              rings={[
                { label: "Move", value: 420, goal: 600, unit: "kcal", tint: "blush" },
                { label: "Exercise", value: 24, goal: 30, unit: "min", tint: "mint" },
                { label: "Stand", value: 9, goal: 12, unit: "h", tint: "sky" },
              ]}
            />
          </Panel>
        }
      >
        <div className="tf-in">
          <PageHeader
            title="Good morning, Mara"
            subtitle="Friday, 13 November · 3 things need you"
            actions={[<SearchField key="s" placeholder="Ask or search" shortcut="⌘K" />]}
          />
        </div>
        <Stagger className="tf-col" style={{ gap: 16 }}>
          <InsightCard
            tone="warning"
            icon="file"
            meta="Documents · 19 days"
            title="Lena's passport expires on 2 December"
            sources={[{ title: "Passport scan", icon: "file" }]}
            why="You travel to Lisbon on 18 December; a valid passport is needed for the flight."
            acceptLabel="Book an appointment"
            onAccept={() => {}}
            onSnooze={() => {}}
            onDismiss={() => {}}
          >
            The town hall has free slots next week; renewal takes about three weeks.
          </InsightCard>
          <InsightCard
            tone="highlight"
            icon="repeat"
            meta="Money · subscriptions"
            title="You pay for two music services"
            sources={[{ title: "Bank account", icon: "card" }]}
            acceptLabel="Cancel one"
            onAccept={() => {}}
            onDismiss={() => {}}
          >
            Keeping one of them saves €131.88 a year.
          </InsightCard>
          <div
            className="tf-grid"
            style={
              {
                "--cols": "repeat(2, minmax(0, 1fr))",
                "--cols-sm": "1fr",
                gap: 16,
              } as React.CSSProperties
            }
          >
            <Panel title="Coming up">
              <DeadlineList
                today={new Date(2026, 10, 13)}
                items={[
                  { id: "car", title: "Car inspection", kind: "Car", date: new Date(2026, 10, 13) },
                  {
                    id: "gym",
                    title: "Gym: last day to cancel",
                    kind: "Contract",
                    date: new Date(2026, 10, 20),
                  },
                  {
                    id: "rent",
                    title: "Rent",
                    kind: "Bill",
                    date: new Date(2026, 11, 1),
                    amount: 1150,
                  },
                ]}
              />
            </Panel>
            <Panel title="Budgets" subtitle="17 days left">
              <BudgetList
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
          </div>
        </Stagger>
      </AppShell>
    </UIProvider>
  );
}
