---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

Approvals: previews of exactly what runs, passkey step-up, inbox filters; infrastructure pieces.

- New previews to put inside `ApprovalCard`: `ChangePreview` (before/after per field, changed rows marked, stacks on phones, optional folded line diff), `CommandPreview` (command, argv, server, risk, timeout, state read before, "Runs once after A"), `MessagePreview` (channel, masked recipient, reply window open/closing/closed, last messages, text or template, image or video of a post), `CampaignPreview` (contacts with source, first sentence, script, calling hours, budget in minutes and money, booking calendar), `DocumentPreview` (text diff or spreadsheet cells), `EventPreview` (time, place, guests with their answer, conflicts) and `MoneyPreview` (amount with cents, masked recipient, bookings with their sum or a refund, "Needs a fresh passkey"). Helpers `LineDiff`, `diffLines`, `foldDiff` and `maskRecipient`.
- New `CommandWhitelist` (allowed commands per server with parameters, risk and approval, blocked patterns) and `DomainHeader` (expiry with days left, SSL, the MX/SPF/DKIM/DMARC lights); `expiryStatus` is exported.
- Extended `ApprovalCard`: `stepUp` (A and B need a passkey: "Needs your passkey", then "Confirm with passkey" while pending), `onDecide` may return a Promise (busy answer, every answer waits, a rejection shows an error and keeps the card open, a resolve collapses a card without `decision`), controlled `busy` and `error`, `screen` (A–D sticky at the bottom in thumb reach on phones), a tighter `compact` with the payload behind "Show what runs", `href` / `linkAs` on the title, 48px answers on touch screens, glass on its own over maps and photos.
- Extended `ApprovalInbox`: filters by project, family and agent (`filters`, controlled or not), an escalation warning above the list, A–D on the selected row (`onDecide(id, key)`), a "Done" view for decided items (`decision` on the item), `href` rows with `linkAs`, roving focus with J/K.
- Extended `OverrideDiff`: `context` folds long unchanged runs into "… n unchanged lines" (it now uses a longest-common-subsequence diff). Extended `DomainList`: `href` per row and `linkAs`.
- New pattern `ApprovalsScreen`; the "Status and approvals" guide shows which preview goes with which action and how step-up works.
