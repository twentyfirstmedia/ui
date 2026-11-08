import * as React from "react";
import {
  Button,
  InvoicePreview,
  PageHeader,
  Select,
  TintIcon,
  TransactionRow,
} from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";

function App() {
  const lines = [
    {
      d: "Halo Team plan · 40 seats · May 2026",
      q: 40,
      u: 24,
      v: 19,
    },
    {
      d: "Onboarding workshop (half day)",
      q: 1,
      u: 650,
      v: 19,
    },
  ];
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
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div
          className="tf-panel tf-in"
          style={
            {
              "--d": "80ms",
            } as React.CSSProperties
          }
        >
          <div
            className="tf-grid"
            style={{
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Select label="Customer" options={["Northwind", "Kestrel Bank"]} />
            <Select label="Payment terms" options={["14 days", "30 days"]} />
          </div>
          {lines.map((l, i) => (
            <div key={i} className="tf-file">
              <TintIcon icon="card" tint="butter" />
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div className="tf-file-name">{l.d}</div>
                <div className="tf-file-meta">{l.q + " × €" + l.u + " · VAT " + l.v + "%"}</div>
              </div>
              <b>{"€" + (l.q * l.u).toLocaleString("en-US") + ".00"}</b>
            </div>
          ))}
          <Button variant="soft" icon="plus">
            Add line
          </Button>
        </div>
        <div
          className="tf-in"
          style={
            {
              "--d": "160ms",
            } as React.CSSProperties
          }
        >
          <InvoicePreview
            brand="Halo"
            number={2097}
            from="Halo Workspace GmbH · Example Street 1 · 20457 Hamburg"
            to="Northwind"
            issued="16.04.2026"
            due="30.04.2026"
            lines={lines}
            note="Thank you for your business. Please pay within 14 days."
          />
        </div>
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
          date="15.04.2026"
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
