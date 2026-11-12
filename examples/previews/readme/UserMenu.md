# UserMenu

The signed-in account at the foot of a sidebar: avatar, name and email, opening a menu with
profile, settings and sign-out.

- `items` are `Menu` items (icons, shortcuts, `"-"` separators, `danger`).
- `compact` shows only the avatar, with the name as its accessible label; use it in a collapsed
  sidebar (`footer={({ collapsed }) => <UserMenu compact={collapsed} … />}`).
- The menu opens above the trigger by default (`side="top"`); use `side="bottom"` at the top of a
  page.
