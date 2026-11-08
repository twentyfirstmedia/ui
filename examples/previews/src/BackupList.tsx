import * as React from "react";
import { BackupList, BlockList } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
          alignItems: "start",
        } as React.CSSProperties
      }
    >
      <div className="tf-panel tf-panel-flush tf-panel-list">
        <BackupList
          onDownload={() => {}}
          onRestore={() => {}}
          footer="Kept for 30 days · restore test passed Nov 2"
          items={[
            {
              id: 1,
              name: "Today 03:00",
              kind: "Database",
              where: "R2 Frankfurt",
              size: "1.84 GB",
              status: "ok",
            },
            {
              id: 2,
              name: "Yesterday 03:00",
              kind: "Database",
              where: "R2 Frankfurt",
              size: "1.83 GB",
              status: "ok",
            },
            {
              id: 3,
              name: "Sun 03:00",
              kind: "Files",
              where: "R2 Frankfurt",
              size: "12.4 GB",
              status: "warn",
            },
          ]}
        />
      </div>
      <div className="tf-panel">
        <BlockList
          onAdd={() => {}}
          onRemove={() => {}}
          items={[
            {
              id: 1,
              value: "185.220.101.4",
              kind: "IP",
              reason: "Card testing",
              by: "Fraud rule",
              until: "Nov 15",
            },
            {
              id: 2,
              value: "spam@mailinator.com",
              kind: "Email",
              reason: "Chargeback",
              by: "Lukas",
            },
            {
              id: 3,
              value: "@growthhacker_xx",
              kind: "Account",
              reason: "Abuse",
              by: "Mara Ellis",
              until: "Dec 1",
            },
          ]}
        />
      </div>
    </div>
  );
}
