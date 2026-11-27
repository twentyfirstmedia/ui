import * as React from "react";
import { MailRouteList } from "@twentyfirstmedia/ui-core";
import type { MailRoute } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [routes, setRoutes] = React.useState<MailRoute[]>([
    { address: "hello@example.com", targets: ["mara@example.com", "jonah@example.com"] },
    { address: "jobs@example.com", targets: ["ava@example.com"] },
    {
      address: "invoices@example.com",
      targets: ["bookkeeping@accounts.example.org"],
      kind: "forward",
      note: "Keeps a copy",
    },
    { address: "press@example.com", targets: ["mara@example.com"], active: false },
  ]);
  return (
    <div className="tf-panel" style={{ gap: 16 }}>
      <MailRouteList
        domain="example.com"
        routes={routes}
        suggestions={[
          { address: "mara@example.com", name: "Mara Ellis" },
          { address: "jonah@example.com", name: "Jonah Petit" },
          { address: "ava@example.com", name: "Ava Brandt" },
        ]}
        onAdd={(r) => setRoutes((l) => l.concat([r]))}
        onDelete={(a) => setRoutes((l) => l.filter((r) => r.address !== a))}
      />
    </div>
  );
}
