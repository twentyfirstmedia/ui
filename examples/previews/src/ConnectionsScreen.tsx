import type * as React from "react";
import {
  AppShell,
  Button,
  ConnectionList,
  ConnectorGallery,
  PageHeader,
  Panel,
  Stagger,
  StatTile,
} from "@twentyfirstmedia/ui-core";
import type { ConnectionItem, SidebarGroup } from "@twentyfirstmedia/ui-core";
import { CATEGORIES, CONNECTORS } from "./_connectors";

const NAV: SidebarGroup[] = [
  {
    items: [
      { id: "today", label: "Today", icon: "sun" },
      { id: "assistant", label: "Assistant", icon: "sparkle" },
    ],
  },
  {
    label: "Agents",
    items: [
      { id: "connections", label: "Connections", icon: "link" },
      { id: "activity", label: "Activity", icon: "list", badge: "1" },
      { id: "access", label: "Data access", icon: "shield" },
    ],
  },
];

const now = new Date(2026, 10, 14, 9, 30);
const ago = (m: number) => new Date(now.getTime() - m * 60000);

const CONNECTED: ConnectionItem[] = [
  {
    id: "gmail",
    name: "Gmail",
    icon: "brandGmail",
    account: "mara@gmail.com",
    state: "connected",
    sync: { state: "synced", last: ago(6) },
  },
  {
    id: "gcal",
    name: "Google Calendar",
    icon: "brandGooglecalendar",
    account: "3 calendars",
    state: "syncing",
    sync: { state: "syncing", last: ago(40) },
  },
  {
    id: "health",
    name: "Apple Health",
    icon: "brandApplehealth",
    account: "Mara's iPhone",
    state: "connected",
    sync: { state: "synced", last: ago(18) },
  },
  {
    id: "commerzbank",
    name: "Commerzbank",
    icon: "brandCommerzbank",
    account: "Giro ••• 4410",
    state: "connected",
    sync: { state: "synced", last: ago(95) },
  },
  {
    id: "n26",
    name: "N26",
    icon: "brandN26",
    account: "Main ••• 7781",
    state: "error",
    sync: { state: "error", last: ago(26 * 60) },
  },
  {
    id: "tado",
    name: "tado°",
    icon: "brandTado",
    account: "Home · 6 rooms",
    state: "connected",
    sync: { state: "synced", last: ago(2) },
  },
  {
    id: "tesla",
    name: "Tesla",
    icon: "brandTesla",
    account: "Model Y",
    state: "connected",
    sync: { state: "synced", last: ago(12) },
  },
];

/** Every service the assistant is connected to, how fresh its data is, and what else it can connect. */
export default function Preview() {
  return (
    <AppShell
      navigation="sidebar"
      brand="Life"
      sidebarGroups={NAV}
      active="connections"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          title="Connections"
          subtitle="What your agents can read and act in"
          actions={[
            <Button key="add" icon="plus">
              Connect a service
            </Button>,
          ]}
        />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
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
          <StatTile label="Connected services" value="7" tint="mint" />
          <StatTile label="Need attention" value="1" tint="butter" />
          <StatTile label="Items read by agents today" value="214" tint="sky" />
        </div>
        <Panel title="Connected" subtitle="Freshest data first">
          <ConnectionList items={CONNECTED} now={now} onManage={() => {}} onReconnect={() => {}} />
        </Panel>
        <Panel title="Add more" subtitle="49 services in 10 categories">
          <ConnectorGallery
            connectors={CONNECTORS.filter((c) => c.state !== "connected")}
            categories={CATEGORIES}
            onConnect={() => {}}
            onOpen={() => {}}
          />
        </Panel>
      </Stagger>
    </AppShell>
  );
}
