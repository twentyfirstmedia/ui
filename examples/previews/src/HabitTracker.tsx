import * as React from "react";
import { HabitTracker, Panel, registerIcons } from "@twentyfirstmedia/ui-core";
import { droplet } from "@twentyfirstmedia/ui-core/icons";

// library icons are registered once by the app
registerIcons({ droplet });
import type { Habit } from "@twentyfirstmedia/ui-core";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function Preview() {
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
      id: "water",
      label: "Drink water",
      icon: "droplet",
      tint: "sky",
      days: [true, true, true, true, true, true, true],
      streak: 12,
      goal: "8 glasses",
    },
    {
      id: "read",
      label: "Read",
      icon: "book",
      tint: "lilac",
      days: [false, true, null, true, false, true, false],
      goal: "3× a week",
    },
    {
      id: "screens",
      label: "No screens after 10 pm",
      icon: "moon",
      tint: "mint",
      days: [true, false, false, true, true, null, false],
    },
  ]);
  return (
    <Panel title="Habits" subtitle="This week" style={{ maxWidth: 560 }}>
      <HabitTracker
        habits={habits}
        dayLabels={DAYS}
        onToggle={(id, done) =>
          setHabits((list) =>
            list.map((h) =>
              h.id === id
                ? {
                    ...h,
                    days: [...h.days.slice(0, -1), done],
                    streak: done ? (h.streak || 0) + 1 : Math.max(0, (h.streak || 1) - 1),
                  }
                : h,
            ),
          )
        }
      />
    </Panel>
  );
}
