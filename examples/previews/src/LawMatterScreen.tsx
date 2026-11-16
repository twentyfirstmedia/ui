import * as React from "react";
import {
  AppShell,
  ConflictCheck,
  DeadlineList,
  Panel,
  RecordHeader,
  RecordTimeline,
  Stagger,
  TimeTracker,
} from "@twentyfirstmedia/ui-core";
import type { RecordEntry } from "@twentyfirstmedia/ui-core";
import { NOW } from "./_crm";
import { HITS, LAW_NAV } from "./_industry";

const ENTRIES: RecordEntry[] = [
  {
    id: "1",
    type: "document",
    title: "Statement of claim received",
    at: new Date(2026, 10, 10, 11, 0),
    actor: "Court",
    meta: "ArbG Hamburg 27 Ca 412/26",
  },
  {
    id: "2",
    type: "meeting",
    title: "Client meeting: facts and documents",
    at: new Date(2026, 10, 12, 15, 0),
    actor: "Dr. Anna Weber",
    meta: "1 h 30 min",
  },
  {
    id: "3",
    type: "note",
    title: "Witness: shift lead Jan Ohm confirms the warning was never handed over",
    at: new Date(2026, 10, 13, 9, 40),
    actor: "Dr. Anna Weber",
    pinned: true,
  },
];

/** A matter in a law firm: the conflict check, court deadlines, time on the matter and the file. */
export default function Preview() {
  const [decision, setDecision] = React.useState<"cleared" | "declined" | undefined>("cleared");
  const [running, setRunning] = React.useState(false);
  return (
    <AppShell
      navigation="sidebar"
      brand="Weber Arbeitsrecht"
      sidebarGroups={LAW_NAV}
      active="matters"
      user={{ name: "Dr. Anna Weber", email: "weber@weber-arbeitsrecht.de" }}
      dock={false}
    >
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <RecordHeader
          kind="matter"
          title="Hartmann ./. Elbe Logistik GmbH"
          subtitle="Matter 2026/0412 · Unfair dismissal · ArbG Hamburg"
          status={{ label: "Open", tone: "info" }}
          tags={["Labour law"]}
          owner="Dr. Anna Weber"
          actions={[
            { label: "Log time", icon: "clock", primary: true },
            { label: "New document", icon: "file" },
          ]}
          facts={[
            { label: "Next deadline", value: "Nov 24 · Statement" },
            { label: "Value in dispute", value: "€38,500" },
            { label: "Hours recorded", value: "21.5 h" },
          ]}
        />
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
          <Panel title="Deadlines">
            <DeadlineList
              today={NOW}
              items={[
                {
                  id: "1",
                  title: "Statement on the claim",
                  kind: "Court deadline",
                  icon: "flag",
                  date: new Date(2026, 10, 24),
                },
                {
                  id: "2",
                  title: "Conciliation hearing",
                  kind: "Hearing",
                  icon: "calendar",
                  date: new Date(2026, 11, 3),
                },
                {
                  id: "3",
                  title: "Advance on costs",
                  kind: "Invoice",
                  icon: "card",
                  date: new Date(2026, 10, 30),
                  amount: 1800,
                },
                {
                  id: "4",
                  title: "Power of attorney filed",
                  kind: "Court",
                  icon: "file",
                  date: new Date(2026, 10, 11),
                  done: true,
                },
              ]}
            />
          </Panel>
          <Panel title="Conflict check">
            <ConflictCheck
              parties={["Lena Hartmann", "Elbe Logistik GmbH", "Kai Petersen"]}
              hits={HITS}
              checkedAt={new Date(2026, 10, 10, 11, 20)}
              decision={decision}
              onDecide={setDecision}
            />
          </Panel>
          <Panel title="Time on this matter">
            <TimeTracker
              running={running}
              startedAt={NOW}
              now={NOW}
              task="Draft statement on the claim"
              onStart={() => setRunning(true)}
              onStop={() => setRunning(false)}
              entries={[
                {
                  id: "1",
                  project: "2026/0412",
                  task: "Read the claim, first assessment",
                  minutes: 75,
                  billable: true,
                },
                {
                  id: "2",
                  project: "2026/0412",
                  task: "Client meeting",
                  minutes: 90,
                  billable: true,
                },
              ]}
            />
          </Panel>
          <Panel title="File">
            <RecordTimeline entries={ENTRIES} now={NOW} filters={false} />
          </Panel>
        </div>
      </Stagger>
    </AppShell>
  );
}
