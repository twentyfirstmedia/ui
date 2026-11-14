# DeviceTile

A smart-home device (from Google Home, Apple Home, SmartThings, tado°, Dyson, eufy, Dreame …):
its reading, its state and the controls its kind needs.

- `kind`: `switch`, `light`, `thermostat`, `vacuum`, `purifier`, `camera`, `lock` or `sensor` sets the icon.
- `onToggle` adds a switch; `target` with `onTarget` adds a − / + stepper for thermostats.
- `battery` (low below 15 %), quick `actions`, `offline`, and the `service` it comes from.
