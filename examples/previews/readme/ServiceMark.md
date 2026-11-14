# ServiceMark

A connected service's mark: its brand logo from the icon library (`brandGmail`, `brandTesla` …),
your own logo, or a monogram when the brand has no open logo ("AH" for Apple Health). An optional
dot shows the connection state, and screen readers hear it in words ("N26, Needs attention").

- Sizes `sm` (24px), `md` (36px) and `lg` (48px); any tint.
- `logo` takes an `<img>` or `<svg>` you are allowed to use; `monogram` overrides the letters.
- `decorative` hides it from screen readers when the name is written next to it.
