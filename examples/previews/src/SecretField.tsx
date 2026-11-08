import * as React from "react";
import { MoneyInput, SecretField } from "@twentyfirstmedia/ui-core";

function App() {
  const vat = React.useState("19"),
    v = React.useState<number | null>(1240);
  return (
    <div
      className="tf-panel"
      style={{
        gap: 24,
      }}
    >
      <SecretField
        prefix="sk_live_"
        last4="4f2a"
        meta="Added Mar 12"
        onReveal={() => true}
        value="sk_live_51Hx…demo…4f2a"
        onCopy={() => {}}
        onRotate={() => {}}
      />
      <MoneyInput
        label="Amount"
        value={v[0]}
        onChange={v[1]}
        vat={vat[0]}
        onVat={vat[1]}
        vatOptions={[
          {
            value: "19",
            label: "19%",
          },
          {
            value: "7",
            label: "7%",
          },
          {
            value: "0",
            label: "0%",
          },
          {
            value: "rc",
            label: "Reverse charge",
          },
        ]}
        showGross
        hint="Net, as on the invoice"
      />
    </div>
  );
}
export default App;
