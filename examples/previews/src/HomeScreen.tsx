import * as React from "react";
import {
  Ambient,
  AppShell,
  DeviceTile,
  NowPlaying,
  PageHeader,
  Segmented,
  Stagger,
  UIProvider,
  VehicleCard,
} from "@twentyfirstmedia/ui-core";
import "./_connectors";
import { LIFE_NAV } from "./_lifenav";

const grid = {
  "--cols": "repeat(3, minmax(0, 1fr))",
  "--cols-sm": "1fr",
  gap: 16,
} as React.CSSProperties;

/** The home: heating, lights, robot vacuum, air and cameras, the car charging and what plays, in glass. */
export default function Preview() {
  const [target, setTarget] = React.useState(21.5);
  const [lights, setLights] = React.useState(true);
  const [mode, setMode] = React.useState("home");
  return (
    <UIProvider scope="subtree" surface="glass">
      <Ambient />
      <AppShell
        navigation="sidebar"
        brand="Life"
        sidebarGroups={LIFE_NAV}
        active="home"
        user={{ name: "Mara Ellis", email: "mara@halo.app" }}
        dock={false}
      >
        <div className="tf-in">
          <PageHeader
            title="Home"
            subtitle="6 rooms · 2 people home"
            actions={[
              <Segmented
                key="mode"
                label="Mode"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "home", label: "Home" },
                  { value: "away", label: "Away" },
                  { value: "night", label: "Night" },
                ]}
              />,
            ]}
          />
        </div>
        <Stagger className="tf-col" style={{ gap: 16 }}>
          <div className="tf-grid" style={grid}>
            <DeviceTile
              kind="thermostat"
              name="Living room"
              room="Heating"
              on
              value="20.8 °C"
              status="Heating · humidity 46 %"
              target={target}
              onTarget={setTarget}
              service={{ name: "tado°", icon: "brandTado" }}
            />
            <DeviceTile
              kind="light"
              name="All lights"
              room="5 on"
              on={lights}
              onToggle={setLights}
              value={lights ? "Evening" : undefined}
              status={lights ? "Scene from Philips Hue" : undefined}
              service={{ name: "Philips Hue", icon: "brandHue" }}
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
              status="Good · night mode at 22:00"
              onToggle={() => {}}
            />
            <DeviceTile
              kind="camera"
              name="Front door"
              room="Doorbell"
              on
              value="Live"
              status="Last ring 14:02"
            />
            <DeviceTile
              kind="sensor"
              name="Office window"
              room="Contact sensor"
              on={false}
              value="Closed"
              battery={12}
            />
          </div>
          <div
            className="tf-grid"
            style={
              {
                "--cols": "minmax(0, 1fr) minmax(0, 1fr)",
                "--cols-sm": "1fr",
                gap: 16,
              } as React.CSSProperties
            }
          >
            <VehicleCard
              name="Model Y"
              model="In the garage"
              battery={58}
              range={287}
              limit={80}
              charging="charging"
              power={11}
              until={new Date(2026, 10, 15, 6, 30)}
              locked
              climateOn={false}
              inside={9}
              onLock={() => {}}
              onClimate={() => {}}
              service={{ name: "Tesla", icon: "brandTesla" }}
            />
            <NowPlaying
              title="Weightless"
              artist="Marconi Union"
              position={203}
              duration={488}
              playing
              device="Living room speaker"
              onPlayPause={() => {}}
              onNext={() => {}}
              onPrevious={() => {}}
              service={{ name: "Spotify", icon: "brandSpotify" }}
            />
          </div>
        </Stagger>
      </AppShell>
    </UIProvider>
  );
}
