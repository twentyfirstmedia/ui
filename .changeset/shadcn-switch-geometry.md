---
"@twentyfirstmedia/ui-core": patch
"@twentyfirstmedia/halo": patch
"@twentyfirstmedia/pro": patch
"@twentyfirstmedia/elements": patch
"@twentyfirstmedia/ui": patch
---

shadcn bridge: switches take the kit's geometry, not only its colours. The bridged `[data-slot="switch"]` is the kit's own switch in both kits (Halo: 40×24 track, 3px inset, an 18px round knob that moves 16px; Pro: the 28×16 hairline switch with a 10px knob that moves 12px), for shadcn's v3 and v4 sizes. The knob is placed with `translate`, which wins over Tailwind's translate utilities, has no shadow, takes the primary foreground when on and stays solid on glass. The "Moving from shadcn/ui" guide shows a shadcn Switch next to the kit Switch.
