import * as React from "react";
import {
  AppShell,
  Button,
  GoalCard,
  HabitTracker,
  JournalEntry,
  MoodPicker,
  PageHeader,
  Panel,
  Stagger,
  Textarea,
} from "@twentyfirstmedia/ui-core";
import type { Habit, MoodLevel, SidebarGroup } from "@twentyfirstmedia/ui-core";

const NAV: SidebarGroup[] = [
  {
    items: [
      { id: "today", label: "Today", icon: "sun" },
      { id: "assistant", label: "Assistant", icon: "sparkle" },
    ],
  },
  {
    label: "Life",
    items: [
      { id: "health", label: "Health", icon: "heartPulse" },
      { id: "habits", label: "Habits & journal", icon: "check" },
      { id: "money", label: "Money", icon: "wallet" },
      { id: "insurance", label: "Insurance", icon: "shield" },
      { id: "documents", label: "Documents", icon: "folder" },
    ],
  },
];

/** A daily check-in: mood, habits, a journal and longer goals. */
export default function Preview() {
  const [mood, setMood] = React.useState<MoodLevel | null>(null);
  const [habits, setHabits] = React.useState<Habit[]>([
    {
      id: "walk",
      label: "Morning walk",
      icon: "sun",
      tint: "butter",
      days: [true, true, false, true, true, true, false],
      streak: 3,
      goal: "20 min",
    },
    {
      id: "read",
      label: "Read",
      icon: "book",
      tint: "lilac",
      days: [false, true, false, true, false, true, true],
      streak: 2,
      goal: "3× a week",
    },
    {
      id: "screens",
      label: "No screens after 10 pm",
      icon: "moon",
      tint: "mint",
      days: [true, false, false, true, true, false, false],
    },
  ]);
  return (
    <AppShell
      navigation="sidebar"
      brand="Life"
      sidebarGroups={NAV}
      active="habits"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      dock={false}
      side={
        <Panel side title="Goals" subtitle="2 active">
          <GoalCard
            title="Read 24 books"
            icon="book"
            tint="lilac"
            value={17}
            target={24}
            unit="books"
            due={new Date(2026, 11, 31)}
          />
          <GoalCard
            title="Emergency fund"
            icon="wallet"
            tint="mint"
            value={3100}
            target={5000}
            format="money"
            due={new Date(2027, 5, 1)}
          />
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader title="Habits & journal" subtitle="Friday, 13 November" />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <Panel title="Check in">
          <MoodPicker value={mood} onChange={setMood} />
          <Textarea label="A line about today" placeholder="What stood out?" rows={2} />
          <div className="tf-row" style={{ justifyContent: "flex-end" }}>
            <Button variant="primary" disabled={!mood}>
              Save entry
            </Button>
          </div>
        </Panel>
        <Panel title="Habits" subtitle="This week">
          <HabitTracker
            habits={habits}
            dayLabels={["M", "T", "W", "T", "F", "S", "S"]}
            onToggle={(id, done) =>
              setHabits((all) =>
                all.map((h) => (h.id === id ? { ...h, days: [...h.days.slice(0, -1), done] } : h)),
              )
            }
          />
        </Panel>
        <JournalEntry
          date={new Date(2026, 10, 12)}
          mood={4}
          title="Slow morning, good walk"
          tags={["Walk", "Family"]}
        >
          <p>
            Slept through for once. Walked to the harbour before work and the day felt lighter after
            that.
          </p>
        </JournalEntry>
      </Stagger>
    </AppShell>
  );
}
