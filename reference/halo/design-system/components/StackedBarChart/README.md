Bars split into parts of a whole per period, with a hover tooltip and legend.

Props: `labels`, `series` ({name, tint, values}), `height`, `width`, `barWidth`, `format(v)`, `legend` (false hides), `label`.

- Three series at most, ordered bottom-up from the steadiest to the most volatile.
- Segments use the tints' `-ink` colors with a 2px gap, so neighbours differ in lightness, not hue alone.
- Hovering a period dims the others and shows totals per series, top series first.
