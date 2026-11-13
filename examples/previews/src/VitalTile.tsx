import type * as React from "react";
import { VitalTile } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
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
        caption="Watch · this morning"
      />
      <VitalTile
        label="Blood pressure (systolic)"
        icon="zap"
        value={138}
        unit="mmHg"
        normal={[90, 129]}
        trend={[128, 131, 130, 134, 136, 135, 138]}
        caption="Cuff · yesterday 21:10"
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
    </div>
  );
}
