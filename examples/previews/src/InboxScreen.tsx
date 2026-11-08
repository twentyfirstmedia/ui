import * as React from "react";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  FileRow,
  IconButton,
  ListRow,
  PageHeader,
  Panel,
  SearchField,
  Stagger,
  StatTile,
  Tabs,
} from "@twentyfirstmedia/ui-core";
import type { ListRowProps } from "@twentyfirstmedia/ui-core";

function Msg(p: {
  who: string;
  time: string;
  d: number;
  me?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="tf-in"
      style={
        {
          "--d": p.d + "ms",
          display: "flex",
          gap: 12,
          flexDirection: p.me ? "row-reverse" : "row",
          alignItems: "flex-end",
        } as React.CSSProperties
      }
    >
      <Avatar name={p.who} size={28} />
      <div
        style={{
          maxWidth: "72%",
          padding: "12px 16px",
          borderRadius: "var(--radius-md)",
          borderBottomLeftRadius: p.me ? 18 : 6,
          borderBottomRightRadius: p.me ? 6 : 18,
          background: p.me ? "var(--accent)" : "var(--surface-sunken)",
          color: p.me ? "var(--on-accent)" : "var(--ink)",
          font: "var(--type-body-weight) 13px/20px var(--font-sans)",
        }}
      >
        {p.children}
        <div
          style={{
            font: "var(--type-body-weight) 11px/14px var(--font-sans)",
            opacity: 0.65,
            marginTop: 4,
          }}
        >
          {p.time}
        </div>
      </div>
    </div>
  );
}
function App() {
  const sel = React.useState(0);
  const list: ListRowProps[] = [
    {
      avatar: "Jonah Petit",
      title: "Jonah Petit",
      subtitle: "Can we move the pricing review to Thursday?",
      meta: "09:12",
      unread: true,
    },
    {
      avatar: "Northwind",
      title: "Northwind · Ida",
      subtitle: "Seat upgrade before renewal — 40 more",
      meta: "08:40",
      unread: true,
    },
    {
      icon: "bell",
      tint: "butter",
      title: "Billing",
      subtitle: "Card ending 4417 expires this month",
      meta: "Yesterday",
    },
    {
      avatar: "Sun Lee",
      title: "Sun Lee",
      subtitle: "Payout file for March is attached",
      meta: "Yesterday",
    },
    {
      avatar: "Blue Fern",
      title: "Blue Fern · Leo",
      subtitle: "Thanks, the export works now!",
      meta: "Mon",
    },
    {
      icon: "flag",
      tint: "blush",
      title: "Incident #88",
      subtitle: "Webhooks delayed in EU region",
      meta: "Sun",
    },
  ];
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="Inbox"
      dock={false}
      side={
        <Panel side title="Northwind" subtitle="Team plan · since 2023">
          <div className="tf-row">
            <Badge tone="success">Active</Badge>
            <Badge tone="info">Renews May 1</Badge>
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
            <StatTile tint="butter" value="€1,240" label="MRR" />
            <StatTile tint="sky" value="24" label="Seats" />
          </div>
          <h3
            className="tf-card-title"
            style={{
              fontSize: 16,
            }}
          >
            Attachments
          </h3>
          <Stagger
            className="tf-col"
            style={{
              gap: 8,
            }}
            delay={300}
          >
            <FileRow name="seat-quote.pdf" meta="182 KB · PDF" kind="pdf" />
            <FileRow name="usage-q1.xlsx" meta="96 KB · Sheet" kind="sheet" />
          </Stagger>
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Inbox"
          subtitle="2 unread · 4 waiting on you"
          actions={[
            <SearchField key="s" placeholder="Search messages" />,
            <Button key="n" icon="edit">
              Compose
            </Button>,
          ]}
        />
      </div>
      <div
        className="tf-grid"
        style={
          {
            "--cols": "320px 1fr",
            gap: 16,
            minHeight: 0,
          } as React.CSSProperties
        }
      >
        <div className="tf-panel tf-panel-flush tf-panel-list">
          <Tabs block items={["All", "Unread", "Assigned"]} />
          <Stagger className="tf-list" delay={120}>
            {list.map((it, i) => (
              <ListRow
                key={i}
                {...it}
                active={sel[0] === i}
                onClick={() => {
                  sel[1](i);
                }}
              />
            ))}
          </Stagger>
        </div>
        <div
          className="tf-panel tf-in"
          style={
            {
              "--d": "160ms",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <div
            className="tf-header"
            style={{
              alignItems: "center",
            }}
          >
            <div className="tf-row">
              <Avatar name="Jonah Petit" size={36} />
              <div>
                <div
                  className="tf-card-title"
                  style={{
                    padding: 0,
                    fontSize: 16,
                  }}
                >
                  Jonah Petit
                </div>
                <div className="tf-card-desc">Pricing page refresh</div>
              </div>
            </div>
            <div className="tf-row">
              <IconButton icon="star" label="Star" />
              <IconButton icon="inbox" label="Archive" />
              <IconButton icon="more" label="More" />
            </div>
          </div>
          <div
            className="tf-col"
            style={{
              gap: 12,
              padding: "8px 0",
            }}
          >
            <Msg who="Jonah Petit" time="09:02" d={260}>
              Morning! The comparison table is ready for a look.
            </Msg>
            <Msg who="Jonah Petit" time="09:12" d={360}>
              Can we move the pricing review to Thursday? Growth wants to join.
            </Msg>
            <Msg who="Mara Ellis" me time="09:20" d={460}>
              Thursday works. I will move the event and add Sun.
            </Msg>
          </div>
          <div
            className="tf-in"
            style={
              {
                "--d": "560ms",
                marginTop: "auto",
                display: "flex",
                gap: 8,
                alignItems: "center",
                padding: "4px 4px 4px 20px",
                borderRadius: "var(--radius-pill)",
                background: "var(--surface-sunken)",
              } as React.CSSProperties
            }
          >
            <IconButton icon="paperclip" label="Attach" variant="outline" />
            <input
              placeholder="Write a reply…"
              aria-label="Reply"
              style={{
                flex: 1,
                minWidth: 0,
                border: 0,
                background: "transparent",
                outline: "none",
                font: "var(--type-body-weight) 13px var(--font-sans)",
                color: "var(--ink)",
              }}
            />
            <Button icon="send">Send</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
