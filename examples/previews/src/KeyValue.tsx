import { Collapsible, Kbd, KeyValue, Spinner, StatusIndicator } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}
    >
      <div
        className="tf-panel"
        style={{
          gap: 12,
        }}
      >
        <KeyValue
          items={[
            ["Server", "ax41-fsn1"],
            ["Address", "95.217.14.80", true],
            ["Kernel", "6.8.0-45"],
            ["Backups", <StatusIndicator status="ok" label="Nightly · 03:00" />],
            ["Notes", null],
          ]}
        />
      </div>
      <div
        className="tf-panel"
        style={{
          gap: 16,
        }}
      >
        <div className="tf-row">
          <span>Search</span>
          <Kbd keys={["⌘", "K"]} />
          <span>Approve</span>
          <Kbd keys={["A"]} />
          <Spinner />
          <Spinner size="lg" />
        </div>
        <Collapsible title="Advanced settings" meta="3 changed" defaultOpen>
          <KeyValue
            dense
            items={[
              ["Timeout", "30 s"],
              ["Retries", "3"],
            ]}
          />
        </Collapsible>
        <Collapsible title="Raw payload">Hidden until opened</Collapsible>
      </div>
    </div>
  );
}
