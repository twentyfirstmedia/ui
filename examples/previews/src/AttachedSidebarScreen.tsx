import * as React from "react";
import {
  Badge,
  Button,
  Card,
  PageHeader,
  Sidebar,
  Stagger,
  Tabs,
  UserMenu,
} from "@twentyfirstmedia/ui-core";
import type { SidebarGroup } from "@twentyfirstmedia/ui-core";

const groups: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "search", label: "Search", icon: "search" },
      { id: "updates", label: "Updates", icon: "bell", count: 3 },
    ],
  },
  {
    label: "Library",
    action: { label: "New collection", icon: "plus" },
    items: [
      { id: "guides", label: "Guides", icon: "book" },
      { id: "templates", label: "Templates", icon: "layers" },
      { id: "assets", label: "Assets", icon: "image" },
      { id: "archive", label: "Archive", icon: "archive" },
    ],
  },
  {
    label: "Teams",
    collapsible: true,
    items: [
      { id: "design", label: "Design", icon: "sparkle" },
      { id: "growth", label: "Growth", icon: "trend" },
    ],
  },
];

const docs = [
  ["Onboarding checklist", "Guides", "Updated today"],
  ["Brand voice", "Guides", "Updated 2 days ago"],
  ["Launch email", "Templates", "Updated last week"],
  ["Pricing table", "Templates", "Updated last week"],
];

/** A full-height app with the sidebar attached to the edge of the screen. */
export default function Preview() {
  const [page, setPage] = React.useState("guides");
  return (
    <div
      style={{
        display: "flex",
        minHeight: 640,
        overflow: "hidden",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--line)",
        background: "var(--canvas)",
      }}
    >
      <Sidebar
        variant="attached"
        label="Library"
        groups={groups}
        current={page}
        onPick={setPage}
        header={
          <span className="tf-brand" style={{ color: "var(--ink)" }}>
            Halo Docs
          </span>
        }
        footer={({ collapsed }) => (
          <UserMenu
            name="Mara Ellis"
            email="mara@halo.app"
            compact={collapsed}
            items={[{ label: "Profile", icon: "user" }, "-", { label: "Sign out", icon: "logout" }]}
          />
        )}
      />
      <main className="tf-col" style={{ flex: 1, minWidth: 0, gap: 20, padding: 24 }}>
        <PageHeader
          title="Guides"
          subtitle="Everything the team writes down once"
          actions={[
            <Button key="n" variant="primary" icon="plus">
              New guide
            </Button>,
          ]}
        />
        <Tabs items={["All", "Drafts", "Shared with me"]} />
        <Stagger className="tf-col" style={{ gap: 12, alignContent: "start" }}>
          {docs.map(([title, kind, when]) => (
            <Card key={title} style={{ minHeight: 0 }}>
              <div className="tf-row" style={{ justifyContent: "space-between", gap: 12 }}>
                <div className="tf-col" style={{ gap: 4 }}>
                  <b>{title}</b>
                  <small className="tf-muted">{when}</small>
                </div>
                <Badge>{kind}</Badge>
              </div>
            </Card>
          ))}
        </Stagger>
      </main>
    </div>
  );
}
