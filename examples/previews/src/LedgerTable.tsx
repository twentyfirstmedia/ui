import { LedgerTable, PnLStatement, ReceiptSuggestion } from "@twentyfirstmedia/ui-core";
import type { LedgerRow } from "@twentyfirstmedia/ui-core";

const rows: LedgerRow[] = [
  {
    id: 1,
    date: "02.04.",
    ref: "RE-0412",
    text: "Hetzner Online GmbH",
    category: "Hosting",
    project: "Northwind",
    projectTint: "sky",
    net: 84.03,
    vat: 15.97,
    gross: 100.0,
    status: "ok",
    statusLabel: "Booked",
  },
  {
    id: 2,
    date: "03.04.",
    ref: "ST-2231",
    text: "Stripe payout",
    category: "Revenue",
    project: "Chatteo",
    projectTint: "mint",
    net: 4210.0,
    vat: 0,
    gross: 4210.0,
    status: "ok",
    statusLabel: "Booked",
  },
  {
    id: 3,
    date: "04.04.",
    ref: "MAIL-88",
    text: "Google Ireland Ltd.",
    category: "Marketing",
    project: "Northwind",
    projectTint: "sky",
    net: -320.0,
    vat: 0,
    gross: -320.0,
    suggested: "Ledger",
    status: "signal",
    statusLabel: "Suggested",
  },
];
export default function Preview() {
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <div className="tf-panel tf-panel-flush">
        <LedgerTable
          rows={rows}
          selectable
          categories={["Hosting", "Revenue", "Marketing", "Software"]}
          bulkActions={[
            {
              label: "Confirm",
              icon: "check",
              onClick: (r, c) => {
                c();
              },
            },
          ]}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 16,
        }}
      >
        <div className="tf-panel">
          <PnLStatement
            columns={["Jan", "Feb", "Mar"]}
            rows={[
              {
                kind: "section",
                label: "Revenue",
              },
              {
                label: "Subscriptions",
                values: [18200, 19400, 21100],
              },
              {
                label: "One-off",
                values: [2100, 1800, 2600],
              },
              {
                kind: "section",
                label: "Costs",
              },
              {
                label: "Hosting",
                values: [-820, -840, -910],
              },
              {
                label: "Marketing",
                values: [-4200, -3900, -5100],
              },
              {
                kind: "total",
                label: "Result",
                values: [15280, 16460, 17690],
              },
            ]}
          />
        </div>
        <ReceiptSuggestion
          file="Rechnung_2026-0412.pdf"
          source="From billing@hetzner.com · 2 Apr"
          fields={[
            {
              label: "Vendor",
              value: "Hetzner Online GmbH",
              confidence: 0.99,
            },
            {
              label: "Date",
              value: "02.04.2026",
              mono: true,
              confidence: 0.98,
            },
            {
              label: "Gross",
              value: "€100.00",
              mono: true,
              confidence: 0.97,
            },
            {
              label: "VAT",
              value: "19 %",
              confidence: 0.72,
            },
          ]}
          suggestion="Hosting · Northwind · as every month"
          onConfirm={() => {}}
          onDiscard={() => {}}
        />
      </div>
    </div>
  );
}
