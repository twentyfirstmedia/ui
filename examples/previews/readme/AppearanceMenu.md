# AppearanceMenu

The look menu at the end of the top bar: theme (auto, light, dark), density (auto, roomy,
compact), motion (normal, lively, off), glass surfaces and, with both kits, the kit. Behind a sun
or a moon, as in the standard app frame.

- Put `AppearanceProvider` around the app instead of `UIProvider`: it applies the choice and keeps
  it in this browser (`storageKey`, default `"tf-appearance"`). It takes every `UIProvider` prop
  (`locale`, `messages`, `floating` …) and `kits={["halo", "pro"]}` when both kits are loaded
  (`themes.css`); then the menu shows the style row.
- `appearanceScript(storageKey)` in `<head>` puts the stored look on `<html>` before the first
  paint, so a reload does not flash.
- Per account instead of per browser: `initial` (the stored value), `onChange(next, patch)` (save
  it), `storageKey={false}`, and `hint="Saved for your account"` on the menu.
- `rows` picks the rows (`"kit"`, `"theme"`, `"density"`, `"motion"`, `"surface"`); `value` and
  `onChange` work without a provider. `useAppearance()` gives the state for your own menu.
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
topEnd={<AppearanceMenu />}
```
