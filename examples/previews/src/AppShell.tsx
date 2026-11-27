import * as React from "react";
import {
  AppShell,
  AppearanceProvider,
  Button,
  CommandPalette,
  IconButton,
  PageHeader,
  Panel,
  SearchTrigger,
  useUI,
} from "@twentyfirstmedia/ui-core";
import type { NotificationItem, SidebarGroup } from "@twentyfirstmedia/ui-core";

const GROUPS: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home", href: "/" },
      { id: "orders", label: "Orders", icon: "cart", href: "/orders", count: 12 },
      {
        id: "refunds",
        label: "Refunds",
        icon: "receipt",
        href: "/refunds",
        count: 2,
        countTone: "signal",
      },
      { id: "customers", label: "Customers", icon: "users", href: "/customers" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "team", label: "Team", icon: "user", href: "/settings/team" },
      { id: "billing", label: "Billing", icon: "card", href: "/settings/billing" },
    ],
  },
];

const PAGES = GROUPS.flatMap((g) => g.items || []);

const day = (offset: number, h: number, m: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  d.setHours(h, m, 0, 0);
  return d;
};
const NOTES: NotificationItem[] = [
  {
    id: 1,
    icon: "receipt",
    tint: "blush",
    title: "Refund waiting for you",
    text: "Order #4182 · €86.00",
    time: "09:12",
    date: day(0, 9, 12),
    unread: true,
    href: "/refunds",
  },
  {
    id: 2,
    icon: "cart",
    tint: "sky",
    title: "12 orders to ship",
    text: "The courier comes at 15:00",
    time: "08:30",
    date: day(0, 8, 30),
    unread: true,
    href: "/orders",
  },
  {
    id: 3,
    icon: "users",
    tint: "mint",
    title: "Ava Brandt joined the team",
    time: "17:40",
    date: day(1, 17, 40),
    href: "/settings/team",
  },
];

/**
 * A stand-in for your router's link (Next.js `Link`): here it only changes the path the shell
 * shows, so the preview can move between pages.
 */
function useDemoRouter(start: string) {
  const [path, setPath] = React.useState(start);
  const Link = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
        function DemoLink({ href = "/", onClick, ...rest }, ref) {
          return (
            <a
              ref={ref}
              href={href}
              {...rest}
              onClick={(e) => {
                onClick?.(e);
                e.preventDefault();
                setPath(href);
              }}
            />
          );
        },
      ),
    [],
  );
  return { path, setPath, Link };
}

/** The standard app frame: brand, search, the bell and the look menu in the top bar, the sidebar below. */
function App() {
  const { path, setPath, Link } = useDemoRouter("/orders");
  const [search, setSearch] = React.useState(false);
  const [notes, setNotes] = React.useState(NOTES);
  const page = PAGES.find((p) => p.href === path) ?? PAGES[1]!;
  return (
    <>
      <AppShell
        navigation="sidebar"
        topbar
        brand="Admin"
        pathname={path}
        linkAs={Link}
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
          <Button size="sm" variant="secondary">
            New order
          </Button>
        }
        notifications={{
          items: notes,
          onReadAll: () => setNotes((n) => n.map((x) => ({ ...x, unread: false }))),
        }}
        appearance
        sidebarGroups={GROUPS}
        user={{ name: "Mara Ellis", email: "mara@example.com" }}
        tabBar
        dock={false}
        // room for the open look menu in the docs
        style={{ minHeight: 640 }}
      >
        <div className="tf-in">
          <PageHeader
            title={page.label}
            subtitle={page.count ? `${page.count} waiting` : undefined}
          />
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
        items={PAGES.map((it) => ({
          group: "Pages",
          label: it.label,
          icon: it.icon,
          run: () => setPath(it.href || "/"),
        }))}
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
