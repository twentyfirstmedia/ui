import * as React from "react";
import { Panel, QuoteBuilder } from "@twentyfirstmedia/ui-core";
import { LINES } from "./_sales";

export default function Preview() {
  const [lines, setLines] = React.useState(LINES);
  return (
    <Panel title="Quote Q-2026-118" subtitle="Website relaunch · Nordhafen Outdoor">
      <QuoteBuilder
        lines={lines}
        taxRate={19}
        onChange={setLines}
        onRemove={(id) => setLines((all) => all.filter((l) => l.id !== id))}
        onAdd={() =>
          setLines((all) => [
            ...all,
            { id: String(Date.now()), name: "New item", quantity: 1, unitPrice: 0 },
          ])
        }
      />
    </Panel>
  );
}
