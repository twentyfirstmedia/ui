import { ActivityRings, Card } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-row" style={{ gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
      <Card style={{ minHeight: 0 }}>
        <ActivityRings
          rings={[
            { label: "Move", value: 420, goal: 600, unit: "kcal", tint: "blush" },
            { label: "Exercise", value: 24, goal: 30, unit: "min", tint: "mint" },
            { label: "Stand", value: 9, goal: 12, unit: "h", tint: "sky" },
          ]}
        />
      </Card>
      <Card style={{ minHeight: 0 }}>
        <ActivityRings
          size={88}
          legend={false}
          label="Steps and water"
          rings={[
            { label: "Steps", value: 8400, goal: 8000, tint: "lilac" },
            { label: "Water", value: 5, goal: 8, unit: "glasses", tint: "sky" },
          ]}
        />
      </Card>
    </div>
  );
}
