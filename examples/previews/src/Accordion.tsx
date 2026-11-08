import * as React from "react";
import { Accordion, Badge, Panel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={{ "--cols": "1fr 1fr", gap: 24, alignItems: "start" } as React.CSSProperties}
    >
      <Accordion
        defaultValue={["billing"]}
        items={[
          {
            id: "billing",
            title: "How does billing work?",
            content:
              "You pay per seat and month. Seats added mid-cycle are prorated to the next invoice.",
          },
          {
            id: "export",
            title: "Can I export my data?",
            content: "Yes. Every table exports to CSV, and the API returns the same fields.",
          },
          {
            id: "sso",
            title: "Do you support single sign-on?",
            meta: <Badge tone="info">Team plan</Badge>,
            content: "SAML and OIDC are included from the Team plan up.",
          },
          { id: "old", title: "Legacy importer", disabled: true, content: "" },
        ]}
      />
      <Panel title="Settings">
        <Accordion
          variant="flush"
          multiple
          defaultValue={["n", "p"]}
          items={[
            {
              id: "n",
              icon: "bell",
              title: "Notifications",
              content: "Approvals and overdue invoices reach you by mail and push.",
            },
            {
              id: "p",
              icon: "lock",
              title: "Privacy",
              content: "Workspace data stays in the EU region.",
            },
            {
              id: "a",
              icon: "code",
              title: "API access",
              content: "Two active keys. Rotate them from Developer settings.",
            },
          ]}
        />
      </Panel>
    </div>
  );
}
