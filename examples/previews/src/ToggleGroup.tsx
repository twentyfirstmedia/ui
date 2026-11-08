import * as React from "react";
import { Toggle, ToggleGroup } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [marks, setMarks] = React.useState(["bold"]);
  return (
    <div className="tf-panel" style={{ gap: 20 }}>
      <div className="tf-row" style={{ gap: 12 }}>
        <ToggleGroup
          label="Text style"
          type="multiple"
          value={marks}
          onChange={setMarks}
          items={[
            { value: "bold", label: "", icon: "bold", hint: "Bold" },
            { value: "list", label: "", icon: "list", hint: "List" },
            { value: "quote", label: "", icon: "quote", hint: "Quote" },
          ]}
        />
        <ToggleGroup
          label="View"
          defaultValue={["week"]}
          items={["Day", "Week", "Month"].map((x) => ({ value: x.toLowerCase(), label: x }))}
        />
      </div>
      <div className="tf-row" style={{ gap: 8 }}>
        <Toggle icon="star" label="Starred" defaultPressed />
        <Toggle icon="pin" label="Pinned" />
        <Toggle icon="bell">Follow thread</Toggle>
        <Toggle size="sm" icon="eye" disabled>
          Watching
        </Toggle>
      </div>
    </div>
  );
}
