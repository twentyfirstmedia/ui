import { LogView, RunHistory, WebhookEndpoint } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <div className="tf-panel tf-panel-flush tf-panel-list">
        <RunHistory
          items={[
            {
              id: 1,
              name: "ImmoScout · Hamburg",
              status: "ok",
              started: "Today 06:00",
              duration: "4 m 12 s",
              counts: [
                {
                  value: 1284,
                  label: "checked",
                },
                {
                  value: 37,
                  label: "new",
                  tone: "success",
                },
              ],
            },
            {
              id: 2,
              name: "Kleinanzeigen · Hamburg",
              status: "warn",
              started: "Today 06:00",
              duration: "7 m 40 s",
              counts: [
                {
                  value: 922,
                  label: "checked",
                },
                {
                  value: 12,
                  label: "new",
                  tone: "success",
                },
                {
                  value: 18,
                  label: "failed",
                  tone: "danger",
                },
              ],
              detail: (
                <LogView
                  title="errors"
                  lines={[
                    {
                      time: "06:03:11",
                      text: "HTTP 429 on page 14, waited 30 s",
                      level: "warn",
                    },
                    {
                      time: "06:05:40",
                      text: "18 detail pages without price, skipped",
                      level: "warn",
                    },
                  ]}
                />
              ),
            },
            {
              id: 3,
              name: "Daily cleanup",
              status: "danger",
              started: "Yesterday 03:00",
              duration: "12 s",
              by: "cron",
              counts: [
                {
                  value: 1,
                  label: "error",
                  tone: "danger",
                },
              ],
              detail: "Database connection refused.",
            },
          ]}
        />
      </div>
      <WebhookEndpoint
        url="https://api.homefield.com/hooks/stripe"
        events={["checkout.session.completed", "invoice.paid", "customer.subscription.deleted"]}
        status="ok"
        statusLabel="Active"
        successRate={98.7}
        onToggle={() => {}}
        onRetry={() => {}}
        defaultOpen
        menu={[
          {
            label: "Send test event",
            icon: "send",
          },
          {
            label: "Rotate secret",
            icon: "key",
          },
          "-",
          {
            label: "Delete",
            icon: "trash",
            danger: true,
          },
        ]}
        deliveries={[
          {
            id: 1,
            code: 200,
            event: "invoice.paid",
            time: "09:41",
            ms: 182,
          },
          {
            id: 2,
            code: 500,
            event: "checkout.session.completed",
            time: "09:12",
            ms: 3012,
          },
          {
            id: 3,
            code: 200,
            event: "customer.subscription.deleted",
            time: "Yesterday",
            ms: 240,
          },
        ]}
      />
    </div>
  );
}
