# Button
Triggers an action; one `primary` per view, everything else secondary or ghost.

**Variants**
- default (secondary): `bg-100` fill, `line-300` border. Most actions.
- `--primary`: `accent` fill, `on-accent` text. The one action the screen exists for ("Freigeben", "Senden", "Buchen").
- `--ghost`: no border; toolbars and table row actions.
- `--danger`: `danger` text, fills `danger-bg` on hover. Destructive actions; always paired with a confirmation step.
- `--sm` (24px) for dense toolbars, `--icon` square for icon-only (always with `aria-label` and a Tooltip).
- `.hq-btngroup` joins buttons edge to edge.

**Consumer provides:** label (verb first, German UI: "Entwurf senden", not "OK"), optional Lucide icon left, optional `hq-kbd` shortcut right.

Height follows density: `control-dense` (28px) or `control-comfy` (34px). Radius `radius-1`. Focus: 2px `focus` outline.
