import { RecordHeader } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-col" style={{ gap: 16, maxWidth: 860 }}>
      <RecordHeader
        title="Lena Hartmann"
        subtitle="Head of Operations at Nordhafen Outdoor"
        status={{ label: "Customer", tone: "success" }}
        tags={["Decision maker", "Hamburg"]}
        owner="Mara Ellis"
        actions={[
          { label: "Email", icon: "mail", primary: true },
          { label: "Call", icon: "phone" },
          { label: "Meeting", icon: "calendar" },
          { label: "Note", icon: "edit" },
        ]}
        facts={[
          { label: "Open deals", value: "€78,000" },
          { label: "Last contact", value: "Today" },
          { label: "Phone", value: "+49 40 2287 1190" },
          { label: "Customer since", value: "Mar 2023" },
        ]}
      />
      <RecordHeader
        kind="matter"
        title="Hartmann ./. Elbe Logistik GmbH"
        subtitle="Matter 2026/0412 · Labour law · Hamburg Labour Court"
        status={{ label: "Open", tone: "info" }}
        owner="Dr. Anna Weber"
        facts={[
          { label: "Next deadline", value: "Nov 24 · Statement" },
          { label: "Value in dispute", value: "€38,500" },
          { label: "Hours recorded", value: "21.5 h" },
        ]}
      />
    </div>
  );
}
