---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

The standard app frame: sidebar and top bar with search and a look menu.

- `AppearanceMenu`: the sun/moon button for the top bar that opens a popover with style (Halo/Pro, when an app ships both kits), theme (Auto/Light/Dark), density (Auto/Roomy/Compact), motion (Normal/Lively/Off) and "Glass surfaces". `rows` picks the rows, `hint` replaces "Saved on this device", `value`/`onChange` make it controlled.
- `AppearanceProvider`: a `UIProvider` that holds the choice, saves it in `localStorage` (`storageKey`, `false` to keep it in memory) and switches with a view transition. `kits={["halo", "pro"]}` turns on the style row; `initial` and `onChange` load and save the choice per account instead. `useAppearance()` is the same state as a hook, `appearanceScript()` an inline `<head>` script that sets the saved look before the first paint.
- `SearchTrigger`: the search field look for the top bar as a button that opens a `CommandPalette`; `shortcut="⌘K"` shows the key and `bindShortcut` binds it.
- `Popover` takes `label`, the accessible name of its panel.
- The AppShell, Dashboard and SidebarShellScreen demos show the standard frame; new pages for AppearanceMenu and SearchTrigger; the installation guide starts apps from it, `twentyfirst-ui init` writes `<AppearanceProvider>` and the MCP server's `build_screen` starts whole apps from it. Apps stay free to build their own frame.
