import * as React from "react";
import { Avatar, ScrollArea, Separator } from "@twentyfirstmedia/ui-core";

const PEOPLE = [
  "Mara Ellis",
  "Jonah Petit",
  "Sun Lee",
  "Rui Costa",
  "Ava Brandt",
  "Ida Nolan",
  "Theo Marsh",
  "Clara Haddad",
  "Ben Okafor",
  "Lena Vogt",
  "Omar Said",
  "Pia Lund",
];

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={{ "--cols": "320px 1fr", gap: 24, alignItems: "start" } as React.CSSProperties}
    >
      <div className="tf-panel" style={{ gap: 12, padding: 16 }}>
        <b>Team · {PEOPLE.length}</b>
        <ScrollArea label="Team members" height={240}>
          <div className="tf-col" style={{ gap: 4 }}>
            {PEOPLE.map((n) => (
              <div
                key={n}
                className="tf-row"
                style={{ gap: 12, padding: "6px 4px", flexWrap: "nowrap" }}
              >
                <Avatar name={n} size={28} />
                <span>{n}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="tf-panel" style={{ gap: 12, padding: 16 }}>
        <b>Releases</b>
        <ScrollArea label="Releases" orientation="horizontal">
          <div className="tf-row" style={{ gap: 12, flexWrap: "nowrap", paddingBottom: 8 }}>
            {["v2.4", "v2.3", "v2.2", "v2.1", "v2.0", "v1.9", "v1.8"].map((v, i) => (
              <div key={v} className="tf-card" style={{ minWidth: 160, minHeight: 0, gap: 4 }}>
                <b>{v}</b>
                <span className="tf-card-desc">
                  {["Apr", "Mar", "Feb", "Jan", "Dec", "Nov", "Oct"][i]} release
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator />
        <span className="tf-card-desc">
          Scroll sideways, or focus the area and use the arrow keys.
        </span>
      </div>
    </div>
  );
}
