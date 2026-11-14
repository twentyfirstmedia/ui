import { ConnectionList, Panel } from "@twentyfirstmedia/ui-core";
import "./_connectors";

const now = new Date(2026, 10, 14, 9, 30);
const ago = (m: number) => new Date(now.getTime() - m * 60000);

export default function Preview() {
  return (
    <Panel title="Connected" subtitle="5 services" style={{ maxWidth: 720 }}>
      <ConnectionList
        now={now}
        onManage={() => {}}
        onReconnect={() => {}}
        items={[
          {
            id: "gmail",
            name: "Gmail",
            icon: "brandGmail",
            account: "mara@gmail.com",
            state: "connected",
            sync: { state: "synced", last: ago(6) },
          },
          {
            id: "spotify",
            name: "Spotify",
            icon: "brandSpotify",
            account: "Mara Ellis",
            state: "syncing",
            sync: { state: "syncing", last: ago(30) },
          },
          {
            id: "health",
            name: "Apple Health",
            tint: "blush",
            account: "Mara's iPhone",
            state: "connected",
            sync: { state: "synced", last: ago(18) },
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
            id: "pccaddie",
            name: "PCCADDIE",
            monogram: "PC",
            tint: "mint",
            account: "GC Hamburg-Walddörfer",
            state: "paused",
            sync: { state: "paused", last: ago(9 * 24 * 60) },
          },
        ]}
      />
    </Panel>
  );
}
