import * as React from "react";
import { Panel, SequenceSteps } from "@twentyfirstmedia/ui-core";
import { STEPS } from "./_sales";

export default function Preview() {
  const [selected, setSelected] = React.useState("1");
  return (
    <Panel title="Outdoor retail Q4" subtitle="Sequence · 6 steps · 240 enrolled">
      <SequenceSteps steps={STEPS} selected={selected} onSelect={setSelected} />
    </Panel>
  );
}
