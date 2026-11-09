/**
 * The generic wrapper: a custom element that renders one ui-core component with React.
 *
 * - No shadow DOM: the kit CSS is global. The element itself is `display: contents`.
 * - Props come from attributes (converted by the prop's kind), from JS properties, and from the
 *   element's content: light-DOM children become `children`, children with `slot="action"` become
 *   the `action` prop. The original nodes are moved into the rendered component, so nested tf-*
 *   elements, listeners and framework bindings on them keep working.
 * - Callbacks become DOM events: `onDecide(key, text)` → `decide` with `detail: [key, text]`.
 * - A top-level element owns a React root. A tf-* element inside another one renders through a
 *   portal in its parent's tree, so React context (Form validation, UIProvider) reaches it.
 * - Moving an element (disconnect and connect in the same task) keeps its state; it unmounts only
 *   when it is still disconnected a microtask later.
 */
import { useTrap } from "@twentyfirstmedia/ui-core";
import {
  createElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { fromAttribute, isSyntheticEvent, normalizeArg, parseStyle } from "./convert.js";
import { camel, kebab, type ElementDef, type EventDef, type PropDef } from "./registry-types.js";

type AnyComponent = ComponentType<Record<string, unknown>>;
type AnyFn = (...args: unknown[]) => unknown;

/** Events this package dispatched (everything else of the same type is the inner DOM's). */
const OURS = new WeakSet<Event>();
/** Global attributes with side effects on the host (tooltip, ARIA role, language): taken as props. */
const STRIP = new Set(["title", "role", "lang"]);
/** Host properties that keep their native meaning even when a component has a prop of that name. */
const NATIVE = new Set([
  "id",
  "slot",
  "hidden",
  "children",
  "className",
  "style",
  "dir",
  "inert",
  "autofocus",
  "tabIndex",
  "accessKey",
  "draggable",
  "translate",
  "spellcheck",
  "contentEditable",
  "nonce",
  "part",
  "popover",
  "innerHTML",
  "textContent",
]);
const MOUNT_TAG = "tf-root";

let uid = 0;

interface SlotHandle {
  owner: TfElement;
  rescan(): void;
  release(el: TfElement): void;
}
interface SlotHost extends HTMLElement {
  __tfSlot?: SlotHandle;
}

/** Nearest tf-* element above `node`. */
function ownerOf(node: Node): TfElement | null {
  for (let n = node.parentNode; n; n = n.parentNode) if (n instanceof TfElement) return n;
  return null;
}
/** Nearest slot of `owner` above `node`; "stash" when the node waits in the owner's stash. */
function slotOf(node: Node, owner: TfElement): SlotHandle | "stash" | null {
  for (let n = node.parentNode; n && n !== owner; n = n.parentNode) {
    if (n === owner._stash) return "stash";
    const h = (n as SlotHost).__tfSlot;
    if (h) return h.owner === owner ? h : null;
  }
  return null;
}
/** Elements and text; not comments (framework anchors) or the whitespace between tags. */
const meaningful = (n: Node) =>
  n.nodeType === Node.ELEMENT_NODE ||
  (n.nodeType === Node.TEXT_NODE && !/^\s*\n\s*$/.test(n.nodeValue ?? "") && n.nodeValue !== "");

// ── React side ──

/** Renders an element's component; re-renders when the element's props change. */
function Host({ el }: { el: TfElement }): ReactNode {
  useSyncExternalStore(el._subscribe, el._snapshot, el._snapshot);
  useLayoutEffect(() => {
    el._sweep();
  });
  return el._view();
}

/**
 * Where original light-DOM nodes go: a `display: contents` span the nodes are moved into. tf-*
 * elements among them render through portals from here, inside the owner's React tree.
 */
function Slot({ owner, nodes }: { owner: TfElement; nodes: Node[] }): ReactNode {
  const ref = useRef<SlotHost>(null);
  const [nested, setNested] = useState<TfElement[]>([]);
  const handle = useMemo<SlotHandle>(() => {
    let current: TfElement[] = [];
    const h: SlotHandle = {
      owner,
      rescan() {
        const span = ref.current;
        if (!span || !span.isConnected) return;
        const found: TfElement[] = [];
        for (const x of span.querySelectorAll("*"))
          if (x instanceof TfElement && ownerOf(x) === owner && x.isConnected) found.push(x);
        for (const x of found) if (x._slot !== h) x._enterPortal(h);
        for (const x of current) if (!found.includes(x) && x._slot === h) x._leave();
        if (found.length !== current.length || found.some((x, i) => x !== current[i])) {
          current = found;
          setNested(found);
        }
      },
      release(el) {
        if (!current.includes(el)) return;
        current = current.filter((x) => x !== el);
        setNested(current);
      },
    };
    return h;
  }, [owner]);
  useLayoutEffect(() => {
    const span = ref.current;
    if (!span) return;
    span.__tfSlot = handle;
    const inOrder =
      span.childNodes.length === nodes.length && nodes.every((n, i) => span.childNodes[i] === n);
    if (!inOrder) for (const n of nodes) span.appendChild(n);
    let queued = false;
    const later = () => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => {
        queued = false;
        handle.rescan();
      });
    };
    later();
    const mo = new MutationObserver((records) => {
      for (const r of records)
        for (const list of [r.addedNodes, r.removedNodes])
          for (const n of list)
            if (
              n instanceof Element &&
              (n instanceof TfElement || n.querySelector(TfElement.selector))
            )
              return later();
    });
    mo.observe(span, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      // content of a slot that closed (a popover) goes back to the stash, so ids still resolve
      queueMicrotask(() => owner._sweep());
    };
  }, [nodes, handle, owner]);
  return createElement(
    "span",
    { ref, "data-tf-slot": "", style: { display: "contents" } },
    nested.map((x) =>
      x._mount ? createPortal(createElement(Host, { el: x }), x._mount, x._mountKey) : null,
    ),
  );
}

/** Modal as a real dialog: fixed over the page, focus trapped, Escape and the backdrop close it. */
function DialogFrame({
  onClose,
  children,
}: {
  onClose: (() => void) | undefined;
  children?: ReactNode;
}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  useTrap(ref, onClose);
  // fields passed in as tf-* elements render a moment later (portals): focus the first one then
  useEffect(() => {
    const t = setTimeout(() => {
      const root = ref.current;
      const field = root?.querySelector<HTMLElement>(
        '[autofocus], input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]), textarea, select',
      );
      const active = document.activeElement;
      const typing =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement;
      if (root && field && !(typing && root.contains(active))) field.focus();
    }, 30);
    return () => clearTimeout(t);
  }, []);
  return createElement(
    "div",
    {
      ref,
      "data-tf-dialog": "",
      style: { position: "fixed", inset: 0, zIndex: 85, overflowY: "auto" },
      onClick: (e: { target: EventTarget | null }) => {
        if (e.target instanceof Element && e.target.classList.contains("tf-backdrop")) onClose?.();
      },
    },
    children,
  );
}

// ── the element ──

export class TfElement extends HTMLElement {
  /** Set per element class by define(). */
  static def: ElementDef;
  static component: AnyComponent;
  /** Selector for every tf-* element (set by defineElements). */
  static selector = "tf-provider";

  readonly _key = `tf${(++uid).toString(36)}`;
  /** Current prop values (attributes and properties; the last write wins). */
  readonly _values = new Map<string, unknown>();
  /** Functions set as properties (render functions, `onVerify` that returns a value …). */
  readonly _fns = new Map<string, AnyFn>();
  /** Light-DOM content by slot (`children`, `action`, `panels:Overview`), read on first render. */
  _slots: Map<string, Node[]> | null = null;
  _views = new Map<string, ReactNode>();
  _root: Root | null = null;
  /** Container React renders into (a fresh one per root or portal). */
  _mount: HTMLElement | null = null;
  _mountKey = "";
  /** The slot this element renders from (portal mode), or null. */
  _slot: SlotHandle | null = null;
  /**
   * Hidden container for content no slot renders right now (closed popover, hidden modal): it
   * stays in the document, so `getElementById` and listeners keep working.
   */
  _stash: HTMLElement | null = null;
  _rendered = false;
  private _version = 0;
  private readonly _subs = new Set<() => void>();
  private readonly _listeners = new Map<string, Set<unknown>>();
  private readonly _callbacks = new Map<string, AnyFn>();
  private _closeFn: (() => void) | undefined;
  private readonly _stripping = new Set<string>();
  private _waiting = false;
  private _observer: MutationObserver | null = null;

  constructor() {
    super();
    const def = this._def;
    // Native events of the component's own controls (an <input>'s `change`, a <form>'s `submit`)
    // stay inside: the element dispatches its own event of that type, with a detail.
    for (const ev of def.events)
      if (ev.type !== "click")
        HTMLElement.prototype.addEventListener.call(this, ev.type, (e: Event) => {
          if (!OURS.has(e) && e.target !== this && this._isOwnDom(e.target))
            e.stopImmediatePropagation();
        });
    if (def.closeChildren) {
      // a menu inside a popover closes it; counts as a listener, so the menu passes `onClose`
      const close = (e: Event) => {
        if (e.target !== this && OURS.has(e)) this._closeFn?.();
      };
      HTMLElement.prototype.addEventListener.call(this, "close", close);
      this._listeners.set("close", new Set([close]));
    }
    // properties set before the element was defined shadow the accessors: re-apply them
    const self = this as unknown as Record<string, unknown>;
    for (const name of [...def.props.map((p) => p.name), ...def.events.map((e) => e.prop)])
      if (!NATIVE.has(name) && Object.prototype.hasOwnProperty.call(this, name)) {
        const v = self[name];
        delete self[name];
        self[name] = v;
      }
  }

  get _def(): ElementDef {
    return (this.constructor as typeof TfElement).def;
  }

  // ── lifecycle ──
  connectedCallback(): void {
    if (this._waiting) return;
    if (document.readyState === "loading") {
      // a classic script in <head>: the content is not parsed yet
      this._waiting = true;
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          this._waiting = false;
          this._attach();
        },
        { once: true },
      );
    } else queueMicrotask(() => this._attach());
  }

  disconnectedCallback(): void {
    queueMicrotask(() => {
      if (!this.isConnected) this._leave();
    });
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    // our own removal of a stripped attribute (the reaction may run later, or with others)
    if (value === null && this._stripping.delete(name)) return;
    const def = this._def;
    const p = def.byAttr.get(name);
    if (p) {
      const v = fromAttribute(p, value);
      if (v === undefined) this._values.delete(p.name);
      else this._values.set(p.name, v);
      if (STRIP.has(name) && value !== null) {
        this._stripping.add(name);
        this.removeAttribute(name);
      }
    }
    this._bump();
  }

  /** Decides how to render: inside the nearest tf-* parent (portal) or with an own root. */
  _attach(): void {
    if (!this.isConnected) return;
    const owner = ownerOf(this);
    if (owner) {
      const slot = slotOf(this, owner);
      // waiting in the stash (closed popover, hidden modal): nothing to render
      if (slot === "stash") return;
      if (slot) {
        if (this._slot !== slot) slot.rescan();
        return;
      }
      // the parent has not rendered yet: it adopts this element when it does
      if (!owner._rendered) return;
    }
    if (this._root) return;
    this._leave();
    this._prepare();
    const mount = this._newMount();
    const root = createRoot(mount, { identifierPrefix: `${this._key}-` });
    this._root = root;
    flushSync(() => root.render(createElement(Host, { el: this })));
  }

  /** Stops rendering (own root unmounted, or the portal dropped from the parent's slot). */
  _leave(): void {
    const root = this._root;
    const slot = this._slot;
    this._root = null;
    this._slot = null;
    this._mount?.remove();
    this._mount = null;
    if (root) root.unmount();
    slot?.release(this);
  }

  /** Called by a parent's slot: render through its portal from now on. */
  _enterPortal(slot: SlotHandle): void {
    this._leave();
    this._prepare();
    this._newMount();
    this._slot = slot;
  }

  private _newMount(): HTMLElement {
    const m = document.createElement(MOUNT_TAG);
    m.style.display = "contents";
    this._mount = m;
    this._mountKey = `${this._key}-${(++uid).toString(36)}`;
    this.appendChild(m);
    return m;
  }

  /** Reads the light DOM once: children by slot. Later direct additions are picked up too. */
  _prepare(): void {
    if (this._slots) return;
    this._slots = new Map();
    for (const n of [...this.childNodes]) this._take(n);
    this._observer = new MutationObserver((records) => {
      if (this._mount && this._mount.parentNode !== this) {
        // the content was replaced (`el.textContent = …`): start over with the new content
        this._slots = null;
        this._views.clear();
        this._observer?.disconnect();
        this._leave();
        this._attach();
        return;
      }
      let changed = false;
      for (const r of records)
        for (const n of r.addedNodes) if (n.parentNode === this) changed = this._take(n) || changed;
      if (changed) {
        this._views.clear();
        this._bump();
      }
    });
    this._observer.observe(this, { childList: true });
  }

  private _take(n: Node): boolean {
    if (n === this._mount || n === this._stash) return false;
    if (n instanceof Element && n.localName === MOUNT_TAG) return false;
    // comments and formatting whitespace stay where they are (frameworks anchor to comments)
    if (!meaningful(n)) return false;
    const raw = n instanceof Element ? n.getAttribute("slot") : null;
    let key = "children";
    if (raw) {
      const i = raw.indexOf(":");
      const prop = camel(i < 0 ? raw : raw.slice(0, i));
      key = i < 0 ? prop : `${prop}:${raw.slice(i + 1)}`;
    }
    // a new array, so the slot sees the change
    this._slots?.set(key, [...(this._slots.get(key) ?? []), n]);
    return true;
  }

  /** Slot nodes that no rendered slot took (a closed popover, a hidden element) wait in the stash. */
  _sweep(): void {
    this._rendered = true;
    if (!this._slots) return;
    for (const list of this._slots.values())
      for (const n of list)
        if (n.parentNode === this || !this.contains(n)) {
          if (!this._stash) {
            const stash = document.createElement("div");
            stash.hidden = true;
            stash.dataset.tfStash = "";
            this._stash = stash;
          }
          if (this._stash.parentNode !== this) this.appendChild(this._stash);
          this._stash.appendChild(n);
        }
  }

  /** True when `target` is part of the component's own DOM, not of content passed in. */
  private _isOwnDom(target: EventTarget | null): boolean {
    for (let n = target as Node | null; n && n !== this; n = n.parentNode)
      if ((n as SlotHost).__tfSlot?.owner === this) return false;
    return true;
  }

  // ── store for React ──
  readonly _subscribe = (fn: () => void): (() => void) => {
    this._subs.add(fn);
    return () => this._subs.delete(fn);
  };
  readonly _snapshot = (): number => this._version;
  _bump(): void {
    this._version++;
    for (const fn of this._subs) fn();
  }

  // ── listeners decide which optional callbacks are passed ──
  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    if (!listener) return;
    super.addEventListener(type, listener, options);
    let set = this._listeners.get(type);
    if (!set) this._listeners.set(type, (set = new Set()));
    const first = set.size === 0;
    set.add(listener);
    if (first) this._bumpTree(type);
  }

  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void {
    if (!listener) return;
    super.removeEventListener(type, listener, options);
    const set = this._listeners.get(type);
    if (set?.delete(listener) && set.size === 0) this._bumpTree(type);
  }

  /**
   * Someone listens for `type` here (a listener, an `on…` handler, Svelte's delegated `__type`
   * handler) or on a tf-* element above.
   */
  _listens(type: string): boolean {
    const own = (el: TfElement) => {
      const props = el as unknown as Record<string, unknown>;
      return (
        !!el._listeners.get(type)?.size ||
        el.hasAttribute(`on${type}`) ||
        typeof props[`on${type}`] === "function" ||
        typeof props[`__${type}`] === "function"
      );
    };
    if (own(this)) return true;
    for (let n = ownerOf(this); n; n = ownerOf(n)) if (own(n)) return true;
    return false;
  }

  private _bumpTree(type: string): void {
    if (this._def.byType.get(type)?.conditional) this._bump();
    for (const x of this.querySelectorAll(TfElement.selector))
      if (x instanceof TfElement && x._def.byType.get(type)?.conditional) x._bump();
  }

  // ── props ──
  /** The element's content for a slot, as React nodes. */
  private _slotView(key: string, list: boolean): ReactNode {
    const cacheKey = `${key}|${list ? 1 : 0}`;
    if (this._views.has(cacheKey)) return this._views.get(cacheKey);
    const nodes = this._slots?.get(key);
    let view: ReactNode = undefined;
    if (nodes?.length)
      view =
        nodes.length === 1 && !list
          ? createElement(Slot, { owner: this, nodes })
          : nodes.map((n, i) => createElement(Slot, { key: i, owner: this, nodes: [n] }));
    this._views.set(cacheKey, view);
    return view;
  }

  private _nodeView(v: unknown): unknown {
    if (v instanceof Node) {
      let view = this._views.get(`node|${(v as { __tfKey?: string }).__tfKey ?? ""}`);
      if (!view) {
        const k = ((v as { __tfKey?: string }).__tfKey ??= `n${(++uid).toString(36)}`);
        view = createElement(Slot, { key: k, owner: this, nodes: [v] });
        this._views.set(`node|${k}`, view);
      }
      return view;
    }
    if (Array.isArray(v)) return v.map((x) => this._nodeView(x));
    return v;
  }

  private _propValue(p: PropDef): unknown {
    if (p.kind === "r" || p.kind === "R") {
      const fromSlot = this._slotView(p.name, p.kind === "R");
      if (fromSlot !== undefined) return fromSlot;
    }
    if (p.kind === "K" && this._slots) {
      let rec: Record<string, ReactNode> | undefined;
      for (const key of this._slots.keys())
        if (key.startsWith(`${p.name}:`))
          (rec ??= {})[key.slice(p.name.length + 1)] = this._slotView(key, false);
      if (rec) return { ...(this._values.get(p.name) as object | undefined), ...rec };
    }
    if (p.kind === "f") return this._fns.get(p.name);
    const v = this._values.get(p.name);
    if (v === undefined) return undefined;
    return p.kind === "r" || p.kind === "R" ? this._nodeView(v) : v;
  }

  private _callback(ev: EventDef): AnyFn {
    let cb = this._callbacks.get(ev.prop);
    if (!cb) {
      cb = (...args: unknown[]) => this._fire(ev, args);
      this._callbacks.set(ev.prop, cb);
    }
    return cb;
  }

  /** A component callback: run a function property, dispatch the event, keep controlled props in step. */
  private _fire(ev: EventDef, args: unknown[]): unknown {
    const own = this._fns.get(ev.prop);
    const result = own ? own.apply(this, args) : undefined;
    const first = args[0];
    // a native click bubbles out of the element anyway
    if (ev.type === "click" && isSyntheticEvent(first) && first.nativeEvent.type === "click")
      return result;
    const values = args.map(normalizeArg);
    const detail =
      ev.arity > 1
        ? Array.from({ length: Math.max(ev.arity, values.length) }, (_, i) => values[i])
        : values.length
          ? values[0]
          : null;
    const e = new CustomEvent(ev.type, { detail, bubbles: true, composed: true, cancelable: true });
    OURS.add(e);
    if (this.dispatchEvent(e)) this._after(ev, values[0]);
    return result;
  }

  private _after(ev: EventDef, value: unknown): void {
    const def = this._def;
    let changed = false;
    for (const s of def.sync)
      if (s.event === ev.prop && this._values.get(s.prop) !== undefined) {
        this._values.set(s.prop, s.from === "false" ? false : value);
        changed = true;
      }
    if (changed) this._bump();
    else if (def.dismiss.has(ev.prop)) this.hidden = true;
  }

  private _passes(ev: EventDef): boolean {
    if (!ev.conditional || this._fns.has(ev.prop)) return true;
    if (this._def.sync.some((s) => s.event === ev.prop && this._values.get(s.prop) !== undefined))
      return true;
    return this._listens(ev.type);
  }

  _props(): Record<string, unknown> {
    const def = this._def;
    const out: Record<string, unknown> = {};
    for (const p of def.props) {
      const v = this._propValue(p);
      if (v !== undefined) out[p.name] = v;
    }
    const kids = this._slotView("children", false);
    if (def.closeChildren)
      out.children = (s: { close: () => void }) => {
        this._closeFn = s.close;
        return kids ?? null;
      };
    else if (kids !== undefined) out.children = kids;
    const cls = this.getAttribute("class");
    if (cls) out.className = cls;
    const style = parseStyle(this.getAttribute("style"));
    if (style) out.style = style;
    for (const ev of def.events) if (this._passes(ev)) out[ev.prop] = this._callback(ev);
    return out;
  }

  _view(): ReactNode {
    if (this.hidden) return null;
    const C = (this.constructor as typeof TfElement).component;
    const props = this._props();
    const node = createElement(C, props);
    return this._def.dialog
      ? createElement(DialogFrame, { onClose: props.onClose as (() => void) | undefined }, node)
      : node;
  }
}

/** A class for one component: observed attributes and a property per prop. */
export function elementClass(def: ElementDef, component: AnyComponent): typeof TfElement {
  const attrs = [
    ...def.props.filter((p) => p.kind !== "f").map((p) => p.attr),
    ...def.events.map((e) => `on${e.type}`),
    "class",
    "style",
    "hidden",
  ];
  class Defined extends TfElement {
    static override def = def;
    static override component = component;
    static observedAttributes = [...new Set(attrs)];
  }
  const proto = Defined.prototype as unknown as Record<string, unknown>;
  const define = (name: string, get: () => unknown, set: (v: unknown) => void) => {
    if (NATIVE.has(name)) return;
    Object.defineProperty(proto, name, { configurable: true, enumerable: true, get, set });
  };
  for (const p of def.props)
    define(
      p.name,
      function (this: TfElement) {
        return p.kind === "f" ? this._fns.get(p.name) : this._values.get(p.name);
      },
      function (this: TfElement, v: unknown) {
        if (p.kind === "f") {
          if (typeof v === "function") this._fns.set(p.name, v as AnyFn);
          else this._fns.delete(p.name);
        } else if (v === undefined) this._values.delete(p.name);
        else this._values.set(p.name, v);
        this._views.clear();
        this._bump();
      },
    );
  // `el.onVerify = code => …`: a callback that returns a value
  for (const e of def.events)
    define(
      e.prop,
      function (this: TfElement) {
        return this._fns.get(e.prop);
      },
      function (this: TfElement, v: unknown) {
        if (typeof v === "function") this._fns.set(e.prop, v as AnyFn);
        else this._fns.delete(e.prop);
        this._bump();
      },
    );
  return Defined;
}

export { kebab };
