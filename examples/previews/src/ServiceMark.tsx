import { Panel, ServiceMark } from "@twentyfirstmedia/ui-core";
import "./_connectors";

export default function Preview() {
  return (
    <Panel
      title="Service marks"
      subtitle="Brand logo, your own logo or a monogram"
      style={{ maxWidth: 620 }}
    >
      <div className="tf-row" style={{ gap: 12 }}>
        <ServiceMark name="Gmail" icon="brandGmail" status="connected" />
        <ServiceMark name="Spotify" icon="brandSpotify" status="syncing" />
        <ServiceMark name="N26" icon="brandN26" status="error" />
        <ServiceMark name="tado°" icon="brandTado" status="paused" />
        <ServiceMark name="Apple Health" tint="blush" />
        <ServiceMark name="Scalable Capital" tint="lilac" />
        <ServiceMark name="Hole19" monogram="19" tint="mint" />
        <ServiceMark name="Phone calls" icon="phone" tint="sky" />
      </div>
      <div className="tf-row" style={{ gap: 12, alignItems: "center" }}>
        <ServiceMark name="Tesla" icon="brandTesla" size="sm" />
        <ServiceMark name="Tesla" icon="brandTesla" />
        <ServiceMark name="Tesla" icon="brandTesla" size="lg" status="connected" />
        <ServiceMark name="Wolt" tint="sky" size="sm" />
        <ServiceMark name="Wolt" tint="sky" />
        <ServiceMark name="Wolt" tint="sky" size="lg" />
      </div>
    </Panel>
  );
}
