import type { MailFolder, MailRecipient } from "@twentyfirstmedia/ui-core";

/** Shared example data for the webmail previews. */
export const PEOPLE: MailRecipient[] = [
  { address: "lena.hart@example.com", name: "Lena Hart" },
  { address: "noah.berg@example.com", name: "Noah Berg" },
  { address: "ava.brandt@example.com", name: "Ava Brandt" },
  { address: "sun.lee@example.com", name: "Sun Lee" },
  { address: "billing@northwind.example", name: "Northwind Billing" },
];

export const FOLDERS: MailFolder[] = [
  { id: "inbox", label: "Inbox", role: "inbox", unread: 12 },
  { id: "starred", label: "Starred", role: "starred" },
  { id: "scheduled", label: "Scheduled", role: "scheduled" },
  { id: "drafts", label: "Drafts", role: "drafts", unread: 2 },
  { id: "sent", label: "Sent", role: "sent" },
  { id: "archive", label: "Archive", role: "archive" },
  { id: "junk", label: "Junk", role: "junk", unread: 3 },
  { id: "trash", label: "Trash", role: "trash" },
  {
    id: "clients",
    label: "Clients",
    unread: 4,
    children: [
      { id: "northwind", label: "Northwind", unread: 3 },
      { id: "bluefern", label: "Blue Fern", unread: 1 },
    ],
  },
  { id: "receipts", label: "Receipts" },
];

export const NEWSLETTER_HTML = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
  <tr><td style="padding:24px 0 8px;font-size:22px;font-weight:700">The weekly digest</td></tr>
  <tr><td><img src="https://images.example.com/digest/header.png" width="560" height="180" alt="Header image"></td></tr>
  <tr><td style="padding:16px 0;line-height:1.6">
    Three things shipped this week: faster exports, saved views and a new audit log.
    <a href="https://example.com/changelog">Read the changelog</a>.
  </td></tr>
  <tr><td style="padding:8px 0;color:#6b6a65;font-size:12px">You get this because you signed up at example.com.</td></tr>
</table>`;
