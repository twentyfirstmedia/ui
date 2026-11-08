import * as React from "react";
import { FileDrop } from "@twentyfirstmedia/ui-core";

function App() {
  const f = React.useState([
    {
      id: "a",
      name: "Receipt-April-Hetzner.pdf",
      size: 184320,
      progress: 100,
    },
    {
      id: "b",
      name: "Team-offsite-photos.zip",
      size: 24117248,
      progress: 46,
    },
  ]);
  return (
    <div className="tf-panel">
      <FileDrop
        files={f[0]}
        onChange={f[1]}
        hint="PDF, PNG or JPG up to 10 MB · drag several at once"
      />
    </div>
  );
}
export default App;
