import { Alert, Button } from "@twentyfirstmedia/ui-core";

function App() {
  return (
    <div
      className="tf-panel"
      style={{
        gap: 12,
      }}
    >
      <Alert tone="info" title="Bank feed syncs every 4 hours" onDismiss={() => {}}>
        New transactions show up here and get matched automatically.
      </Alert>
      <Alert tone="success" title="Domain verified">
        halo.app is ready to send mail.
      </Alert>
      <Alert
        tone="warning"
        title="halo.dev expires on May 4, 2026"
        action={
          <Button size="sm" variant="secondary">
            Turn on auto-renew
          </Button>
        }
      >
        Auto-renew is off. If it lapses, mail on this domain stops.
      </Alert>
      <Alert
        tone="danger"
        title="Payment failed"
        action={
          <Button size="sm" variant="secondary">
            Update card
          </Button>
        }
      >
        We couldn’t charge the card ending 4242. We retry in 3 days.
      </Alert>
      <Alert tone="highlight" title="3 agent drafts need your review" />
    </div>
  );
}
export default App;
