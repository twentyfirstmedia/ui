---
title: Icons
description: "93 icons built into every component, plus a library of more than 550 in the same style: passkeys and security, social and brand logos, files, media, commerce, places and more. Search them below and click one to copy its name."
---

Every icon is a line drawing on a 24px grid with 2px round-capped strokes in `currentColor`, so it takes the colour and size of the text around it, in both kits. Brand logos (`brand…`) are filled.

```tsx
import { Button, Icon, IconButton } from "@twentyfirstmedia/{{kit}}";

<Icon name="truck" size={16} />
<Button icon="plus">Add</Button>
<IconButton icon="trash" label="Delete" />
```

## Built in and library

- **Built in** (93): the icons the components use themselves. They work by name everywhere, with nothing to set up.
- **Library** (more than 550): everything else, from `@twentyfirstmedia/{{kit}}/icons`. Register what you use once, before rendering, and the names work like the built-in ones in `Icon` and every `icon` prop. Only the icons you register end up in your bundle.

```tsx
// app/icons.ts: import it from your root layout and from your client provider
import { registerIcons } from "@twentyfirstmedia/{{kit}}";
import { fingerprint, scanFace, brandGithub } from "@twentyfirstmedia/{{kit}}/icons";

registerIcons({ fingerprint, scanFace, brandGithub });
```

`registerIcons(ICON_LIBRARY)` registers all of them (about 43 KB gzip), handy for prototypes and admin tools. The custom elements of `@twentyfirstmedia/elements` have the whole library registered, so `<tf-button icon="fingerprint">` works in plain HTML.

A name nobody registered draws a placeholder and logs a warning once, naming the import to add.

## Passkeys and sign-in

`fingerprint` and `scanFace` for passkeys and biometrics, `keyRound` and `lock` for passwords and keys, `shieldCheck` for verified states, `smartphoneNfc` for security keys and phones, `qrCode` for sign-in on another device.

```tsx
<Button icon="fingerprint" variant="primary">Sign in with a passkey</Button>
```

## Social and brand logos

Brand logos are filled and sized to sit next to the line icons: `brandX`, `brandInstagram`, `brandFacebook`, `brandThreads`, `brandYoutube`, `brandTiktok`, `brandWhatsapp`, `brandTelegram`, `brandDiscord`, `brandBluesky`, `brandMastodon`, `brandGithub` and more (see Brands below). Give logo-only links a label, e.g. `<IconButton icon="brandGithub" label="GitHub" asChild><a href="…" /></IconButton>`.

Logos are trademarks of their owners; use them to link to the brand's own page and follow its guidelines. Some brands (LinkedIn, Microsoft, Slack) do not allow their logos in icon libraries; register the official file yourself (below) if you need one.

## Your own icons

Register any drawing on the 24px grid: a path string is stroked like the kit's icons, `{ d, filled: true }` is filled. To type the names, extend `CustomIcons`:

```tsx
import { registerIcons } from "@twentyfirstmedia/{{kit}}";

registerIcons({ acme: "M4 18l8-12 8 12z", acmeLogo: { d: "M…", filled: true } });

declare module "@twentyfirstmedia/ui-core" {
  interface CustomIcons {
    acme: true;
    acmeLogo: true;
  }
}
```

The built-in names cannot be replaced, so components always look as designed.

## Licences

Line icons in the library come from [Lucide](https://lucide.dev) (ISC licence) and brand logos from [Simple Icons](https://simpleicons.org) (CC0), redrawn to the kit's grid; the notices ship in `ICONS-LICENSE` of `@twentyfirstmedia/ui-core`.
