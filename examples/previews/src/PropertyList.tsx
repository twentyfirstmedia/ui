import * as React from "react";
import { Panel, PropertyList } from "@twentyfirstmedia/ui-core";
import type { PropertyField } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [fields, setFields] = React.useState<PropertyField[]>([
    { id: "email", label: "Email", type: "email", value: "lena@nordhafen.de" },
    { id: "phone", label: "Phone", type: "phone", value: "+49 40 2287 1190" },
    { id: "web", label: "Website", type: "url", value: "https://nordhafen.de" },
    {
      id: "stage",
      label: "Lifecycle",
      type: "select",
      value: "Customer",
      options: ["Lead", "Prospect", "Customer", "Former customer"],
    },
    {
      id: "value",
      label: "Lifetime value",
      type: "money",
      value: 126400,
      readOnly: true,
      hint: "From invoices",
    },
    { id: "renewal", label: "Renewal", type: "date", value: new Date(2027, 2, 1) },
    { id: "owner", label: "Owner", type: "person", value: "Mara Ellis" },
    { id: "tags", label: "Tags", type: "tags", value: ["Decision maker", "Hamburg"] },
    { id: "source", label: "Source", value: null },
  ]);
  return (
    <Panel title="Details" style={{ maxWidth: 480 }}>
      <PropertyList
        fields={fields}
        onChange={(id, v) =>
          setFields((all) =>
            all.map((f) =>
              f.id !== id
                ? f
                : {
                    ...f,
                    value:
                      f.type === "tags"
                        ? v.split(/,\s*/).filter(Boolean)
                        : f.type === "date"
                          ? new Date(v)
                          : f.type === "money"
                            ? Number(v)
                            : v,
                  },
            ),
          )
        }
      />
    </Panel>
  );
}
