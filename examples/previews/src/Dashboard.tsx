import * as React from "react";
import {
  AppShell,
  AppearanceMenu,
  AppearanceProvider,
  CommandPalette,
  SearchTrigger,
  useUI,
  Badge,
  Button,
  Card,
  Chip,
  EventCard,
  IconButton,
  PageHeader,
  Panel,
  Stagger,
  StatTile,
  Tabs,
  TintIcon,
} from "@twentyfirstmedia/ui-core";
import type { SidebarGroup } from "@twentyfirstmedia/ui-core";
import { cardActs } from "./_workspace";

const NAV: SidebarGroup[] = [
  {
    items: [
      { id: "Home", label: "Home", icon: "home" },
      { id: "People", label: "People", icon: "users" },
      { id: "Projects", label: "Projects", icon: "grid" },
      { id: "Inbox", label: "Inbox", icon: "mail", count: 4 },
      { id: "Calendar", label: "Calendar", icon: "calendar" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "Billing", label: "Billing", icon: "card" },
      { id: "Reports", label: "Reports", icon: "chart" },
      { id: "Settings", label: "Settings", icon: "settings" },
    ],
  },
];

function App() {
  const f = React.useState("All");
  const [page, setPage] = React.useState("Projects");
  const [search, setSearch] = React.useState(false);
  return (
    <>
      <AppShell
        navigation="sidebar"
        topbar
        brand="Halo"
        tag="Admin"
        topStart={
          <SearchTrigger
            placeholder="Search people, projects, invoices"
            shortcut="⌘K"
            bindShortcut
            onClick={() => setSearch(true)}
          />
        }
        topStartCompact={
          <IconButton
            icon="search"
            label="Search"
            variant="ghost"
            onClick={() => setSearch(true)}
          />
        }
        topEnd={
          <>
            <IconButton icon="bell" label="Notifications" variant="ghost" />
            <AppearanceMenu />
          </>
        }
        sidebarGroups={NAV}
        active={page}
        onNavigate={setPage}
        user={{ name: "Mara Ellis", email: "mara@halo.app" }}
        dock={false}
        side={
          <Panel
            side
            title="Schedule"
            subtitle="5 items waiting · 2 today"
            action={<IconButton icon="plus" label="Add event" />}
          >
            <Tabs block items={["Events", "Approvals", "History"]} />
            <Stagger className="tf-col" delay={300}>
              <EventCard kind="meeting" label="Team sync" date="Tue, Apr 14" time="10:30">
                Roadmap check-in with design and growth; bring last sprint numbers.
              </EventCard>
              <EventCard kind="review" label="Design review" date="Wed, Apr 15" time="14:00">
                Walk through the new billing settings flow.
              </EventCard>
              <EventCard kind="deadline" label="Deadline" date="Fri, Apr 17" time="17:00">
                Send Q2 invoices to all annual customers.
              </EventCard>
            </Stagger>
          </Panel>
        }
      >
        <div className="tf-in">
          <PageHeader title="Projects" subtitle="Plan, ship and retire work across the workspace" />
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
          <StatTile tint="sky" value="18" label="All projects" />
          <StatTile tint="mint" value="11" label="Live" delta="+2 this week" />
          <StatTile tint="placeholder" value="4" label="Drafts" />
          <StatTile tint="butter" value="€48,210" label="Revenue (MTD)" />
        </Stagger>
        <div
          className="tf-in"
          style={
            {
              "--d": "260ms",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
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
          style={
            {
              "--cols": "repeat(3, 1fr)",
            } as React.CSSProperties
          }
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
      <CommandPalette
        open={search}
        onClose={() => setSearch(false)}
        placeholder="Search people, projects, invoices"
        items={NAV.flatMap((g) =>
          (g.items || []).map((it) => ({
            group: "Pages",
            label: it.label,
            icon: it.icon,
            run: () => setPage(it.label),
          })),
        )}
      />
    </>
  );
}

export default function Preview() {
  // In an app: <AppearanceProvider kits={["halo", "pro"]}> once around everything. Here the
  // preview starts in the docs' kit and theme and keeps the reader's choice to itself.
  const ui = useUI();
  return (
    <AppearanceProvider
      key={`${ui.kit}-${ui.theme}`}
      scope="subtree"
      storageKey={false}
      kits={["halo", "pro"]}
      defaults={{ kit: ui.kit, theme: ui.theme === "dark" ? "dark" : "light" }}
    >
      <App />
    </AppearanceProvider>
  );
}
