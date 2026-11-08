# HairlineGrid
Flush cells divided by 1px `line-200` hairlines: the structural layout primitive for every HQ screen.

Use it for overview pages, stat rows, split views and anything that would otherwise be a row of floating cards. Cells touch; the hairline is the only separation. No shadows, no radius, no gaps wider than 1px.

**Consumer provides:** the grid template (`grid-template-columns`), the cells (any element; each gets `bg-100` automatically).

**Anatomy**
- `.hq-grid` sets `gap: 1px` over a `line-200` background, so gaps read as hairlines.
- `.hq-cell` pads `space-4` (`.hq-cell--lg`: `space-6`).
- `.hq-marks` + four `.hq-mark` (`tl tr bl br`) add crosshair marks in `line-300` at a section's corners. Use them on at most one region per screen, the one that frames the screen's main content.
- `.hq-gridbg` paints a faint `line-100` background grid at the `space-6` pitch; only for empty canvases and empty states.

**Do**
- Span cells (`grid-column: span 2`) instead of nesting grids.
- Label each cell with an `eyebrow`.

**Don't**
- Don't put a bordered card inside a cell.
- Don't use `space-*` gaps between cells; cells always touch.
