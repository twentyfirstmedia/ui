Smooth stacked areas for volume over time, with a crosshair tooltip.

Props: `labels`, `series` ({name, tint, values}), `stacked` (default true), `height`, `width`, `format(v)`, `legend`, `label`.

- Areas are the light tints, edges the `-ink` lines, so the stack reads in both themes.
- Use stacked areas when the total matters; switch to LineChart when you compare series against each other.
- Labels thin out automatically past 12 points.
