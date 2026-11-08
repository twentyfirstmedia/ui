# OfficeFloor
The inside of one building: one floor, a room per team, a desk per agent, generated from the project config. Avatars walk when work is delegated. Shown here: FollowerPilot.

**Try it**
- Watch the Head Agent stand up, walk down the aisle, along the corridor and to a colleague when a `delegation` event arrives. A bubble shows the task; the colleague's chip turns to "denkt", then "arbeitet".
- Click an avatar, its chip or its desk: the chat sheet opens with the live thread (hand-offs, tool calls, streamed text) and a composer. Messages you send get an answer.
- An agent with a beacon is waiting for approval. Open it and decide with A–D right in the chat; B and D ask for a note. The beacon disappears and the agent goes back to work.
- **Namen** shows full names on all chips. Hover shows one.

**Layout rules (algorithmic, no frontend code per project)**
- Rooms sit side by side along the back wall, in config order. Width = `max(3.4, columns × 2.3 + 1)` tiles; two desk rows per room; a 1-agent room centers its desk.
- Aisles to the right of each desk column; the corridor in front connects all rooms. Paths: seat → aisle → corridor → target aisle → stand next to the target.
- Back and left walls take the CI tint with a CI baseboard; the reception wall carries the project logo plate. Front walls are cut away.
- Glass partitions between rooms; a CI threshold line at each room door.

**Status on the agent**
| Status | Chip | Monitor |
|---|---|---|
| working | info pulse + initials | CI, bright |
| thinking | three dots | info, blinking |
| waiting | signal beacon "Freigabe" | signal |
| error | danger square "Fehler" | danger, blinking |
| idle | ring | dark |

**Decoration from config** (`deco: { <teamId>: … }`): `instawall` (FollowerPilot Content), `vitrine` (Jason Devine Shop), `kpi` (live cost on a wall screen), `racks` (Rechenzentrum). Plants in every room. Messengers (light packets) enter through the door for `relay`, `brief` and `result` events addressed to this building.
