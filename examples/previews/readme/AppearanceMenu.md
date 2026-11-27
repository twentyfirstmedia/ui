# AppearanceMenu

The look menu at the end of the top bar: theme (auto, light, dark), brand colour, density (auto,
roomy, compact), motion (normal, lively, off), glass surfaces and, with both kits, the kit. Behind
a sun or a moon, as in the standard app frame. On phones it opens as a bottom sheet.

- Put `AppearanceProvider` around the app instead of `UIProvider`: it applies the choice and keeps
  it in this browser (`storageKey`, default `"tf-appearance"`). It takes every `UIProvider` prop
  (`locale`, `messages`, `floating` …) and `kits={["halo", "pro"]}` when both kits are loaded
  (`themes.css`); then the menu shows the style row.
- `appearanceScript(storageKey)` in `<head>` puts the stored look on `<html>` before the first
  paint, so a reload does not flash.
- Per account instead of per browser: `initial` (the stored value), `onChange(next, patch)` (save
  it), `storageKey={false}`, and `hint="Saved for your account"` on the menu.
- Brand colour: the kit's own primary ("Default"), the six `THEME_PRESETS` (blue, violet, emerald,
  orange, rose, teal) or a custom colour from the colour picker, which goes through `brandTheme`.
  The value (`brand`: a preset key or a hex colour) is part of the stored look and of
  `appearanceScript`, so the colour is there before the first paint too.
- Hovering a choice previews it before it is picked (`onPreview(patch)`, `null` when the pointer
  leaves); inside an `AppearanceProvider` the app shows the preview without storing it.
- With glass on, `AppearanceProvider` paints an `Ambient` behind the app so the glass has something
  to show; `ambient={{ colors: [...] }}` or `ambient={{ src: "/backdrop.jpg" }}` sets your own,
  `ambient={false}` leaves the background to you.
- `rows` picks the rows (`"kit"`, `"theme"`, `"brand"`, `"density"`, `"motion"`, `"surface"`);
  leave out `"brand"` for an app with a fixed brand colour. `value` and `onChange` work without a
  provider (controlled: store the choice per user on your server). `useAppearance()` gives the
  state for your own menu.
- `sheet={false}` keeps the popover on phones. In `AppShell`, `appearance` (or
  `appearance={{ hint: "Saved for your account" }}`) puts the menu at the end of the top bar.
- Kit and theme changes cross-fade where the browser supports view transitions and motion is on.

```tsx
// app/layout.tsx
<head>
  <script dangerouslySetInnerHTML={{ __html: appearanceScript() }} />
</head>
<body>
  <AppearanceProvider kits={["halo", "pro"]} floating="solid">{children}</AppearanceProvider>
</body>

// in the AppShell
<AppShell navigation="sidebar" topbar appearance … />
```
