# PaletteSwatches

A colour palette as swatches: each colour with its name and role, the HEX and OKLCH values (click to
copy) and its WCAG contrast as text on a light and on a dark background, rated AAA, AA, AA large or fails.

- `colors` are data (`#rrggbb`), shown as they are: a brand's palette, not the kit's theme.
- `light` and `dark` set the backgrounds the contrast is measured against (default white and near black).
- `compact` shows small chips with name and values only; `contrast={false}` hides the contrast rows.
- The maths is exported: `contrastRatio(a, b)`, `wcagLevel(ratio)`, `hexToOklch(hex)` and `formatOklch(hex)`.
