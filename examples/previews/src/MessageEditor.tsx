import * as React from "react";
import { MessageEditor, VersionSwitch } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [version, setVersion] = React.useState(1);
  const [busy, setBusy] = React.useState(false);
  return (
    <div className="tf-panel" style={{ gap: 24 }}>
      <MessageEditor
        autoFocus={false}
        defaultValue={"Northwind wants 40 more seats before the renewal.\nUse the new price list."}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
      <div className="tf-row" style={{ gap: 24, alignItems: "center" }}>
        <VersionSwitch count={3} index={version} onChange={setVersion} />
        <VersionSwitch
          count={3}
          index={2}
          busy={busy}
          onChange={() => {
            setBusy(true);
            setTimeout(() => setBusy(false), 1500);
          }}
        />
      </div>
    </div>
  );
}
