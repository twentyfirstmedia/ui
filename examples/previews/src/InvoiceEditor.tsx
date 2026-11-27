import * as React from "react";
import { Button, InvoiceEditor, Select } from "@twentyfirstmedia/ui-core";
import type { InvoiceDraft } from "@twentyfirstmedia/ui-core";

const CUSTOMERS = [
  { id: "northwind", name: "Northwind", detail: "Hamburg · net 14 days" },
  { id: "kestrel", name: "Kestrel Bank", detail: "Berlin · net 30 days" },
  { id: "sunline", name: "Sunline Travel", detail: "Munich · net 14 days" },
];

export default function Preview() {
  const [value, setValue] = React.useState<InvoiceDraft>({
    customer: "northwind",
    lines: [
      {
        id: "1",
        description: "Team plan · 40 seats · May 2026",
        quantity: 40,
        unit: "Seat",
        price: 24,
        vat: 19,
      },
      {
        id: "2",
        description: "Onboarding workshop (half day)",
        quantity: 1,
        unit: "Day",
        price: 650,
        vat: 19,
        discount: 10,
      },
      {
        id: "3",
        description: "Printed handbook",
        quantity: 12,
        unit: "Piece",
        price: 18.5,
        vat: 7,
      },
    ],
    note: "Thank you for your business. Please pay within 14 days.",
  });
  return (
    <InvoiceEditor
      value={value}
      onChange={setValue}
      customers={CUSTOMERS}
      customerAction={
        <Button variant="secondary" icon="plus">
          New
        </Button>
      }
      head={<Select label="Payment terms" options={["14 days", "30 days"]} />}
      units={["Seat", "Day", "Hour", "Piece"]}
      preview={{
        brand: "Halo",
        number: 2097,
        from: "Halo Workspace GmbH · Example Street 1 · 20457 Hamburg",
        issued: "Apr 16, 2026",
        due: "Apr 30, 2026",
      }}
      footnote="The number is given when the invoice is issued."
      actions={
        <>
          <Button variant="secondary">Save draft</Button>
          <Button icon="send">Issue invoice</Button>
        </>
      }
    />
  );
}
