import * as React from "react";
import { ImportMapper, Panel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [mapping, setMapping] = React.useState<Record<string, string>>({
    Vorname: "first",
    Nachname: "last",
    "E-Mail": "email",
    Firma: "company",
    Telefon: "",
    Notizen: "",
  });
  return (
    <Panel title="Import contacts" subtitle="contacts-export.csv" style={{ maxWidth: 820 }}>
      <ImportMapper
        rows={1204}
        mapping={mapping}
        onChange={setMapping}
        columns={[
          { name: "Vorname", samples: ["Lena", "Jonas", "Ayşe"] },
          { name: "Nachname", samples: ["Hartmann", "Pick", "Demir"] },
          { name: "E-Mail", samples: ["lena@nordhafen.de", "jonas@pick.studio"] },
          { name: "Firma", samples: ["Nordhafen Outdoor", "Pick Studio"] },
          { name: "Telefon", samples: ["+49 40 2287 1190", "0172 5550 123"] },
          { name: "Notizen", samples: ["Met at OMR", ""] },
        ]}
        fields={[
          { id: "first", label: "First name", required: true },
          { id: "last", label: "Last name", required: true },
          { id: "email", label: "Email", required: true },
          { id: "phone", label: "Phone" },
          { id: "company", label: "Company" },
          { id: "note", label: "Note" },
        ]}
        problems={[
          { row: 17, message: "Email is not valid" },
          { row: 245, message: "Email already exists (merge or skip)" },
        ]}
      />
    </Panel>
  );
}
