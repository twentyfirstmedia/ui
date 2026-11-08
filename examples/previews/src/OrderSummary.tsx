import * as React from "react";
import { Button, CartLine, CheckoutSteps, OrderSummary } from "@twentyfirstmedia/ui-core";
import type { CartLineProps, Discount } from "@twentyfirstmedia/ui-core";

type OrderLine = Omit<CartLineProps, "onQty" | "onRemove"> & { key: string };

function App() {
  const lines = React.useState<OrderLine[]>([
      {
        key: "a",
        name: "Halo Cotton Tee",
        variant: "M · Sky",
        art: "tee",
        tint: "sky",
        price: 32,
        qty: 1,
      },
      {
        key: "b",
        name: "Studio Mug",
        art: "mug",
        tint: "butter",
        price: 18,
        qty: 2,
        note: "Only 6 left",
      },
    ]),
    d = React.useState<Discount | null>(null),
    step = React.useState(1);
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <CheckoutSteps current={step[0]} onPick={step[1]} />
      <div
        className="tf-grid"
        style={
          {
            "--cols": "minmax(0, 1fr) 340px",
            gap: 16,
            alignItems: "start",
          } as React.CSSProperties
        }
      >
        <div className="tf-panel">
          {lines[0].map((l) => (
            <CartLine
              {...l}
              key={l.key}
              onQty={(n) => {
                lines[1](
                  lines[0].map((z) =>
                    z.key === l.key
                      ? Object.assign({}, z, {
                          qty: n,
                        })
                      : z,
                  ),
                );
              }}
              onRemove={() => {
                lines[1](lines[0].filter((z) => z.key !== l.key));
              }}
            />
          ))}
        </div>
        <div className="tf-panel">
          <OrderSummary
            lines={lines[0]}
            showLines
            discount={d[0]}
            freeShippingFrom={75}
            onCoupon={(c) => {
              if (c === null) return d[1](null);
              if (c !== "HALO10") return false;
              d[1]({
                code: "HALO10",
                pct: 10,
                label: "10% off everything",
              });
            }}
            action={<Button icon="lock">Pay now</Button>}
          />
        </div>
      </div>
    </div>
  );
}
export default App;
