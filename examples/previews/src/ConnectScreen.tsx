import * as React from "react";
import {
  Button,
  ConsentList,
  Icon,
  KeyValue,
  Panel,
  QrCode,
  ServiceMark,
} from "@twentyfirstmedia/ui-core";
import type { ConsentConnector } from "@twentyfirstmedia/ui-core";
import "./_connectors";

/**
 * Connecting a service: what the assistant may do (each permission with its level and whether it
 * asks first), where the data stays, then the provider's sign-in. Apple Health connects through
 * the phone app instead.
 */
export default function Preview() {
  const [gmail, setGmail] = React.useState<ConsentConnector>({
    id: "gmail",
    name: "Gmail",
    icon: "brandGmail",
    purpose: "Finds bills, deadlines and travel plans in your mail and drafts replies for you.",
    scopes: [
      { id: "read", label: "Read messages", granted: true, required: true, level: "read" },
      { id: "label", label: "Sort and label", granted: true, level: "act" },
      {
        id: "draft",
        label: "Draft replies",
        description: "Saved as drafts; nothing is sent",
        granted: true,
        level: "act",
      },
      {
        id: "send",
        label: "Send on your behalf",
        description: "Each message waits for your OK",
        granted: false,
        level: "act",
        asksFirst: true,
      },
    ],
  });
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "minmax(0, 3fr) minmax(0, 2fr)",
          "--cols-sm": "1fr",
          gap: 16,
          alignItems: "start",
        } as React.CSSProperties
      }
    >
      <Panel title="Connect Gmail" subtitle="Life asks for these permissions">
        <div className="tf-row" style={{ gap: 10 }} aria-hidden>
          <ServiceMark name="Life" icon="sparkle" tint="lilac" size="lg" decorative />
          <Icon name="link" size={16} />
          <ServiceMark name="Gmail" icon="brandGmail" size="lg" decorative />
        </div>
        <ConsentList
          connectors={[gmail]}
          label="Gmail permissions"
          onScopeChange={(_, s, granted) =>
            setGmail((g) => ({
              ...g,
              scopes: g.scopes.map((x) => (x.id === s ? { ...x, granted } : x)),
            }))
          }
        />
        <KeyValue
          items={[
            ["Stored", "In the EU, encrypted"],
            ["Kept", "90 days, then summaries only"],
            ["Used for training", "Never"],
            ["Revoke", "Any time under Data access"],
          ]}
        />
        <div className="tf-row" style={{ justifyContent: "flex-end" }}>
          <Button variant="secondary">Cancel</Button>
          <Button icon="brandGoogle">Continue with Google</Button>
        </div>
      </Panel>
      <Panel
        title="Connect Apple Health"
        subtitle="Health data stays on your iPhone until you share it"
      >
        <ServiceMark name="Apple Health" tint="blush" size="lg" />
        <p style={{ margin: 0 }}>
          Open the Life app on your iPhone and scan this code. It asks iOS for steps, sleep, heart
          rate and workouts; you pick each type there.
        </p>
        <div style={{ maxWidth: 200 }}>
          <QrCode value="https://life.example/pair/7KQ-48D" />
        </div>
        <KeyValue items={[["Pairing code", "7KQ-48D", true]]} />
      </Panel>
    </div>
  );
}
