# Spinner
Indeterminate loading for short waits inside controls and rows (button submitting, tool call running).

16px ring, `line-300` track, `fg-100` arc; `--lg` 24px for panel loads. Show after 300 ms only. Inside a button the spinner replaces the icon and the label changes to the progressive form ("Sende …"). For page-level loads use Skeleton; for long jobs use Progress.
