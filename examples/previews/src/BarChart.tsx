import { BarChart } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-panel"
      style={{
        maxWidth: 620,
      }}
    >
      <BarChart
        data={[
          {
            label: "Mon",
            value: 32,
          },
          {
            label: "Tue",
            value: 48,
          },
          {
            label: "Wed",
            value: 41,
          },
          {
            label: "Thu",
            value: 66,
            tint: "lilac",
          },
          {
            label: "Fri",
            value: 58,
          },
          {
            label: "Sat",
            value: 22,
          },
          {
            label: "Sun",
            value: 18,
          },
        ]}
      />
    </div>
  );
}
