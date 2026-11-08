# Toggle and ToggleGroup

On/off buttons. A **Toggle** is a single pressed state (star, pin, follow). A **ToggleGroup** joins
several: `type="single"` allows at most one, `type="multiple"` any number (text styles, filters).

- Pressed state is `aria-pressed`; icon-only toggles take their name from `label` (or the option's `hint`).
- ←/→, Home and End move between the toggles of a group.
- For choosing exactly one of a few views, `Segmented` is the closer fit.
