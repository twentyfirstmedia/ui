---
title: Plain HTML and other frameworks
description: "Every component as a custom element (<tf-button>, <tf-data-table> …) for plain HTML, Vue, Svelte, Angular, Astro and server templates. No React setup needed."
---

`@twentyfirstmedia/elements` turns every component into a custom element with the same props: `Button` is `<tf-button>`, `DataTable` is `<tf-data-table>`, `UIProvider` is `<tf-provider>`. React is bundled inside, so the page needs no build step and no React tooling. The elements use no shadow DOM: the {{Kit}} stylesheet styles them like everywhere else.

## From a CDN

Load the {{Kit}} CSS and the elements, then write HTML:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@twentyfirstmedia/{{kit}}/dist/styles.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@twentyfirstmedia/elements/dist/elements.js"></script>

<tf-panel title="Revenue" subtitle="Last 7 days">
  <tf-button slot="action" variant="ghost" size="sm">Export</tf-button>
  <tf-bar-chart label="Revenue per day"
    data='[{"label":"Mon","value":32},{"label":"Tue","value":48},{"label":"Wed","value":41}]'>
  </tf-bar-chart>
</tf-panel>
```

unpkg works the same way (`https://unpkg.com/@twentyfirstmedia/elements/dist/elements.js`). For a classic `<script>` without `type="module"` use `dist/elements.global.js`; it exposes `window.TwentyfirstElements` with `toast` and the `Intl` formatters. Pin a version in production, for example `@twentyfirstmedia/elements@0.1`.

Self-host when you can: the CDN is the only external request. The components themselves never load anything, and the fonts come with the stylesheet.

## From npm

```sh
npm install @twentyfirstmedia/elements @twentyfirstmedia/{{kit}}
```

```js
import "@twentyfirstmedia/{{kit}}/styles.css";
import { toast } from "@twentyfirstmedia/elements"; // defines every tf-* element
```

The `@twentyfirstmedia/{{kit}}` package is only needed for its stylesheet; the elements bring their own copy of the components and React.

## Attributes, properties, events and slots

| Component API | As an element |
| --- | --- |
| `variant="ghost"`, `size="sm"` | the same attribute |
| `defaultValue`, `iconRight` | kebab-case: `default-value`, `icon-right` |
| `disabled`, `selectable` (boolean) | present means true, absent means unset, `"false"` means false |
| `max={8}` (number) | `max="8"` |
| `items`, `columns`, `rows` (arrays, objects) | a property, `el.items = [...]`, or JSON in the attribute: `items='["Day","Week"]'`; lists of strings also take `items="Day, Week"` |
| `format`, `renderExpanded`, `onVerify` (functions) | properties only: `el.format = (v) => ...` |
| `onChange`, `onDecide`, `onClose` | DOM events `change`, `decide`, `close` (the name without `on`, lowercase) |
| `children` | the element's content: text, HTML and other tf-* elements |
| `action`, `trace`, `corner` (ReactNode props) | children with `slot="action"`; a DOM node set as a property works too |
| `actions` (a list of nodes) | every child with `slot="actions"` is one item |
| `panels` on Tabs (a record of nodes) | children with `slot="panels:Overview"` |
| `className`, `style` | the `class` and `style` attributes |

Events bubble, are composed and can be cancelled. `event.detail` holds the callback's argument, or an array when the callback takes several (`decide` gives `[key, text]`). Where a component would pass a React change event, the detail is the control's value (`checked` for switches and checkboxes).

```js
const tabs = document.querySelector("tf-tabs");
tabs.addEventListener("change", (e) => console.log("now on", e.detail));

const card = document.querySelector("tf-approval-card");
card.addEventListener("decide", (e) => {
  const [key, text] = e.detail;
  card.decision = { key, by: "Mara", at: "09:41", text };
});
```

A few rules make plain HTML pleasant:

- **Uncontrolled by default.** Without `value` or `checked`, Tabs, Segmented, Switch and friends keep their own state. Set the attribute to control them: the element then follows the user's input like a native control, unless a listener calls `event.preventDefault()`.
- **Optional callbacks follow listeners.** Some components only show a part when the callback is set, such as the dismiss button of `<tf-alert>`. The element passes those callbacks while something listens for the event on the element or a tf-* element around it.
- **Closing hides the element.** Modal, Drawer, CommandPalette and Alert set the `hidden` attribute after `close` (or `dismiss`) unless the event is cancelled. Remove `hidden` to show them again. `<tf-modal>` opens as a dialog over the page: focus moves in and stays there, Escape and the backdrop close it, and focus returns to where it was.
- **Menus close their popover.** A `<tf-menu>` inside `<tf-popover>` closes it when an item runs or on Escape.
- **Nested elements share context.** A tf-* element inside another one renders in its parent's React tree, so `<tf-text-field name="email">` inside `<tf-form>` shows the form's validation message.
- **Layout is unchanged.** Each element is `display: contents`; the component's root is the flex or grid item. The `id` attribute stays on the element, and `title`, `role` and `lang` move into the component.

Content is read when the element first renders; children added later with `append` are picked up as well. Content that is not shown at the moment (a closed popover, a hidden modal) stays in the document, inside the element, so `getElementById` keeps working.

## Toasts and helpers

```html
<tf-toaster></tf-toaster>
<script type="module">
  import { toast, formatMoney } from "https://cdn.jsdelivr.net/npm/@twentyfirstmedia/elements/dist/elements.js";
  toast({ text: `Paid ${formatMoney(1290)}`, tone: "success" });
</script>
```

## Kit switching and theming

With one kit's `styles.css` no attribute is needed. To switch between Halo and Pro at runtime, load `@twentyfirstmedia/ui-core/dist/themes.css` (both kits) and set `data-kit` on `<html>`. Theme and density work the same way in both setups:

```html
<html data-kit="{{kit}}" data-theme="system">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@twentyfirstmedia/ui-core/dist/themes.css">

<script type="module">
  document.documentElement.dataset.kit = "{{other}}";
  document.documentElement.dataset.theme = "dark";
</script>
```

`<tf-provider kit="{{kit}}" theme="dark" density="compact">` does the same declaratively; with `scope="subtree"` it applies to its content only. Every colour, radius, shadow and spacing is a CSS variable, so your own CSS can retheme the kit (see [Theming and tokens](/{{kit}}/theming/)):

```css
:root {
  --accent: var(--lilac-ink);
  --radius-lg: 12px;
}
```

## Vue

Tell the compiler that `tf-*` tags are custom elements. Vue binds arrays and objects as properties and listens with `@`:

```js
// vite.config.js
import vue from "@vitejs/plugin-vue";
export default {
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("tf-") } } })],
};
```

```html
<script setup>
import "@twentyfirstmedia/elements";
import { ref } from "vue";
const tab = ref("Overview");
</script>

<template>
  <tf-tabs :items="['Overview', 'Activity']" :value="tab" @change="tab = $event.detail" />
</template>
```

## Svelte

```html
<script>
  import "@twentyfirstmedia/elements";
  let checked = $state(false);
</script>

<tf-switch checked={checked} onchange={(e) => (checked = e.detail)}>Email me updates</tf-switch>
<tf-data-table columns={columns} rows={rows} selectable></tf-data-table>
```

## Angular

Allow custom elements in the component and bind properties with `[ ]` and events with `( )`:

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "@twentyfirstmedia/elements";

@Component({
  selector: "app-team",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <tf-tabs [items]="tabs" (change)="onTab($event)"></tf-tabs>
    <tf-data-table [columns]="columns" [rows]="rows" selectable></tf-data-table>
  `,
})
export class TeamComponent {
  tabs = ["Members", "Invites"];
  tab = "Members";
  columns = [{ key: "name", label: "Name" }];
  rows = [{ id: 1, name: "Ava Vogel" }];
  onTab(e: Event) {
    this.tab = (e as CustomEvent<string>).detail;
  }
}
```

## Astro, Rails, Django and other server templates

Render the tags on the server and load the elements once in the layout. Pass data as JSON in attributes:

```html
---
// Astro
const items = ["Overview", "Activity"];
---
<tf-tabs items={JSON.stringify(items)}></tf-tabs>
<script>
  import "@twentyfirstmedia/elements";
</script>
```

```html
<!-- Django: escape the JSON for the attribute -->
<tf-bar-chart label="Signups" data="{{ signups_json }}"></tf-bar-chart>
```

## Static markup with the kit classes

For markup that needs no behaviour, the kit classes work without any script: the stylesheet alone is enough.

```html
<section class="tf-panel">
  <div class="tf-row">
    <button class="tf-btn tf-btn-primary" type="button">Save</button>
    <button class="tf-btn tf-btn-ghost" type="button">Cancel</button>
    <span class="tf-badge tf-badge-success"><span class="tf-badge-dot"></span>Live</span>
  </div>
</section>
```

Interactive components (tabs, menus, dialogs, tables) need the elements for their keyboard paths and ARIA.

## Editor support and types

The package ships a Custom Elements Manifest (`custom-elements.json`) for autocompletion of tags, attributes, events and slots, and VS Code HTML data:

```json
{ "html.customData": ["./node_modules/@twentyfirstmedia/elements/dist/vscode.html-custom-data.json"] }
```

In TypeScript, `document.querySelector("tf-data-table")` is typed with every property of `DataTable`.
