Centered card for sign-in, sign-up, password reset, two-step codes and invites.

Props: `title`, `text`, `icon` + `tint` (for non-sign-in steps), `brand`, `foot` (the one secondary link), children (fields and one primary Button).

- One task per card, one primary button. Secondary paths go in the footer.
- After "Send reset link", swap to a confirmation card that doesn't reveal whether the account exists.
- Put it on the `canvas` color with a small "Back" link at top-left.
