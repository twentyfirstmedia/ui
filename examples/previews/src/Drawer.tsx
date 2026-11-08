import * as React from "react";
import { Badge, Drawer, StatTile, Tabs } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        position: "relative",
        height: 480,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--canvas)",
      }}
    >
      <Drawer
        inline
        title="Northwind"
        subtitle="Logistics · Hamburg · customer since 2021"
        avatar="Northwind"
        onClose={() => {}}
      >
        <div className="tf-row">
          <Badge tone="success">Good</Badge>
          <Badge tone="info" dot={false}>
            Team · 24 seats
          </Badge>
        </div>
        <Tabs block items={["Overview", "Invoices", "Mail"]} />
        <div
          className="tf-grid"
          style={
            {
              "--cols": "1fr 1fr",
              "--cols-sm": "1fr 1fr",
            } as React.CSSProperties
          }
        >
          <StatTile tint="butter" value="€1,240" label="MRR" />
          <StatTile tint="mint" value="€14,880" label="Paid to date" />
        </div>
      </Drawer>
    </div>
  );
}
