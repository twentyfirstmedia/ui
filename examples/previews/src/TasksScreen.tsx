import * as React from "react";
import {
  AppShell,
  Button,
  PageHeader,
  Panel,
  Segmented,
  Stagger,
  StatTile,
  TaskList,
} from "@twentyfirstmedia/ui-core";
import type { CrmTask } from "@twentyfirstmedia/ui-core";
import { CRM_NAV, NOW } from "./_crm";

const TASKS: CrmTask[] = [
  {
    id: "1",
    title: "Send revised proposal",
    due: new Date(2026, 10, 13),
    priority: "high",
    assignee: "Mara Ellis",
    related: "Deal · Retainer 2027",
  },
  {
    id: "2",
    title: "Follow up with Lindqvist Studio",
    due: new Date(2026, 10, 14),
    assignee: "Mara Ellis",
    related: "Deal · Brand refresh",
  },
  {
    id: "3",
    title: "Call Lena about the contract",
    due: NOW,
    assignee: "Mara Ellis",
    related: "Person · Lena Hartmann",
  },
  {
    id: "4",
    title: "Prepare workshop agenda",
    due: NOW,
    assignee: "Jonas Pick",
    related: "Deal · Shop migration",
  },
  {
    id: "5",
    title: "Ask for two references",
    due: new Date(2026, 10, 19),
    priority: "low",
    assignee: "Lea Brandt",
    related: "Company · Nordhafen Outdoor",
  },
  {
    id: "6",
    title: "Quarterly review with Velo Werk",
    due: new Date(2026, 10, 24),
    assignee: "Lea Brandt",
    related: "Company · Velo Werk",
  },
  { id: "7", title: "Clean up duplicate contacts" },
  {
    id: "8",
    title: "Book the kick-off room",
    due: new Date(2026, 10, 12),
    done: true,
    assignee: "Jonas Pick",
  },
];

/** Everyone's to-dos: overdue first, then today, upcoming, without a date and done. */
export default function Preview() {
  const [tasks, setTasks] = React.useState(TASKS);
  const [who, setWho] = React.useState("me");
  const shown =
    who === "me" ? tasks.filter((x) => x.assignee === "Mara Ellis" || !x.assignee) : tasks;
  const start = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  const count = (test: (x: CrmTask) => boolean) => shown.filter((x) => !x.done && test(x)).length;
  return (
    <AppShell
      navigation="sidebar"
      brand="Pilot CRM"
      sidebarGroups={CRM_NAV}
      active="tasks"
      user={{ name: "Mara Ellis", email: "mara@pilot.app" }}
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          title="Tasks"
          subtitle="Monday, 16 November"
          actions={[
            <Segmented
              key="who"
              label="Show"
              value={who}
              onChange={setWho}
              options={[
                { value: "me", label: "Mine" },
                { value: "all", label: "Team" },
              ]}
            />,
            <Button key="new" icon="plus">
              New task
            </Button>,
          ]}
        />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "repeat(3, minmax(0, 1fr))",
              "--cols-sm": "1fr",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <StatTile
            label="Overdue"
            value={count((x) => !!x.due && +new Date(x.due) < +start)}
            tint="blush"
          />
          <StatTile
            label="Due today"
            value={count((x) => !!x.due && +new Date(x.due) >= +start && +new Date(x.due) < +end)}
            tint="butter"
          />
          <StatTile label="Done" value={shown.filter((x) => x.done).length} tint="mint" />
        </div>
        <Panel>
          <TaskList
            tasks={shown}
            today={NOW}
            onOpen={() => {}}
            onToggle={(id, done) =>
              setTasks((all) => all.map((x) => (x.id === id ? { ...x, done } : x)))
            }
          />
        </Panel>
      </Stagger>
    </AppShell>
  );
}
