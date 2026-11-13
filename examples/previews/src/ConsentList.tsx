import * as React from "react";
import { ConsentList } from "@twentyfirstmedia/ui-core";
import type { ConsentConnector } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [list, setList] = React.useState<ConsentConnector[]>([
    {
      id: "bank",
      name: "Bank account",
      icon: "card",
      purpose: "Finds bills, subscriptions and price changes; never moves money.",
      lastUsed: new Date(2026, 10, 12),
      scopes: [
        { id: "balance", label: "Balances", granted: true, required: true },
        { id: "tx", label: "Transactions", description: "The last 12 months", granted: true },
        {
          id: "pay",
          label: "Prepare transfers",
          description: "You approve each one",
          granted: false,
        },
      ],
    },
    {
      id: "health",
      name: "Health data",
      icon: "heartPulse",
      purpose: "Sleep, activity and vitals for your daily summary. Stays on this device.",
      lastUsed: new Date(2026, 10, 13),
      scopes: [
        { id: "sleep", label: "Sleep", granted: true },
        { id: "activity", label: "Activity", granted: true },
        { id: "vitals", label: "Heart rate and blood pressure", granted: false },
      ],
    },
  ]);
  return (
    <div style={{ maxWidth: 560 }}>
      <ConsentList
        connectors={list}
        onScopeChange={(c, s, granted) =>
          setList((all) =>
            all.map((x) =>
              x.id === c
                ? { ...x, scopes: x.scopes.map((y) => (y.id === s ? { ...y, granted } : y)) }
                : x,
            ),
          )
        }
        onRevoke={(c) => setList((all) => all.filter((x) => x.id !== c))}
      />
    </div>
  );
}
