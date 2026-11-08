import {
  AppShell,
  AvatarStack,
  Badge,
  Button,
  Card,
  KanbanColumn,
  PageHeader,
  Progress,
  Tabs,
} from "@twentyfirstmedia/ui-core";
import type { Tint } from "@twentyfirstmedia/ui-core";

interface TaskProps {
  t: string;
  m?: string[];
  b?: React.ReactNode;
  who: string[];
  tint?: Tint;
  p?: number;
}

function T(p: TaskProps) {
  return (
    <Card
      onClick={() => {}}
      tint={p.tint}
      title={p.t}
      meta={p.m}
      status={p.b}
      actions={[<AvatarStack key={1} names={p.who} size={24} />]}
    >
      {p.p != null && <Progress value={p.p} tint="mint" label="Progress" />}
    </Card>
  );
}
function App() {
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="Projects"
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          crumbs={["Projects", "Pricing page refresh"]}
          title="Sprint 14 board"
          subtitle="18 tasks · ends Friday"
          actions={[
            <AvatarStack
              key="a"
              names={[
                "Mara Ellis",
                "Jonah Petit",
                "Sun Lee",
                "Rui Costa",
                "Ida Nolan",
                "Ava Brandt",
              ]}
            />,
            <Tabs key="t" items={["Board", "List", "Timeline"]} />,
            <Button key="n" icon="plus">
              New task
            </Button>,
          ]}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <KanbanColumn title="To do" dot="sky" delay={120}>
          <T
            t="Write FAQ for annual plans"
            m={["Docs", "Due Thu"]}
            b={<Badge>Copy</Badge>}
            who={["Ava Brandt"]}
          />
          <T
            t="Localise tiers for DE and FR"
            m={["Growth"]}
            b={<Badge tone="info">i18n</Badge>}
            who={["Sun Lee", "Ida Nolan"]}
          />
          <T
            t="Plan migration emails"
            m={["Lifecycle"]}
            b={<Badge>Email</Badge>}
            who={["Rui Costa"]}
          />
        </KanbanColumn>
        <KanbanColumn title="In progress" dot="butter" delay={220}>
          <T
            tint="lilac"
            t="Comparison table component"
            m={["Design system", "3 of 5 states"]}
            b={<Badge tone="highlight">Focus</Badge>}
            who={["Jonah Petit", "Mara Ellis"]}
            p={60}
          />
          <T
            t="Checkout seat selector"
            m={["Billing"]}
            b={<Badge tone="warning">Blocked</Badge>}
            who={["Rui Costa"]}
            p={30}
          />
        </KanbanColumn>
        <KanbanColumn title="In review" dot="lilac" delay={320}>
          <T
            t="Billing settings flow"
            m={["Due Fri"]}
            b={<Badge tone="highlight">Review</Badge>}
            who={["Mara Ellis", "Sun Lee"]}
          />
          <T
            t="Empty states for reports"
            m={["Due Mon"]}
            b={<Badge tone="warning">Changes</Badge>}
            who={["Jonah Petit"]}
          />
        </KanbanColumn>
        <KanbanColumn title="Done" dot="mint" delay={420}>
          <T
            t="Pricing research recap"
            m={["Shipped Tue"]}
            b={<Badge tone="success">Done</Badge>}
            who={["Sun Lee"]}
          />
          <T
            t="New tier names"
            m={["Shipped Mon"]}
            b={<Badge tone="success">Done</Badge>}
            who={["Mara Ellis"]}
          />
          <T
            t="Analytics events for upgrade"
            m={["Shipped Mon"]}
            b={<Badge tone="success">Done</Badge>}
            who={["Ida Nolan"]}
          />
        </KanbanColumn>
      </div>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
