import { StackedBarChart } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel">
      <div>
        <h3 className="tf-panel-title">Revenue by plan</h3>
        <p className="tf-panel-sub">Hover a bar for the split</p>
      </div>
      <StackedBarChart
        height={180}
        labels={["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]}
        format={(v) => "€" + (v / 1000).toFixed(1) + "k"}
        series={[
          {
            name: "Starter",
            tint: "sky",
            values: [3100, 3400, 3300, 3900, 4200, 4500],
          },
          {
            name: "Team",
            tint: "mint",
            values: [9800, 10400, 11200, 11900, 12800, 13600],
          },
          {
            name: "Business",
            tint: "lilac",
            values: [5200, 5900, 6100, 6600, 7400, 8100],
          },
        ]}
      />
    </div>
  );
}
