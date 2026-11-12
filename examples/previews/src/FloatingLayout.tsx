import * as React from "react";
import {
  Badge,
  FloatingLayout,
  IconButton,
  KeyValue,
  MapView,
  Panel,
  SearchField,
  Segmented,
} from "@twentyfirstmedia/ui-core";
import type { MapPoint } from "@twentyfirstmedia/ui-core";

const hubs: MapPoint[] = [
  { id: "ham", label: "Hamburg", lat: 53.5, lng: 10, value: 840, sub: "840 parcels today" },
  { id: "rot", label: "Rotterdam", lat: 51.9, lng: 4.5, value: 610, tint: "mint" },
  { id: "nyc", label: "New York", lat: 40.7, lng: -74, value: 380, tint: "butter" },
  { id: "dxb", label: "Dubai", lat: 25.2, lng: 55.3, value: 290, tint: "lilac", pulse: true },
  { id: "sgp", label: "Singapore", lat: 1.3, lng: 103.8, value: 450, tint: "blush" },
];

export default function Preview() {
  const [view, setView] = React.useState("Today");
  return (
    <FloatingLayout
      label="Shipments"
      height={520}
      background={<MapView label="Shipments by hub" bubbles points={hubs} height="100%" />}
      controls={
        <div className="tf-col" style={{ gap: 8 }}>
          <IconButton icon="plus" label="Zoom in" variant="outline" />
          <IconButton icon="minus" label="Zoom out" variant="outline" />
        </div>
      }
      attribution="© OpenStreetMap contributors"
      top={
        <>
          <SearchField placeholder="Search hubs" style={{ flex: "1 1 220px", maxWidth: 360 }} />
          <IconButton icon="filter" label="Filters" variant="outline" />
        </>
      }
      end={
        <Panel
          title="Hamburg"
          subtitle="Hub"
          action={
            <Badge tone="success" dot>
              On time
            </Badge>
          }
        >
          <KeyValue
            items={[
              ["Parcels", "840"],
              ["Delayed", "12"],
              ["Next truck", "14:20"],
            ]}
          />
        </Panel>
      }
      bottom={
        <Segmented
          label="Period"
          options={["Today", "Week", "Month"]}
          value={view}
          onChange={setView}
        />
      }
    />
  );
}
