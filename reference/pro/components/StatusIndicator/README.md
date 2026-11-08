# StatusIndicator
Encodes state in color AND shape, so state reads at a glance and without color vision.

| State | Shape | Token | German label |
| --- | --- | --- | --- |
| Done / healthy | dot | `ok` | Erledigt, Online |
| Running | pulsing dot | `info` | Arbeitet |
| Needs a human | diamond | `signal` | Wartet auf Freigabe |
| Warning | triangle | `warn` | Warnung, Läuft ab |
| Error / failed | square | `danger` | Fehler |
| Idle / paused | ring | `fg-300` | Bereit, Pausiert |

Markup: `i.hq-shape.hq-shape--{dot|pulse|diamond|tri|square|ring}.is-{ok|info|signal|warn|danger|idle}`. Always pair the shape with a word unless the row already names the state. The pulse stops under `prefers-reduced-motion`.
