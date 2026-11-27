import { DaySeparator } from "@twentyfirstmedia/ui-core";

const NOW = "2026-04-16T12:00:00";

export default function Preview() {
  return (
    <div className="tf-panel" style={{ gap: 8 }}>
      <DaySeparator date="2026-04-13T09:00:00" now={NOW} />
      <p className="tf-card-desc">Monday's messages …</p>
      <DaySeparator date="2026-04-15T18:20:00" now={NOW} />
      <p className="tf-card-desc">Yesterday's messages …</p>
      <DaySeparator date="2026-04-16T08:05:00" now={NOW} />
      <p className="tf-card-desc">This morning's messages …</p>
      <DaySeparator label="New messages" tone="accent" />
      <p className="tf-card-desc">Unread messages …</p>
    </div>
  );
}
