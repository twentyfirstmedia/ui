import { NetWorthCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <NetWorthCard
      style={{ maxWidth: 620 }}
      change={1240}
      changeLabel="since October"
      history={[38200, 38900, 39400, 39100, 40300, 41000, 41800, 42900]}
      assets={[
        { label: "Current account", value: 4820, icon: "card" },
        { label: "Savings", value: 12600, icon: "wallet" },
        { label: "ETF portfolio", value: 31450, icon: "chart" },
        { label: "Pension fund", value: 9800, icon: "shield" },
      ]}
      liabilities={[
        { label: "Car loan", value: 11200, icon: "key" },
        { label: "Credit card", value: 670, icon: "card" },
      ]}
    />
  );
}
