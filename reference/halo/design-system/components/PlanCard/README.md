Pricing tier for plan pages and upgrade dialogs. Wrap several in `.ha-plans` for an even grid.

Props: `name`, `text`, `price` (number, 0 = "Free", null = "Let’s talk"), `was` (struck price, e.g. monthly vs yearly), `per`, `features` (strings; prefix "-" for not included), `featured` (dark card + flag), `flag`, `current` (disables the button), `cta`, `onPick`.

- One featured plan, the one most customers should pick. It inverts to the frame color.
- List the same features in the same order on every card, so rows can be compared; mark missing ones instead of leaving them out.
- Pair with a Segmented Monthly / Yearly switch that states the saving.
