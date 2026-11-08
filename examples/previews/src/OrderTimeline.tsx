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
          Placed: "Apr 12, 09:14",
          Paid: "Apr 12, 09:15",
          Packed: "Apr 12, 15:40",
          Shipped: "Apr 13, 08:02",
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
