# RecordHeader

The top of any CRM record (person, company, deal, matter): picture, name and subtitle, status and
tags, the owner, quick actions and a row of key facts.

- `kind` picks the default picture: an Avatar for a person, a ServiceMark for a company, a tinted
  icon for a deal or matter. `avatar` or `icon` override it.
- `actions` with `primary: true` becomes the filled button; `menu` takes anything for the far end
  (an overflow Menu, a LeadScore).
- Below 520px the actions and facts wrap under the title.
