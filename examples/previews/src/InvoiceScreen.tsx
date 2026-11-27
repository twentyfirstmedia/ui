import * as React from "react";
import {
  Button,
  InvoiceEditor,
  PageHeader,
  Select,
  TransactionRow,
} from "@twentyfirstmedia/ui-core";
import type { InvoiceDraft } from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";

function App() {
  const [draft, setDraft] = React.useState<InvoiceDraft>({
    customer: "northwind",
    lines: [
      {
        id: "1",
        description: "Halo Team plan · 40 seats · May 2026",
        quantity: 40,
        price: 24,
        vat: 19,
      },
      { id: "2", description: "Onboarding workshop (half day)", quantity: 1, price: 650, vat: 19 },
    ],
    note: "Thank you for your business. Please pay within 14 days.",
  });
  return (
    <Shell
      area="Finance"
      current="invoices"
      action={{
        label: "New invoice",
        icon: "plus",
      }}
      pages={[
        {
          id: "overview",
          label: "Overview",
          icon: "chart",
        },
        {
          id: "invoices",
          label: "Invoices",
          icon: "card",
          count: 4,
        },
        {
          id: "expenses",
          label: "Expenses",
          icon: "file",
          count: 4,
        },
        {
          id: "bank",
          label: "Bank",
          icon: "swap",
          count: 4,
        },
        {
          id: "vat",
          label: "VAT return",
          icon: "flag",
        },
        {
          id: "pnl",
          label: "Profit & loss",
          icon: "trend",
        },
      ]}
    >
      <div className="tf-in">
        <PageHeader
          crumbs={["Finance", "Invoices", "New"]}
          title="Invoice #2097"
          subtitle="Totals update as you type"
          actions={[
            <Button key="d" variant="secondary">
              Save draft
            </Button>,
            <Button key="s" icon="send">
              {"Create & send"}
            </Button>,
          ]}
        />
      </div>
      <div
        className="tf-in"
        style={
          {
            "--d": "80ms",
          } as React.CSSProperties
        }
      >
        <InvoiceEditor
          value={draft}
          onChange={setDraft}
          customers={[
            { id: "northwind", name: "Northwind" },
            { id: "kestrel", name: "Kestrel Bank" },
          ]}
          head={<Select label="Payment terms" options={["14 days", "30 days"]} />}
          preview={{
            brand: "Halo",
            number: 2097,
            from: "Halo Workspace GmbH · Example Street 1 · 20457 Hamburg",
            issued: "Apr 16, 2026",
            due: "Apr 30, 2026",
          }}
        />
      </div>
      <div
        className="tf-col tf-in"
        style={
          {
            gap: 8,
            "--d": "240ms",
          } as React.CSSProperties
        }
      >
        <h3
          className="tf-card-title"
          style={{
            padding: 0,
          }}
        >
          Bank: to match
        </h3>
        <TransactionRow
          text="STRIPE PAYOUT 0415"
          date="Apr 15, 2026"
          amount={2318.4}
          hint="Payout for 3 card payments: invoices #2093, #2094, #2095"
        />
      </div>
    </Shell>
  );
}
export default function Preview() {
  return <App />;
}
