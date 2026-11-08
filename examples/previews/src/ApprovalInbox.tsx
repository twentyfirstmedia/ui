import * as React from "react";
import { ApprovalInbox } from "@twentyfirstmedia/ui-core";
import type { ApprovalInboxItem } from "@twentyfirstmedia/ui-core";

const items: ApprovalInboxItem[] = [
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
    project: "Chatteo",
    family: "money",
    age: "38 min",
    ageMin: 38,
  },
  {
    id: 3,
    title: "Set daily ad budget to €30",
    agent: "Ads",
    project: "Northwind",
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
];
function App() {
  const s = React.useState<string | number>(1);
  return (
    <div className="tf-panel tf-panel-flush tf-panel-list">
      <ApprovalInbox items={items} selected={s[0]} onSelect={s[1]} />
    </div>
  );
}
export default App;
