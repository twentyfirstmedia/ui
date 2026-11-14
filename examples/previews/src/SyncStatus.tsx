import { Panel, SyncStatus } from "@twentyfirstmedia/ui-core";

const now = new Date(2026, 10, 14, 9, 30);
const minutes = (m: number) => new Date(now.getTime() + m * 60000);

export default function Preview() {
  return (
    <Panel title="Sync status" style={{ maxWidth: 620 }}>
      <SyncStatus
        state="synced"
        now={now}
        last={minutes(-6)}
        next={minutes(54)}
        counts={[
          { label: "emails", value: 1204 },
          { label: "threads", value: 316 },
          { label: "attachments", value: 88 },
        ]}
        onSync={() => {}}
      />
      <SyncStatus state="syncing" now={now} last={minutes(-60)} />
      <SyncStatus
        state="error"
        now={now}
        last={minutes(-26 * 60)}
        error="N26 asks you to confirm access again every 180 days."
        onSync={() => {}}
      />
      <SyncStatus state="paused" now={now} last={minutes(-3 * 24 * 60)} />
      <SyncStatus state="never" now={now} />
      <SyncStatus state="synced" now={now} last={minutes(-2)} compact />
    </Panel>
  );
}
