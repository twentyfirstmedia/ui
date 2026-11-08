import { Button, Input, Modal } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        height: 340,
        position: "relative",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--canvas)",
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
            Send invites
          </Button>,
        ]}
      >
        <Input label="Email addresses" placeholder="name@company.com, …" />
      </Modal>
    </div>
  );
}
