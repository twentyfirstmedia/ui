import * as React from "react";
import { SelectMenu } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-panel tf-grid"
      style={{ "--cols": "1fr 1fr", gap: 20, paddingBottom: 260 } as React.CSSProperties}
    >
      <SelectMenu
        label="Assignee"
        placeholder="Choose a person"
        options={[
          { value: "mara", label: "Mara Ellis", hint: "Owner", group: "Leadership" },
          { value: "jonah", label: "Jonah Petit", hint: "Design", group: "Team" },
          { value: "sun", label: "Sun Lee", hint: "Growth", group: "Team" },
          { value: "rui", label: "Rui Costa", hint: "Finance", group: "Team" },
          { value: "ava", label: "Ava Brandt", hint: "Invited", group: "Team", disabled: true },
        ]}
      />
      <SelectMenu
        label="Region"
        defaultValue="eu"
        hint="Where workspace data is stored"
        options={[
          { value: "eu", label: "Europe (Frankfurt)", icon: "globe" },
          { value: "us", label: "United States (Ohio)", icon: "globe" },
          { value: "ap", label: "Asia Pacific (Sydney)", icon: "globe" },
        ]}
      />
    </div>
  );
}
