import * as React from "react";
import {
  ActivityRings,
  Ambient,
  AppShell,
  Button,
  InsightCard,
  MedicationList,
  PageHeader,
  Panel,
  Segmented,
  SleepChart,
  Stagger,
  UIProvider,
  VitalTile,
} from "@twentyfirstmedia/ui-core";
import type { MedicationItem, SidebarGroup, SleepSegment } from "@twentyfirstmedia/ui-core";

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
      { id: "health", label: "Health", icon: "heartPulse" },
      { id: "habits", label: "Habits & journal", icon: "check" },
      { id: "money", label: "Money", icon: "wallet" },
      { id: "insurance", label: "Insurance", icon: "shield" },
      { id: "documents", label: "Documents", icon: "folder", count: 2 },
    ],
  },
];

const at = (d: number, h: number, m: number) => new Date(2026, 10, d, h, m).getTime();
const night: SleepSegment[] = [
  { stage: "awake", start: at(12, 23, 10), end: at(12, 23, 22) },
  { stage: "light", start: at(12, 23, 22), end: at(13, 0, 5) },
  { stage: "deep", start: at(13, 0, 5), end: at(13, 1, 10) },
  { stage: "rem", start: at(13, 1, 10), end: at(13, 1, 45) },
  { stage: "light", start: at(13, 1, 45), end: at(13, 3, 0) },
  { stage: "deep", start: at(13, 3, 0), end: at(13, 3, 35) },
  { stage: "light", start: at(13, 3, 35), end: at(13, 4, 50) },
  { stage: "rem", start: at(13, 4, 50), end: at(13, 5, 40) },
  { stage: "light", start: at(13, 5, 40), end: at(13, 6, 35) },
  { stage: "awake", start: at(13, 6, 35), end: at(13, 6, 45) },
];

/** A personal health page in glass over ambient colour: vitals with healthy ranges, activity, sleep, medication and an insight. */
export default function Preview() {
  const [range, setRange] = React.useState("Today");
  const [meds, setMeds] = React.useState<MedicationItem[]>([
    { id: "d", name: "Vitamin D", dose: "1,000 IU", time: "07:30", status: "taken" },
    { id: "r", name: "Ramipril", dose: "5 mg", time: "13:00", status: "due" },
    { id: "s", name: "Magnesium", dose: "300 mg", time: "22:00", status: "upcoming" },
  ]);
  return (
    <UIProvider scope="subtree" surface="glass">
      <Ambient />
      <AppShell
        navigation="sidebar"
        brand="Life"
        sidebarGroups={NAV}
        active="health"
        user={{ name: "Mara Ellis", email: "mara@halo.app" }}
        userMenu={[
          { label: "Settings", icon: "settings" },
          "-",
          { label: "Sign out", icon: "logout" },
        ]}
        dock={false}
        side={
          <Panel side title="Medication" subtitle="3 doses today">
            <MedicationList
              items={meds}
              onTake={(id) =>
                setMeds((all) => all.map((m) => (m.id === id ? { ...m, status: "taken" } : m)))
              }
            />
          </Panel>
        }
      >
        <div className="tf-in">
          <PageHeader
            title="Health"
            subtitle="Friday, 13 November"
            actions={[
              <Segmented
                key="r"
                label="Range"
                options={["Today", "Week", "Month"]}
                value={range}
                onChange={setRange}
              />,
            ]}
          />
        </div>
        <Stagger
          className="tf-grid"
          style={
            {
              "--cols": "repeat(3, minmax(0, 1fr))",
              "--cols-sm": "1fr",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <VitalTile
            label="Resting heart rate"
            value={58}
            unit="bpm"
            normal={[50, 80]}
            trend={[61, 60, 62, 59, 58, 58, 57, 58]}
            caption="Watch · 06:45"
          />
          <VitalTile
            label="Blood pressure"
            icon="zap"
            value={138}
            unit="mmHg"
            normal={[90, 129]}
            trend={[128, 131, 130, 134, 136, 135, 138]}
            caption="Cuff · yesterday"
          />
          <VitalTile
            label="Weight"
            icon="trend"
            value={74.2}
            digits={1}
            unit="kg"
            trend={[75.8, 75.4, 75.1, 74.9, 74.6, 74.4, 74.2]}
            caption="Scale · today"
          />
        </Stagger>
        <InsightCard
          tone="warning"
          icon="zap"
          meta="Health · this week"
          title="Blood pressure has been above range for 5 days"
          sources={[{ title: "Cuff · 7 readings", icon: "zap" }]}
          why="Five of your last seven evening readings were above 129 mmHg. You asked to be told when that happens more than three days in a row."
          acceptLabel="Share with Dr. Weber"
          onAccept={() => {}}
          onSnooze={() => {}}
        >
          Consider taking the next readings in the morning too, and mention it at your check-up.
        </InsightCard>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "minmax(0, 1fr) minmax(0, 1.4fr)",
              "--cols-sm": "1fr",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <Panel title="Activity" subtitle="Goals for today">
            <ActivityRings
              rings={[
                { label: "Move", value: 420, goal: 600, unit: "kcal", tint: "blush" },
                { label: "Exercise", value: 24, goal: 30, unit: "min", tint: "mint" },
                { label: "Stand", value: 9, goal: 12, unit: "h", tint: "sky" },
              ]}
            />
          </Panel>
          <Panel
            title="Sleep"
            subtitle="Last night"
            action={
              <Button variant="ghost" size="sm">
                Trends
              </Button>
            }
          >
            <SleepChart segments={night} />
          </Panel>
        </div>
      </AppShell>
    </UIProvider>
  );
}
