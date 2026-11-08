import { BalanceCard, ServiceMonitor } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <BalanceCard
          name="Provider A"
          sub="Followers, likes"
          balance={1840.5}
          perDay={212}
          low={500}
          spark={[2400, 2300, 2150, 2020, 1990, 1910, 1840]}
          onTopUp={() => {}}
        />
        <BalanceCard
          name="Provider B"
          sub="Views"
          balance={310.2}
          perDay={96}
          low={400}
          spark={[900, 780, 640, 520, 470, 380, 310]}
          onTopUp={() => {}}
        />
        <BalanceCard
          name="SMS gateway"
          sub="Verification codes"
          balance={0}
          perDay={4.1}
          low={20}
          icon="phone"
          tint="sky"
          onTopUp={() => {}}
        />
      </div>
      <div className="tf-panel tf-panel-flush tf-panel-list">
        <ServiceMonitor
          items={[
            {
              name: "Checkout",
              status: "ok",
              statusLabel: "Operational",
              latency: 182,
              errorRate: 0.2,
              checked: "30 s ago",
              history: ["ok", "ok", "ok", "ok", "ok", "ok", "ok", "ok", "ok", "ok", "ok", "ok"],
            },
            {
              name: "Provider A API",
              status: "warn",
              statusLabel: "Slow",
              latency: 2310,
              errorRate: 3.4,
              checked: "30 s ago",
              history: [
                "ok",
                "ok",
                "ok",
                "warn",
                "ok",
                "ok",
                "warn",
                "warn",
                "ok",
                "warn",
                "warn",
                "warn",
              ],
            },
            {
              name: "Mail delivery",
              status: "danger",
              statusLabel: "Down",
              latency: null,
              errorRate: 100,
              checked: "1 min ago",
              history: [
                "ok",
                "ok",
                "ok",
                "ok",
                "ok",
                "ok",
                "ok",
                "ok",
                "ok",
                "danger",
                "danger",
                "danger",
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
