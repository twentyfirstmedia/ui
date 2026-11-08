# RunTrace
One agent run step by step: model calls, tool calls, waits for approval, with time and cost per step as a waterfall.

Columns: step name (indented for nested steps, status shape), lane with a bar positioned by start and duration, duration, cost. Bars: model calls `fg-100`, tool calls `chart-2`, waiting for a human as a `signal` outline. Totals in the header. Links to the full Langfuse trace. This is the "Flugschreiber" view inside HQ.
