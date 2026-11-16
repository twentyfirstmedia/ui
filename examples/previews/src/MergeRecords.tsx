import { MergeRecords, Panel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Panel
      title="Merge duplicates"
      subtitle="Pick what to keep per field"
      style={{ maxWidth: 760 }}
    >
      <MergeRecords
        records={[
          {
            id: "a",
            title: "Lena Hartmann",
            subtitle: "Created Mar 2023 · 48 activities",
            values: {
              email: "lena@nordhafen.de",
              phone: "+49 40 2287 1190",
              company: "Nordhafen Outdoor",
              title: "Head of Operations",
              city: "Hamburg",
            },
          },
          {
            id: "b",
            title: "L. Hartmann",
            subtitle: "Imported Oct 2026 · 2 activities",
            values: {
              email: "l.hartmann@nordhafen.de",
              phone: "+49 40 2287 1190",
              company: "Nordhafen Outdoor GmbH",
              title: "",
              city: "Hamburg",
            },
          },
        ]}
        fields={[
          { id: "email", label: "Email" },
          { id: "phone", label: "Phone" },
          { id: "company", label: "Company" },
          { id: "title", label: "Job title" },
          { id: "city", label: "City" },
        ]}
        onMerge={() => {}}
      />
    </Panel>
  );
}
