import { AvatarStack, Badge, Card, KanbanColumn } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        maxWidth: 300,
      }}
    >
      <KanbanColumn title="In review" dot="lilac">
        <Card
          title="Billing settings flow"
          meta={["Due Fri"]}
          status={<Badge tone="highlight">Review</Badge>}
          actions={[<AvatarStack key={1} names={["Mara Ellis", "Sun Lee"]} size={24} />]}
        />
        <Card
          title="Empty states for reports"
          meta={["Due Mon"]}
          status={<Badge tone="warning">Changes</Badge>}
        />
      </KanbanColumn>
    </div>
  );
}
