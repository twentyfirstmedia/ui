import { IconButton } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-col" style={{ gap: 20 }}>
      <div className="tf-row" style={{ gap: 8, flexWrap: "wrap" }}>
        <IconButton icon="edit" label="Edit" />
        <IconButton icon="trash" label="Delete" variant="outline" />
        <IconButton icon="more" label="More actions" variant="ghost" />
        <IconButton icon="plus" label="Add" variant="solid" />
        <IconButton icon="x" label="Close" size="sm" />
        <IconButton icon="settings" label="Settings" size="lg" />
      </div>
      <div className="tf-row" style={{ gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <IconButton icon="chevronLeft" label="Back to orders" href="#orders" variant="ghost" />
        <span style={{ color: "var(--ink-muted)" }}>Order #4417</span>
        <IconButton asChild icon="download" label="Download invoice" variant="outline">
          <a href="#invoice-4417.pdf" download />
        </IconButton>
      </div>
    </div>
  );
}
