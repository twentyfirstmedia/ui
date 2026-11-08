Domains and DNS: `DnsRecordTable`, `DomainList` (sorted by what needs attention) and `MailAuthStatus` (MX, SPF, DKIM, DMARC lights).

DnsRecordTable: `records` ({id, type, name, content, ttl, proxy: true | false | null}), `rowMenu(record)` (Menu items), `selectable`, `bulkActions`, `toolbar`. Built on DataTable.
DomainList: `items` ({name, registrar, dns, days, ssl, sslLabel}), `onOpen`. Under 30 days warns, under 7 days is danger.
MailAuthStatus: `rows` ({domain, mx, spf, dkim, dmarc: {status, label}}), `columns`, `onOpen(row, column)`.
