import * as React from "react";
import { AgentCard, AgentDetails, Button } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "1fr 1fr 300px",
          gap: 16,
          alignItems: "start",
        } as React.CSSProperties
      }
    >
      <AgentCard
        name="Atlas"
        role="Support triage"
        tint="sky"
        status="running"
        statusLabel="Working"
        model="Claude Sonnet 5.5"
        cost="€1.84"
        last="Drafted a reply to Northwind"
        onChat={() => {}}
        onClick={() => {}}
      />
      <AgentCard
        name="Ledger"
        role="Bookkeeping"
        tint="butter"
        status="signal"
        statusLabel="Waiting for approval"
        model="Claude Haiku 5.5"
        cost="€0.22"
        last="Proposed 3 bookings"
      />
      <div className="tf-panel">
        <AgentDetails
          name="Atlas"
          role="Support triage · Northwind"
          tint="sky"
          status="running"
          statusLabel="Working"
          sections={[
            {
              title: "Numbers",
              items: [
                ["Model", "Claude Sonnet 5.5"],
                ["Today", "€1.84", true],
                ["This month", "€38.20", true],
                ["Runs", "142"],
              ],
            },
            {
              title: "Tools",
              meta: "3",
              items: [
                ["Mailbox", "read, draft"],
                ["Knowledge base", "read"],
              ],
            },
            {
              title: "Memory",
              open: false,
              children: "Prefers short replies.",
            },
          ]}
          actions={[
            <Button key="c" variant="soft" icon="settings">
              Configure
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}
