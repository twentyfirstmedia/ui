import * as React from "react";
import { DeadlineList, Panel } from "@twentyfirstmedia/ui-core";
import type { DeadlineItem } from "@twentyfirstmedia/ui-core";

const today = new Date(2026, 10, 13);

export default function Preview() {
  const [items, setItems] = React.useState<DeadlineItem[]>([
    {
      id: "tax",
      title: "Income tax return",
      kind: "Tax",
      date: new Date(2026, 10, 10),
      note: "Extension possible",
    },
    { id: "car", title: "Car inspection", kind: "Car", date: new Date(2026, 10, 13) },
    { id: "gym", title: "Gym: last day to cancel", kind: "Contract", date: new Date(2026, 10, 20) },
    { id: "rent", title: "Rent", kind: "Bill", date: new Date(2026, 11, 1), amount: 1150 },
    {
      id: "id",
      title: "Passport renewal",
      kind: "Document",
      date: new Date(2027, 1, 14),
      note: "Lena",
    },
    {
      id: "elec",
      title: "Electricity",
      kind: "Bill",
      date: new Date(2026, 10, 2),
      amount: 99,
      done: true,
    },
  ]);
  return (
    <Panel title="Deadlines" subtitle="Next 90 days" style={{ maxWidth: 620 }}>
      <DeadlineList
        today={today}
        items={items}
        onDone={(id) => setItems((all) => all.map((d) => (d.id === id ? { ...d, done: true } : d)))}
      />
    </Panel>
  );
}
