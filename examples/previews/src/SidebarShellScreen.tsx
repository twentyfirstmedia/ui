import * as React from "react";
import {
  AppShell,
  Badge,
  Button,
  IconButton,
  KeyValue,
  PageHeader,
  Panel,
  Progress,
  SearchField,
  Stagger,
  StatTile,
} from "@twentyfirstmedia/ui-core";
import type { SidebarGroup } from "@twentyfirstmedia/ui-core";

const groups: SidebarGroup[] = [
  {
    items: [
      { id: "overview", label: "Overview", icon: "home" },
      { id: "inbox", label: "Inbox", icon: "inbox", count: 12 },
      { id: "calendar", label: "Calendar", icon: "calendar" },
    ],
  },
  {
    label: "Workspace",
    action: { label: "New project", icon: "plus" },
    items: [
      { id: "projects", label: "Projects", icon: "grid", count: 3 },
      { id: "customers", label: "Customers", icon: "users" },
      {
        id: "finance",
        label: "Finance",
        icon: "card",
        items: [
          { id: "invoices", label: "Invoices", icon: "file" },
          { id: "payouts", label: "Payouts", icon: "download" },
          { id: "tax", label: "Tax", icon: "chart" },
        ],
      },
      { id: "reports", label: "Reports", icon: "chart", badge: "New" },
    ],
  },
  {
    label: "Settings",
    collapsible: true,
    items: [
      { id: "team", label: "Team", icon: "users" },
      { id: "integrations", label: "Integrations", icon: "webhook", badge: "dot" },
      { id: "security", label: "Security", icon: "shield" },
    ],
  },
];

/** The app shell with a labelled sidebar on the dark frame: groups, nesting, workspace and account. */
export default function Preview() {
  const [page, setPage] = React.useState("invoices");
  const [ws, setWs] = React.useState("halo");
  return (
    <AppShell
      navigation="sidebar"
      sidebarGroups={groups}
      active={page}
      onNavigate={setPage}
      sidebar={{ shortcut: true }}
      workspaces={{
        items: [
          { id: "halo", name: "Halo Studio", sub: "Pro plan", tint: "lilac" },
          { id: "north", name: "Northwind", sub: "Team plan", tint: "mint" },
        ],
        value: ws,
        onChange: setWs,
      }}
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      userMenu={[
        { label: "Profile", icon: "user" },
        { label: "Settings", icon: "settings" },
        "-",
        { label: "Sign out", icon: "logout" },
      ]}
      dock={false}
      side={
        <Panel side title="Payout" subtitle="Next on Friday">
          <KeyValue
            items={[
              ["Amount", "€18,420"],
              ["Invoices", "42"],
              ["Fees", "€312"],
            ]}
          />
          <Progress value={68} label="Collected" />
          <Button variant="secondary" icon="download">
            Export
          </Button>
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Invoices"
          subtitle="April · 42 sent, 7 open"
          actions={[
            <SearchField key="s" placeholder="Search invoices" shortcut="⌘K" />,
            <Button key="n" variant="primary" icon="plus">
              New invoice
            </Button>,
          ]}
        />
      </div>
      <Stagger
        className="tf-grid"
        style={
          {
            "--cols": "repeat(3, minmax(0, 1fr))",
            "--cols-sm": "1fr",
            gap: 16,
          } as React.CSSProperties
        }
      >
        <StatTile value="€48,210" label="Billed" tint="sky" delta="+12%" />
        <StatTile value="€6,940" label="Open" tint="butter" delta="7 invoices" />
        <StatTile value="€1,280" label="Overdue" tint="blush" delta="2 invoices" />
      </Stagger>
      <Panel
        title="Latest"
        subtitle="Sent this week"
        action={<IconButton icon="filter" label="Filter" />}
      >
        <KeyValue
          items={[
            [
              "INV-2041 · Northwind",
              <Badge key="a" tone="warning">
                Open
              </Badge>,
            ],
            [
              "INV-2040 · Kestrel Bank",
              <Badge key="b" tone="success">
                Paid
              </Badge>,
            ],
            [
              "INV-2039 · Copperline",
              <Badge key="c" tone="success">
                Paid
              </Badge>,
            ],
          ]}
        />
      </Panel>
    </AppShell>
  );
}
