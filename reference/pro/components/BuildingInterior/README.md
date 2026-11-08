# BuildingInterior
Inside a project's building as a flat 2D view: one room per team, one desk per agent. Used in the Lite/mobile view and as a fallback to the 3D scene.

`hq-interior` grid of rooms (HairlineGrid cells) with the team name and counts; desks show the agent avatar with status shape, name and current task. A desk waiting for approval gets a `signal` border (`.is-waiting`). Click a desk to open the agent. The project's CI color appears only as the square next to the building name.
