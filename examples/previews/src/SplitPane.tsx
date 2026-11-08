import { InboxList, SplitPane } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-panel tf-panel-flush"
      style={{
        height: 280,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <SplitPane
        defaultSize={320}
        min={220}
        max={600}
        storageKey="demo"
        left={
          <div
            style={{
              padding: 16,
            }}
          >
            <InboxList
              selected={1}
              items={[
                {
                  id: 1,
                  from: "Ida Nolan",
                  time: "08:40",
                  subject: "Seat upgrade before renewal",
                  snippet: "We are growing faster than planned…",
                  unread: true,
                },
                {
                  id: 2,
                  from: "Jonas Petit",
                  time: "Yesterday",
                  subject: "Pricing review → Thursday?",
                  snippet: "Growth wants to join…",
                },
              ]}
            />
          </div>
        }
        right={
          <div
            style={{
              padding: 24,
            }}
          >
            <b>Drag the divider</b>
            <p className="tf-card-desc">
              Double-click resets. ← → move it when focused. The width is remembered per storageKey.
            </p>
          </div>
        }
      />
    </div>
  );
}
