import * as React from "react";
import { Menu } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [grid, setGrid] = React.useState(true);
  const [density, setDensity] = React.useState("comfortable");
  return (
    <div className="tf-row" style={{ gap: 24, alignItems: "flex-start", paddingBottom: 120 }}>
      <Menu
        items={[
          {
            label: "Open",
            icon: "eye",
            shortcut: "↵",
          },
          {
            label: "Rename",
            icon: "edit",
            shortcut: "R",
          },
          {
            label: "Duplicate",
            icon: "file",
          },
          {
            label: "Share link",
            icon: "link",
          },
          "-",
          {
            label: "Delete",
            icon: "trash",
            danger: true,
          },
        ]}
      />
      <Menu
        label="View"
        items={[
          { label: "Show grid", type: "checkbox", checked: grid, onClick: () => setGrid(!grid) },
          { label: "Show minimap", type: "checkbox", checked: false },
          "-",
          {
            label: "Comfortable",
            type: "radio",
            group: "density",
            checked: density === "comfortable",
            onClick: () => setDensity("comfortable"),
          },
          {
            label: "Compact",
            type: "radio",
            group: "density",
            checked: density === "compact",
            onClick: () => setDensity("compact"),
          },
          "-",
          {
            label: "Sort by",
            icon: "list",
            items: [
              { label: "Name", type: "radio", checked: true },
              { label: "Last change", type: "radio" },
              { label: "Size", type: "radio" },
            ],
          },
          { label: "Export as PDF", icon: "download", disabled: true },
        ]}
      />
    </div>
  );
}
