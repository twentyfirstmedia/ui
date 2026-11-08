import * as React from "react";
import { Calendar, DatePicker } from "@twentyfirstmedia/ui-core";
import type { DateRange } from "@twentyfirstmedia/ui-core";

function App() {
  const d = React.useState<Date | DateRange | null>(new Date(2026, 3, 16)),
    r = React.useState<Date | DateRange | null>({
      from: new Date(2026, 3, 6),
      to: new Date(2026, 3, 16),
    });
  return (
    <div
      className="tf-panel tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
          alignContent: "start",
        } as React.CSSProperties
      }
    >
      <DatePicker label="Due date" value={d[0]} onChange={d[1]} today={new Date(2026, 3, 16)} />
      <DatePicker
        label="Report range"
        range
        value={r[0]}
        onChange={r[1]}
        today={new Date(2026, 3, 16)}
        hint="Presets on the left"
      />
      <div
        style={{
          gridColumn: "1 / -1",
        }}
      >
        <div
          className="tf-popover"
          style={{
            position: "static",
            width: 476,
            maxWidth: "100%",
            animation: "none",
          }}
        >
          <div className="tf-dp with-presets">
            <div className="tf-dp-presets">
              {["Last 7 days", "Last 30 days", "Last 90 days", "This year"].map((x, i) => (
                <button key={x} type="button" className={"tf-dp-preset" + (i === 0 ? " on" : "")}>
                  {x}
                </button>
              ))}
            </div>
            <Calendar range value={r[0]} today={new Date(2026, 3, 16)} onChange={r[1]} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
