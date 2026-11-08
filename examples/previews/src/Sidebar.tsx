import * as React from "react";
import { Avatar, Sidebar } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [page, setPage] = React.useState("invoices");
  const groups = [
    {
      items: [
        { id: "home", label: "Home", icon: "home" as const },
        { id: "inbox", label: "Inbox", icon: "mail" as const, count: 4 },
      ],
    },
    {
      label: "Finance",
      items: [
        {
          id: "billing",
          label: "Billing",
          icon: "card" as const,
          items: [
            { id: "invoices", label: "Invoices", icon: "file" as const },
            { id: "payouts", label: "Payouts", icon: "download" as const },
          ],
        },
        { id: "reports", label: "Reports", icon: "chart" as const },
      ],
    },
  ];
  const head = (
    <div className="tf-row" style={{ gap: 8, padding: "4px 4px 0", flexWrap: "nowrap" }}>
      <span className="tf-brand" style={{ color: "var(--ink)" }}>
        Halo
        <span className="tf-brand-dot" />
      </span>
    </div>
  );
  return (
    <div className="tf-row" style={{ gap: 24, alignItems: "stretch", flexWrap: "wrap" }}>
      <div style={{ height: 420, display: "flex" }}>
        <Sidebar
          label="Workspace"
          groups={groups}
          current={page}
          onPick={setPage}
          header={head}
          footer={<Avatar name="Mara Ellis" size={28} />}
        />
      </div>
      <div style={{ height: 420, display: "flex" }}>
        <Sidebar
          label="Workspace (collapsed)"
          groups={groups}
          current={page}
          onPick={setPage}
          defaultCollapsed
        />
      </div>
    </div>
  );
}
