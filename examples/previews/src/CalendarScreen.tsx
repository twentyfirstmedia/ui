import * as React from "react";
import {
  AppShell,
  Button,
  EventCard,
  IconButton,
  PageHeader,
  Panel,
  Stagger,
  Tabs,
} from "@twentyfirstmedia/ui-core";

const DAYS = ["Mon 13", "Tue 14", "Wed 15", "Thu 16", "Fri 17"];
const EV = [
  {
    d: 0,
    s: 9,
    e: 10,
    t: "Standup",
    tint: "sky",
    who: "Team",
  },
  {
    d: 0,
    s: 13,
    e: 14.5,
    t: "Hiring panel",
    tint: "lilac",
    who: "Design",
  },
  {
    d: 1,
    s: 10.5,
    e: 12,
    t: "Team sync",
    tint: "sky",
    who: "Growth + Design",
  },
  {
    d: 1,
    s: 15,
    e: 16,
    t: "Partner call",
    tint: "mint",
    who: "Northwind",
  },
  {
    d: 2,
    s: 9,
    e: 10,
    t: "Standup",
    tint: "sky",
    who: "Team",
  },
  {
    d: 2,
    s: 14,
    e: 15.5,
    t: "Design review",
    tint: "lilac",
    who: "Billing flow",
  },
  {
    d: 3,
    s: 11,
    e: 12.5,
    t: "Pricing review",
    tint: "butter",
    who: "Moved from Wed",
  },
  {
    d: 3,
    s: 16,
    e: 17,
    t: "Incident retro",
    tint: "blush",
    who: "Webhooks #88",
  },
  {
    d: 4,
    s: 9,
    e: 10,
    t: "Standup",
    tint: "sky",
    who: "Team",
  },
  {
    d: 4,
    s: 15.5,
    e: 17,
    t: "Q2 invoices due",
    tint: "butter",
    who: "Finance",
  },
];
const START = 8,
  END = 18,
  ROW = 48;
function App() {
  const hours = [];
  for (let i = START; i <= END; i++) hours.push(i);
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="Calendar"
      dock={false}
      side={
        <Panel side title="Up next" subtitle="Thursday, 16 April">
          <div
            className="tf-card tf-in"
            style={
              {
                minHeight: 0,
                gap: 12,
                padding: 16,
                "--d": "200ms",
              } as React.CSSProperties
            }
          >
            <div
              className="tf-row"
              style={{
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                }}
              >
                April 2026
              </span>
              <span
                className="tf-row"
                style={{
                  gap: 4,
                }}
              >
                <IconButton icon="chevronLeft" label="Previous month" size="sm" />
                <IconButton icon="chevronRight" label="Next month" size="sm" />
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 4,
                textAlign: "center",
                font: "600 11.5px/28px var(--font-sans)",
              }}
            >
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span
                  key={"h" + i}
                  style={{
                    color: "var(--ink-muted)",
                  }}
                >
                  {d}
                </span>
              ))}
              {([null, null] as (number | null)[])
                .concat(
                  Array.from(
                    {
                      length: 30,
                    },
                    (_, i) => i + 1,
                  ),
                )
                .map((n, i) => {
                  const on = n != null && n >= 13 && n <= 17,
                    today = n === 16;
                  return (
                    <span
                      key={i}
                      style={{
                        borderRadius: 999,
                        background: today ? "var(--accent)" : on ? "var(--sky)" : "transparent",
                        color: today ? "var(--on-accent)" : "var(--ink)",
                      }}
                    >
                      {n || ""}
                    </span>
                  );
                })}
            </div>
          </div>
          <Stagger className="tf-col" delay={320}>
            <EventCard
              kind="review"
              label="Pricing review"
              date="Thu, 16.04"
              time="11:00"
              tint="butter"
              icon="card"
            >
              Moved from Wednesday so Growth can join.
            </EventCard>
            <EventCard kind="incident" label="Incident retro" date="Thu, 16.04" time="16:00">
              What delayed EU webhooks and how we stop it.
            </EventCard>
          </Stagger>
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Calendar"
          subtitle="Week 16 · 10 events"
          actions={[
            <Tabs key="t" items={["Day", "Week", "Month"]} defaultValue="Week" />,
            <Button key="n" icon="plus">
              New event
            </Button>,
          ]}
        />
      </div>
      <div
        className="tf-panel tf-in"
        style={
          {
            "--d": "120ms",
            padding: 16,
            gap: 0,
            overflowX: "auto",
          } as React.CSSProperties
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "48px repeat(5, 1fr)",
            minWidth: 560,
            gap: 8,
            paddingBottom: 12,
          }}
        >
          <span />
          {DAYS.map((d, i) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                font: "700 13px/18px var(--font-sans)",
                padding: "8px 0",
                borderRadius: 999,
                background: i === 3 ? "var(--accent)" : "transparent",
                color: i === 3 ? "var(--on-accent)" : "var(--ink)",
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "48px repeat(5, 1fr)",
            minWidth: 560,
            gap: 8,
            position: "relative",
          }}
        >
          <div>
            {hours.slice(0, -1).map((hr) => (
              <div
                key={hr}
                style={{
                  height: ROW,
                  font: "600 11px/1 var(--font-sans)",
                  color: "var(--ink-muted)",
                }}
              >
                {(hr < 10 ? "0" : "") + hr + ":00"}
              </div>
            ))}
          </div>
          {DAYS.map((d, di) => (
            <div
              key={d}
              style={{
                position: "relative",
                height: ROW * (END - START),
                backgroundImage:
                  "repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px " +
                  ROW +
                  "px)",
                borderRadius: 12,
              }}
            >
              {EV.filter((e) => e.d === di).map((e, i) => (
                <div
                  key={i}
                  className={"tf-in tf-bg-" + e.tint}
                  style={
                    {
                      "--d": 200 + di * 70 + i * 60 + "ms",
                      position: "absolute",
                      left: 4,
                      right: 4,
                      top: (e.s - START) * ROW + 2,
                      height: (e.e - e.s) * ROW - 4,
                      borderRadius: 12,
                      padding: "8px 12px",
                      boxSizing: "border-box",
                      overflow: "hidden",
                    } as React.CSSProperties
                  }
                >
                  <div
                    style={{
                      font: "700 12.5px/16px var(--font-sans)",
                    }}
                  >
                    {e.t}
                  </div>
                  <div
                    style={{
                      font: "500 11.5px/15px var(--font-sans)",
                      opacity: 0.78,
                    }}
                  >
                    {e.who}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
