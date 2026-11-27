---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

Calendar and webmail components.

New:

- `CalendarView`: day, week, month and agenda for several calendars (tints, visibility toggles, read-only calendars such as public holidays), an all-day row and a now line, create by clicking or dragging an empty slot or with Enter on a focused slot (arrow keys move between slots and days), event details as a popover (desktop) or a bottom sheet (phones) with guests and their replies, "Going?" (`onRsvp`) and your own actions; a week or month shows as a list on phones. Controlled `view`, `date`, `selected` and `hidden`; `onRangeChange` reports the visible range. `calendarRange` is exported.
- `EventInvite`: an invitation inside a mail with time, place, organizer, guests and what else is in the calendar then; Accept, Maybe, Decline and "Add to calendar"; updated and cancelled states.
- `MailHtml`: an HTML mail in a sandboxed frame (no scripts, no forms, its own CSP), remote images only after "Load images", links in a new tab without referrer, auto height, paper or theme colours. `mailDocument` and `countRemoteImages` are exported.
- `RecipientInput`: address chips with suggestions (static or asked while typing), validation and paste of several addresses (`parseRecipients`, `isEmailAddress`).
- `MailComposer`: from-address select, To/Cc/Bcc, subject, rich text body, signature switch, attachments from the device or app sources with upload progress, draft state, "Send later" and Undo in a toast; ⌘/Ctrl+Enter sends.
- `MailFolders`: the folder tree with standard and own folders, unread counts and a context menu (new folder inside, rename, delete, empty trash and junk) from a button, a right click or Shift+F10.
- `MailFilterBar`: account, domain, unread, starred, with attachments and agent.
- `MailRulesEditor`: conditions → actions (move, archive, mark read, star, forward, hand to an agent, delete).
- `AutoReplyEditor`: the out-of-office reply with a period, subject, message and "only contacts".
- `MailRouteList`: aliases and forwards of a domain with add and delete.
- Patterns: `MailScreen` (a full webmail) and `CalendarScreen` now built on `CalendarView` and `EventInvite`.

Extended:

- `InboxList`: `selectable` with checked ids (controlled or not), `bulkActions` in a `BulkActionBar` above the list, `onStar`, an attachment mark and rows as links (`href`, `linkAs`). Without these the markup stays as before.
- `MailThread`: `unsubscribe` (one-click unsubscribe for newsletters, done and busy states) and `actions` next to the subject.
- `RichTextEditor`: `hideLabel`.
