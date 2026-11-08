import { CommandPalette } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        position: "relative",
        height: 430,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--canvas)",
      }}
    >
      <CommandPalette
        inline
        onClose={() => {}}
        items={[
          {
            id: 1,
            group: "Pages",
            label: "Invoices",
            hint: "Finance",
            icon: "card",
          },
          {
            id: 2,
            group: "Pages",
            label: "Pipeline",
            hint: "Customers",
            icon: "trend",
          },
          {
            id: 3,
            group: "Actions",
            label: "New invoice",
            icon: "card",
            tint: "butter",
          },
          {
            id: 4,
            group: "Actions",
            label: "Compose mail",
            icon: "edit",
            tint: "sky",
          },
          {
            id: 5,
            group: "Actions",
            label: "New agent",
            icon: "bot",
            tint: "lilac",
          },
          {
            id: 6,
            group: "Records",
            label: "Northwind",
            hint: "Customer · Team",
            icon: "users",
            tint: "sky",
            searchOnly: true,
          },
        ]}
      />
    </div>
  );
}
