import { RichText } from "@twentyfirstmedia/ui-core";

const MD = `## Renewal for Northwind

Northwind renews on **May 1**. The new list price applies from then; *existing seats keep their price* until the term ends. ~~Old discount~~ no longer applies.

| Plan | Seats | Per seat | Per month |
|:--|--:|--:|--:|
| Team | 40 | €24 | €960 |
| Team, prorated April | 40 | €12 | €480 |

1. Check the seat count with Ida
   - she asked for **40**, the contract says 35
   - the extra 5 are trial users
2. Send the quote
3. Book the call for the renewal

- [x] Prices checked
- [ ] Quote sent
- [ ] Call booked

> The quote must say that the prorated amount is billed with the next invoice.

Notes: https://example.com/handbook/sales/renewals-and-prorated-seats-for-annual-plans and \`billing.prorate(seats, from)\`.

\`\`\`ts
const total = seats * price * (daysLeft / daysInMonth);
\`\`\``;

export default function Preview() {
  return (
    <div className="tf-panel">
      <RichText text={MD} />
    </div>
  );
}
