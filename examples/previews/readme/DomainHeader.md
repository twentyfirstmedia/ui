# DomainHeader

The top of a domain's page, above its `DnsRecordTable`: the name, registrar and DNS host, the expiry (days left worked out from `expires`; under 30 days warns, under 7 is danger, `autoRenew` noted), the SSL state with issuer and end date, and the mail lights MX, SPF, DKIM and DMARC. `onOpenCheck(check)` makes each cell a button that opens what was found; `actions` go on the right. `DomainList` rows link with `href` / `linkAs`.
