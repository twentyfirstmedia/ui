import * as React from "react";
import {
  AppShell,
  Panel,
  PropertyList,
  QuoteBuilder,
  RecordHeader,
  SignatureStatus,
  Stagger,
} from "@twentyfirstmedia/ui-core";
import { CRM_NAV } from "./_crm";
import { LINES } from "./_sales";

/** A quote for a deal: line items with optional extras and VAT, terms, and where the signatures stand. */
export default function Preview() {
  const [lines, setLines] = React.useState(LINES);
  return (
    <AppShell
      navigation="sidebar"
      brand="Pilot CRM"
      sidebarGroups={CRM_NAV}
      active="quotes"
      user={{ name: "Mara Ellis", email: "mara@pilot.app" }}
      dock={false}
    >
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <RecordHeader
          kind="deal"
          icon="file"
          title="Website relaunch"
          subtitle="Quote Q-2026-118 · Nordhafen Outdoor"
          status={{ label: "Sent", tone: "info" }}
          owner="Mara Ellis"
          actions={[
            { label: "Send again", icon: "send", primary: true },
            { label: "PDF", icon: "download" },
            { label: "Duplicate", icon: "copy" },
          ]}
          facts={[
            { label: "Valid until", value: "Dec 1, 2026" },
            { label: "Opened", value: "3 times" },
            { label: "Version", value: "2 of 2" },
          ]}
        />
        <Panel title="Items">
          <QuoteBuilder
            lines={lines}
            taxRate={19}
            onChange={setLines}
            onAdd={() =>
              setLines((all) => [
                ...all,
                { id: String(all.length + 1), name: "New item", quantity: 1, unitPrice: 0 },
              ])
            }
          />
        </Panel>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "minmax(0, 1fr) minmax(0, 1fr)",
              "--cols-sm": "1fr",
              gap: 16,
              alignItems: "start",
            } as React.CSSProperties
          }
        >
          <Panel title="Signatures">
            <SignatureStatus
              document="Quote Q-2026-118.pdf"
              ordered
              expiresAt={new Date(2026, 11, 1)}
              onRemind={() => {}}
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
                  state: "viewed",
                  at: new Date(2026, 10, 16, 8, 40),
                },
              ]}
            />
          </Panel>
          <Panel title="Terms">
            <PropertyList
              fields={[
                { id: "pay", label: "Payment", value: "30% on order, 70% on launch" },
                { id: "due", label: "Due", value: "14 days net" },
                { id: "start", label: "Start", type: "date", value: new Date(2027, 0, 11) },
                { id: "contact", label: "Contact", type: "person", value: "Lena Hartmann" },
              ]}
            />
          </Panel>
        </div>
      </Stagger>
    </AppShell>
  );
}
