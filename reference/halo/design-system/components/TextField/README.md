Text input with label, required or optional mark, hint, and inline validation (error or success).

Props: `label`, `required`, `optional`, `hint`, `error`, `success`, `icon` (leading IconName), `suffix` (unit text), `type`, `value`, `defaultValue`, `onChange`, `onBlur`, `disabled`, `placeholder`, `autoComplete`.

- Validate on blur, not on every key: show the error once the person leaves the field, then clear it live as they fix it.
- Error text says what is wrong in plain words ("That doesn’t look like an email address"), never "Invalid input".
- Use `success` sparingly, for checks that took effort (a free username, a verified domain).
- Mark the minority: if most fields are required, mark the optional ones instead.
- `FormField` is the same shell without an input, for wrapping custom controls.
