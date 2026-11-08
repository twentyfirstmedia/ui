/**
 * @twentyfirstmedia/elements: every Twentyfirst UI component as a custom element (`<tf-button>`,
 * `<tf-data-table>` …) for plain HTML and any framework. Importing this module defines them all.
 */
import * as core from "@twentyfirstmedia/ui-core";
import type { ComponentType } from "react";
import { elementClass, TfElement } from "./element.js";
import { DEFS } from "./generated/registry.js";
import { parseDef } from "./registry-types.js";

export {
  toast,
  formatDate,
  formatMoney,
  formatNumber,
  formatPercent,
} from "@twentyfirstmedia/ui-core";

declare const __VERSION__: string;
export const VERSION: string = typeof __VERSION__ === "string" ? __VERSION__ : "0.0.0";

/** Tag name → component name. */
export const ELEMENTS: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(DEFS.map((d) => [d.t, d.c])),
);

const TAGS = DEFS.map((d) => d.t);

let styled = false;
/** The elements are transparent to layout: the component's root is the flex or grid item. */
function styles(): void {
  if (styled) return;
  styled = true;
  const tags = TAGS.join(",");
  const css = `:where(${tags},tf-root){display:contents}:where(${tags})[hidden]{display:none}`;
  try {
    // a constructed sheet also works under a strict Content-Security-Policy
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } catch {
    const style = document.createElement("style");
    style.dataset.tfElements = "";
    style.textContent = css;
    document.head.prepend(style);
  }
}

/** Defines every tf-* element. Runs on import; calling it again is harmless. */
export function defineElements(): void {
  if (typeof window === "undefined" || typeof customElements === "undefined") return;
  TfElement.selector = TAGS.join(",");
  styles();
  const lib = core as unknown as Record<string, unknown>;
  for (const raw of DEFS) {
    if (customElements.get(raw.t)) continue;
    const component = lib[raw.c];
    if (typeof component !== "function") continue;
    customElements.define(
      raw.t,
      elementClass(parseDef(raw), component as ComponentType<Record<string, unknown>>),
    );
  }
}

defineElements();
