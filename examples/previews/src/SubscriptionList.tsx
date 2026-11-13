import { Panel, SubscriptionList } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Panel title="Subscriptions" subtitle="6 active" style={{ maxWidth: 560 }}>
      <SubscriptionList
        onManage={() => {}}
        items={[
          {
            id: "stream",
            name: "Streaming",
            icon: "play",
            amount: 13.99,
            period: "month",
            next: new Date(2026, 10, 18),
            category: "Entertainment",
          },
          {
            id: "music",
            name: "Music",
            icon: "monitor",
            amount: 10.99,
            period: "month",
            next: new Date(2026, 10, 21),
            category: "Entertainment",
          },
          {
            id: "cloud",
            name: "Cloud storage",
            icon: "folder",
            amount: 99,
            period: "year",
            next: new Date(2027, 2, 4),
            category: "Work",
          },
          {
            id: "gym",
            name: "Gym",
            icon: "zap",
            amount: 34.9,
            period: "month",
            next: new Date(2026, 11, 1),
            category: "Health",
          },
          {
            id: "news",
            name: "News",
            icon: "book",
            amount: 2.5,
            period: "week",
            status: "trial",
            next: new Date(2026, 10, 20),
          },
          {
            id: "maps",
            name: "Maps pro",
            icon: "map",
            amount: 4.99,
            period: "month",
            status: "cancelled",
          },
        ]}
      />
    </Panel>
  );
}
