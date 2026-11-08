import * as React from "react";
import { Stagger, StatTile } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Stagger
      className="tf-grid"
      style={
        {
          "--cols": "repeat(4, 1fr)",
          "--cols-sm": "repeat(2, minmax(0, 1fr))",
          "--cols-md": "repeat(2, minmax(0, 1fr))",
        } as React.CSSProperties
      }
    >
      <StatTile tint="sky" value="128" label="Active members" />
      <StatTile tint="mint" value="24" label="Live projects" delta="+3 this week" />
      <StatTile tint="placeholder" value="9" label="Needs review" />
      <StatTile tint="butter" value="$48,210" label="Revenue (MTD)" />
    </Stagger>
  );
}
