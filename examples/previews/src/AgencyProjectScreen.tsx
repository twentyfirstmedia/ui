import * as React from "react";
import {
  AppShell,
  BudgetList,
  Gantt,
  Panel,
  RecordHeader,
  Stagger,
  TimeTracker,
  Timesheet,
} from "@twentyfirstmedia/ui-core";
import { AGENCY_NAV } from "./_crm";
import { PLAN, WEEK } from "./_sales";

const NOW = new Date(2026, 10, 16, 11, 12);

/** An agency project: the plan as a timeline, budget per phase, this week's hours and the timer. */
export default function Preview() {
  const [rows, setRows] = React.useState(WEEK);
  const [running, setRunning] = React.useState(true);
  return (
    <AppShell
      navigation="sidebar"
      brand="Studio Hafen"
      sidebarGroups={AGENCY_NAV}
      active="projects"
      user={{ name: "Mara Ellis", email: "mara@studiohafen.de" }}
      dock={false}
    >
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <RecordHeader
          kind="deal"
          icon="folder"
          title="Website relaunch"
          subtitle="Nordhafen Outdoor · Fixed price with hourly extras"
          status={{ label: "On track", tone: "success" }}
          owner="Mara Ellis"
          actions={[
            { label: "Log time", icon: "clock", primary: true },
            { label: "Invoice", icon: "card" },
          ]}
          facts={[
            { label: "Budget", value: "€41,700" },
            { label: "Used", value: "62%" },
            { label: "Hours", value: "284 of 420" },
            { label: "Launch", value: "Dec 14" },
          ]}
        />
        <Panel title="Plan">
          <Gantt tasks={PLAN} today={NOW} onOpen={() => {}} />
        </Panel>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "minmax(0, 1fr) minmax(0, 1fr)",
              "--cols-sm": "1fr",
              gap: 16,
              alignItems: "start",
            } as React.CSSProperties
          }
        >
          <Panel title="Budget by phase">
            <BudgetList
              categories={[
                {
                  id: "d",
                  label: "Discovery",
                  icon: "sparkle",
                  tint: "lilac",
                  spent: 6400,
                  limit: 6400,
                },
                { id: "de", label: "Design", icon: "image", tint: "sky", spent: 6900, limit: 7680 },
                {
                  id: "dev",
                  label: "Development",
                  icon: "code",
                  tint: "mint",
                  spent: 12600,
                  limit: 14490,
                },
                {
                  id: "pm",
                  label: "Project management",
                  icon: "users",
                  tint: "butter",
                  spent: 3100,
                  limit: 2800,
                },
              ]}
            />
          </Panel>
          <Panel title="Timer">
            <TimeTracker
              running={running}
              startedAt={new Date(NOW.getTime() - 2537000)}
              now={NOW}
              task="Checkout flow: address step"
              project="Nordhafen · Website relaunch"
              projects={["Nordhafen · Website relaunch", "Velo Werk · App redesign", "Internal"]}
              onStart={() => setRunning(true)}
              onStop={() => setRunning(false)}
              entries={[
                {
                  id: "1",
                  project: "Nordhafen · Website relaunch",
                  task: "Stand-up and planning",
                  minutes: 30,
                  billable: true,
                },
                {
                  id: "2",
                  project: "Nordhafen · Website relaunch",
                  task: "Template review with Lena",
                  minutes: 60,
                  billable: true,
                },
              ]}
            />
          </Panel>
        </div>
        <Panel title="This week" subtitle="Week 47 · target 8 h a day">
          <Timesheet
            rows={rows}
            weekStart={new Date(2026, 10, 16)}
            target={8}
            onChange={(id, day, hours) =>
              setRows((all) =>
                all.map((r) =>
                  r.id === id ? { ...r, hours: r.hours.map((h, i) => (i === day ? hours : h)) } : r,
                ),
              )
            }
          />
        </Panel>
      </Stagger>
    </AppShell>
  );
}
