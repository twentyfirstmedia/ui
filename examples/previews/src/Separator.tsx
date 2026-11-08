import * as React from "react";
import { AspectRatio, Button, Input, Label, Separator } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={{ "--cols": "1fr 1fr", gap: 24, alignItems: "start" } as React.CSSProperties}
    >
      <div className="tf-panel" style={{ gap: 16 }}>
        <div className="tf-col" style={{ gap: 8 }}>
          <Label htmlFor="sep-mail" required>
            Work email
          </Label>
          <Input id="sep-mail" placeholder="you@company.com" />
        </div>
        <div className="tf-col" style={{ gap: 8 }}>
          <Label htmlFor="sep-team" hint="optional">
            Team name
          </Label>
          <Input id="sep-team" placeholder="Design" />
        </div>
        <Separator label="or" />
        <Button variant="secondary" icon="globe">
          Continue with Google
        </Button>
        <div className="tf-row" style={{ gap: 12, alignItems: "center", flexWrap: "nowrap" }}>
          <span className="tf-card-desc">Docs</span>
          <Separator orientation="vertical" />
          <span className="tf-card-desc">Status</span>
          <Separator orientation="vertical" />
          <span className="tf-card-desc">Changelog</span>
        </div>
      </div>
      <div className="tf-panel" style={{ gap: 12 }}>
        <AspectRatio ratio={16 / 9}>
          <div
            className="tf-gallery-ph tf-t-sky"
            style={{ height: "100%", display: "grid", placeItems: "center" }}
          >
            16 : 9
          </div>
        </AspectRatio>
        <div
          className="tf-grid"
          style={{ "--cols": "1fr 1fr", "--cols-sm": "1fr 1fr", gap: 12 } as React.CSSProperties}
        >
          <AspectRatio ratio={1}>
            <div
              className="tf-gallery-ph tf-t-mint"
              style={{ height: "100%", display: "grid", placeItems: "center" }}
            >
              1 : 1
            </div>
          </AspectRatio>
          <AspectRatio ratio={4 / 5}>
            <div
              className="tf-gallery-ph tf-t-butter"
              style={{ height: "100%", display: "grid", placeItems: "center" }}
            >
              4 : 5
            </div>
          </AspectRatio>
        </div>
      </div>
    </div>
  );
}
