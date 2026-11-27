import * as React from "react";
import {
  AgentMark,
  AgentNetwork,
  AgentStatus,
  AppShell,
  AppearanceProvider,
  ApprovalCard,
  ChatMessage,
  ChatThread,
  CommandPalette,
  Composer,
  CoordinationTicker,
  IconButton,
  MoneyPreview,
  Panel,
  PromptStarters,
  SearchTrigger,
  Tabs,
  UsageMeter,
  useUI,
  useWidth,
} from "@twentyfirstmedia/ui-core";
import type {
  AgentNetworkHandoff,
  ApprovalKey,
  NotificationItem,
  SidebarGroup,
} from "@twentyfirstmedia/ui-core";
import { NETWORK, NOW, TICKER } from "./_coordination";

const GROUPS: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Mission control", icon: "home", href: "/" },
      {
        id: "approvals",
        label: "Approvals",
        icon: "lock",
        href: "/approvals",
        count: 3,
        countTone: "signal",
      },
      { id: "chats", label: "Chats", icon: "mail", href: "/chats", count: 4 },
      { id: "agents", label: "Agents", icon: "bot", href: "/agents" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "projects", label: "Projects", icon: "folder", href: "/projects" },
      { id: "costs", label: "Costs", icon: "card", href: "/costs" },
      { id: "settings", label: "Settings", icon: "settings", href: "/settings" },
    ],
  },
];

const NOTES: NotificationItem[] = [
  {
    id: 1,
    icon: "lock",
    tint: "lilac",
    title: "Refund of €40.00 waits for you",
    text: "Shop lead · Northwind Shop",
    time: "11:57",
    unread: true,
  },
  {
    id: 2,
    icon: "x",
    tint: "blush",
    title: "Release failed on the iOS target",
    text: "Atlas App",
    time: "11:40",
    unread: true,
  },
];

const STARTERS = [
  {
    icon: "sparkle" as const,
    tint: "lilac" as const,
    title: "Brief me on today",
    text: "What moved, what waits for me",
    prompt: "Brief me on today: what moved and what waits for me?",
  },
  {
    icon: "lock" as const,
    tint: "butter" as const,
    title: "Open approvals",
    text: "Oldest first, with the risk",
    prompt: "Walk me through the open approvals, oldest first.",
  },
  {
    icon: "zap" as const,
    tint: "sky" as const,
    title: "Plan a launch",
    text: "Split it across the leads",
    prompt: "Plan the Atlas 2.4 launch and hand the parts to the leads.",
  },
  {
    icon: "card" as const,
    tint: "mint" as const,
    title: "Costs this week",
    text: "Per project against the budget",
    prompt: "How do this week's costs compare to the budgets?",
  },
];

type Msg = { id: string; role: "user" | "assistant"; text: string };

function MainChat({ grow }: { grow?: boolean }) {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [busy, setBusy] = React.useState(false);
  const send = (text: string) => {
    if (!text.trim()) return;
    const n = messages.length;
    setMessages((m) => [...m, { id: `u${n}`, role: "user", text }]);
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `a${n}`,
          role: "assistant",
          text: "On it. I asked the **Shop lead** for the refund details and the **App lead** for the failed build. Two approvals wait for you on the right.",
        },
      ]);
      setBusy(false);
    }, 900);
  };
  return (
    <Panel
      title="Main agent"
      subtitle="Orchestrates 3 leads and 6 agents"
      action={<AgentStatus status="Running" step="Planning the week" />}
      style={grow ? { minHeight: 560 } : undefined}
    >
      <div className="tf-col" style={{ gap: 12, flex: 1, minHeight: 0 }}>
        {messages.length === 0 ? (
          <div className="tf-col" style={{ gap: 16, alignItems: "center", padding: "24px 0" }}>
            <AgentMark tint="lilac" icon="sparkle" size={48} />
            <p className="tf-card-desc" style={{ margin: 0, textAlign: "center" }}>
              Ask the main agent anything. It hands the work to the right lead.
            </p>
            <PromptStarters items={STARTERS} onPick={send} />
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 280, display: "flex" }}>
            <ChatThread label="Main agent">
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  id={m.id}
                  role={m.role}
                  name={m.role === "assistant" ? "Main agent" : undefined}
                  tint="lilac"
                  text={m.text}
                />
              ))}
            </ChatThread>
          </div>
        )}
        <Composer
          placeholder="Message the main agent…"
          busy={busy}
          onSend={(text) => send(text)}
          mentionOptions={[
            {
              id: "shop-lead",
              label: "Shop lead",
              group: "Leads",
              tint: "sky",
              role: "Northwind Shop",
            },
            { id: "app-lead", label: "App lead", group: "Leads", tint: "mint", role: "Atlas App" },
            {
              id: "office-lead",
              label: "Office lead",
              group: "Leads",
              tint: "butter",
              role: "Back office",
            },
          ]}
        />
      </div>
    </Panel>
  );
}

function Approvals() {
  const [done, setDone] = React.useState<Record<string, ApprovalKey>>({});
  const decide = (id: string) => (key: ApprovalKey) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setDone((d) => ({ ...d, [id]: key }));
        resolve();
      }, 600);
    });
  return (
    <div className="tf-col" style={{ gap: 12 }}>
      <ApprovalCard
        compact
        stepUp
        family="money"
        agent="Shop lead"
        project="Northwind Shop"
        age="3 min"
        title="Refund €40.00 for order 4417"
        text="The parcel arrived damaged; the photo is in the thread."
        decision={done.refund ? { key: done.refund, by: "You", at: "now" } : null}
        onDecide={decide("refund")}
      >
        <MoneyPreview
          amount={40}
          currency="EUR"
          recipient="Card ending 4242"
          refund={{ payment: "Order 4417 · €40.00", paidAt: "Apr 12" }}
          stepUp
        />
      </ApprovalCard>
      <ApprovalCard
        compact
        family="marketing"
        agent="Ads"
        project="Northwind Shop"
        age="24 min"
        title="Raise the search budget to €30 a day"
        text="Cost per order fell 18% this week."
        decision={done.ads ? { key: done.ads, by: "You", at: "now" } : null}
        onDecide={decide("ads")}
      />
    </div>
  );
}

function Costs() {
  return (
    <div className="tf-col" style={{ gap: 16 }}>
      <UsageMeter
        label="Today, all projects"
        used={38.4}
        limit={60}
        format={(v) => `€${v.toFixed(2)}`}
      />
      <UsageMeter
        label="Northwind Shop"
        used={21.1}
        limit={25}
        format={(v) => `€${v.toFixed(2)}`}
      />
      <UsageMeter label="Atlas App" used={12.9} limit={25} format={(v) => `€${v.toFixed(2)}`} />
      <UsageMeter label="Back office" used={4.4} limit={10} format={(v) => `€${v.toFixed(2)}`} />
    </div>
  );
}

const ROUTES: [string, string, string][] = [
  ["main", "shop-lead", "Refund request"],
  ["shop-lead", "support", "Ask for the photo"],
  ["main", "app-lead", "Fix the iOS build"],
  ["app-lead", "release", "Retry with Xcode 18"],
  ["qa", "app-lead", "Tests passed"],
  ["main", "books", "November invoices"],
];

function MissionControl() {
  const [boxRef, width] = useWidth<HTMLDivElement>(undefined, 1200);
  const phone = width < 640;
  const wide = width >= 1100;
  const [handoffs, setHandoffs] = React.useState<AgentNetworkHandoff[]>([]);
  const n = React.useRef(0);
  const motion = useUI().motion;
  React.useEffect(() => {
    if (motion === "off" || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      const [from, to, label] = ROUTES[n.current % ROUTES.length]!;
      n.current += 1;
      setHandoffs((h) => [...h.slice(-10), { id: `h${n.current}`, from, to, label }]);
    }, 3000);
    return () => clearInterval(timer);
  }, [motion]);
  const network = <AgentNetwork root={NETWORK} handoffs={handoffs} height={360} />;
  const ticker = <CoordinationTicker items={TICKER} now={NOW} max={5} />;
  if (phone)
    return (
      <div ref={boxRef} className="tf-col" style={{ gap: 16 }}>
        <MainChat />
        <Panel>
          <Tabs
            items={["Agents", "Activity", "Approvals", "Costs"]}
            label="Mission control"
            block
            panels={{
              Agents: network,
              Activity: ticker,
              Approvals: <Approvals />,
              Costs: <Costs />,
            }}
          />
        </Panel>
      </div>
    );
  if (!wide)
    return (
      <div ref={boxRef} className="tf-col" style={{ gap: 16 }}>
        <MainChat />
        <Panel title="Agents" subtitle="Handoffs move live along the lines">
          {network}
        </Panel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          <Panel title="Waiting for you" subtitle="2 approvals">
            <Approvals />
          </Panel>
          <div className="tf-col" style={{ gap: 16 }}>
            <Panel title="Coordination">{ticker}</Panel>
            <Panel title="Costs today" subtitle="Against the daily budget">
              <Costs />
            </Panel>
          </div>
        </div>
      </div>
    );
  return (
    <div ref={boxRef} className="tf-col" style={{ gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 380px)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <MainChat grow />
        <div className="tf-col" style={{ gap: 16 }}>
          <Panel title="Waiting for you" subtitle="2 approvals">
            <Approvals />
          </Panel>
          <Panel title="Costs today" subtitle="Against the daily budget">
            <Costs />
          </Panel>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <Panel title="Agents" subtitle="Handoffs move live along the lines">
          {network}
        </Panel>
        <Panel title="Coordination">{ticker}</Panel>
      </div>
    </div>
  );
}

function App() {
  const [search, setSearch] = React.useState(false);
  const [notes, setNotes] = React.useState(NOTES);
  return (
    <>
      <AppShell
        navigation="sidebar"
        topbar
        brand="Control"
        pathname="/"
        topStart={
          <SearchTrigger
            placeholder="Search agents, chats, approvals…"
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
        notifications={{
          items: notes,
          onReadAll: () => setNotes((x) => x.map((i) => ({ ...i, unread: false }))),
        }}
        appearance
        sidebarGroups={GROUPS}
        user={{ name: "Mara Ellis", email: "mara@example.com" }}
        tabBar
        dock={false}
      >
        <MissionControl />
      </AppShell>
      <CommandPalette
        open={search}
        onClose={() => setSearch(false)}
        placeholder="Search agents, chats, approvals…"
        items={GROUPS.flatMap((g) => g.items || []).map((it) => ({
          group: "Pages",
          label: it.label,
          icon: it.icon,
          run: () => setSearch(false),
        }))}
      />
    </>
  );
}

export default function Preview() {
  // In an app: <AppearanceProvider kits={["halo", "pro"]}> once around everything; glass shows
  // Ambient behind the frame. Here the preview starts in the docs' kit and theme.
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
