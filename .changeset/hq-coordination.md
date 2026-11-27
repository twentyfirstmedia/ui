---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

Coordination views for multi-agent systems and shared pieces:

- `AgentNetwork`: the hierarchy of an orchestrator, its leads and the agents that do the work as a live graph (zoom, pan, fit). Each node shows status and an approval beacon; every new handoff from your event stream (`{ id, from, to, label }`) sends a packet along the edges and is announced to screen readers. With reduced motion the receiver is marked instead. A details card with a link opens on click; narrower than 560px it is a list.
- `CoordinationTicker`: the latest handoffs, runs and approvals as a live list with a link per line.
- `MissionControlScreen` pattern: the main agent's chat in the middle with prompt starters, open approvals, today's costs, the agent network and the ticker around it; tabs on phones; glass over `Ambient`.
- `UIProvider linkAs` and `useLinkAs`: one router link for every navigating component.
- `BulkActionBar` (DataTable now uses it), `DaySeparator` and `Highlight`.
