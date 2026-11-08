import * as React from "react";
import { CouponCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
        } as React.CSSProperties
      }
    >
      <CouponCard
        code="SPRING20"
        kind="percent"
        value={20}
        used={312}
        limit={500}
        until="Apr 30"
        min={10}
        revenue={8420}
        text="All Instagram packages"
        menu={[
          {
            label: "Edit",
            icon: "edit",
          },
          {
            label: "Duplicate",
            icon: "copy",
          },
          "-",
          {
            label: "Deactivate",
            icon: "pause",
            danger: true,
          },
        ]}
      />
      <CouponCard
        code="WELCOME5"
        kind="fixed"
        value={5}
        used={1204}
        text="First order"
        revenue={21890}
      />
      <CouponCard
        code="BLACKFRIDAY"
        kind="percent"
        value={30}
        used={1000}
        limit={1000}
        until="Nov 29"
        statusLabel="Used up"
      />
    </div>
  );
}
