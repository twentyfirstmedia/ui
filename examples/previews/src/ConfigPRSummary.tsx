import { Button, ConfigPRSummary, ModuleRegistry } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      <ConfigPRSummary
        title="New team: Support for Chatteo"
        meta="Proposed by Main Brain · PR #212"
        status="signal"
        statusLabel="Needs review"
        summary="Adds a support team with two agents. Both start in drafts-only mode."
        items={[
          {
            kind: "team",
            name: "chatteo/support",
          },
          {
            kind: "agent",
            name: "Iris",
            detail: "Mailbox (read, draft) · Knowledge base",
          },
          {
            kind: "agent",
            name: "Nora",
            detail: "WhatsApp (reply within 24 h)",
          },
          {
            kind: "trigger",
            name: "New mail to hello@chatteo.de",
            op: "change",
          },
        ]}
        actions={[
          <Button key="v" variant="secondary" size="sm">
            View PR
          </Button>,
          <Button key="m" size="sm" icon="check">
            Approve
          </Button>,
        ]}
      />
      <div className="tf-panel tf-panel-flush tf-panel-list">
        <ModuleRegistry
          onToggle={() => {}}
          items={[
            {
              id: "chats",
              name: "Chats",
              version: "1.4.0",
              text: "Agents and people in one place",
              core: true,
              icon: "mail",
            },
            {
              id: "crm",
              name: "CRM",
              version: "0.9.2",
              text: "Companies, contacts, pipeline",
              enabled: true,
              icon: "users",
              adds: ["Nav", "Tool", "Jobs"],
            },
            {
              id: "brand",
              name: "Brand studio",
              version: "0.6.0",
              text: "Brand packages for customers",
              enabled: false,
              icon: "sparkle",
              adds: ["Nav", "Tool"],
            },
          ]}
        />
      </div>
    </div>
  );
}
