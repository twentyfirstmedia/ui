Cart and checkout pieces: `CartLine` rows, the `OrderSummary` with discount code and free-shipping progress, and `CheckoutSteps`.

CartLine props: `name`, `variant`, `note`, `art` + `tint`, `price`, `qty`, `onQty(n)`, `onRemove` (the − button becomes a bin at 1).
OrderSummary props: `lines` ({name, variant, art, tint, price, qty}), `showLines`, `discount` ({code, pct | amount, label}), `onCoupon(code)` (return false to show "isn’t valid"; null removes), `shipping` (fixed) or `freeShippingFrom` (default 75, else €4.90), `vat` (19, prices include it), `title`, `action` (the CTA).
CheckoutSteps props: `steps` (Cart, Details, Shipping, Payment), `current`, `onPick` (go back only).

- Keep the summary in a sticky side column on desktop; it moves under the form on phones.
- Show what's left for free shipping; it is the strongest nudge in a cart.
- Removing a line shows an Undo toast instead of a confirm.
