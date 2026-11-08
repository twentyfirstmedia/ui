# ButtonGroup

Attached buttons that act as one control: undo/redo, zoom, or a split button whose arrow opens a menu.

- Children are regular `Button`, `IconButton` or a `Popover` trigger; the group only joins their corners.
- `label` names the group for assistive tech; `orientation="vertical"` stacks them.
