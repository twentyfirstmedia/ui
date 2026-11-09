import * as React from "react";
import { Ambient, Badge, Button, Panel, StatTile, UIProvider } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <UIProvider scope="subtree" surface="glass">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: 16,
          padding: 24,
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
        }}
      >
        <Ambient />
        <StatTile value="7h 42m" label="Sleep" tint="sky" delta="+18 min" />
        <StatTile value="12 days" label="Streak" tint="butter" />
        <Panel
          title="Breathe"
          subtitle="Four minutes, box breathing"
          action={<Badge tone="success">New</Badge>}
        >
          <Button variant="primary" icon="play">
            Start
          </Button>
        </Panel>
      </div>
    </UIProvider>
  );
}
