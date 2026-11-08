import { Button, ConnectionBanner, ConnectionCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-col"
      style={{
        gap: 8,
      }}
    >
      <ConnectionBanner state="reconnecting" seconds={4} onRetry={() => {}} />
      <ConnectionCard
        name="Stripe · FollowerX GmbH"
        icon="card"
        text="Payments and refunds · 3 agents"
        status="connected"
        statusLabel="Connected"
        action={
          <Button size="sm" variant="soft">
            Manage
          </Button>
        }
      />
      <ConnectionCard
        name="Google Ads"
        icon="trend"
        text="Budgets and campaigns · 1 agent"
        status="expiring"
        statusLabel="Expires in 5 days"
        action={<Button size="sm">Renew</Button>}
      />
      <ConnectionCard
        name="Docs workspace"
        icon="book"
        text="Release notes · Echo"
        status="error"
        statusLabel="Error"
        action={<Button size="sm">Reconnect</Button>}
      />
      <ConnectionBanner state="offline" />
    </div>
  );
}
