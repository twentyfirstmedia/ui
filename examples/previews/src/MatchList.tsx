import { MatchList, Panel } from "@twentyfirstmedia/ui-core";
import { BUYERS } from "./_industry";

export default function Preview() {
  return (
    <Panel title="Buyers for this flat" subtitle="3 rooms · 84 m² · Eppendorf · €629,000">
      <MatchList
        matches={BUYERS}
        contactLabel="Send exposé"
        onContact={() => {}}
        onOpen={() => {}}
      />
    </Panel>
  );
}
