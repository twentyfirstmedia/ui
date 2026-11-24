import * as React from "react";
import { CommandPalette, SearchTrigger } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [open, setOpen] = React.useState(false);
  const [picked, setPicked] = React.useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <SearchTrigger
        placeholder="Search orders, customers, pages…"
        shortcut="⌘K"
        bindShortcut
        onClick={() => setOpen(true)}
      />
      <p style={{ margin: 0, color: "var(--ink-muted)" }}>
        {picked ? `Opened ${picked}` : "Click it or press ⌘K."}
      </p>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Search orders, customers, pages…"
        items={["Orders", "Customers", "Invoices", "Settings"].map((label) => ({
          group: "Pages",
          label,
          run: () => setPicked(label),
        }))}
      />
    </div>
  );
}
