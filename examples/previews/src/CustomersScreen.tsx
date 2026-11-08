import * as React from "react";
import {
  Avatar,
  Badge,
  Drawer,
  ListRow,
  PageHeader,
  SearchField,
  Stagger,
  StatTile,
  Table,
  Tabs,
} from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";
import type { Tone } from "@twentyfirstmedia/ui-core";

const CO: [string, string, string, number, string][] = [
  ["Northwind", "Logistics · Hamburg", "Team", 1240, "Good"],
  ["Kestrel Bank", "Banking · Frankfurt", "Business", 3880, "Good"],
  ["Copperline", "Manufacturing · Munich", "Starter", 190, "Watch"],
  ["Harbor & Co", "Retail · Cologne", "Team", 1468, "At risk"],
  ["Lumen Labs", "Research · Vienna", "Business", 4076, "Good"],
  ["Orbit Foods", "Food · Zurich", "Team", 1445, "Good"],
];
const HT: Record<string, Tone> = {
  Good: "success",
  Watch: "warning",
  "At risk": "danger",
};
function App() {
  return (
    <Shell
      area="Customers"
      current="companies"
      action={{
        label: "New deal",
        icon: "plus",
      }}
      pages={[
        {
          id: "companies",
          label: "Companies",
          icon: "grid",
          count: 1,
        },
        {
          id: "pipeline",
          label: "Pipeline",
          icon: "trend",
          count: 2,
        },
        {
          id: "contacts",
          label: "Contacts",
          icon: "user",
        },
      ]}
      overlay={
        <Drawer
          inline
          title="Northwind"
          subtitle="Logistics · Hamburg · customer since 2021"
          avatar="Northwind"
          onClose={() => {}}
        >
          <div className="tf-row">
            <Badge tone="success">Good</Badge>
            <Badge tone="info" dot={false}>
              Team · 24 seats
            </Badge>
            <Badge dot={false}>Owner: Mara Ellis</Badge>
          </div>
          <Tabs block items={["Overview", "Invoices", "Mail", "Agent brief"]} />
          <div
            className="tf-grid"
            style={{
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <StatTile tint="butter" value="€1,240" label="MRR" />
            <StatTile tint="mint" value="€14,880" label="Paid to date" />
          </div>
          <ListRow
            avatar="Ida Nolan"
            title="Ida Nolan"
            subtitle="Head of Ops · ida@northwind.example"
          />
          <ListRow
            avatar="Amara Silva"
            title="Amara Silva"
            subtitle="IT admin · amara@northwind.example"
          />
        </Drawer>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Companies"
          subtitle="15 customers · example data"
          actions={[<SearchField key="s" placeholder="Search companies" />]}
        />
      </div>
      <Stagger
        className="tf-grid"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        }}
        delay={80}
      >
        <StatTile tint="butter" value="€33,067" label="Monthly recurring revenue" />
        <StatTile tint="sky" value="15" label="Customers" />
        <StatTile tint="placeholder" value="5" label="Need attention" />
        <StatTile tint="mint" value="€182,600" label="Open pipeline" />
      </Stagger>
      <div
        className="tf-panel tf-in"
        style={
          {
            padding: 12,
            "--d": "260ms",
          } as React.CSSProperties
        }
      >
        <Table
          columns={[
            {
              key: "0",
              label: "Company",
              render: (r) => (
                <span
                  className="tf-row"
                  style={{
                    flexWrap: "nowrap",
                  }}
                >
                  <Avatar name={r[0]} size={30} />
                  <span>
                    <b>{r[0]}</b>
                    <div className="tf-card-desc">{r[1]}</div>
                  </span>
                </span>
              ),
            },
            {
              key: "2",
              label: "Plan",
              render: (r) => (
                <Badge
                  tone={r[2] === "Business" ? "highlight" : r[2] === "Team" ? "info" : "neutral"}
                  dot={false}
                >
                  {r[2]}
                </Badge>
              ),
            },
            {
              key: "3",
              label: "MRR",
              align: "right",
              render: (r) => "€" + r[3].toLocaleString("en-US"),
            },
            {
              key: "4",
              label: "Health",
              render: (r) => <Badge tone={HT[r[4]]}>{r[4]}</Badge>,
            },
          ]}
          rows={CO}
        />
      </div>
    </Shell>
  );
}
export default function Preview() {
  return <App />;
}
