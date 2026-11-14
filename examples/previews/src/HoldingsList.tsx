import { HoldingsList, Panel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Panel title="Holdings" subtitle="Scalable Capital · today" style={{ maxWidth: 720 }}>
      <HoldingsList
        period="today"
        onSelect={() => {}}
        holdings={[
          {
            id: "1",
            name: "MSCI World ETF",
            symbol: "IE00B4L5Y983",
            value: 18420,
            change: 0.6,
            weight: 48,
          },
          {
            id: "2",
            name: "Emerging Markets ETF",
            symbol: "IE00BKM4GZ66",
            value: 6240,
            change: -1.2,
            weight: 16,
          },
          { id: "3", name: "Apple", symbol: "AAPL", value: 4310, change: 1.8, weight: 11 },
          {
            id: "4",
            name: "Global Bonds ETF",
            symbol: "IE00B3F81409",
            value: 7150,
            change: 0,
            weight: 19,
          },
          { id: "5", name: "Bitcoin ETP", symbol: "BTCE", value: 2300, change: -3.4, weight: 6 },
        ]}
      />
    </Panel>
  );
}
