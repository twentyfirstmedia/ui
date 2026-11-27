---
title: Status and approvals
description: One state model and one way to ask a human, in both kits.
---

State is shape plus colour, so it reads without colour vision: **ok** = dot, **running** = pulsing dot, **signal** = diamond (waits for a human), **warn** = triangle, **danger** = square, **idle** = ring. One status word always maps to the same tone on every page. Only `signal` may draw attention unasked; warnings and errors never animate.

Everything an agent may not do alone goes through `ApprovalCard` with four answers in this order: **A** yes, as shown · **B** yes, with a change · **C** no, discard · **D** different instruction. The card shows the risk family, agent and project, age and escalation time, and the exact payload that will run. A–D work as keys. Once decided it collapses to one line with letter, person and time. `ApprovalInbox` lists open approvals oldest first; J and K move.

## What the card shows

The payload is always exactly what will run, never a summary. Put one of the previews inside the card:

| The agent wants to … | Preview | Family | Step-up |
|---|---|---|---|
| change a record, a setting, a resource at a provider, a mailbox | [ChangePreview](/{{kit}}/components/ChangePreview/) (before/after per field, optional line diff) | infra | yes |
| run a command on a server | [CommandPreview](/{{kit}}/components/CommandPreview/) (command, argv, risk, state before, timeout) | infra | critical commands |
| message a customer or publish a post | [MessagePreview](/{{kit}}/components/MessagePreview/) (recipient masked, reply window, last messages, text or template) | comms / marketing | no |
| start a phone campaign | [CampaignPreview](/{{kit}}/components/CampaignPreview/) (contacts, first sentence, script, hours, budget) | comms | yes |
| edit a document or sheet | [DocumentPreview](/{{kit}}/components/DocumentPreview/) (line diff or cells) | apps | no |
| create or change an event | [EventPreview](/{{kit}}/components/EventPreview/) (time, place, guests, conflicts) | comms | no |
| pay, refund or book | [MoneyPreview](/{{kit}}/components/MoneyPreview/) (amount, recipient masked, bookings with their sum) | money | always |

`maskRecipient()` shortens e-mail addresses, phone numbers, IBANs and names for these previews. Previews end with what happens on A ("Runs once after A").

## Step-up and pending answers

Money, legal and infrastructure decisions need a fresh passkey: give the card `stepUp`. A and B then say "Needs your passkey". Do the WebAuthn step-up and the call in `onDecide` and return the Promise: the pressed answer shows "Confirm with passkey" and spins, every answer waits, and a rejection shows an error and keeps the card open (nothing ran). Once it resolves, the card collapses to its one-line record (or set `decision` yourself).

## Phones and side panels

On touch screens every answer is at least 48px tall. `screen` fills a deep-link page: the payload scrolls and A–D stay at the bottom, full width, in thumb reach. `compact` fits a side panel: answers in a row, the payload one click away behind "Show what runs", `href` to open the full approval. `ApprovalInbox` filters by project, family and agent, warns before escalations, answers the selected row with A–D and keeps a "Done" view.

See [StatusIndicator](/{{kit}}/components/StatusIndicator/), [ApprovalCard](/{{kit}}/components/ApprovalCard/) and [ApprovalInbox](/{{kit}}/components/ApprovalInbox/) for the props.
