import * as React from "react";
import {
  AppShell,
  Forecast,
  PageHeader,
  Panel,
  Segmented,
  Stagger,
  StatTile,
} from "@twentyfirstmedia/ui-core";
import { CRM_NAV } from "./_crm";
import { REPS } from "./_sales";

/** The quarter's forecast: quota, won, commit and best case per rep and per month. */
export default function Preview() {
  const [view, setView] = React.useState("reps");
  return (
    <AppShell
      navigation="sidebar"
      brand="Pilot CRM"
      sidebarGroups={CRM_NAV}
      active="forecast"
      user={{ name: "Mara Ellis", email: "mara@pilot.app" }}
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          title="Forecast"
          subtitle="Q4 2026 · New business"
          actions={[
            <Segmented
              key="view"
              label="Group by"
              value={view}
              onChange={setView}
              options={[
                { value: "reps", label: "Reps" },
                { value: "months", label: "Months" },
              ]}
            />,
          ]}
        />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "repeat(2, minmax(0, 1fr))",
              "--cols-sm": "repeat(2, minmax(0, 1fr))",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <StatTile label="Quota" value="€300,000" tint="butter" />
          <StatTile label="Won" value="€251,500" tint="mint" delta="84%" />
          <StatTile label="Commit" value="€46,000" tint="sky" />
          <StatTile label="Best case" value="€52,000" tint="lilac" />
        </div>
        <Panel title={view === "reps" ? "By rep" : "By month"} subtitle="The line marks the quota">
          {view === "reps" ? (
            <Forecast rows={REPS} />
          ) : (
            <Forecast
              rows={[
                { id: "oct", name: "October", quota: 100000, won: 108500, commit: 0, bestCase: 0 },
                {
                  id: "nov",
                  name: "November",
                  quota: 100000,
                  won: 92000,
                  commit: 14000,
                  bestCase: 12000,
                },
                {
                  id: "dec",
                  name: "December",
                  quota: 100000,
                  won: 51000,
                  commit: 32000,
                  bestCase: 40000,
                },
              ]}
            />
          )}
        </Panel>
      </Stagger>
    </AppShell>
  );
}
