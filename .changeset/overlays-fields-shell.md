---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
"@twentyfirstmedia/elements": minor
---

Fixes and additions from moving an admin app onto the kits:

- **Focus trap of overlays opened through `open`**: `CommandPalette`, `Drawer`, `Modal`, `ConfirmDialog` and `ExportDialog` mounted closed and opened later now move focus inside on open (an element with `data-autofocus` first, then the first text field), keep Tab inside, close on Escape and return focus to the trigger on close. `useTrap(ref, onClose, active)` takes the new `active` flag. `Modal` traps focus while open (it did not before) and gets `inline` for in-page demos.
- **`hideLabel`** on every field control (`Input`, `Select`, `Textarea`, `TextField`, `SelectMenu`, `NumberInput`, `Combobox`, `DatePicker`, `TagInput`, `MoneyInput`, `ColorField`, `LocaleField`, `Slider`, `RangeSlider`, `RadioGroup`, `VariantPicker`, `FormField`; accepted by `SearchField` and `StatusSelect`): the label stays the accessible name but is visually hidden, so filter bars stay one row. New utility class `tf-sr-only`.
- **`IconButton` as a link**: `href` and `linkAs` (for router links); `label` stays the accessible name and tooltip. `asChild` is now documented.
- **`AppShell fill`**: the shell is the whole page (at least `100dvh`, no outer radius); the sidebar stays in view on desktop, and on phones the sheet starts right under the sidebar bar.
- **Icons**: `volume`, `volumeOff`, `trophy` and `receipt` are in the kit's own set (97 icons). The library still exports `volume`, `trophy` and `receipt` (deprecated aliases), so existing imports keep working.
