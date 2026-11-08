import { IconButton, MapView } from "@twentyfirstmedia/ui-core";
import type { MapPoint } from "@twentyfirstmedia/ui-core";

const world: MapPoint[] = [
  {
    id: "de",
    label: "Germany",
    lat: 51,
    lng: 10,
    value: 820,
    sub: "820 orders today",
  },
  {
    id: "at",
    label: "Austria",
    lat: 47.5,
    lng: 14.5,
    value: 260,
    tint: "mint",
  },
  {
    id: "ch",
    label: "Switzerland",
    lat: 46.8,
    lng: 8.2,
    value: 210,
    tint: "mint",
  },
  {
    id: "us",
    label: "United States",
    lat: 39,
    lng: -98,
    value: 140,
    tint: "butter",
  },
  {
    id: "ae",
    label: "UAE",
    lat: 24,
    lng: 54,
    value: 90,
    tint: "lilac",
    pulse: true,
  },
  {
    id: "br",
    label: "Brazil",
    lat: -12,
    lng: -52,
    value: 60,
    tint: "blush",
  },
];
const city: MapPoint[] = [
  {
    id: 1,
    label: "3-room flat, Eppendorf",
    sub: "€649,000 · 84 m²",
    lat: 53.59,
    lng: 9.98,
    text: "€649k",
  },
  {
    id: 2,
    label: "Loft, HafenCity",
    sub: "€1,190,000 · 112 m²",
    lat: 53.541,
    lng: 10.0,
    text: "€1.19m",
    tint: "lilac",
  },
  {
    id: 3,
    label: "2-room flat, Altona",
    sub: "€1,480 / month",
    lat: 53.55,
    lng: 9.935,
    text: "€1,480",
    tint: "mint",
  },
  {
    id: 4,
    label: "House, Blankenese",
    lat: 53.565,
    lng: 9.81,
    text: "€2.4m",
    tint: "butter",
  },
];
export default function Preview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}
    >
      <div
        className="tf-panel"
        style={{
          gap: 12,
        }}
      >
        <b>Orders by country</b>
        <MapView bubbles points={world} height={360} legend="Bubble size = orders today" />
      </div>
      <div
        className="tf-panel"
        style={{
          gap: 12,
        }}
      >
        <b>Listings</b>
        <MapView
          points={city}
          bounds={{
            n: 53.62,
            s: 53.52,
            w: 9.78,
            e: 10.06,
          }}
          height={360}
          selected={2}
          controls={[
            <IconButton key={1} icon="plus" label="Zoom in" size="sm" />,
            <IconButton key={2} icon="minus" label="Zoom out" size="sm" />,
          ]}
        />
      </div>
    </div>
  );
}
