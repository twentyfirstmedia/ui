Number entry three ways: `NumberInput` with − / + steppers, `Slider` for a value on a known scale, `OtpInput` for one-time codes.

NumberInput: `label`, `value`/`defaultValue`, `onChange(n)`, `min`, `max`, `step`, `unit`, `hint`.
Slider: `label`, `min`, `max`, `step`, `value`/`defaultValue`, `onChange(n)`, `format(v)`, `marks` (false hides min/max), `hint`.
OtpInput: `length` (6), `onComplete(code)`, `error` (shakes and turns red), `label`.

- NumberInput for small exact counts (seats, days); arrow keys step too.
- Slider when the range matters more than the exact value (budgets, thresholds); always show the value bubble.
- OtpInput moves focus forward as you type, back on Backspace, and fills every box on paste.
