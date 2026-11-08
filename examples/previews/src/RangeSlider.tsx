import * as React from "react";
import { ColorField, RangeSlider, StatusSelect, TilePicker } from "@twentyfirstmedia/ui-core";

function App() {
  const r = React.useState<[number, number]>([300000, 650000]),
    t = React.useState<string | string[]>("scandi"),
    s = React.useState("read");
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      <div
        className="tf-panel"
        style={{
          gap: 20,
        }}
      >
        <RangeSlider
          label="Price"
          min={0}
          max={1500000}
          step={10000}
          value={r[0]}
          onChange={r[1]}
          unit="€"
        />
        <RangeSlider
          label="Living area"
          min={20}
          max={300}
          defaultValue={[60, 140]}
          inputs={false}
          openEnd
          format={(v) => v + " m²"}
        />
        <div className="tf-row">
          <StatusSelect
            value={s[0]}
            onChange={s[1]}
            label="Status"
            options={[
              {
                value: "unread",
                label: "Unread",
                status: "running",
              },
              {
                value: "read",
                label: "Read",
                status: "idle",
              },
              {
                value: "contacted",
                label: "Contacted",
                status: "ok",
              },
              {
                value: "rejected",
                label: "Not a fit",
                status: "danger",
              },
            ]}
          />
          <ColorField value="#2f6fe0" against="#ffffff" />
        </div>
      </div>
      <div
        className="tf-panel"
        style={{
          gap: 12,
        }}
      >
        <b>Room style</b>
        <TilePicker
          value={t[0]}
          onChange={(v) => t[1](v ?? "")}
          label="Room style"
          min={120}
          options={[
            {
              value: "scandi",
              label: "Scandinavian",
              tint: "sky",
              icon: "home",
            },
            {
              value: "modern",
              label: "Modern",
              tint: "mint",
              icon: "grid",
            },
            {
              value: "industrial",
              label: "Industrial",
              tint: "butter",
              icon: "layers",
            },
            {
              value: "classic",
              label: "Classic",
              tint: "blush",
              icon: "star",
              meta: "Pro",
            },
            {
              value: "japandi",
              label: "Japandi",
              tint: "lilac",
              icon: "sun",
            },
            {
              value: "boho",
              label: "Boho",
              disabled: true,
              icon: "sparkle",
              meta: "Soon",
            },
          ]}
        />
      </div>
    </div>
  );
}
export default App;
