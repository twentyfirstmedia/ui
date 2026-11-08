Form pieces added for search filters and admin settings: `RangeSlider` (two thumbs), `StatusSelect` (a status pill that opens a list), `TilePicker` (pick one or many visual options) and `ColorField` (hex input with contrast check).

RangeSlider: `label`, `min`, `max`, `step`, `value` / `defaultValue` ([low, high]) + `onChange`, `unit`, `inputs` (false shows values instead of fields), `openEnd` (adds "+" at max), `format`.
StatusSelect: `options` ({value, label, status}), `value` / `onChange`, `size` ("sm"), `label`.
TilePicker: `options` ({value, label, meta, image | icon | art, tint, color, disabled}), `value` / `onChange`, `multiple`, `min` (tile width), `label`.
ColorField: `label`, `value` / `onChange`, `against` (colour to check contrast with; false hides it), `hint`.
