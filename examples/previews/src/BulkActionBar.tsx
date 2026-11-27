import * as React from "react";
import { BulkActionBar, Checkbox, ListRow } from "@twentyfirstmedia/ui-core";

const MAILS = [
  { id: "m1", from: "Lena Hart", subject: "Quarterly numbers for the board" },
  { id: "m2", from: "Noah Berg", subject: "Re: venue for the offsite" },
  { id: "m3", from: "Billing", subject: "Your invoice for November" },
  { id: "m4", from: "Ava Brandt", subject: "Draft of the hiring plan" },
];

export default function Preview() {
  const [selected, setSelected] = React.useState<string[]>(["m1", "m3"]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <div className="tf-panel" style={{ gap: 8, minHeight: 360 }}>
      <BulkActionBar
        floating={false}
        count={selected.length}
        onClear={() => setSelected([])}
        actions={[
          { label: "Archive", icon: "archive", onClick: () => setSelected([]) },
          { label: "Mark read", icon: "check", onClick: () => setSelected([]) },
          { label: "Delete", icon: "trash", danger: true, onClick: () => setSelected([]) },
        ]}
      />
      {MAILS.map((m) => (
        <ListRow
          key={m.id}
          leading={
            <Checkbox
              label={`Select ${m.subject}`}
              checked={selected.includes(m.id)}
              onChange={() => {
                toggle(m.id);
              }}
            />
          }
          title={m.subject}
          subtitle={m.from}
        />
      ))}
    </div>
  );
}
