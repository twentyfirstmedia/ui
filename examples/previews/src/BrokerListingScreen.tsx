import * as React from "react";
import {
  AppShell,
  EnergyClass,
  MatchList,
  Panel,
  PropertyList,
  RecordHeader,
  RecordTimeline,
  Stagger,
  ViewingList,
} from "@twentyfirstmedia/ui-core";
import type { RecordEntry } from "@twentyfirstmedia/ui-core";
import { NOW } from "./_crm";
import { BROKER_NAV, BUYERS, VIEWINGS } from "./_industry";

const ENTRIES: RecordEntry[] = [
  {
    id: "1",
    type: "email",
    title: "Exposé sent to Familie Kaya",
    at: new Date(2026, 10, 16, 8, 50),
    actor: "Mara Ellis",
  },
  {
    id: "2",
    type: "call",
    title: "Owner: lowest price €610,000",
    at: new Date(2026, 10, 15, 16, 20),
    actor: "Mara Ellis",
    meta: "6 min",
  },
  {
    id: "3",
    type: "stage",
    title: "Price reduced from €649,000 to €629,000",
    at: new Date(2026, 10, 10, 9, 0),
    actor: "Mara Ellis",
  },
  {
    id: "4",
    type: "document",
    title: "Energy certificate uploaded",
    at: new Date(2026, 10, 3, 14, 0),
    actor: "Lea Brandt",
  },
];

/** A listing for a broker: the property, matching buyers, viewings with feedback and the history. */
export default function Preview() {
  return (
    <AppShell
      navigation="sidebar"
      brand="Hafen Immobilien"
      sidebarGroups={BROKER_NAV}
      active="listings"
      user={{ name: "Mara Ellis", email: "mara@hafen-immobilien.de" }}
      dock={false}
    >
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <RecordHeader
          kind="deal"
          icon="home"
          title="3-room flat with balcony"
          subtitle="Isestraße 61, 2nd floor · 20149 Hamburg-Eppendorf"
          status={{ label: "Active", tone: "success" }}
          tags={["Sale", "Exclusive"]}
          owner="Mara Ellis"
          actions={[
            { label: "Send exposé", icon: "send", primary: true },
            { label: "Plan viewing", icon: "calendar" },
          ]}
          facts={[
            { label: "Price", value: "€629,000" },
            { label: "Living space", value: "84 m²" },
            { label: "Rooms", value: "3" },
            { label: "Online for", value: "23 days" },
          ]}
        />
        <Panel title="Matching buyers" subtitle="3 of 41 in your buyer list">
          <MatchList matches={BUYERS} contactLabel="Send exposé" onContact={() => {}} />
        </Panel>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "minmax(0, 1fr) minmax(0, 1fr)",
              "--cols-sm": "1fr",
              gap: 16,
              alignItems: "start",
            } as React.CSSProperties
          }
        >
          <Panel title="Viewings">
            <ViewingList viewings={VIEWINGS} onConfirm={() => {}} onFeedback={() => {}} />
          </Panel>
          <Panel title="Property">
            <PropertyList
              fields={[
                { id: "built", label: "Built", value: "1908, renovated 2019" },
                { id: "floor", label: "Floor", value: "2 of 4, no lift" },
                { id: "fee", label: "Service charge", type: "money", value: 412 },
                { id: "comm", label: "Buyer commission", type: "percent", value: 3.57 },
                { id: "free", label: "Available", type: "date", value: new Date(2027, 1, 1) },
              ]}
            />
            <EnergyClass value="C" kwh={96} />
          </Panel>
        </div>
        <Panel title="History">
          <RecordTimeline entries={ENTRIES} now={NOW} filters={false} />
        </Panel>
      </Stagger>
    </AppShell>
  );
}
