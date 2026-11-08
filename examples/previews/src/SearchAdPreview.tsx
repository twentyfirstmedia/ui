import * as React from "react";
import { SearchAdPreview, TextField } from "@twentyfirstmedia/ui-core";

function App() {
  const hl = React.useState([
      "Real Instagram Followers",
      "Delivery in 1 Hour",
      "Trusted by 50,000 Creators",
    ]),
    ds = React.useState([
      "Grow your account with real followers. Secure payment, 30-day refill guarantee, German support.",
      "Start from €2.90. No password needed.",
    ]);
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
          alignItems: "start",
        } as React.CSSProperties
      }
    >
      <div
        className="tf-panel"
        style={{
          gap: 12,
        }}
      >
        {hl[0].map((v, i) => (
          <TextField
            key={i}
            label={"Headline " + (i + 1)}
            value={v}
            onChange={(e) => {
              const n = hl[0].slice();
              n[i] = e.target.value;
              hl[1](n);
            }}
            hint={v.length + " / 30"}
          />
        ))}
        {ds[0].map((v, i) => (
          <TextField
            key={"d" + i}
            label={"Description " + (i + 1)}
            value={v}
            onChange={(e) => {
              const n = ds[0].slice();
              n[i] = e.target.value;
              ds[1](n);
            }}
            hint={v.length + " / 90"}
          />
        ))}
      </div>
      <div className="tf-panel">
        <SearchAdPreview
          name="Northwind"
          domain="northwind.de"
          paths={["instagram", "followers"]}
          headlines={hl[0]}
          descriptions={ds[0]}
          sitelinks={["Buy likes", "Pricing", "Refill guarantee", "Support"]}
        />
      </div>
    </div>
  );
}
export default App;
