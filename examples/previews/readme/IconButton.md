# IconButton

A button that is only an icon. `label` is required: it becomes the accessible name and the tooltip.

- Variants `soft` (default), `solid`, `outline` and `ghost`; sizes `sm`, `md` and `lg` on the control
  scale of the kit.
- `href` renders a real link with the same look (middle-click, ⌘-click and prefetch work); `linkAs`
  takes a router link such as Next.js `Link`. `asChild` puts the look and the icon on your own single
  child element instead.

```tsx
import Link from "next/link";

<IconButton icon="chevronLeft" label="Back to orders" href="/admin/orders" linkAs={Link} />
<IconButton asChild icon="download" label="Download invoice">
  <a href="/invoices/4417.pdf" download />
</IconButton>
```
