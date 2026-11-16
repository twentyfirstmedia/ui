import * as React from "react";
import { ConflictCheck, Panel } from "@twentyfirstmedia/ui-core";
import { HITS } from "./_industry";

export default function Preview() {
  const [parties, setParties] = React.useState([
    "Lena Hartmann",
    "Elbe Logistik GmbH",
    "Kai Petersen",
  ]);
  const [decision, setDecision] = React.useState<"cleared" | "declined" | undefined>();
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
          alignItems: "start",
        } as React.CSSProperties
      }
    >
      <Panel title="New matter" subtitle="Hartmann ./. Elbe Logistik GmbH">
        <ConflictCheck
          parties={parties}
          onParties={setParties}
          hits={HITS}
          checkedAt={new Date(2026, 10, 16, 9, 30)}
          onCheck={() => {}}
          decision={decision}
          onDecide={setDecision}
        />
      </Panel>
      <Panel title="Another matter" subtitle="Velo Werk GmbH, contract review">
        <ConflictCheck
          parties={["Velo Werk GmbH", "Tobias Wendt"]}
          hits={[]}
          checkedAt={new Date(2026, 10, 15, 14, 5)}
          decision="cleared"
        />
      </Panel>
    </div>
  );
}
