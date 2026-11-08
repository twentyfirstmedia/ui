import * as React from "react";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Chip,
  Donut,
  IconButton,
  PageHeader,
  Pagination,
  Panel,
  SearchField,
  Stagger,
  StatTile,
  Table,
  Timeline,
} from "@twentyfirstmedia/ui-core";

const MEMBERS = [
  {
    n: "Mara Ellis",
    e: "mara@halo.app",
    r: "Owner",
    t: "Leadership",
    s: "Active",
    tone: "success",
    a: "Now",
  },
  {
    n: "Jonah Petit",
    e: "jonah@halo.app",
    r: "Admin",
    t: "Design",
    s: "Active",
    tone: "success",
    a: "5 min ago",
  },
  {
    n: "Sun Lee",
    e: "sun@halo.app",
    r: "Editor",
    t: "Growth",
    s: "Active",
    tone: "success",
    a: "1 h ago",
  },
  {
    n: "Rui Costa",
    e: "rui@halo.app",
    r: "Editor",
    t: "Finance",
    s: "Away",
    tone: "warning",
    a: "Yesterday",
  },
  {
    n: "Ava Brandt",
    e: "ava@halo.app",
    r: "Viewer",
    t: "Support",
    s: "Invited",
    tone: "info",
    a: "—",
  },
  {
    n: "Ida Nolan",
    e: "ida@halo.app",
    r: "Editor",
    t: "Sales",
    s: "Active",
    tone: "success",
    a: "3 h ago",
  },
  {
    n: "Theo Marsh",
    e: "theo@halo.app",
    r: "Viewer",
    t: "Design",
    s: "Suspended",
    tone: "danger",
    a: "12 days ago",
  },
];
function App() {
  const f = React.useState("Everyone");
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="People"
      side={
        <Panel side title="Team" subtitle="42 seats · 38 used">
          <Donut
            size={120}
            stroke={16}
            legend={false}
            center="38"
            caption="of 42"
            data={[
              {
                label: "Design",
                value: 9,
                tint: "lilac",
              },
              {
                label: "Growth",
                value: 11,
                tint: "mint",
              },
              {
                label: "Support",
                value: 8,
                tint: "sky",
              },
              {
                label: "Finance",
                value: 4,
                tint: "butter",
              },
              {
                label: "Sales",
                value: 6,
                tint: "blush",
              },
            ]}
          />
          <div className="tf-legend">
            {[
              ["Design", "lilac"],
              ["Growth", "mint"],
              ["Support", "sky"],
              ["Finance", "butter"],
              ["Sales", "blush"],
            ].map((x) => (
              <span key={x[0]}>
                <i
                  style={{
                    background: "var(--" + x[1] + "-ink)",
                  }}
                />
                {x[0]}
              </span>
            ))}
          </div>
          <h3
            className="tf-card-title"
            style={{
              fontSize: 16,
              marginTop: 8,
            }}
          >
            Recent activity
          </h3>
          <Timeline
            delay={400}
            items={[
              {
                avatar: "Jonah Petit",
                text: (
                  <span>
                    <b>Jonah</b>
                    {" changed Ava to Viewer"}
                  </span>
                ),
                time: "10 min ago",
              },
              {
                icon: "send",
                tint: "sky",
                text: "3 invites sent to support@",
                time: "1 h ago",
              },
              {
                avatar: "Mara Ellis",
                text: (
                  <span>
                    <b>Mara</b>
                    {" suspended Theo Marsh"}
                  </span>
                ),
                time: "Mon",
              },
            ]}
          />
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="People"
          subtitle="Everyone with access to this workspace"
          actions={[
            <SearchField key="s" placeholder="Search by name or email" />,
            <Button key="b" icon="users">
              Invite
            </Button>,
          ]}
        />
      </div>
      <Stagger
        className="tf-grid"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
        delay={80}
      >
        <StatTile tint="sky" value="38" label="Members" />
        <StatTile tint="mint" value="31" label="Active today" />
        <StatTile tint="placeholder" value="3" label="Pending invites" />
        <StatTile tint="lilac" value="6" label="Admins" />
      </Stagger>
      <div
        className="tf-in tf-row"
        style={
          {
            "--d": "240ms",
          } as React.CSSProperties
        }
      >
        {["Everyone", "Admins", "Editors", "Viewers", "Invited"].map((t) => (
          <Chip
            key={t}
            selected={f[0] === t}
            onClick={() => {
              f[1](t);
            }}
          >
            {t}
          </Chip>
        ))}
      </div>
      <div
        className="tf-panel tf-panel-flush tf-in"
        style={
          {
            "--d": "300ms",
          } as React.CSSProperties
        }
      >
        <Table
          columns={[
            {
              key: "n",
              label: "Name",
              render: (r) => (
                <span
                  className="tf-row"
                  style={{
                    flexWrap: "nowrap",
                  }}
                >
                  <Avatar name={r.n} size={32} />
                  <span>
                    <div
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      {r.n}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--ink-muted)",
                      }}
                    >
                      {r.e}
                    </div>
                  </span>
                </span>
              ),
            },
            {
              key: "r",
              label: "Role",
            },
            {
              key: "t",
              label: "Team",
            },
            {
              key: "s",
              label: "Status",
              render: (r) => <Badge tone={r.tone}>{r.s}</Badge>,
            },
            {
              key: "a",
              label: "Last active",
            },
            {
              key: "x",
              label: "",
              align: "right",
              render: () => <IconButton icon="more" label="Member options" size="sm" />,
            },
          ]}
          rows={MEMBERS}
        />
        <div
          className="tf-row"
          style={{
            justifyContent: "space-between",
            padding: "8px 16px",
          }}
        >
          <span className="tf-card-desc">Showing 7 of 38</span>
          <Pagination total={6} page={1} />
        </div>
      </div>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
