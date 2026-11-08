import * as React from "react";
import {
  AppShell,
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Skeleton,
  Stagger,
  StatTile,
  TintIcon,
} from "@twentyfirstmedia/ui-core";
import { cardActs } from "./_workspace";

function SkelCard() {
  return (
    <div className="tf-card">
      <div
        className="tf-row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Skeleton variant="title" width="55%" />
        <Skeleton variant="circle" width={30} />
      </div>
      <Skeleton />
      <Skeleton width="70%" />
      <div className="tf-card-foot">
        <Skeleton width={70} height={26} />
        <div className="tf-row">
          <Skeleton variant="circle" width={30} />
          <Skeleton variant="circle" width={30} />
        </div>
      </div>
    </div>
  );
}
function App() {
  const done = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => {
      done[1](true);
    }, 2200);
    return () => {
      clearTimeout(t);
    };
  }, []);
  if (done[0])
    return (
      <AppShell active="Projects" dock={false}>
        <div className="tf-in">
          <PageHeader
            title="Projects"
            subtitle="Loaded — content replaces the skeleton with the normal entrance"
          />
        </div>
        <Stagger
          className="tf-grid"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          <StatTile tint="sky" value="18" label="All projects" />
          <StatTile tint="mint" value="11" label="Live" />
          <StatTile tint="placeholder" value="4" label="Drafts" />
          <StatTile tint="butter" value="$48,210" label="Revenue (MTD)" />
        </Stagger>
        <Stagger
          className="tf-grid"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
          delay={200}
        >
          <Card
            title="Quarterly onboarding"
            description="Welcome flow for new workspace admins."
            corner={<TintIcon icon="book" tint="mint" />}
            status={<Badge tone="success">Live</Badge>}
            actions={cardActs()}
          />
          <Card
            tint="lilac"
            title="Pricing page refresh"
            description="New tiers and a comparison table."
            status={<Badge>86 viewing</Badge>}
          />
          <Card
            title="Partner referral program"
            description="Track invites, payouts and tiers."
            corner={<TintIcon icon="users" tint="sky" />}
            status={<Badge tone="success">Live</Badge>}
            actions={cardActs()}
          />
          <EmptyState
            title="No archived projects"
            text="Projects you retire land here, with their history kept."
            icon="folder"
            tint="butter"
            action={
              <Button variant="soft" size="sm">
                View all
              </Button>
            }
          />
        </Stagger>
      </AppShell>
    );
  return (
    <AppShell active="Projects" dock={false}>
      <div
        className="tf-col"
        style={{
          gap: 8,
        }}
      >
        <Skeleton variant="title" width={220} height={28} />
        <Skeleton width={320} />
      </div>
      <div
        className="tf-grid"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} variant="block" height={84} />
        ))}
      </div>
      <div
        className="tf-grid"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkelCard key={i} />
        ))}
      </div>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
