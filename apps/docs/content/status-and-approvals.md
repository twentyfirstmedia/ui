---
title: Status and approvals
description: One state model and one way to ask a human, in both kits.
---

State is shape plus colour, so it reads without colour vision: **ok** = dot, **running** = pulsing dot, **signal** = diamond (waits for a human), **warn** = triangle, **danger** = square, **idle** = ring. One status word always maps to the same tone on every page. Only `signal` may draw attention unasked; warnings and errors never animate.

Everything an agent may not do alone goes through `ApprovalCard` with four answers in this order: **A** yes, as shown · **B** yes, with a change · **C** no, discard · **D** different instruction. The card shows the risk family, agent and project, age and escalation time, and the exact payload that will run. A–D work as keys. Once decided it collapses to one line with letter, person and time. `ApprovalInbox` lists open approvals oldest first; J and K move.

See [StatusIndicator](/{{kit}}/components/StatusIndicator/), [ApprovalCard](/{{kit}}/components/ApprovalCard/) and [ApprovalInbox](/{{kit}}/components/ApprovalInbox/) for the props.
