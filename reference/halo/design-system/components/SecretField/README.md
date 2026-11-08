`SecretField` shows a stored credential without exposing it; `MoneyInput` takes amounts in the locale's format with a VAT rate.

SecretField: `prefix`, `last4`, `value` (shown only after `onReveal` resolves truthy; ask for a passkey there), `meta`, `onCopy`, `onRotate`.
MoneyInput: `label`, `value` / `onChange(number)`, `currency`, `vat` + `onVat` + `vatOptions`, `showGross`, `hint`, `error`. Parses and formats with Halo.setLocale.

- Never render a full secret by default; reveal is a step-up action.
- Amounts are right-aligned tabular mono so columns line up.
