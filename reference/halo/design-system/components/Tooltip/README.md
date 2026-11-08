`Tooltip` names an icon-only control on hover or focus; `Popover` holds a small interactive panel anchored to a trigger.

Tooltip props: `label`, `shortcut`, `side` ("top" | "bottom" | "left" | "right"), one child element.
Popover props: `trigger` (element, or `({open, toggle}) => element`), `open`/`onOpenChange` (optional control), `align` ("start" | "end"), `side` ("top"), `width`, `flush` (no padding, for Menus), `block`, children or `({close}) => children`.

- Tooltips only add a name or a shortcut. Anything you must read or click goes in a Popover.
- Tooltips appear after 350 ms on hover, immediately on keyboard focus, and close on Esc.
- Popovers close on outside click and Esc. Use a Modal when the task needs more than a few fields.
