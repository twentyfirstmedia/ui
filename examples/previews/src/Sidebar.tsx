import * as React from "react";
import { Sidebar, UserMenu, WorkspaceSwitcher } from "@twentyfirstmedia/ui-core";
import type { MenuItem, SidebarGroup } from "@twentyfirstmedia/ui-core";

const itemMenu: (MenuItem | "-")[] = [
  { label: "Rename", icon: "edit" },
  { label: "Share", icon: "share" },
  "-",
  { label: "Archive", icon: "archive", danger: true },
];

const groups: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "inbox", label: "Inbox", icon: "mail", count: 4 },
      { id: "activity", label: "Activity", icon: "bell", badge: "dot" },
    ],
  },
  {
    label: "Projects",
    action: { label: "New project", icon: "plus" },
    items: [
      { id: "launch", label: "Spring launch", icon: "sparkle", actions: itemMenu },
      { id: "pricing", label: "Pricing page", icon: "tag", badge: "New", actions: itemMenu },
    ],
  },
  {
    label: "Finance",
    collapsible: true,
    items: [
      {
        id: "billing",
        label: "Billing",
        icon: "card",
        items: [
          { id: "invoices", label: "Invoices", icon: "file" },
          { id: "payouts", label: "Payouts", icon: "download" },
        ],
      },
      { id: "reports", label: "Reports", icon: "chart" },
    ],
  },
  {
    label: "Help",
    collapsible: true,
    items: [
      { id: "docs", label: "Docs", icon: "book", href: "#docs", external: true },
      { id: "api", label: "API access", icon: "code", disabled: true },
    ],
  },
];

const workspaces = [
  { id: "halo", name: "Halo Studio", sub: "Pro plan", tint: "lilac" as const },
  { id: "north", name: "Northwind", sub: "Team plan", tint: "mint" as const },
];

const account: (MenuItem | "-")[] = [
  { label: "Profile", icon: "user" },
  { label: "Settings", icon: "settings" },
  "-",
  { label: "Sign out", icon: "logout" },
];

export default function Preview() {
  const [page, setPage] = React.useState("launch");
  const [ws, setWs] = React.useState("halo");
  const parts = {
    groups,
    current: page,
    onPick: setPage,
    header: ({ collapsed }: { collapsed: boolean }) => (
      <WorkspaceSwitcher items={workspaces} value={ws} onChange={setWs} compact={collapsed} />
    ),
    footer: ({ collapsed }: { collapsed: boolean }) => (
      <UserMenu name="Mara Ellis" email="mara@halo.app" items={account} compact={collapsed} />
    ),
  };
  return (
    <div className="tf-row" style={{ gap: 24, alignItems: "stretch", flexWrap: "wrap" }}>
      <div style={{ height: 600, display: "flex" }}>
        <Sidebar label="Workspace" shortcut {...parts} />
      </div>
      <div style={{ height: 600, display: "flex" }}>
        <Sidebar label="Workspace (collapsed)" defaultCollapsed {...parts} />
      </div>
    </div>
  );
}
