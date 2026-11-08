import { Avatar, Badge, Table } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: 22,
        padding: 8,
      }}
    >
      <Table
        columns={[
          {
            key: "name",
            label: "Customer",
            render: (r) => (
              <span className="tf-row">
                <Avatar name={r.name} size={26} />
                {r.name}
              </span>
            ),
          },
          {
            key: "plan",
            label: "Plan",
          },
          {
            key: "status",
            label: "Status",
            render: (r) => <Badge tone={r.tone}>{r.status}</Badge>,
          },
          {
            key: "mrr",
            label: "MRR",
            align: "right",
          },
        ]}
        rows={[
          {
            name: "Northwind",
            plan: "Team",
            status: "Active",
            tone: "success",
            mrr: "$1,240",
          },
          {
            name: "Blue Fern",
            plan: "Starter",
            status: "Trial",
            tone: "info",
            mrr: "$0",
          },
          {
            name: "Copperline",
            plan: "Business",
            status: "Past due",
            tone: "warning",
            mrr: "$3,900",
          },
        ]}
      />
    </div>
  );
}
