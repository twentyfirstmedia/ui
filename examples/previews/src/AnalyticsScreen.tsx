import * as React from "react";
import {
  AppShell,
  BarChart,
  Button,
  CountUp,
  Donut,
  LineChart,
  PageHeader,
  Panel,
  Sparkline,
  Stagger,
  Table,
  Tabs,
  TintIcon,
} from "@twentyfirstmedia/ui-core";
import type { IconName, Tint } from "@twentyfirstmedia/ui-core";

interface KpiProps {
  label: string;
  value: string;
  delta: string;
  up?: boolean;
  icon: IconName;
  tint: Tint;
  spark: number[];
}

function Kpi(p: KpiProps) {
  return (
    <div
      className="tf-card"
      style={{
        minHeight: 0,
        gap: 8,
      }}
    >
      <div
        className="tf-row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <span className="tf-card-desc">{p.label}</span>
        <TintIcon icon={p.icon} tint={p.tint} />
      </div>
      <div
        className="tf-row"
        style={{
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <CountUp className="tf-stat-value" value={p.value} />
          <div
            style={{
              font: "var(--type-label-weight) 12px/16px var(--font-sans)",
              color: "var(--" + (p.up ? "mint" : "blush") + "-ink)",
              marginTop: 2,
            }}
          >
            {p.delta}
          </div>
        </div>
        <Sparkline values={p.spark} tint={p.up ? "mint" : "blush"} width={96} height={34} />
      </div>
    </div>
  );
}
function App() {
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="Reports"
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          title="Analytics"
          subtitle="How the workspace is growing, week over week"
          actions={[
            <Tabs
              key="t"
              items={["7 days", "30 days", "Quarter", "Year"]}
              defaultValue="30 days"
            />,
            <Button key="e" variant="secondary" icon="download">
              Export
            </Button>,
          ]}
        />
      </div>
      <Stagger
        className="tf-grid"
        style={
          {
            "--cols": "repeat(4, 1fr)",
            "--cols-sm": "repeat(2, minmax(0, 1fr))",
            "--cols-md": "repeat(2, minmax(0, 1fr))",
          } as React.CSSProperties
        }
        delay={80}
      >
        <Kpi
          label="Revenue"
          value="$41,280"
          delta="+18.2% vs last month"
          up
          icon="card"
          tint="butter"
          spark={[18, 22, 21, 29, 34, 38, 41]}
        />
        <Kpi
          label="Active members"
          value="1,284"
          delta="+6.4%"
          up
          icon="users"
          tint="sky"
          spark={[9, 10, 10, 11, 12, 12, 13]}
        />
        <Kpi
          label="Conversion"
          value="4.8%"
          delta="+0.6 pts"
          up
          icon="trend"
          tint="mint"
          spark={[3.9, 4.1, 4.0, 4.4, 4.5, 4.6, 4.8]}
        />
        <Kpi
          label="Churn"
          value="1.9%"
          delta="+0.3 pts"
          up={false}
          icon="flag"
          tint="blush"
          spark={[1.4, 1.5, 1.5, 1.6, 1.8, 1.7, 1.9]}
        />
      </Stagger>
      <Stagger
        className="tf-grid"
        style={
          {
            "--cols": "1.6fr 1fr",
          } as React.CSSProperties
        }
        delay={300}
      >
        <Panel
          title="Revenue"
          subtitle="Subscriptions vs. services"
          action={
            <div className="tf-legend">
              <span>
                <i
                  style={{
                    background: "var(--mint-ink)",
                  }}
                />
                Subscriptions
              </span>
              <span>
                <i
                  style={{
                    background: "var(--sky-ink)",
                  }}
                />
                Services
              </span>
            </div>
          }
        >
          <LineChart
            height={190}
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
            format={(v) => "$" + Math.round(v / 1000) + "k"}
            series={[
              {
                values: [18000, 22000, 21000, 29000, 34000, 38000, 41000],
                tint: "mint",
                area: true,
              },
              {
                values: [9000, 11000, 14000, 13000, 17000, 19000, 23000],
                tint: "sky",
              },
            ]}
          />
        </Panel>
        <Panel title="Plan mix" subtitle="1,284 paying members">
          <Donut
            size={150}
            stroke={20}
            center="1,284"
            caption="members"
            data={[
              {
                label: "Team",
                value: 54,
                tint: "sky",
              },
              {
                label: "Starter",
                value: 26,
                tint: "mint",
              },
              {
                label: "Business",
                value: 14,
                tint: "lilac",
              },
              {
                label: "Trial",
                value: 6,
                tint: "butter",
              },
            ]}
          />
        </Panel>
      </Stagger>
      <Stagger
        className="tf-grid"
        style={
          {
            "--cols": "1fr 1.2fr",
          } as React.CSSProperties
        }
        delay={480}
      >
        <Panel title="Sign-ups this week" subtitle="Thursday was the launch email">
          <BarChart
            height={150}
            data={[
              {
                label: "Mon",
                value: 32,
              },
              {
                label: "Tue",
                value: 48,
              },
              {
                label: "Wed",
                value: 41,
              },
              {
                label: "Thu",
                value: 86,
                tint: "lilac",
              },
              {
                label: "Fri",
                value: 58,
              },
              {
                label: "Sat",
                value: 22,
              },
              {
                label: "Sun",
                value: 18,
              },
            ]}
          />
        </Panel>
        <Panel title="Top channels">
          <Table
            columns={[
              {
                key: "ch",
                label: "Channel",
                render: (r) => (
                  <span className="tf-row">
                    <TintIcon icon={r.icon} tint={r.tint} />
                    {r.ch}
                  </span>
                ),
              },
              {
                key: "v",
                label: "Visits",
                align: "right",
              },
              {
                key: "c",
                label: "Conv.",
                align: "right",
              },
              {
                key: "t",
                label: "Trend",
                align: "right",
                render: (r) => (
                  <Sparkline values={r.s} tint={r.up ? "mint" : "blush"} width={70} height={22} />
                ),
              },
            ]}
            rows={[
              {
                ch: "Organic search",
                icon: "search",
                tint: "sky",
                v: "24,180",
                c: "5.2%",
                s: [3, 4, 4, 5, 6, 6, 7],
                up: true,
              },
              {
                ch: "Newsletter",
                icon: "mail",
                tint: "butter",
                v: "9,402",
                c: "7.9%",
                s: [2, 2, 3, 5, 4, 6, 7],
                up: true,
              },
              {
                ch: "Partners",
                icon: "users",
                tint: "mint",
                v: "6,115",
                c: "6.1%",
                s: [5, 5, 4, 5, 6, 6, 6],
                up: true,
              },
              {
                ch: "Paid social",
                icon: "globe",
                tint: "blush",
                v: "5,870",
                c: "2.3%",
                s: [6, 5, 5, 4, 4, 3, 3],
                up: false,
              },
            ]}
          />
        </Panel>
      </Stagger>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
