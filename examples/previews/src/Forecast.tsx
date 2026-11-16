import { Forecast, Panel } from "@twentyfirstmedia/ui-core";
import { REPS } from "./_sales";

export default function Preview() {
  return (
    <Panel title="Q4 forecast" subtitle="New business · ends Dec 31">
      <Forecast rows={REPS} />
    </Panel>
  );
}
