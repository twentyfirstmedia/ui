# Input
Single-line and multi-line text entry with label, hint and error.

**Anatomy:** `.hq-field` > `label` + `.hq-input` (or `.hq-textarea`) + `.hq-hint`. Prefix/suffix (icons, units, domains) go in `.hq-inputgroup` with `.affix` cells; `.affix--sep` adds a hairline divider.

**Rules**
- Inputs sit on `bg-000` with a `line-300` border (3:1), so they read as wells inside `bg-100` cells.
- Focus: border and 1px ring in `focus`. Error: `aria-invalid="true"` turns the border `danger`; the hint below says what is wrong and how to fix it ("Adresse fehlt ein @").
- Use `.hq-input--mono` for IDs, IPs, DNS values, IBANs and amounts.
- Placeholders in `fg-400` are examples, never labels.
- On mobile set font-size 16px to stop iOS zoom.
