import { ConfirmDialog } from "@twentyfirstmedia/ui-core";

function App() {
  return (
    <div
      style={{
        position: "relative",
        height: 360,
        borderRadius: 24,
        overflow: "hidden",
        background: "var(--canvas)",
        transform: "translateZ(0)",
      }}
    >
      <ConfirmDialog
        open
        danger
        title="Delete halo.dev?"
        text="DNS records, mailboxes and certificates for this domain are removed. This can’t be undone."
        confirmText="halo.dev"
        confirmLabel="Delete domain"
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    </div>
  );
}
export default App;
