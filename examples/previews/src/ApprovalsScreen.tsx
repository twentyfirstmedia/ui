import * as React from "react";
import {
  ApprovalCard,
  ApprovalInbox,
  ChangePreview,
  CommandPreview,
  MessagePreview,
  MoneyPreview,
  PageHeader,
} from "@twentyfirstmedia/ui-core";
import type { ApprovalInboxItem, ApprovalKey } from "@twentyfirstmedia/ui-core";
import { fakeDecision } from "./_approvals";

const ITEMS: ApprovalInboxItem[] = [
  {
    id: "reply",
    title: "Reply to Erika L. on WhatsApp",
    agent: "Atlas",
    project: "Support",
    family: "comms",
    age: "2 h 10 min",
    ageMin: 130,
    urgent: true,
  },
  {
    id: "refund",
    title: "Refund €10.00 to card ending 4242",
    agent: "Ledger",
    project: "Billing",
    family: "money",
    age: "38 min",
    ageMin: 38,
  },
  {
    id: "dns",
    title: "Update TXT record ops-test",
    agent: "Scout",
    project: "Domains",
    family: "infra",
    age: "3 min",
    ageMin: 3,
  },
  {
    id: "restart",
    title: "Restart nginx on web-1",
    agent: "Ops",
    project: "Platform",
    family: "infra",
    age: "1 min",
    ageMin: 1,
  },
];

const WHY: Record<string, string> = {
  reply: "Atlas answers in the open reply window; replies need your OK.",
  refund: "The customer was charged twice for order 2041.",
  dns: "The verification value changed after the provider renewed the token.",
  restart: "The health check has failed for 4 minutes.",
};

function Payload({ id }: { id: string }) {
  if (id === "reply")
    return (
      <MessagePreview
        channel="WhatsApp"
        recipient="Erika L. (…5678)"
        window={{ state: "closing", until: "2026-04-16T18:20:00" }}
        context={[
          {
            from: "in",
            at: "2026-04-16T09:02:00",
            text: "Any news on order 2041? I need it by Friday.",
          },
        ]}
        text="Good news: order 2041 left the warehouse this morning and arrives Thursday."
      />
    );
  if (id === "refund")
    return (
      <MoneyPreview
        amount={10}
        recipient="Visa …4242"
        reference="Order 2041"
        refund={{ payment: "pay_3PqL8x2k", paidAt: "Apr 14, 18:02" }}
      />
    );
  if (id === "dns")
    return (
      <ChangePreview
        title="Update TXT record · northwind.example"
        fields={[
          { label: "Name", before: "ops-test", after: "ops-test", mono: true },
          { label: "Content", before: "verify=4f1c0e92", after: "verify=b7d2a6f1", mono: true },
          { label: "TTL", before: "3600", after: "300", mono: true },
        ]}
      />
    );
  return (
    <CommandPreview
      command="systemctl restart nginx"
      server="web-1"
      host="deploy@203.0.113.7:22"
      risk="critical"
      timeout={60}
      stateBefore="Active: failed (Result: exit-code) since 09:37:12; 4min ago"
    />
  );
}

export default function Preview() {
  const [items, setItems] = React.useState(ITEMS);
  const [selected, setSelected] = React.useState<string | number>("reply");
  const item = items.find((x) => x.id === selected);
  const record = (id: string | number, key: ApprovalKey, text?: string) =>
    setItems((all) =>
      all.map((x) => (x.id === id ? { ...x, decision: { key, text, by: "You", at: "now" } } : x)),
    );
  return (
    <div className="tf-col" style={{ gap: 16 }}>
      <PageHeader title="Approvals" subtitle="What agents may not do alone, oldest first" />
      <div
        className="tf-grid"
        style={
          {
            "--cols": "minmax(0, 2fr) minmax(0, 3fr)",
            "--cols-sm": "1fr",
            gap: 16,
            alignItems: "start",
          } as React.CSSProperties
        }
      >
        <div className="tf-panel">
          <ApprovalInbox
            items={items}
            selected={selected}
            onSelect={setSelected}
            filters={["project", "family"]}
            onDecide={(id, key) => {
              if (key === "A" || key === "C") record(id, key);
            }}
          />
        </div>
        {item && (
          <ApprovalCard
            key={String(item.id)}
            agent={item.agent}
            project={item.project}
            family={item.family}
            age={item.age}
            title={item.title}
            text={WHY[String(item.id)]}
            escalation={item.urgent ? "Escalates to the owner in 12 min" : undefined}
            stepUp={item.family === "money" || item.family === "infra"}
            decision={item.decision ?? null}
            onDecide={async (key, text) => {
              await fakeDecision(key, 900);
              record(item.id, key, text);
            }}
          >
            <Payload id={String(item.id)} />
          </ApprovalCard>
        )}
      </div>
    </div>
  );
}
