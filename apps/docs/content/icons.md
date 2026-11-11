---
title: Icons
description: "93 icons built into every component, plus a library of about 700 in the same style: passkeys and security, AI, social and brand logos, files, media, commerce, maps and 3D, games and more. Search them below and click one to copy its name."
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
- **Library** (about 700): everything else, from `@twentyfirstmedia/{{kit}}/icons`. Register what you use once, before rendering, and the names work like the built-in ones in `Icon` and every `icon` prop. Only the icons you register end up in your bundle.

```tsx
// app/icons.ts: import it from your root layout and from your client provider
import { registerIcons } from "@twentyfirstmedia/{{kit}}";
import { fingerprint, scanFace, brandGithub } from "@twentyfirstmedia/{{kit}}/icons";

registerIcons({ fingerprint, scanFace, brandGithub });
```

`registerIcons(ICON_LIBRARY)` registers all of them (about 60 KB gzip), handy for prototypes and admin tools. The custom elements of `@twentyfirstmedia/elements` have the whole library registered, so `<tf-button icon="fingerprint">` works in plain HTML.

A name nobody registered draws a placeholder and logs a warning once, naming the import to add.

## Passkeys and sign-in

`fingerprint` and `scanFace` for passkeys and biometrics, `keyRound` and `lock` for passwords and keys, `shieldCheck` for verified states, `smartphoneNfc` for security keys and phones, `qrCode` for sign-in on another device.

```tsx
<Button icon="fingerprint" variant="primary">Sign in with a passkey</Button>
```

## Social and brand logos

Brand logos are filled and sized to sit next to the line icons: `brandX`, `brandInstagram`, `brandFacebook`, `brandThreads`, `brandYoutube`, `brandTiktok`, `brandWhatsapp`, `brandTelegram`, `brandDiscord`, `brandBluesky`, `brandMastodon`, `brandGithub` and more (see Brands below). Give logo-only links a label, e.g. `<IconButton icon="brandGithub" label="GitHub" asChild><a href="…" /></IconButton>`.

For AI products there are `brandOpenai`, `brandAnthropic`, `brandClaude`, `brandGooglegemini`, `brandMistralai`, `brandPerplexity`, `brandDeepseek`, `brandOllama`, `brandHuggingface`, `brandModelcontextprotocol` and more; for business `brandLinkedin`, `brandXing`, `brandMicrosoft`, `brandSlack`, `brandMeta`, `brandGoogleads` and `brandGoogleanalytics`.

Logos are trademarks of their owners; use them to link to the brand's own page and follow its guidelines. A logo that is missing (Microsoft Teams, for one) or your own product's logo: register the official file yourself (below).

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

Line icons in the library come from [Lucide](https://lucide.dev) (ISC licence), brand logos from [Simple Icons](https://simpleicons.org) (CC0) and, for LinkedIn, Microsoft, Windows, Slack, Skype, Amazon and OpenAI, from [Font Awesome Free](https://fontawesome.com) (CC BY 4.0, attribution: Font Awesome Free by Fonticons, Inc.). All are fitted to the kit's grid; the notices ship in `ICONS-LICENSE` of `@twentyfirstmedia/ui-core`.
