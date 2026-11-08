import { AreaChart } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel">
      <div>
        <h3 className="tf-panel-title">Visitors by channel</h3>
        <p className="tf-panel-sub">Stacked, per week</p>
      </div>
      <AreaChart
        height={180}
        labels={["W14", "W15", "W16", "W17", "W18", "W19", "W20", "W21"]}
        format={(v) => (v / 1000).toFixed(1) + "k"}
        series={[
          {
            name: "Organic",
            tint: "sky",
            values: [4200, 4600, 4400, 5100, 5600, 5300, 6100, 6500],
          },
          {
            name: "Newsletter",
            tint: "butter",
            values: [1800, 2600, 1900, 2100, 3400, 2200, 2400, 3900],
          },
          {
            name: "Partners",
            tint: "mint",
            values: [1200, 1300, 1500, 1400, 1600, 1900, 1800, 2100],
          },
        ]}
      />
    </div>
  );
}
