import * as React from "react";
import {
  AppShell,
  Avatar,
  Button,
  Input,
  ListRow,
  PageHeader,
  Panel,
  Select,
  Stagger,
  Switch,
} from "@twentyfirstmedia/ui-core";
import type { IconName, Tint } from "@twentyfirstmedia/ui-core";

function App() {
  const sec = React.useState(0);
  const nav: [string, IconName, Tint | "plain"][] = [
    ["Profile", "user", "sky"],
    ["Workspace", "grid", "mint"],
    ["Notifications", "bell", "butter"],
    ["Security", "lock", "lilac"],
    ["Integrations", "link", "plain"],
    ["Billing", "card", "blush"],
  ];
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="Settings"
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          title="Settings"
          subtitle="Manage your profile and how Halo works for your team"
          actions={[
            <Button key="c" variant="ghost">
              Discard
            </Button>,
            <Button key="s" icon="check">
              Save changes
            </Button>,
          ]}
        />
      </div>
      <div
        className="tf-grid"
        style={
          {
            "--cols": "240px 1fr",
            gap: 24,
            alignItems: "start",
          } as React.CSSProperties
        }
      >
        <div className="tf-panel tf-panel-flush tf-panel-list">
          <Stagger className="tf-list" delay={100}>
            {nav.map((n, i) => (
              <ListRow
                key={n[0]}
                icon={n[1]}
                tint={n[2]}
                title={n[0]}
                active={sec[0] === i}
                onClick={() => {
                  sec[1](i);
                }}
              />
            ))}
          </Stagger>
        </div>
        <Stagger
          className="tf-col"
          style={{
            gap: 16,
          }}
          delay={160}
        >
          <Panel title="Profile" subtitle="Shown to everyone in the workspace">
            <div
              className="tf-row"
              style={{
                gap: 16,
              }}
            >
              <Avatar name="Mara Ellis" size={64} />
              <Button variant="secondary" size="sm">
                Upload photo
              </Button>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </div>
            <div
              className="tf-grid"
              style={
                {
                  "--cols": "1fr 1fr",
                  gap: 16,
                } as React.CSSProperties
              }
            >
              <Input label="Full name" defaultValue="Mara Ellis" />
              <Input
                label="Email"
                defaultValue="mara@halo.app"
                hint="Used for sign-in and receipts."
              />
              <Select label="Role" options={["Owner", "Admin", "Editor", "Viewer"]} />
              <Select
                label="Time zone"
                options={[
                  "Europe/Berlin (UTC+2)",
                  "Asia/Dubai (UTC+4)",
                  "America/New_York (UTC−4)",
                ]}
              />
            </div>
          </Panel>
          <Panel title="Notifications" subtitle="Choose what reaches your inbox">
            <div
              className="tf-col"
              style={{
                gap: 16,
              }}
            >
              <Switch spread defaultChecked>
                Approvals waiting on me
              </Switch>
              <Switch spread defaultChecked>
                Invoices paid or overdue
              </Switch>
              <Switch spread>Weekly analytics digest</Switch>
              <Switch spread>Product updates from Halo</Switch>
            </div>
          </Panel>
          <div
            className="tf-card tf-bg-blush"
            style={{
              minHeight: 0,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                className="tf-card-title"
                style={{
                  padding: 0,
                }}
              >
                Delete workspace
              </div>
              <div className="tf-card-desc">
                Removes every project, file and invoice. This cannot be undone.
              </div>
            </div>
            <Button variant="secondary" icon="trash">
              Delete…
            </Button>
          </div>
        </Stagger>
      </div>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
