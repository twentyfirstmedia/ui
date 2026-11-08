import { OrderTimeline } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-panel"
      style={{
        gap: 32,
      }}
    >
      <OrderTimeline
        status="Shipped"
        times={{
          Placed: "12 Apr, 09:14",
          Paid: "12 Apr, 09:15",
          Packed: "12 Apr, 15:40",
          Shipped: "13 Apr, 08:02",
        }}
      />
      <OrderTimeline
        status="Paid"
        times={{
          Placed: "Just now",
          Paid: "Just now",
        }}
      />
      <OrderTimeline status="Refunded" />
    </div>
  );
}
