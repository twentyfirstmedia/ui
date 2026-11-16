import * as React from "react";
import { Panel, Timesheet } from "@twentyfirstmedia/ui-core";
import { WEEK } from "./_sales";

export default function Preview() {
  const [rows, setRows] = React.useState(WEEK);
  return (
    <Panel title="Week 47" subtitle="Nov 16 to 22, 2026">
      <Timesheet
        rows={rows}
        weekStart={new Date(2026, 10, 16)}
        target={8}
        onChange={(id, day, hours) =>
          setRows((all) =>
            all.map((r) =>
              r.id === id ? { ...r, hours: r.hours.map((h, i) => (i === day ? hours : h)) } : r,
            ),
          )
        }
      />
    </Panel>
  );
}
