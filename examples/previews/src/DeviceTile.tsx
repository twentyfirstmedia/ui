import * as React from "react";
import { DeviceTile } from "@twentyfirstmedia/ui-core";
import "./_connectors";

export default function Preview() {
  const [target, setTarget] = React.useState(21.5);
  const [light, setLight] = React.useState(true);
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "repeat(3, minmax(0, 1fr))",
          "--cols-sm": "1fr",
          gap: 16,
        } as React.CSSProperties
      }
    >
      <DeviceTile
        kind="thermostat"
        name="Living room"
        room="Heating"
        on
        value="20.8 °C"
        status={`Heating · humidity 46 %`}
        target={target}
        onTarget={setTarget}
        service={{ name: "tado°", icon: "brandTado" }}
      />
      <DeviceTile
        kind="light"
        name="Ceiling light"
        room="Kitchen"
        on={light}
        onToggle={setLight}
        value={light ? "80 %" : undefined}
        status={light ? "Warm white" : undefined}
        service={{ name: "Google Home", icon: "brandGooglehome" }}
      />
      <DeviceTile
        kind="vacuum"
        name="Robot vacuum"
        room="Ground floor"
        on
        value="Cleaning"
        status="Hallway · 18 m² to go"
        battery={64}
        actions={[
          { label: "Pause", icon: "pause" },
          { label: "Dock", icon: "home" },
        ]}
      />
      <DeviceTile
        kind="purifier"
        name="Air purifier"
        room="Bedroom"
        on
        value="AQI 12"
        status="Good · night mode"
        onToggle={() => {}}
      />
      <DeviceTile kind="camera" name="Front door" room="Outside" offline />
      <DeviceTile
        kind="sensor"
        name="Window sensor"
        room="Office"
        on={false}
        value="Closed"
        battery={12}
      />
    </div>
  );
}
