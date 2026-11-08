# @twentyfirstmedia/elements

Every [Twentyfirst UI](https://ui.twentyfirst.media) component as a custom element: `<tf-button>`, `<tf-panel>`, `<tf-data-table>`, `<tf-approval-card>` and 209 more, with the same props as the React components. For plain HTML, Vue, Svelte, Angular, Astro, Rails and Django templates; React is bundled inside, so no React setup is needed. Works with both kits, [Halo](https://www.npmjs.com/package/@twentyfirstmedia/halo) and [Pro](https://www.npmjs.com/package/@twentyfirstmedia/pro).

[Website](https://ui.twentyfirst.media) · [Guide](https://ui.twentyfirst.media/halo/html/) · [Halo docs](https://ui.twentyfirst.media/halo/) · [Pro docs](https://ui.twentyfirst.media/pro/) · [GitHub](https://github.com/twentyfirstmedia/ui)

## Use it from a CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@twentyfirstmedia/halo/dist/styles.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@twentyfirstmedia/elements/dist/elements.js"></script>

<tf-panel title="Team">
  <tf-button slot="action" variant="ghost" size="sm">Invite</tf-button>
  <tf-tabs items="Members, Invites"></tf-tabs>
</tf-panel>
```

For a classic `<script>` use `dist/elements.global.js` (global `TwentyfirstElements`).

## Or install it

```sh
npm install @twentyfirstmedia/elements @twentyfirstmedia/halo
```

```js
import "@twentyfirstmedia/halo/styles.css";
import { toast } from "@twentyfirstmedia/elements"; // defines every tf-* element
```

## How props map

- Attributes in kebab-case: `default-value`, `icon-right`. Booleans by presence (`"false"` is false), numbers as text.
- Arrays and objects as properties (`table.rows = [...]`) or JSON in the attribute (`items='["Day","Week"]'`).
- Callbacks are DOM events: `onChange` → `change`, `onDecide` → `decide`, with the argument in `event.detail` (an array when there are several).
- Content is `children`; `slot="action"` fills the `action` prop, `slot="panels:Overview"` a tab panel.
- `<tf-provider kit="pro" theme="dark">`, or `data-kit` and `data-theme` on `<html>`.

The [guide](https://ui.twentyfirst.media/halo/html/) has the details and examples for every framework.

## What you get

- `dist/elements.js`: ESM, React and the components bundled, minified.
- `dist/elements.global.js`: the same for a classic `<script>`.
- `dist/elements.d.ts`: types, including `HTMLElementTagNameMap`, so `querySelector("tf-tabs")` is typed.
- `dist/custom-elements.json`: a Custom Elements Manifest for editor autocompletion; `dist/vscode.html-custom-data.json` for VS Code's `html.customData`.

No shadow DOM, no telemetry and no network requests from the components.

## License

[MIT](https://github.com/twentyfirstmedia/ui/blob/main/LICENSE) © Twentyfirst Media. Bundles React and ReactDOM (MIT).
