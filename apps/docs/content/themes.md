---
title: Theme builder
description: "Build a shadcn-style theme for {{Kit}} live on real components: presets, brand colours, radius and imported shadcn themes, with the CSS to copy."
---

Pick a preset, change any colour or paste a theme from ui.shadcn.com/themes or tweakcn; the preview uses the real components of the kit. Light and dark are edited separately: switch the theme in the header. "Apply to the whole site" lets you browse every component page in your theme (in this tab only).

## Use the result

Save the CSS as `theme.css` and import it once, after the kit's styles, or let the CLI write and import it:

```sh
npx @twentyfirstmedia/ui theme ./theme.css
npx @twentyfirstmedia/ui theme violet
```

In React you can also pass a theme at runtime: `<UIProvider tokens={theme}>`. See [Theming and tokens](/{{kit}}/theming/) for every variable.
