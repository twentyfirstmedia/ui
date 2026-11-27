# Stepper

The steps of a wizard or a setup flow. On wide screens the steps stand in a row with their number, label and an optional description; on phones (or always with `variant="compact"`) it says "Step 3 of 5" with the current step's name and a progress bar.

- `current` is the index of the current step: earlier steps are done, later ones upcoming. A step's own `state` wins (`"error"` for a step that needs attention).
- `onStepClick` turns done and error steps into buttons that go back to them.
- Screen readers hear the state after each step's name ("Account, done") and the current step is `aria-current="step"`.
- For a whole wizard page with the steps beside the content, see `Wizard`.
