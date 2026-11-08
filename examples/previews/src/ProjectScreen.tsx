import * as React from "react";
import {
  AppShell,
  Avatar,
  AvatarStack,
  Badge,
  Button,
  Checkbox,
  FileRow,
  PageHeader,
  Panel,
  ProgressRing,
  Stagger,
  StatTile,
  Tabs,
  Timeline,
} from "@twentyfirstmedia/ui-core";

function App() {
  const tasks: [string, boolean][] = [
    ["Draft new tier names", true],
    ["Comparison table component", true],
    ["Localise tiers for DE and FR", false],
    ["Checkout seat selector", false],
    ["Write FAQ for annual plans", false],
  ];
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="Projects"
      side={
        <Panel side title="Activity" subtitle="Last 7 days">
          <Timeline
            delay={300}
            items={[
              {
                avatar: "Mara Ellis",
                text: (
                  <span>
                    <b>Mara</b>
                    {" approved the tier names"}
                  </span>
                ),
                time: "2 min ago",
              },
              {
                avatar: "Jonah Petit",
                text: (
                  <span>
                    <b>Jonah</b>
                    {" moved Comparison table to review"}
                  </span>
                ),
                time: "1 h ago",
              },
              {
                icon: "sparkle",
                tint: "mint",
                text: "Preview deployed to staging",
                time: "Yesterday",
              },
              {
                avatar: "Rui Costa",
                text: (
                  <span>
                    <b>Rui</b>
                    {" flagged the seat selector as blocked"}
                  </span>
                ),
                time: "Mon",
              },
              {
                icon: "flag",
                tint: "blush",
                text: "Deadline set to Fri, 17.04",
                time: "Mon",
              },
            ]}
          />
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          crumbs={["Projects", "Pricing page refresh"]}
          title="Pricing page refresh"
          subtitle="New tiers and a comparison table for annual plans"
          actions={[
            <AvatarStack key="a" names={["Mara Ellis", "Jonah Petit", "Sun Lee", "Rui Costa"]} />,
            <Button key="s" variant="secondary" icon="share">
              Share
            </Button>,
            <Button key="p" icon="play">
              Preview
            </Button>,
          ]}
        />
      </div>
      <div
        className="tf-in"
        style={
          {
            "--d": "100ms",
          } as React.CSSProperties
        }
      >
        <Tabs items={["Overview", "Tasks", "Files", "Settings"]} />
      </div>
      <Stagger
        className="tf-grid"
        style={
          {
            "--cols": "1.3fr 1fr",
          } as React.CSSProperties
        }
        delay={160}
      >
        <div
          className="tf-card tf-bg-lilac"
          style={{
            minHeight: 0,
            flexDirection: "row",
            alignItems: "center",
            gap: 24,
          }}
        >
          <ProgressRing value={64} size={104} stroke={11} caption="done" />
          <div
            className="tf-col"
            style={{
              gap: 8,
            }}
          >
            <span
              className="tf-card-title"
              style={{
                padding: 0,
              }}
            >
              On track for Friday
            </span>
            <span className="tf-card-desc">
              11 of 18 tasks done. One blocker on checkout needs a decision from billing.
            </span>
            <div className="tf-row">
              <Badge tone="success">On track</Badge>
              <Badge tone="warning">1 blocker</Badge>
            </div>
          </div>
        </div>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "1fr 1fr",
              "--cols-sm": "1fr 1fr",
              gap: 12,
            } as React.CSSProperties
          }
        >
          <StatTile tint="sky" value="18" label="Tasks" />
          <StatTile tint="butter" value="3" label="Days left" />
          <StatTile tint="mint" value="24" label="Comments" />
          <StatTile tint="placeholder" value="2" label="In review" />
        </div>
      </Stagger>
      <Stagger
        className="tf-grid"
        style={
          {
            "--cols": "1.3fr 1fr",
          } as React.CSSProperties
        }
        delay={320}
      >
        <Panel
          title="Milestone tasks"
          action={
            <Button size="sm" variant="soft" icon="plus">
              Add
            </Button>
          }
        >
          <Stagger
            className="tf-col"
            style={{
              gap: 4,
            }}
            delay={420}
          >
            {tasks.map((t) => (
              <div
                key={t[0]}
                className="tf-row-item"
                style={{
                  gridTemplateColumns: "auto 1fr auto",
                  cursor: "default",
                }}
              >
                <Checkbox defaultChecked={t[1]} label={t[0]} />
                <span
                  style={{
                    fontWeight: "var(--type-label-weight)",
                    fontSize: 14,
                    textDecoration: t[1] ? "line-through" : "none",
                    color: t[1] ? "var(--ink-muted)" : "var(--ink)",
                  }}
                >
                  {t[0]}
                </span>
                <Avatar name={t[0]} size={24} />
              </div>
            ))}
          </Stagger>
        </Panel>
        <Panel title="Files" subtitle="4 attachments">
          <Stagger
            className="tf-col"
            style={{
              gap: 8,
            }}
            delay={480}
          >
            <FileRow name="brief-v4.pdf" meta="2.4 MB · PDF" kind="pdf" />
            <FileRow name="pricing-tiers.fig" meta="18 MB · Design" kind="fig" />
            <FileRow name="q2-forecast.xlsx" meta="640 KB · Sheet" kind="sheet" />
          </Stagger>
        </Panel>
      </Stagger>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
