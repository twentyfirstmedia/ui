import * as React from "react";
import { Avatar, Badge, DataTable, FilterBar } from "@twentyfirstmedia/ui-core";
import type { Tone } from "@twentyfirstmedia/ui-core";

const ROWS = [
  {
    id: 1,
    name: "Ava Vogel",
    email: "ava@halo.app",
    role: "Editor",
    team: "Engineering",
    status: "Active",
    seats: 3,
  },
  {
    id: 2,
    name: "Ben Okafor",
    email: "ben@halo.app",
    role: "Viewer",
    team: "Sales",
    status: "Invited",
    seats: 1,
  },
  {
    id: 3,
    name: "Clara Haddad",
    email: "clara@halo.app",
    role: "Admin",
    team: "Design",
    status: "Active",
    seats: 5,
  },
  {
    id: 4,
    name: "Elif Sato",
    email: "elif@halo.app",
    role: "Editor",
    team: "Engineering",
    status: "Away",
    seats: 2,
  },
  {
    id: 5,
    name: "Jonah Petit",
    email: "jonah@halo.app",
    role: "Editor",
    team: "Growth",
    status: "Active",
    seats: 4,
  },
];
const TONE: Record<string, Tone> = {
  Active: "success",
  Invited: "info",
  Away: "warning",
};
function App() {
  const f = React.useState<Record<string, string>>({
      Team: "Engineering",
    }),
    q = React.useState("");
  const rows = ROWS.filter(
    (r) =>
      (!f[0].Team || r.team === f[0].Team) &&
      (!f[0].Status || r.status === f[0].Status) &&
      (!q[0] || r.name.toLowerCase().indexOf(q[0].toLowerCase()) >= 0),
  );
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <FilterBar
        search="Search people"
        query={q[0]}
        onQuery={q[1]}
        value={f[0]}
        onChange={f[1]}
        filters={[
          {
            key: "Team",
            label: "Team",
            options: ["Design", "Engineering", "Growth", "Sales"],
          },
          {
            key: "Status",
            label: "Status",
            options: ["Active", "Invited", "Away"],
          },
        ]}
      />
      <div className="tf-panel tf-panel-flush">
        <DataTable
          rows={rows}
          selectable
          stickyHeader
          defaultSort={{
            key: "name",
            dir: "asc",
          }}
          toolbar={<span className="tf-card-desc">{rows.length + " of " + ROWS.length}</span>}
          bulkActions={[
            {
              label: "Change role",
              icon: "edit",
              onClick: () => {},
            },
            {
              label: "Remove",
              icon: "trash",
              danger: true,
              onClick: (r, clear) => {
                clear();
              },
            },
          ]}
          renderExpanded={(r) => (
            <span className="tf-card-desc">{r.email + " · " + r.seats + " seats assigned"}</span>
          )}
          columns={[
            {
              key: "name",
              label: "Name",
              sortable: true,
              hideable: false,
              render: (r) => (
                <span
                  className="tf-row"
                  style={{
                    flexWrap: "nowrap",
                  }}
                >
                  <Avatar name={r.name} size={28} />
                  <b>{r.name}</b>
                </span>
              ),
            },
            {
              key: "role",
              label: "Role",
              sortable: true,
            },
            {
              key: "team",
              label: "Team",
              sortable: true,
            },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (r) => <Badge tone={TONE[r.status]}>{r.status}</Badge>,
            },
            {
              key: "seats",
              label: "Seats",
              align: "right",
              sortable: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
export default App;
