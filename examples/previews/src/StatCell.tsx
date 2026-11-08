import { StatCell } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 16,
      }}
    >
      <StatCell
        label="Revenue today"
        value="€4,812"
        delta={12.4}
        compare="vs last Friday"
        spark={[3, 4, 4, 6, 5, 7, 8]}
        icon="card"
        iconTint="butter"
      />
      <StatCell
        label="Orders"
        value="128"
        delta={4.1}
        compare="vs last Friday"
        spark={[5, 6, 5, 7, 6, 8, 8]}
      />
      <StatCell
        label="Refund rate"
        value="1.2%"
        delta={-0.4}
        compare="vs last week"
        invert
        spark={[4, 4, 3, 3, 2, 2, 2]}
      />
      <StatCell
        label="Failed orders"
        value="7"
        delta={40}
        compare="vs yesterday"
        invert
        spark={[1, 2, 1, 3, 2, 4, 5]}
        tint="blush"
      />
    </div>
  );
}
