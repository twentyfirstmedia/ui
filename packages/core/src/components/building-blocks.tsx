"use client";

import * as React from "react";
import { cx } from "../cx.js";
import { useControlled, useOutside } from "../hooks.js";
import { Icon } from "../Icon.js";
import { Menu } from "./feedback.js";
import type {
  CollapsibleProps,
  ContextMenuProps,
  InlineEditProps,
  KbdProps,
  KeyValueProps,
  SpinnerProps,
  SplitPaneProps,
  TreeItem,
  TreeViewProps,
} from "./types.js";

/* ── Foundations ── */
export function Kbd(p: KbdProps) {
  const keys = p.keys || [p.children];
  return (
    <span className="tf-kbds">
      {keys.map((k, i) => (
        <kbd key={i} className="tf-kbd2">
          {k}
        </kbd>
      ))}
    </span>
  );
}
export function KeyValue(p: KeyValueProps) {
  return (
    <dl className={cx("tf-kv", p.dense && "dense", p.className)}>
      {(p.items || []).map((it, i) => {
        const r = Array.isArray(it)
          ? {
              k: it[0],
              v: it[1],
              mono: it[2],
            }
          : it;
        return (
          <div key={i}>
            <dt>{r.k}</dt>
            <dd className={r.mono ? "tf-mono" : undefined}>
              {r.v == null || r.v === "" ? <span className="tf-kv-empty">—</span> : r.v}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
export function Spinner(p: SpinnerProps) {
  return (
    <span
      className={cx("tf-spinner", p.size === "lg" && "lg")}
      role="status"
      aria-label={p.label || "Loading"}
    />
  );
}
export function Collapsible(p: CollapsibleProps) {
  const o = useControlled(p.open, !!p.defaultOpen, p.onOpenChange);
  return (
    <div className={cx("tf-collapse", o[0] && "open", p.className)}>
      <button
        type="button"
        className="tf-collapse-head"
        aria-expanded={o[0]}
        onClick={() => {
          o[1](!o[0]);
        }}
      >
        <Icon name="chevronRight" size={14} className="tf-collapse-chev" />
        <b>{p.title}</b>
        {p.meta && <span className="tf-collapse-meta">{p.meta}</span>}
      </button>
      {o[0] && <div className="tf-collapse-body tf-in">{p.children}</div>}
    </div>
  );
}
export function ContextMenu(p: ContextMenuProps) {
  const pos = React.useState<{
      x: number;
      y: number;
    } | null>(null),
    ref = React.useRef<HTMLDivElement>(null),
    lp = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useOutside(ref, !!pos[0], () => {
    pos[1](null);
  });
  function openAt(x: number, y: number) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    pos[1]({
      x: x - r.left,
      y: y - r.top,
    });
  }
  return (
    <div
      ref={ref}
      className="tf-ctx"
      onContextMenu={(e) => {
        e.preventDefault();
        openAt(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (!t) return;
        lp.current = setTimeout(() => {
          openAt(t.clientX, t.clientY);
        }, 500);
      }}
      onTouchEnd={() => {
        clearTimeout(lp.current);
      }}
    >
      {p.children}
      {pos[0] && (
        <div
          className="tf-ctx-menu"
          style={{
            left: pos[0].x,
            top: pos[0].y,
          }}
        >
          <Menu
            items={(p.items || []).map((it) =>
              it === "-"
                ? it
                : Object.assign({}, it, {
                    onClick: () => {
                      pos[1](null);
                      it.onClick && it.onClick();
                    },
                  }),
            )}
          />
        </div>
      )}
    </div>
  );
}
export function SplitPane(p: SplitPaneProps) {
  const key = p.storageKey && "tf-split-" + p.storageKey;
  let init = p.defaultSize || 360;
  try {
    const saved = key ? localStorage.getItem(key) : null;
    if (saved) init = +saved;
  } catch {
    /* storage unavailable */
  }
  const size = React.useState(init),
    wrap = React.useRef<HTMLDivElement>(null),
    drag = React.useRef(false);
  function set(v: number) {
    v = Math.max(p.min || 200, Math.min(p.max || 720, v));
    size[1](v);
    try {
      if (key) localStorage.setItem(key, String(v));
    } catch {
      /* storage unavailable */
    }
  }
  React.useEffect(() => {
    function mv(e: PointerEvent) {
      if (!drag.current || !wrap.current) return;
      const r = wrap.current.getBoundingClientRect();
      set(e.clientX - r.left);
    }
    function up() {
      drag.current = false;
      document.body.style.cursor = "";
    }
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
    };
  }, []);
  return (
    <div
      ref={wrap}
      className={cx("tf-split", p.className)}
      style={
        {
          "--split": size[0] + "px",
        } as React.CSSProperties
      }
    >
      <div className="tf-split-a">{p.left}</div>
      <div
        className="tf-split-handle"
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={size[0]}
        tabIndex={0}
        onPointerDown={(e) => {
          e.preventDefault();
          drag.current = true;
          document.body.style.cursor = "col-resize";
        }}
        onDoubleClick={() => {
          set(p.defaultSize || 360);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") set(size[0] - 16);
          if (e.key === "ArrowRight") set(size[0] + 16);
        }}
      />
      <div className="tf-split-b">{p.right}</div>
    </div>
  );
}
export function TreeView(p: TreeViewProps) {
  const open = React.useState(p.defaultOpen || []),
    sel = useControlled(p.selected, undefined, p.onSelect);
  function node(n: TreeItem, depth: number): React.ReactNode {
    const kids = n.children && n.children.length,
      isOpen = open[0].indexOf(n.id) > -1;
    return (
      <li
        key={n.id}
        role="treeitem"
        aria-expanded={kids ? isOpen : undefined}
        aria-selected={sel[0] === n.id}
      >
        <div
          className={cx("tf-tree-row", sel[0] === n.id && "on")}
          style={{
            paddingLeft: 8 + depth * 16,
          }}
          tabIndex={0}
          onClick={() => {
            sel[1](n.id);
            if (kids) open[1](isOpen ? open[0].filter((x) => x !== n.id) : open[0].concat([n.id]));
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" && kids && !isOpen) open[1](open[0].concat([n.id]));
            if (e.key === "ArrowLeft" && isOpen) open[1](open[0].filter((x) => x !== n.id));
            if (e.key === "Enter") sel[1](n.id);
          }}
        >
          {kids ? (
            <Icon name="chevronRight" size={13} className={cx("tf-tree-chev", isOpen && "open")} />
          ) : (
            <span className="tf-tree-sp" />
          )}
          {n.icon && <Icon name={n.icon} size={15} />}
          <span className="tf-tree-label">{n.label}</span>
          {n.meta != null && <span className="tf-tree-meta">{n.meta}</span>}
        </div>
        {kids && isOpen && <ul role="group">{n.children?.map((c) => node(c, depth + 1))}</ul>}
      </li>
    );
  }
  return (
    <ul className="tf-tree" role="tree" aria-label={p.label}>
      {(p.items || []).map((n) => node(n, 0))}
    </ul>
  );
}
export function InlineEdit(p: InlineEditProps) {
  const ed = React.useState(false),
    v = React.useState(p.value);
  function save() {
    ed[1](false);
    if (v[0] !== p.value) p.onSave && p.onSave(v[0]);
  }
  if (!ed[0])
    return (
      <span
        className={cx("tf-inline", p.mono && "tf-mono", p.align === "right" && "right")}
        tabIndex={0}
        role="button"
        aria-label={p.label}
        onDoubleClick={() => {
          v[1](p.value);
          ed[1](true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            v[1](p.value);
            ed[1](true);
          }
        }}
      >
        {p.display ? p.display(p.value) : p.value}
        <Icon name="edit" size={12} className="tf-inline-ico" />
      </span>
    );
  return p.options ? (
    <select
      className="tf-input tf-inline-input"
      autoFocus
      value={v[0]}
      onChange={(e) => {
        v[1](e.target.value);
      }}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") ed[1](false);
      }}
    >
      {p.options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  ) : (
    <input
      className={cx("tf-input tf-inline-input", p.mono && "tf-mono")}
      autoFocus
      value={v[0]}
      type={p.type || "text"}
      onChange={(e) => {
        v[1](e.target.value);
      }}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") ed[1](false);
      }}
    />
  );
}
