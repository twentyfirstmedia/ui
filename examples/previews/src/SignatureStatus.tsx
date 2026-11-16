import { Panel, SignatureStatus } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={{ "--cols": "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 } as React.CSSProperties}
    >
      <Panel title="Signatures">
        <SignatureStatus
          document="Service agreement Nordhafen 2027.pdf"
          ordered
          expiresAt={new Date(2026, 11, 1)}
          onRemind={() => {}}
          onVoid={() => {}}
          signers={[
            {
              id: "1",
              name: "Mara Ellis",
              role: "Agency",
              state: "signed",
              at: new Date(2026, 10, 13, 16, 2),
            },
            {
              id: "2",
              name: "Lena Hartmann",
              role: "Client",
              email: "lena@nordhafen.de",
              state: "viewed",
              at: new Date(2026, 10, 16, 8, 40),
            },
            { id: "3", name: "Henrik Sørensen", role: "Client", state: "waiting" },
          ]}
        />
      </Panel>
      <Panel title="Completed">
        <SignatureStatus
          document="NDA Velo Werk.pdf"
          signers={[
            {
              id: "1",
              name: "Lea Brandt",
              role: "Agency",
              state: "signed",
              at: new Date(2026, 10, 9, 11, 5),
            },
            {
              id: "2",
              name: "Tobias Wendt",
              role: "Client",
              state: "declined",
              at: new Date(2026, 10, 10, 9, 30),
            },
          ]}
        />
      </Panel>
    </div>
  );
}
