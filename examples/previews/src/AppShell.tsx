import { AppShell, PageHeader, Panel } from "@twentyfirstmedia/ui-core";
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

export default function Preview() {
  return (
    <AppShell
      navigation="sidebar"
      brand="Admin"
      sidebarGroups={GROUPS}
      active="orders"
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
  );
}
