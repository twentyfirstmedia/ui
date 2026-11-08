import * as React from "react";
import { BarList, LiveFeed, formatMoney } from "@twentyfirstmedia/ui-core";
import type { LiveFeedItem, LiveFeedProps } from "@twentyfirstmedia/ui-core";

const types: LiveFeedProps["types"] = [
  {
    value: "order",
    label: "Orders",
  },
  {
    value: "payment",
    label: "Payments",
  },
  {
    value: "error",
    label: "Errors",
  },
];
const seed: LiveFeedItem[] = [
  {
    id: 1,
    type: "order",
    icon: "cart",
    tint: "mint",
    title: "1,000 Instagram followers",
    text: "Order #48213 · Germany · PayPal",
    amount: 12.9,
    time: "2s",
  },
  {
    id: 2,
    type: "payment",
    icon: "card",
    tint: "sky",
    title: "Payment received",
    text: "Stripe · card ending 4242",
    amount: 39,
    time: "14s",
  },
  {
    id: 3,
    type: "error",
    icon: "zap",
    tint: "blush",
    title: "Provider timeout",
    text: "SMM provider B · retried",
    time: "41s",
  },
  {
    id: 4,
    type: "order",
    icon: "cart",
    tint: "mint",
    title: "5,000 TikTok views",
    text: "Order #48212 · Austria",
    amount: 4.9,
    time: "1m",
  },
];
function App() {
  const it = React.useState<LiveFeedItem[]>(seed);
  React.useEffect(() => {
    let n = 100;
    const t = setInterval(() => {
      n++;
      it[1]((l): LiveFeedItem[] => [
        {
          id: n,
          type: "order",
          icon: "cart",
          tint: "mint",
          title: ((n % 3) + 1) * 500 + " starter kits",
          text: "Order #" + (48213 + n - 100) + " · Switzerland",
          amount: 2.9 + (n % 5),
          time: "now",
          fresh: true,
        },
        ...l.slice(0, 7),
      ]);
    }, 2600);
    return () => {
      clearInterval(t);
    };
  }, []);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      <div className="tf-panel">
        <LiveFeed items={it[0]} types={types} maxHeight={420} />
      </div>
      <div
        className="tf-panel"
        style={{
          gap: 12,
        }}
      >
        <b>Revenue by country</b>
        <BarList
          format={(v) => formatMoney(v)}
          items={[
            {
              label: "Germany",
              mark: "🇩🇪",
              value: 18240,
              share: 0.52,
            },
            {
              label: "Austria",
              mark: "🇦🇹",
              value: 6120,
              share: 0.17,
            },
            {
              label: "Switzerland",
              mark: "🇨🇭",
              value: 5480,
              share: 0.16,
              tint: "mint",
            },
            {
              label: "Netherlands",
              mark: "🇳🇱",
              value: 2210,
              share: 0.06,
              tint: "butter",
            },
            {
              label: "Other",
              value: 3100,
              share: 0.09,
              tint: "lilac",
            },
          ]}
        />
      </div>
    </div>
  );
}
export default App;
