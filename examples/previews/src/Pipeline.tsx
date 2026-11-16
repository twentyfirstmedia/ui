import * as React from "react";
import { Pipeline } from "@twentyfirstmedia/ui-core";
import type { PipelineStage } from "@twentyfirstmedia/ui-core";
import { STAGES } from "./_crm";

export default function Preview() {
  const [stages, setStages] = React.useState<PipelineStage[]>(STAGES);
  return (
    <Pipeline
      stages={stages}
      onOpen={() => {}}
      onMove={(id, to) =>
        setStages((all) => {
          const deal = all.flatMap((s) => s.deals).find((d) => d.id === id);
          if (!deal) return all;
          return all.map((s) => ({
            ...s,
            deals:
              s.id === to
                ? [{ ...deal, daysInStage: 0 }, ...s.deals.filter((d) => d.id !== id)]
                : s.deals.filter((d) => d.id !== id),
          }));
        })
      }
    />
  );
}
