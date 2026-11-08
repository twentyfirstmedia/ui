import { Avatar, Badge, HoverCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel" style={{ gap: 16, paddingBottom: 180 }}>
      <p style={{ margin: 0 }}>
        Assigned to{" "}
        <HoverCard trigger={<a href="#">@mara</a>} side="bottom" align="start">
          <div className="tf-row" style={{ gap: 12, flexWrap: "nowrap", alignItems: "flex-start" }}>
            <Avatar name="Mara Ellis" size={40} />
            <div className="tf-col" style={{ gap: 4 }}>
              <b>Mara Ellis</b>
              <span className="tf-card-desc">Owner · Leadership · joined Mar 2024</span>
              <div className="tf-row" style={{ gap: 6 }}>
                <Badge tone="success">Online</Badge>
                <Badge>Berlin</Badge>
              </div>
            </div>
          </div>
        </HoverCard>{" "}
        by the pricing workflow. Hover or focus the name to see the card.
      </p>
    </div>
  );
}
