import * as React from "react";
import { Button, Drawer, SelectMenu } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        position: "relative",
        height: 420,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--canvas)",
      }}
    >
      <Drawer
        inline
        side="bottom"
        title="Filters"
        subtitle="12 of 48 listings match"
        onClose={() => {}}
      >
        <div className="tf-grid" style={{ "--cols": "1fr 1fr", gap: 16 } as React.CSSProperties}>
          <SelectMenu label="Rooms" defaultValue="3" options={["1", "2", "3", "4+"]} />
          <SelectMenu label="Sort by" defaultValue="Newest" options={["Newest", "Price", "Size"]} />
        </div>
        <div className="tf-row" style={{ justifyContent: "flex-end" }}>
          <Button variant="ghost">Reset</Button>
          <Button>Show 12 listings</Button>
        </div>
      </Drawer>
    </div>
  );
}
