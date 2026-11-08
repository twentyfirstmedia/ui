import { EventCard, IconButton, Panel, Tabs } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        maxWidth: 340,
        background: "var(--canvas)",
        padding: 12,
        borderRadius: "var(--radius-lg)",
      }}
    >
      <Panel
        title="Schedule"
        subtitle="5 items waiting · 2 today"
        action={<IconButton icon="plus" label="Add" />}
      >
        <Tabs block items={["Events", "Approvals", "History"]} />
        <EventCard kind="review" label="Design review" date="Wed, Apr 15" time="14:00">
          Walk through the new billing settings flow.
        </EventCard>
      </Panel>
    </div>
  );
}
