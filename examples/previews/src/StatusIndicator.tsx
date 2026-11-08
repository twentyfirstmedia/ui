import { Badge, StatusIndicator } from "@twentyfirstmedia/ui-core";
import type { Status, Tone } from "@twentyfirstmedia/ui-core";

const S: [Status, string][] = [
  ["ok", "Done"],
  ["running", "Working"],
  ["signal", "Waiting for approval"],
  ["warn", "Paused · budget"],
  ["danger", "Failed"],
  ["idle", "Ready"],
];
export default function Preview() {
  return (
    <div
      className="tf-panel"
      style={{
        gap: 24,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {S.map((s) => (
          <StatusIndicator key={s[0]} status={s[0]} label={s[1]} />
        ))}
      </div>
      <div className="tf-row">
        {(
          [
            ["success", "Live"],
            ["info", "Pending"],
            ["highlight", "Needs review"],
            ["warning", "Expiring"],
            ["danger", "Overdue"],
            ["neutral", "Draft"],
          ] as [Tone, string][]
        ).map((b) => (
          <Badge key={b[0]} tone={b[0]}>
            {b[1]}
          </Badge>
        ))}
      </div>
    </div>
  );
}
