import * as React from "react";
import { Badge, Button, Card, IconButton, Stagger, TintIcon } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Stagger
      className="tf-grid"
      style={
        {
          "--cols": "repeat(3, 1fr)",
        } as React.CSSProperties
      }
    >
      <Card
        title="Quarterly onboarding"
        description="Welcome flow for new workspace admins."
        meta={["Mara Ellis", "12 steps", "348 users"]}
        corner={<TintIcon icon="book" tint="mint" />}
        status={<Badge tone="success">Live</Badge>}
        actions={[
          <IconButton key={1} icon="more" label="More" size="sm" />,
          <IconButton key={2} icon="x" label="Archive" size="sm" />,
          <IconButton key={3} icon="check" label="Approve" size="sm" variant="solid" />,
        ]}
      />
      <Card
        tint="lilac"
        title="Pricing page refresh"
        description="New tiers and a comparison table for annual plans."
        corner={<IconButton icon="play" label="Preview" size="sm" variant="outline" />}
        status={<Badge tone="neutral">86 viewing</Badge>}
        actions={[<IconButton key={1} icon="edit" label="Edit" size="sm" variant="solid" />]}
      />
      <Card
        title="Invoice #2041 is overdue"
        description="Net-30 passed four days ago; reminder bounced."
        meta={["Rui Costa", "High priority"]}
        corner={<TintIcon icon="mail" tint="blush" />}
        status={<Badge tone="warning">Open</Badge>}
        actions={[
          <Button key={1} size="sm" variant="soft">
            Reply
          </Button>,
        ]}
      />
    </Stagger>
  );
}
