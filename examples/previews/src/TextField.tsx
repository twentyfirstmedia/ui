import * as React from "react";
import { TextField } from "@twentyfirstmedia/ui-core";

function App() {
  const e = React.useState("mara@"),
    n = React.useState("Mara Ellis");
  const bad = !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(e[0]);
  return (
    <div
      className="tf-panel tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
        } as React.CSSProperties
      }
    >
      <TextField
        label="Full name"
        required
        value={n[0]}
        onChange={(x) => {
          n[1](x.target.value);
        }}
        success={n[0].length > 1 ? "Looks good" : null}
      />
      <TextField
        label="Email"
        required
        icon="mail"
        value={e[0]}
        onChange={(x) => {
          e[1](x.target.value);
        }}
        error={bad ? "That doesn’t look like an email address" : null}
      />
      <TextField label="Company" optional placeholder="Acme GmbH" hint="Shown on invoices" />
      <TextField label="Monthly budget" suffix="EUR" defaultValue="1,200" />
      <TextField
        label="Workspace URL"
        defaultValue="halo.app/acme"
        disabled
        hint="Ask an owner to change it"
      />
    </div>
  );
}
export default App;
