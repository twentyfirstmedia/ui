import { DocumentList, Panel, registerIcons } from "@twentyfirstmedia/ui-core";
import { idCard } from "@twentyfirstmedia/ui-core/icons";

registerIcons({ idCard });

export default function Preview() {
  return (
    <Panel title="Documents" subtitle="Family" style={{ maxWidth: 620 }}>
      <DocumentList
        today={new Date(2026, 10, 13)}
        onOpen={() => {}}
        documents={[
          {
            id: "pass",
            title: "Passport",
            category: "ID",
            icon: "idCard",
            holder: "Lena",
            expires: new Date(2026, 11, 2),
          },
          {
            id: "card",
            title: "ID card",
            category: "ID",
            icon: "idCard",
            holder: "Mara",
            expires: new Date(2031, 4, 1),
          },
          {
            id: "lic",
            title: "Driving licence",
            category: "ID",
            icon: "idCard",
            holder: "Jonas",
            expires: new Date(2026, 9, 1),
          },
          {
            id: "rent",
            title: "Rental contract",
            category: "Home",
            icon: "home",
            meta: "PDF · 1.2 MB",
          },
          {
            id: "ins",
            title: "Household contents policy",
            category: "Insurance",
            icon: "shield",
            meta: "PDF · 240 KB",
          },
        ]}
      />
    </Panel>
  );
}
