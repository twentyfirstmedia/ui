---
"@twentyfirstmedia/ui-core": patch
"@twentyfirstmedia/halo": patch
"@twentyfirstmedia/pro": patch
"@twentyfirstmedia/elements": patch
"@twentyfirstmedia/ui": patch
---

- shadcn bridge: the switch knob's resting place is set in a rule of its own. Lightning CSS (Next.js) folded `transform: none` and `translate` of one rule into `transform: translate(3px)`, which then added to the checked `translate`, so the knob ended flush right (and 3px too far in on Pro). The bridge is now tested as Lightning CSS minifies it.
- Glass AppShell on phones: the shell's sidebar drawer blurs the page under it (`--glass-filter`), in both kits, so content no longer shows sharply through the menu.
