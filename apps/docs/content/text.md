---
title: Text and locale
description: "Built-in text is English by default; replace any of it with UIProvider messages, and format numbers, money and dates for any locale with UIProvider locale."
---

The kits ship plain English and no translations. Every text a component shows on its own (accessible names, button texts, placeholders, status words, validation messages) can be replaced, and numbers, money, percentages and dates follow a locale you set. Props such as `title`, `label` or `placeholder` on a component still win over both.

```tsx
import { UIProvider } from "@twentyfirstmedia/{{kit}}";

<UIProvider
  locale="de-DE"
  messages={{
    close: "Schließen",
    send: "Senden",
    composerHint: "Enter zum Senden · Shift+Enter für eine neue Zeile",
    selectedCount: (n, formatted) => `${formatted ?? n} ausgewählt`,
    agentStatus: { Running: "Läuft", Idle: "Bereit" },
  }}
>
  {children}
</UIProvider>;
```

## Messages

- `messages` is partial: what you leave out stays English. Nested providers merge on top of the outer one, so a section of the app can change a few strings.
- Strings with a value in them are functions (`` removeItem: (name) => `${name} entfernen` ``), so the word order is yours. A few take React nodes where the value is highlighted (`typeToConfirm`, `freeShippingIn`).
- Status words (`agentStatus`, `orderStatus`, `reviewState`, `riskFamily`, `flowStep`) are groups keyed by the status value, which stays English in your data. Groups merge one level deep.
- `DEFAULT_STRINGS` holds every key with its English text; the `UIStrings` type documents each one. Type your own set as `UIMessages` to get completion and checks.
- `useUIStrings()` returns the strings that apply where it is called, for your own components.
- Server components (`StatusScreen`, `AuthCard`) cannot read the provider; their texts are props.

Set `lang` on `<html>` (or the element around a translated part) yourself, so screen readers pronounce the text in the right language.

## Locale

`locale` is a BCP 47 tag (default `en-US`). It applies to every number, amount, percentage and date a component formats, to calendar month and weekday names, and to `CountUp` and `StatTile`, which read string values in that locale: in `de-DE`, `"13,05 €/m²"` counts up to 13.05 and keeps its unit.

The helpers take the locale as their last argument, and `useFormat()` returns them bound to the provider's locale:

```tsx
import { formatMoney, useFormat } from "@twentyfirstmedia/{{kit}}";

formatMoney(1290, "EUR", undefined, "de-DE"); // "1.290 €"

function Price({ value }: { value: number }) {
  const { formatMoney } = useFormat();
  return <b>{formatMoney(value)}</b>;
}
```

Money defaults to euros; pass a currency per call. Calendars start on Monday.
