Hierarchies, in-place editing and object menus: `TreeView`, `InlineEdit`, `ContextMenu`.

TreeView: `items` ({id, label, icon, meta, children}), `defaultOpen` (ids), `selected` + `onSelect`, `label`. Arrow keys open, close and move; meta sits right in mono.
InlineEdit: `value`, `onSave(v)`, `options` (select instead of text), `mono`, `type`, `display(v)`, `align`. Double-click or Enter edits, Enter saves, Esc cancels.
ContextMenu: `items` (Menu items), children (the target). Right-click or a long press opens it at the pointer; destructive actions last.
