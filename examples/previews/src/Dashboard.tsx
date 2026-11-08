import * as React from "react";
import {
  AppShell,
  Badge,
  Button,
  Card,
  Chip,
  EventCard,
  IconButton,
  PageHeader,
  Panel,
  SearchField,
  Stagger,
  StatTile,
  Tabs,
  TintIcon,
} from "@twentyfirstmedia/ui-core";
import { cardActs } from "./_workspace";

function App() {
  const f = React.useState("All");
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="Projects"
      side={
        <Panel
          side
          title="Schedule"
          subtitle="5 items waiting · 2 today"
          action={<IconButton icon="plus" label="Add event" />}
        >
          <Tabs block items={["Events", "Approvals", "History"]} />
          <Stagger className="tf-col" delay={300}>
            <EventCard kind="meeting" label="Team sync" date="Tue, 14.04" time="10:30">
              Roadmap check-in with design and growth; bring last sprint numbers.
            </EventCard>
            <EventCard kind="review" label="Design review" date="Wed, 15.04" time="14:00">
              Walk through the new billing settings flow.
            </EventCard>
            <EventCard kind="deadline" label="Deadline" date="Fri, 17.04" time="17:00">
              Send Q2 invoices to all annual customers.
            </EventCard>
          </Stagger>
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Projects"
          subtitle="Plan, ship and retire work across the workspace"
          actions={[
            <SearchField key="s" placeholder="Search people, projects, invoices" shortcut="⌘K" />,
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
        <StatTile tint="sky" value="18" label="All projects" />
        <StatTile tint="mint" value="11" label="Live" delta="+2 this week" />
        <StatTile tint="placeholder" value="4" label="Drafts" />
        <StatTile tint="butter" value="$48,210" label="Revenue (MTD)" />
      </Stagger>
      <div
        className="tf-in"
        style={
          {
            "--d": "260ms",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          } as React.CSSProperties
        }
      >
        <div className="tf-row">
          {["All", "Live", "Draft", "Archived"].map((t) => (
            <Chip
              key={t}
              selected={f[0] === t}
              onClick={() => {
                f[1](t);
              }}
            >
              {t}
            </Chip>
          ))}
        </div>
        <Button icon="plus">New project</Button>
      </div>
      <Stagger
        className="tf-grid"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
        delay={320}
      >
        <Card
          onClick={() => {}}
          title="Quarterly onboarding"
          description="Welcome flow for new workspace admins."
          meta={["Mara Ellis", "12 steps", "348 users"]}
          corner={<TintIcon icon="book" tint="mint" />}
          status={<Badge tone="success">Live</Badge>}
          actions={cardActs()}
        />
        <Card
          onClick={() => {}}
          tint="lilac"
          title="Pricing page refresh"
          description="New tiers and a comparison table for annual plans."
          meta={["Jonah Petit", "6 sections"]}
          corner={<IconButton icon="play" label="Preview" size="sm" variant="outline" />}
          status={<Badge tone="neutral">86 viewing</Badge>}
          actions={[<IconButton key={1} icon="edit" label="Edit" size="sm" variant="solid" />]}
        />
        <Card
          onClick={() => {}}
          title="Partner referral program"
          description="Track invites, payouts and partner tiers."
          meta={["Sun Lee", "4 steps", "57 partners"]}
          corner={<TintIcon icon="users" tint="sky" />}
          status={<Badge tone="success">Live</Badge>}
          actions={cardActs()}
        />
        <Card
          onClick={() => {}}
          title="Invoice #2041 is overdue"
          description="Net-30 passed four days ago; the reminder bounced."
          meta={["Rui Costa", "High priority"]}
          corner={<TintIcon icon="mail" tint="blush" />}
          status={<Badge tone="warning">Open</Badge>}
          actions={[
            <Button key={1} size="sm" variant="soft">
              Reply
            </Button>,
          ]}
        />
        <Card
          onClick={() => {}}
          title="Help center migration"
          description="Move 140 articles to the new docs layout."
          meta={["Ava Brandt", "0 published"]}
          corner={<TintIcon icon="file" tint="mint" />}
          status={<Badge>Draft</Badge>}
          actions={cardActs()}
        />
        <Card
          onClick={() => {}}
          title="Annual plan upgrade request"
          description="Northwind wants 40 more seats before renewal."
          meta={["Ida Nolan", "Normal priority"]}
          corner={<TintIcon icon="card" tint="butter" />}
          status={<Badge tone="info">Pending</Badge>}
          actions={cardActs()}
        />
      </Stagger>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
