import { KeyValue, Panel, Tabs } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Panel title="Northwind">
      <Tabs
        label="Customer"
        items={["Overview", "Invoices", "Notes"]}
        panels={{
          Overview: (
            <KeyValue
              items={[
                { k: "Plan", v: "Team · 24 seats" },
                { k: "MRR", v: "€1,240" },
                { k: "Renews", v: "May 1, 2026" },
              ]}
            />
          ),
          Invoices: <p className="tf-card-desc">Three invoices this year, all paid.</p>,
          Notes: <p className="tf-card-desc">Wants 40 more seats before the renewal.</p>,
        }}
      />
    </Panel>
  );
}
