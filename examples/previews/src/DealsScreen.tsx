import * as React from "react";
import {
  AppShell,
  Button,
  PageHeader,
  Pipeline,
  Segmented,
  Stagger,
  StatTile,
} from "@twentyfirstmedia/ui-core";
import type { PipelineStage } from "@twentyfirstmedia/ui-core";
import { CRM_NAV, STAGES } from "./_crm";

/** The sales pipeline: totals and weighted value per stage, stale deals marked, deals moved by drag or menu. */
export default function Preview() {
  const [stages, setStages] = React.useState<PipelineStage[]>(STAGES);
  const [who, setWho] = React.useState("all");
  return (
    <AppShell
      navigation="sidebar"
      brand="Pilot CRM"
      sidebarGroups={CRM_NAV}
      active="pipeline"
      user={{ name: "Mara Ellis", email: "mara@pilot.app" }}
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          title="Pipeline"
          subtitle="New business · Q4"
          actions={[
            <Segmented
              key="who"
              label="Owner"
              value={who}
              onChange={setWho}
              options={[
                { value: "all", label: "Everyone" },
                { value: "me", label: "My deals" },
              ]}
            />,
            <Button key="new" icon="plus">
              New deal
            </Button>,
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
          <StatTile label="Open pipeline" value="€197,500" />
          <StatTile label="Weighted" value="€88,300" tint="sky" />
          <StatTile label="Won this month" value="€54,000" delta="+18%" tint="mint" />
          <StatTile label="Avg. days to close" value="34" tint="butter" />
        </div>
        <Pipeline
          stages={
            who === "me"
              ? stages.map((s) => ({
                  ...s,
                  deals: s.deals.filter((d) => d.owner === "Mara Ellis"),
                }))
              : stages
          }
          onOpen={() => {}}
          onMove={(id, to) =>
            setStages((all) => {
              const deal = all.flatMap((s) => s.deals).find((d) => d.id === id);
              if (!deal) return all;
              return all.map((s) => ({
                ...s,
                deals:
                  s.id === to
                    ? [{ ...deal, daysInStage: 0 }, ...s.deals.filter((d) => d.id !== id)]
                    : s.deals.filter((d) => d.id !== id),
              }));
            })
          }
        />
      </Stagger>
    </AppShell>
  );
}
