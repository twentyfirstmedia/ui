# Progress
Progress of long jobs: mail migration, CSV import, DATEV export, deploys, bulk agent runs.

2px bar (`hq-progress`), determinate with percent and count in mono ("1.240 / 3.800 Mails"), or indeterminate (moving segment) when the total is unknown. Long jobs run in the background: show them in the top bar and in the NotificationCenter when done; never block the UI.
