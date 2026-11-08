import * as React from "react";
import {
  AppShell,
  Avatar,
  Badge,
  BarChart,
  Button,
  Icon,
  IconButton,
  PageHeader,
  Panel,
  Progress,
  ProgressRing,
  Stagger,
  StatTile,
  Table,
} from "@twentyfirstmedia/ui-core";

const INV = [
  {
    id: "#2044",
    c: "Northwind",
    d: "12.04.2026",
    a: "$1,240.00",
    s: "Paid",
    tone: "success",
  },
  {
    id: "#2043",
    c: "Copperline",
    d: "10.04.2026",
    a: "$3,900.00",
    s: "Due",
    tone: "info",
  },
  {
    id: "#2042",
    c: "Blue Fern",
    d: "08.04.2026",
    a: "$420.00",
    s: "Paid",
    tone: "success",
  },
  {
    id: "#2041",
    c: "Harbor & Co",
    d: "02.03.2026",
    a: "$860.00",
    s: "Overdue",
    tone: "danger",
  },
  {
    id: "#2040",
    c: "Lumen Labs",
    d: "28.02.2026",
    a: "$2,150.00",
    s: "Paid",
    tone: "success",
  },
];
function App() {
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="Billing"
      side={
        <Panel side title="Your plan" subtitle="Renews on 01.05.2026">
          <div
            className="tf-card tf-bg-lilac"
            style={{
              minHeight: 0,
            }}
          >
            <div
              className="tf-row"
              style={{
                justifyContent: "space-between",
              }}
            >
              <span
                className="tf-card-title"
                style={{
                  padding: 0,
                }}
              >
                Team
              </span>
              <Badge tone="neutral" dot={false}>
                Annual
              </Badge>
            </div>
            <div>
              <span className="tf-stat-value">$96</span>
              <span className="tf-card-desc">{" / seat / month"}</span>
            </div>
            <Button variant="primary" iconRight="arrowUpRight">
              Upgrade to Business
            </Button>
          </div>
          <div
            className="tf-row"
            style={{
              gap: 16,
              flexWrap: "nowrap",
            }}
          >
            <ProgressRing value={90} tint="butter" size={76} stroke={8} />
            <div>
              <div
                style={{
                  fontWeight: 700,
                }}
              >
                38 of 42 seats
              </div>
              <div className="tf-card-desc">Add seats before inviting more people.</div>
            </div>
          </div>
          <h3
            className="tf-card-title"
            style={{
              fontSize: 16,
            }}
          >
            Usage
          </h3>
          <div className="tf-col">
            <div>
              <div
                className="tf-row"
                style={{
                  justifyContent: "space-between",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                <span>Storage</span>
                <span>62 / 100 GB</span>
              </div>
              <Progress value={62} tint="sky" />
            </div>
            <div>
              <div
                className="tf-row"
                style={{
                  justifyContent: "space-between",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                <span>API calls</span>
                <span>41k / 50k</span>
              </div>
              <Progress value={82} tint="butter" />
            </div>
          </div>
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Billing"
          subtitle="Invoices, payments and your subscription"
          actions={[
            <Button key="e" variant="secondary" icon="download">
              Export CSV
            </Button>,
            <Button key="n" icon="plus">
              New invoice
            </Button>,
          ]}
        />
      </div>
      <Stagger
        className="tf-grid"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
        delay={80}
      >
        <StatTile tint="butter" value="$48,210" label="Collected (MTD)" />
        <StatTile tint="sky" value="$12,480" label="Outstanding" />
        <StatTile tint="blush" value="3" label="Overdue invoices" />
        <StatTile tint="mint" value="98.2%" label="On-time rate" />
      </Stagger>
      <Stagger
        className="tf-grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
        }}
        delay={280}
      >
        <div
          className="tf-card"
          style={{
            minHeight: 0,
            background: "var(--frame)",
            color: "var(--on-frame)",
          }}
        >
          <div
            className="tf-row"
            style={{
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                font: "600 12px/16px var(--font-sans)",
                color: "var(--on-frame-muted)",
              }}
            >
              Default payment method
            </span>
            <Icon name="card" size={20} />
          </div>
          <div
            style={{
              font: "700 20px/26px var(--font-sans)",
              letterSpacing: ".08em",
            }}
          >
            •••• •••• •••• 4417
          </div>
          <div
            className="tf-row"
            style={{
              justifyContent: "space-between",
              color: "var(--on-frame-muted)",
              fontSize: 13,
            }}
          >
            <span>Mara Ellis</span>
            <span>Expires 04/26</span>
          </div>
        </div>
        <Panel title="Collected per month">
          <BarChart
            height={92}
            barWidth={22}
            format={(v) => "$" + Math.round(v / 1000) + "k"}
            data={[
              {
                label: "Nov",
                value: 31000,
              },
              {
                label: "Dec",
                value: 28000,
              },
              {
                label: "Jan",
                value: 36000,
              },
              {
                label: "Feb",
                value: 39000,
              },
              {
                label: "Mar",
                value: 44000,
              },
              {
                label: "Apr",
                value: 48210,
                tint: "butter",
              },
            ]}
          />
        </Panel>
      </Stagger>
      <div
        className="tf-panel tf-panel-flush tf-in"
        style={
          {
            "--d": "420ms",
          } as React.CSSProperties
        }
      >
        <Table
          columns={[
            {
              key: "id",
              label: "Invoice",
            },
            {
              key: "c",
              label: "Customer",
              render: (r) => (
                <span className="tf-row">
                  <Avatar name={r.c} size={26} />
                  {r.c}
                </span>
              ),
            },
            {
              key: "d",
              label: "Issued",
            },
            {
              key: "s",
              label: "Status",
              render: (r) => <Badge tone={r.tone}>{r.s}</Badge>,
            },
            {
              key: "a",
              label: "Amount",
              align: "right",
            },
            {
              key: "x",
              label: "",
              align: "right",
              render: () => <IconButton icon="download" label="Download PDF" size="sm" />,
            },
          ]}
          rows={INV}
        />
      </div>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
