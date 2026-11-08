/**
 * The element registry (src/generated/registry.ts, written by scripts/generate.ts) in a compact
 * form, and its parsed shape.
 *
 * Prop kinds: b boolean · n number · s string · x number or string · r node (slot) · R node list
 * (slot) · K record of nodes (`slot="prop:key"`) · d date · j JSON · f function (property only).
 * Flags after the kind: `?` "null" means null · `!` "false" means false · `l` JSON or a
 * comma-separated list · `t` ISO dates become Date objects.
 */
export interface RawDef {
  /** Tag name. */
  t: string;
  /** Component export of ui-core. */
  c: string;
  /** Props as `name:kind` separated by spaces. */
  p: string;
  /** Callbacks as `onName:arity` (`?` after the arity: only passed while someone listens). */
  e?: string;
  /** Controlled props that follow their callback: `onChange:value:detail`, `onClose:open:false`. */
  s?: string;
  /** Callbacks after which the element hides itself (`hidden`) unless the event was cancelled. */
  x?: string;
  /** Rendered as a dialog: fixed over the page, focus trapped, Escape and the backdrop close it. */
  dialog?: 1;
  /** `children` may be a function of `{ close }`: a `close` event from inside closes it. */
  close?: 1;
}

export interface PropDef {
  name: string;
  attr: string;
  kind: string;
  flags: string;
}
export interface EventDef {
  /** Callback prop, e.g. `onChange`. */
  prop: string;
  /** DOM event type, e.g. `change`. */
  type: string;
  arity: number;
  conditional: boolean;
}
export interface SyncDef {
  event: string;
  prop: string;
  from: "detail" | "false";
}
export interface ElementDef {
  tag: string;
  component: string;
  props: PropDef[];
  byAttr: Map<string, PropDef>;
  byName: Map<string, PropDef>;
  events: EventDef[];
  byType: Map<string, EventDef>;
  sync: SyncDef[];
  dismiss: Set<string>;
  dialog: boolean;
  closeChildren: boolean;
}

export function kebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}
export function camel(name: string): string {
  return name.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

const words = (s: string | undefined) => (s ? s.split(" ").filter(Boolean) : []);

export function parseDef(raw: RawDef): ElementDef {
  const props = words(raw.p).map((w) => {
    const [name = "", spec = "j"] = w.split(":");
    return { name, attr: kebab(name), kind: spec.charAt(0), flags: spec.slice(1) };
  });
  const events = words(raw.e).map((w) => {
    const [prop = "", spec = "0"] = w.split(":");
    return {
      prop,
      type: prop.slice(2).toLowerCase(),
      arity: parseInt(spec, 10) || 0,
      conditional: spec.endsWith("?"),
    };
  });
  const sync = words(raw.s).map((w) => {
    const [event = "", prop = "", from = "detail"] = w.split(":");
    return { event, prop, from: from === "false" ? ("false" as const) : ("detail" as const) };
  });
  return {
    tag: raw.t,
    component: raw.c,
    props,
    byAttr: new Map(props.map((p) => [p.attr, p])),
    byName: new Map(props.map((p) => [p.name, p])),
    events,
    byType: new Map(events.map((e) => [e.type, e])),
    sync,
    dismiss: new Set(words(raw.x)),
    dialog: !!raw.dialog,
    closeChildren: !!raw.close,
  };
}
