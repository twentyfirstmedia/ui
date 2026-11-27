import * as React from "react";
import { ApprovalInbox } from "@twentyfirstmedia/ui-core";
import type { ApprovalInboxItem, ApprovalKey } from "@twentyfirstmedia/ui-core";

const ITEMS: ApprovalInboxItem[] = [
  {
    id: 1,
    title: "Send reply to Northwind",
    agent: "Atlas",
    project: "Support",
    family: "comms",
    age: "2 h 10 min",
    ageMin: 130,
    urgent: true,
  },
  {
    id: 2,
    title: "Refund €10.00 to card ending 4242",
    agent: "Ledger",
    project: "Billing",
    family: "money",
    age: "38 min",
    ageMin: 38,
  },
  {
    id: 3,
    title: "Set daily ad budget to €30",
    agent: "Ads",
    project: "Marketing",
    family: "marketing",
    age: "12 min",
    ageMin: 12,
  },
  {
    id: 4,
    title: "Add TXT record ops-test",
    agent: "Scout",
    project: "Domains",
    family: "infra",
    age: "3 min",
    ageMin: 3,
  },
  {
    id: 5,
    title: "Restart nginx on web-1",
    agent: "Ops",
    project: "Platform",
    family: "infra",
    decision: { key: "A", by: "Mara Ellis", at: "08:12" },
  },
  {
    id: 6,
    title: "Delete the duplicate contact Ida N.",
    agent: "Growth",
    project: "Sales",
    family: "apps",
    decision: { key: "C", by: "Lukas", at: "Yesterday" },
  },
];

export default function Preview() {
  const [items, setItems] = React.useState(ITEMS);
  const [selected, setSelected] = React.useState<string | number>(1);
  const decide = (id: string | number, key: ApprovalKey) => {
    // A and C decide at once; B and D would open the text field of the card next to the list
    if (key !== "A" && key !== "C") return;
    setItems((all) =>
      all.map((x) => (x.id === id ? { ...x, decision: { key, by: "You", at: "now" } } : x)),
    );
  };
  return (
    <div className="tf-panel">
      <ApprovalInbox
        items={items}
        selected={selected}
        onSelect={setSelected}
        onDecide={decide}
        filters
      />
    </div>
  );
}
