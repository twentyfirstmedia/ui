import { CoordinationTicker, Panel } from "@twentyfirstmedia/ui-core";
import { NOW, TICKER } from "./_coordination";

export default function Preview() {
  return (
    <Panel title="Coordination">
      <CoordinationTicker items={TICKER} now={NOW} />
    </Panel>
  );
}
