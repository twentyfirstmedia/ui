# SettingsLayout
Standard layout for every settings page (global, module, project, agent): label column left, controls right, one row per topic.

`hq-settings` HairlineGrid: left cell with title and one sentence on what it does, right cell with the controls. Changes save per row with a toast, or the page has one sticky "Speichern" bar when changes must go together. Destructive settings sit in a final "Gefahrenzone" row.
