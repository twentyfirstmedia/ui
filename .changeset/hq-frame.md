---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

The app frame: routes, the bell, the look menu with a brand colour, a tab bar for phones, a stepper and input groups.

New:

- `NotificationCenter`: the bell for the top bar with the unread count (its accessible name says how many), behind it the notification list in a popover (a bottom sheet on phones), grouped by day, with a deep link per item and "Mark all read"; controlled `open`.
- `Stepper`: wizard steps in a row on wide screens (done, current, upcoming, error; `onStepClick` goes back to done steps), "Step 2 of 5" with a progress bar on phones or with `variant="compact"`.
- `InputGroup`: a text field with `start` and `end` affixes in one outline (text read with the field, an icon, a unit select or a button).
- `matchPath(pathname, entries)`: the entry whose `href` matches the path, the longest match winning.

Extended:

- `AppShell`: `pathname` marks the page whose `href` matches (top nav and sidebar), `linkAs` renders every nav link (sidebar, top nav, tab bar, rail, dock) through your router, `notifications` puts a `NotificationCenter` and `appearance` the `AppearanceMenu` at the end of the top bar, `tabBar` shows a `MobileTabBar` with "More" on phones, a "Skip to content" link jumps to `<main>` (`skipLink`, `mainId`), and with `fill` the frame keeps clear of the notch and the home indicator (safe areas).
- `AppearanceMenu` and `AppearanceProvider`: a brand colour row (the kit's own, the six `THEME_PRESETS`, a custom colour through `brandTheme`; `brand` in `Appearance` and in `appearanceScript`), a preview while a choice is hovered (`onPreview`), a bottom sheet on phones (`sheet`), and `Ambient` behind the app while glass is on (`ambient`). `appearanceBrandTheme(brand)` gives the theme of a brand value.
- `MobileTabBar`: tabs with `href` (and `linkAs`), `countTone: "signal"`, and `more` for the pages that do not fit, in a sheet grouped by `group`.
- `NotificationList`: day groups from `date`, `href` per item (with `linkAs`), `hideFilter`.
- Nav items (`NavItem`, `SidebarItem`) take `countTone: "signal"`; top nav items take `id` and `href`; `SideRail` and `Dock` items take `href` (with `linkAs`).
- `Segmented` takes `onPreview` (called while an option is hovered).
