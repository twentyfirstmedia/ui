import * as React from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Chip,
  Dock,
  FloatingLayout,
  IconButton,
  KeyValue,
  MapView,
  Panel,
  SearchField,
  Segmented,
  Switch,
} from "@twentyfirstmedia/ui-core";
import type { MapPoint } from "@twentyfirstmedia/ui-core";

/** A city drawn from the kit's colours, so it follows the kit and the theme. */
function CityMap() {
  const streets = [80, 190, 300, 410, 520, 630, 740];
  const avenues = [90, 230, 370, 510, 650, 790, 930, 1070];
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1200" height="800" fill="var(--background)" />
      {avenues.flatMap((x, i) =>
        streets.map((y, j) => (
          <rect
            key={`${i}-${j}`}
            x={x + 12}
            y={y + 12}
            width={116}
            height={86}
            rx={6}
            fill="var(--muted)"
          />
        )),
      )}
      <rect x="652" y="82" width="256" height="196" rx="18" fill="var(--mint)" />
      <rect x="92" y="522" width="256" height="196" rx="18" fill="var(--mint)" />
      <circle cx="790" cy="180" r="34" fill="var(--sky)" />
      <path
        d="M-40 470 C 180 400, 320 560, 520 470 S 860 330, 1240 430 L 1240 560 C 900 470, 720 610, 520 600 S 160 540, -40 610 Z"
        fill="var(--sky)"
      />
      <g stroke="var(--card)" strokeWidth="10" strokeLinecap="round">
        {streets.map((y) => (
          <line key={y} x1="0" x2="1200" y1={y + 6} y2={y + 6} />
        ))}
        {avenues.map((x) => (
          <line key={x} x1={x + 6} x2={x + 6} y1="0" y2="800" />
        ))}
      </g>
      <g stroke="var(--butter)" strokeWidth="16" strokeLinecap="round" fill="none">
        <path d="M0 196 L 1200 196" />
        <path d="M516 0 L 516 800" />
        <path d="M150 800 L 660 330 L 1200 120" />
      </g>
    </svg>
  );
}

const places: MapPoint[] = [
  {
    id: "cafe",
    label: "Kaffeerösterei",
    sub: "Café · open until 18:00",
    lat: 72,
    lng: 44,
    text: "Café",
    tint: "butter",
  },
  {
    id: "museum",
    label: "Harbour Museum",
    sub: "Museum · €12",
    lat: 50,
    lng: 54,
    text: "Museum",
    tint: "lilac",
  },
  {
    id: "market",
    label: "Fish Market",
    sub: "Market · Sundays 5–9:30",
    lat: 24,
    lng: 40,
    text: "Market",
    tint: "blush",
  },
  {
    id: "park",
    label: "Planten un Blomen",
    sub: "Park",
    lat: 32,
    lng: 60,
    text: "Park",
    tint: "mint",
  },
];

export default function Preview() {
  const [selected, setSelected] = React.useState<MapPoint["id"] | null>("museum");
  const [mode, setMode] = React.useState("Explore");
  const place = places.find((p) => p.id === selected);
  return (
    <FloatingLayout
      label="City map"
      height={720}
      background={
        <MapView
          label="Map of the harbour district"
          background={<CityMap />}
          bounds={{ n: 100, s: 0, w: 0, e: 100 }}
          points={places}
          selected={selected}
          onSelect={setSelected}
          height="100%"
        />
      }
      top={
        <>
          <SearchField
            placeholder="Search places and addresses"
            style={{ flex: "1 1 260px", maxWidth: 420 }}
          />
          <Chip>Coffee</Chip>
          <Chip>Museums</Chip>
          <Chip selected>Open now</Chip>
        </>
      }
      start={
        <Panel title="Layers" subtitle="What the map shows">
          <Segmented
            label="Map style"
            options={["Explore", "Transit", "Satellite"]}
            value={mode}
            onChange={setMode}
            block
          />
          <Switch defaultChecked>Traffic</Switch>
          <Switch defaultChecked>Parks and water</Switch>
          <Switch>Bike lanes</Switch>
        </Panel>
      }
      end={
        <div style={{ display: "grid", gap: 12 }}>
          <ButtonGroup orientation="vertical" label="Zoom" style={{ justifySelf: "end" }}>
            <IconButton icon="plus" label="Zoom in" variant="outline" />
            <IconButton icon="minus" label="Zoom out" variant="outline" />
          </ButtonGroup>
          {place && (
            <Panel
              title={place.label}
              subtitle={typeof place.sub === "string" ? place.sub : undefined}
              action={
                <Badge tone="success" dot>
                  Open
                </Badge>
              }
            >
              <KeyValue
                items={[
                  ["Walk", "12 min"],
                  ["Distance", "850 m"],
                  ["Rating", "4.7 of 5"],
                ]}
              />
              <div className="tf-row" style={{ gap: 8 }}>
                <Button variant="primary" icon="send">
                  Directions
                </Button>
                <Button variant="secondary" icon="star">
                  Save
                </Button>
              </div>
            </Panel>
          )}
        </div>
      }
      bottom={
        <Dock
          label="Map tools"
          items={[
            { icon: "search", label: "Search", tint: "sky" },
            { icon: "star", label: "Saved", tint: "butter" },
            { icon: "clock", label: "Recent", tint: "mint" },
            { icon: "share", label: "Share", tint: "lilac" },
          ]}
        />
      }
    />
  );
}
