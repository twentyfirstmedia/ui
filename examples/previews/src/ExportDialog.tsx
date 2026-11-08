import { ExportDialog } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "var(--canvas)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <ExportDialog
        inline
        title="Export orders"
        count={4812}
        formats={["csv", "xlsx", "json"]}
        columns={[
          {
            key: "id",
            label: "Order number",
          },
          {
            key: "date",
            label: "Date",
          },
          {
            key: "customer",
            label: "Customer",
          },
          {
            key: "product",
            label: "Product",
          },
          {
            key: "net",
            label: "Net",
          },
          {
            key: "vat",
            label: "VAT",
          },
          {
            key: "email",
            label: "Email",
            default: false,
          },
          {
            key: "ip",
            label: "IP address",
            default: false,
          },
        ]}
        note="Personal data is only included when you pick those columns."
        onExport={(o, prog) =>
          new Promise((r) => {
            let x = 0;
            const t = setInterval(() => {
              x += 20;
              prog(x);
              if (x >= 100) {
                clearInterval(t);
                r();
              }
            }, 300);
          })
        }
        onClose={() => {}}
      />
    </div>
  );
}
