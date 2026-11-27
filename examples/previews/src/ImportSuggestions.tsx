import * as React from "react";
import { ImportSuggestions, Panel } from "@twentyfirstmedia/ui-core";
import type { ImportSuggestionLine } from "@twentyfirstmedia/ui-core";

const LINES: ImportSuggestionLine[] = [
  {
    id: "1",
    date: "2026-10-02",
    text: "AWS EMEA SARL 1002-4471",
    counterparty: "Amazon Web Services",
    amount: -412.3,
    suggestion: {
      category: "Hosting",
      booking: "4930 Hosting ← 1200 Bank",
      confidence: 0.96,
      reason: "Same vendor as last month",
    },
  },
  {
    id: "2",
    date: "2026-10-03",
    text: "STRIPE PAYOUT 1003",
    counterparty: "Stripe",
    amount: 2318.4,
    suggestion: { category: "Revenue", booking: "1200 Bank ← 1360 Clearing", confidence: 0.91 },
  },
  {
    id: "3",
    date: "2026-10-03",
    text: "STRIPE PAYOUT 1003",
    counterparty: "Stripe",
    amount: 2318.4,
    state: "duplicate",
  },
  {
    id: "4",
    date: "2026-10-05",
    text: "BUERO KONTOR 55821",
    counterparty: "Office Supply Co.",
    amount: -86.9,
    suggestion: {
      category: "Office supplies",
      booking: "4930 Office ← 1200 Bank",
      confidence: 0.72,
    },
  },
  { id: "5", date: "2026-10-06", text: "CARD 4411 COFFEE BAR", amount: -4.2 },
  {
    id: "6",
    date: "2026-10-01",
    text: "RENT OCT 2026",
    counterparty: "Harbour Offices",
    amount: -1850,
    state: "booked",
  },
];

export default function Preview() {
  const [lines, setLines] = React.useState(LINES);
  return (
    <Panel title="Import October">
      <ImportSuggestions
        lines={lines}
        categories={["Hosting", "Revenue", "Office supplies", "Travel", "Meals", "Rent"]}
        onCategoryChange={(id, category) =>
          setLines((l) =>
            l.map((x) =>
              x.id === id && x.suggestion ? { ...x, suggestion: { ...x.suggestion, category } } : x,
            ),
          )
        }
        onEdit={() => {}}
        onConfirm={(ids) =>
          new Promise<void>((r) =>
            setTimeout(() => {
              setLines((l) => l.map((x) => (ids.includes(x.id) ? { ...x, state: "booked" } : x)));
              r();
            }, 900),
          )
        }
      />
    </Panel>
  );
}
