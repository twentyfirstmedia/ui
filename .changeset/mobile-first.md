---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
---

Mobile first: every component works from 320px up in both kits (desktop from 1181px unchanged). The shell, rail and page nav reflow on phones, tables scroll in their own box, dialogs open as bottom sheets, popovers and tooltips stay on screen, text fields use 16px on touch screens and Pro switches to comfortable hit targets on touch unless `data-density` is set. New: `tf-grid` columns via `--cols` / `--cols-md` / `--cols-sm`, `tf-sheet-nav` / `tf-sheet-aside`, `tf-table-scroll`, `useKeepInView`, `useScrollFocus`, `Tooltip` `defaultOpen`.
