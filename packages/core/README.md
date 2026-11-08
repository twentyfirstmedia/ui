# @twentyfirstmedia/ui-core

The shared core of the [Twentyfirst UI](https://ui.twentyfirst.media) kits: every component, hook, icon and `Intl` formatter, plus `themes.css` with both kits.

[Website](https://ui.twentyfirst.media) · [Halo docs](https://ui.twentyfirst.media/halo/) · [Pro docs](https://ui.twentyfirst.media/pro/) · [GitHub](https://github.com/twentyfirstmedia/ui) · [llms.txt](https://ui.twentyfirst.media/llms.txt)

Most apps install a kit instead, [`@twentyfirstmedia/halo`](https://www.npmjs.com/package/@twentyfirstmedia/halo) or [`@twentyfirstmedia/pro`](https://www.npmjs.com/package/@twentyfirstmedia/pro), which re-export everything here together with the kit's styles.

Install `ui-core` directly to load **both kits** and switch at runtime:

```sh
npm install @twentyfirstmedia/ui-core
```

```tsx
import "@twentyfirstmedia/ui-core/themes.css";
import { Button, UIProvider } from "@twentyfirstmedia/ui-core";

export function App({ pro }: { pro: boolean }) {
  return (
    <UIProvider kit={pro ? "pro" : "halo"}>
      <Button variant="primary">Save</Button>
    </UIProvider>
  );
}
```

Markup, props and state stay the same; only the CSS that applies changes.

## License

[MIT](https://github.com/twentyfirstmedia/ui/blob/main/LICENSE) © Twentyfirst Media. Fonts under the SIL Open Font License 1.1.
