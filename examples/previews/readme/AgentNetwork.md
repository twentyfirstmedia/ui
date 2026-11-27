# AgentNetwork

The hierarchy of a multi-agent system as a live graph: the orchestrator at the top, a lead per project or team below it and the agents that do the work under each lead.

- Each node shows name, project, status (the kit's status shapes: idle, running, signal = waiting for approval, warn, danger, ok) and a beacon with the number of open approvals.
- `handoffs` come from your event stream (`{ id, from, to, label }`): every new id sends a small packet along the edges, up to the shared lead and down to the receiver. Screen readers hear "A handed … to B". With reduced motion (or `UIProvider motion="off"`) the receiver is marked for a moment instead.
- Click a node for its details card with `detail`, `renderDetails` and a link (`href`, `linkAs` or `UIProvider linkAs`). `selected`/`onSelect` make the selection controlled.
- Drag to pan, pinch or Ctrl/⌘ + wheel to zoom, the buttons zoom and fit. Narrower than 560px (or `layout="list"`) it is an indented list instead of a graph.
