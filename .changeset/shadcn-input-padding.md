---
"@twentyfirstmedia/ui-core": patch
"@twentyfirstmedia/halo": patch
"@twentyfirstmedia/pro": patch
"@twentyfirstmedia/elements": patch
"@twentyfirstmedia/ui": patch
---

shadcn bridge: fields keep their own horizontal padding. A search field with `pl-9` (or `ps-*`, `p-*`, `pr-*`, `pe-*`, also with variants) keeps it, so a leading icon no longer sits on the placeholder; the other side still gets the kit's padding. Fields without Tailwind classes can ask for icon room with `data-icon="leading"` or `"trailing"`.
