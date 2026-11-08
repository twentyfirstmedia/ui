import * as React from "react";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  StatTile,
  Toast,
} from "@twentyfirstmedia/ui-core";

function App() {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <AppShell
        brand="Halo"
        tag="Admin"
        user={{ name: "Mara Ellis", email: "mara@halo.app" }}
        active="People"
        dock={false}
      >
        <PageHeader
          title="People"
          subtitle="Everyone with access to this workspace"
          actions={[
            <Button key="b" icon="users">
              Invite
            </Button>,
          ]}
        />
        <div
          className="tf-grid"
          style={
            {
              "--cols": "repeat(4, 1fr)",
              "--cols-sm": "repeat(2, minmax(0, 1fr))",
              "--cols-md": "repeat(2, minmax(0, 1fr))",
            } as React.CSSProperties
          }
        >
          <StatTile tint="sky" value="38" label="Members" />
          <StatTile tint="mint" value="31" label="Active today" />
          <StatTile tint="placeholder" value="3" label="Pending invites" />
          <StatTile tint="lilac" value="6" label="Admins" />
        </div>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "repeat(3, 1fr)",
            } as React.CSSProperties
          }
        >
          {["Mara Ellis", "Jonah Petit", "Sun Lee", "Rui Costa", "Ida Nolan", "Ava Brandt"].map(
            (n) => (
              <Card
                key={n}
                title={n}
                description="Member"
                corner={<Avatar name={n} size={32} />}
                status={<Badge tone="success">Active</Badge>}
              />
            ),
          )}
        </div>
      </AppShell>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 30,
          overflow: "hidden",
        }}
      >
        <Modal
          style={{
            position: "absolute",
            inset: 0,
          }}
          icon="users"
          tint="sky"
          title="Invite teammates"
          text="They get access to every project in this workspace."
          actions={[
            <Button key={1} variant="ghost">
              Cancel
            </Button>,
            <Button key={2} icon="send">
              Send 3 invites
            </Button>,
          ]}
        >
          <Input
            label="Email addresses"
            defaultValue="leo@bluefern.io, nina@bluefern.io, ops@bluefern.io"
          />
          <Select label="Role" options={["Editor", "Viewer", "Admin"]} />
          <div className="tf-row">
            <Badge tone="info">3 seats left after this</Badge>
            <Badge>Expires in 7 days</Badge>
          </div>
        </Modal>
      </div>
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 40,
        }}
      >
        <Toast action="Undo">Ava Brandt was removed</Toast>
      </div>
    </div>
  );
}
export default function Preview() {
  return <App />;
}
