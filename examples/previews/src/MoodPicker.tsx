import * as React from "react";
import { Card, MoodPicker } from "@twentyfirstmedia/ui-core";
import type { MoodLevel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [mood, setMood] = React.useState<MoodLevel | null>(4);
  return (
    <div className="tf-row" style={{ gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
      <Card style={{ width: 420, minHeight: 0 }}>
        <MoodPicker value={mood} onChange={setMood} />
      </Card>
      <Card style={{ width: 280, minHeight: 0 }}>
        <MoodPicker label="Energy today" compact defaultValue={3} />
      </Card>
    </div>
  );
}
