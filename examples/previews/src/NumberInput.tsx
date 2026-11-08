import * as React from "react";
import { NumberInput, OtpInput, Slider } from "@twentyfirstmedia/ui-core";

function App() {
  const s = React.useState(12),
    b = React.useState(120);
  return (
    <div
      className="tf-panel"
      style={{
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <NumberInput
          label="Seats"
          value={s[0]}
          onChange={s[1]}
          min={1}
          max={200}
          hint="€24 per seat"
        />
        <NumberInput label="VAT" defaultValue={19} min={0} max={25} unit="%" />
        <div className="tf-field">
          <span className="tf-field-label">Verification code</span>
          <OtpInput onComplete={() => {}} />
          <span className="tf-field-hint">Paste works too</span>
        </div>
      </div>
      <Slider
        label="Monthly agent budget"
        min={0}
        max={500}
        step={10}
        value={b[0]}
        onChange={b[1]}
        format={(v) => "€" + v}
        hint="Agents pause and ask you once they reach it"
      />
    </div>
  );
}
export default App;
