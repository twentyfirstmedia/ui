# InputGroup

A text field with affixes inside one outline: a protocol before a domain, a currency or unit, a fixed email domain, a search icon, a unit select or a copy button.

- `start` and `end` take text, an `Icon` or a control. Text affixes are read with the field (`aria-describedby`); controls keep their own names and are reached with Tab.
- Takes the props of `TextField` (`label`, `hint`, `error`, `value`, `onChange`, `inputMode` …). `children` replaces the built-in input with your own control (give it `className="tf-input"`).
- The outline shows hover, focus and errors for the whole group; on touch screens the text is 16px so iOS does not zoom.
