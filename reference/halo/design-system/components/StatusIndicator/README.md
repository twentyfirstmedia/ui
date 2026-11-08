State as shape and colour together, so it reads at a glance and without colour vision.

Props: `status` ("ok" | "running" | "signal" | "warn" | "danger" | "idle"), `label`, `size` ("sm"). `StatusShape` is the bare shape.

| status | shape | token | typical words |
| --- | --- | --- | --- |
| ok | dot | `ok` | Done, Online, Valid, Booked |
| running | pulsing dot | `info` | Working, Syncing |
| signal | diamond | `signal` | Waiting for approval, Needs a human |
| warn | triangle | `warn` | Paused · budget, Expiring |
| danger | square | `danger` | Failed, Offline |
| idle | ring | `idle` | Ready, Inactive |

- Always shape plus a word; drop the word only in dense columns whose header already names the state.
- Only `signal` may draw attention unasked. Warnings and errors stay in their own area and never animate.
- Badges use the same shapes: success dot, info dot, highlight diamond, warning triangle, danger square, neutral ring. Badge tones also accept the status names (ok, running, signal, warn, idle).
