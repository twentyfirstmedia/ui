import { Gauge } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-panel"
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: 24,
      }}
    >
      <Gauge
        value={60}
        max={75}
        caption="80% of monthly target"
        format={(v) => "€" + v + "k"}
        tint="mint"
      />
      <Gauge
        value={72}
        max={100}
        thresholds={[60, 85]}
        caption="Agent budget used"
        format={(v) => v + "%"}
      />
      <Gauge
        value={91}
        max={100}
        thresholds={[60, 85]}
        caption="Storage used"
        format={(v) => v + "%"}
      />
    </div>
  );
}
