# Meter
Thin bar for budgets, quotas and resource use, with a tick at the warning threshold.

4px track in `bg-300`, fill in `fg-100`. Add `.is-warn` from the warning threshold (budget: 80 %) and `.is-danger` at the hard stop (100 %). The `.tick` marks the threshold in `line-300`. Always show the number next to it (`mono-sm`): the bar is a glance, the figure is the fact.
