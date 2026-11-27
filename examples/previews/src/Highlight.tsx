import * as React from "react";
import { Highlight, TextField } from "@twentyfirstmedia/ui-core";

const LINES = [
  "Invoice RE-2026-00041 for the November retainer is overdue.",
  "The offsite moves to the lake house; invoices go to finance.",
  "Draft of the hiring plan with the new design roles.",
];

export default function Preview() {
  const [query, setQuery] = React.useState("invoice plan");
  return (
    <div className="tf-panel" style={{ gap: 12 }}>
      <TextField label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
      {LINES.map((line) => (
        <p key={line} style={{ margin: 0 }}>
          <Highlight text={line} query={query} />
        </p>
      ))}
    </div>
  );
}
