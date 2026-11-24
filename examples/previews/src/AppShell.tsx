import * as React from "react";
import {
  AppShell,
  AppearanceMenu,
  AppearanceProvider,
  Button,
  CommandPalette,
  IconButton,
  PageHeader,
  Panel,
  SearchTrigger,
  useUI,
} from "@twentyfirstmedia/ui-core";
import type { SidebarGroup } from "@twentyfirstmedia/ui-core";

const GROUPS: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "orders", label: "Orders", icon: "cart", badge: "12" },
      { id: "customers", label: "Customers", icon: "users" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "team", label: "Team", icon: "user" },
      { id: "billing", label: "Billing", icon: "card" },
    ],
  },
];

/** The standard app frame: brand, search and the look menu in the top bar, the sidebar below. */
function App() {
  const [page, setPage] = React.useState("orders");
  const [search, setSearch] = React.useState(false);
  return (
    <>
      <AppShell
        navigation="sidebar"
        topbar
        brand="Admin"
        topStart={
          <SearchTrigger
            placeholder="Search orders, customers…"
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
            <Button size="sm" variant="secondary">
              New order
            </Button>
            <AppearanceMenu />
          </>
        }
        sidebarGroups={GROUPS}
        active={page}
        onNavigate={setPage}
        user={{ name: "Mara Ellis", email: "mara@example.com" }}
        dock={false}
      >
        <div className="tf-in">
          <PageHeader title="Orders" subtitle="12 waiting to ship" />
        </div>
        <Panel title="Today">
          <p style={{ margin: 0, color: "var(--ink-muted)" }}>
            The content of the page goes into the sheet.
          </p>
        </Panel>
      </AppShell>
      <CommandPalette
        open={search}
        onClose={() => setSearch(false)}
        placeholder="Search orders, customers…"
        items={GROUPS.flatMap((g) =>
          (g.items || []).map((it) => ({
            group: "Pages",
            label: it.label,
            icon: it.icon,
            run: () => setPage(it.id || it.label),
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
