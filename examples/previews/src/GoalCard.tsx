import type * as React from "react";
import { GoalCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "repeat(2, minmax(0, 1fr))",
          "--cols-sm": "1fr",
          gap: 16,
        } as React.CSSProperties
      }
    >
      <GoalCard
        title="Emergency fund"
        icon="wallet"
        tint="mint"
        value={3100}
        target={5000}
        format="money"
        due={new Date(2027, 5, 1)}
        note="€275 a month keeps you on track."
      />
      <GoalCard
        title="Run a half marathon"
        icon="trend"
        tint="blush"
        value={14}
        target={21}
        unit="km"
        due={new Date(2027, 3, 26)}
        milestones={[
          { label: "5 km without a break", done: true },
          { label: "10 km under an hour", done: true },
          { label: "15 km long run" },
          { label: "Race day" },
        ]}
      />
    </div>
  );
}
