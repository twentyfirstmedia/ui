import * as React from "react";
import { MedicationList, Panel } from "@twentyfirstmedia/ui-core";
import type { MedicationItem } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [items, setItems] = React.useState<MedicationItem[]>([
    { id: "d", name: "Vitamin D", dose: "1,000 IU", time: "07:30", status: "taken" },
    {
      id: "m",
      name: "Metformin",
      dose: "500 mg",
      note: "With breakfast",
      time: "08:00",
      status: "missed",
    },
    { id: "r", name: "Ramipril", dose: "5 mg", time: "13:00", status: "due" },
    {
      id: "s",
      name: "Magnesium",
      dose: "300 mg",
      note: "Before bed",
      time: "22:00",
      status: "upcoming",
    },
  ]);
  return (
    <Panel title="Today" subtitle="4 doses · 1 taken" style={{ maxWidth: 560 }}>
      <MedicationList
        items={items}
        onTake={(id) =>
          setItems((list) => list.map((m) => (m.id === id ? { ...m, status: "taken" } : m)))
        }
      />
    </Panel>
  );
}
