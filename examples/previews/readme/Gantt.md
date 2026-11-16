# Gantt

Tasks and milestones on a time axis: a bar per task with its progress, the owner, week lines and
today's line.

- Each task reads out its range and progress ("Design, Nov 9 to Nov 20, 70% done");
  `onOpen(id)` makes the name a button.
- The chart keeps 16px per day and scrolls sideways inside its box on small screens.
