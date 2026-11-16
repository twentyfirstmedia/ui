import * as React from "react";
import { Panel, RecordTimeline } from "@twentyfirstmedia/ui-core";
import type { RecordEntry } from "@twentyfirstmedia/ui-core";
import { ENTRIES, NOW } from "./_crm";

export default function Preview() {
  const [entries, setEntries] = React.useState<RecordEntry[]>(ENTRIES);
  return (
    <Panel title="Activity" style={{ maxWidth: 720 }}>
      <RecordTimeline
        entries={entries}
        now={NOW}
        onAdd={(type, text) =>
          setEntries((all) => [
            { id: String(all.length + 1), type, title: text, at: new Date(), actor: "You" },
            ...all,
          ])
        }
      />
    </Panel>
  );
}
