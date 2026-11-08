import * as React from "react";
import { DeployPipeline, Meter, ServerCard, UptimeBar } from "@twentyfirstmedia/ui-core";
import type { UptimeDay } from "@twentyfirstmedia/ui-core";

const days: UptimeDay[] = [];
for (let i = 0; i < 90; i++)
  days.push(
    i === 61
      ? {
          status: "danger",
          note: "14 min down",
        }
      : i === 40 || i === 77
        ? {
            status: "warn",
            note: "slow responses",
          }
        : {
            status: i < 6 ? "none" : "ok",
          },
  );
export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
        } as React.CSSProperties
      }
    >
      <ServerCard
        name="ax41-fsn1"
        provider="Hetzner"
        address="95.217.14.80"
        status="ok"
        statusLabel="Online"
        meters={[
          {
            label: "CPU",
            value: 34,
            text: "34%",
          },
          {
            label: "RAM",
            value: 81,
            text: "52 / 64 GB",
          },
          {
            label: "Disk",
            value: null,
          },
        ]}
        foot="Last deploy 2 h ago · #482"
      />
      <div
        className="tf-panel"
        style={{
          gap: 16,
        }}
      >
        <b>northwind.de</b>
        <UptimeBar days={days} uptime={99.96} />
        <Meter label="Budget" value={82} text="€820 / €1,000" />
        <DeployPipeline
          stages={[
            {
              name: "Pull",
              status: "done",
              duration: "4 s",
            },
            {
              name: "Build",
              status: "done",
              duration: "1 m 12 s",
            },
            {
              name: "Approve",
              status: "signal",
            },
            {
              name: "Release",
            },
          ]}
        />
      </div>
    </div>
  );
}
