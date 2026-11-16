import { Gantt, Panel } from "@twentyfirstmedia/ui-core";
import { PLAN } from "./_sales";

export default function Preview() {
  return (
    <Panel title="Website relaunch" subtitle="Nordhafen Outdoor · Nov 2 to Dec 14">
      <Gantt tasks={PLAN} today={new Date(2026, 10, 16)} onOpen={() => {}} />
    </Panel>
  );
}
