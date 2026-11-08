import { LineChart } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-panel"
      style={{
        maxWidth: 620,
      }}
    >
      <LineChart
        labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
        format={(v) => "€" + Math.round(v / 1000) + "k"}
        series={[
          {
            values: [18000, 22000, 21000, 29000, 34000, 41000],
            tint: "mint",
            area: true,
          },
          {
            values: [12000, 14000, 17000, 16000, 21000, 24000],
            tint: "sky",
          },
        ]}
      />
    </div>
  );
}
