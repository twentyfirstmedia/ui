"use client";
/**
 * SelectMenu: a styled select. The button shows the choice; the list opens below with groups,
 * icons and hints. Keyboard: ↑/↓/Enter/Space open, arrows move, Home/End, typeahead, Enter
 * picks, Escape closes. Inside a Form it submits under `name` and shows its message.
 */
import * as React from "react";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { useControlled, useId } from "../hooks.js";
import { useFieldError } from "./form.js";
import { Popover } from "./overlays.js";
import type { SelectMenuOption, SelectMenuProps } from "./types.js";

const norm = (o: string | SelectMenuOption): SelectMenuOption =>
  typeof o === "string" ? { value: o, label: o } : o;

export function SelectMenu(p: SelectMenuProps) {
  const uid = useId("sel");
  const id = p.id || uid;
  const fromForm = useFieldError(p.name);
  const error = p.error || fromForm;
  const opts = (p.options || []).map(norm);
  const v = useControlled(p.value, p.defaultValue ?? "", p.onChange);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const btn = React.useRef<HTMLButtonElement>(null);
  const list = React.useRef<HTMLDivElement>(null);
  const hidden = React.useRef<HTMLInputElement>(null);
  const typed = React.useRef({ s: "", t: 0 });
  const cur = opts.find((o) => o.value === v[0]);
  const enabled = opts.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  const show = (at?: number) => {
    setActive(at ?? Math.max(0, opts.indexOf(cur as SelectMenuOption)));
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  };
  const pick = (i: number) => {
    const o = opts[i];
    if (!o || o.disabled) return;
    v[1](o.value);
    close();
    // let a surrounding Form re-check the field
    requestAnimationFrame(() =>
      hidden.current?.dispatchEvent(new Event("change", { bubbles: true })),
    );
  };
  const step = (dir: 1 | -1) => {
    const pos = enabled.indexOf(active);
    const next = enabled[Math.min(enabled.length - 1, Math.max(0, pos + dir))];
    if (next != null) setActive(next);
  };
  const find = (key: string) => {
    const now = Date.now();
    typed.current = { s: (now - typed.current.t < 600 ? typed.current.s : "") + key, t: now };
    const q = typed.current.s.toLowerCase();
    return opts.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(q));
  };
  React.useEffect(() => {
    if (open) list.current?.focus();
  }, [open]);
  React.useEffect(() => {
    if (!open || active < 0) return;
    list.current
      ?.querySelector(`#${CSS.escape(`${uid}-o${active}`)}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active, uid]);

  const groups: [string | undefined, number[]][] = [];
  opts.forEach((o, i) => {
    const last = groups[groups.length - 1];
    if (last && last[0] === o.group) last[1].push(i);
    else groups.push([o.group, [i]]);
  });

  return (
    <div className={cx("tf-field", p.className)} style={p.style}>
      {p.label && (
        <label className="tf-field-label" htmlFor={id} id={`${id}-label`}>
          {p.label}
          {p.required && (
            <span className="tf-req" aria-hidden>
              {" *"}
            </span>
          )}
        </label>
      )}
      <Popover
        block
        open={open}
        onOpenChange={(o) => (o ? show() : close(false))}
        role="presentation"
        flush
        trigger={() => (
          <button
            ref={btn}
            id={id}
            type="button"
            className={cx("tf-input", "tf-selectmenu", !cur && "empty")}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${uid}-list`}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error || p.hint ? `${id}-msg` : undefined}
            disabled={p.disabled}
            onClick={() => (open ? close() : show())}
            onKeyDown={(e) => {
              if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
                e.preventDefault();
                show();
              } else if (e.key.length === 1 && /\S/.test(e.key)) {
                const i = find(e.key);
                if (i >= 0) v[1](opts[i]?.value as string);
              }
            }}
          >
            {cur?.icon && <Icon name={cur.icon} size={15} />}
            <span className="tf-selectmenu-value">
              {cur ? cur.label : p.placeholder || "Select…"}
            </span>
            <Icon name="chevronDown" size={16} className="tf-selectmenu-chev" />
          </button>
        )}
      >
        <div
          ref={list}
          id={`${uid}-list`}
          className="tf-selectmenu-list"
          role="listbox"
          tabIndex={-1}
          aria-labelledby={p.label ? `${id}-label` : undefined}
          aria-label={p.label ? undefined : p.placeholder || "Options"}
          aria-activedescendant={active >= 0 ? `${uid}-o${active}` : undefined}
          onKeyDown={(e) => {
            const keys: Record<string, () => void> = {
              ArrowDown: () => step(1),
              ArrowUp: () => step(-1),
              Home: () => setActive(enabled[0] ?? -1),
              End: () => setActive(enabled[enabled.length - 1] ?? -1),
              Enter: () => pick(active),
              " ": () => pick(active),
              Escape: () => close(),
            };
            const run = keys[e.key];
            if (run) {
              e.preventDefault();
              run();
            } else if (e.key === "Tab") close(false);
            else if (e.key.length === 1 && /\S/.test(e.key)) {
              const i = find(e.key);
              if (i >= 0) setActive(i);
            }
          }}
        >
          {groups.map(([g, idx], gi) => {
            const items = idx.map((i) => {
              const o = opts[i] as SelectMenuOption;
              const sel = o.value === v[0];
              return (
                <div
                  key={o.value}
                  id={`${uid}-o${i}`}
                  role="option"
                  aria-selected={sel}
                  aria-disabled={o.disabled || undefined}
                  className={cx("tf-selectmenu-opt", i === active && "active")}
                  onPointerMove={() => !o.disabled && setActive(i)}
                  onClick={() => pick(i)}
                >
                  {o.icon && <Icon name={o.icon} size={15} />}
                  <span className="tf-option-text">
                    <b>{o.label}</b>
                    {o.hint && <small>{o.hint}</small>}
                  </span>
                  {sel && <Icon name="check" size={15} className="tf-selectmenu-check" />}
                </div>
              );
            });
            return g ? (
              <div key={g + gi} role="group" aria-labelledby={`${uid}-g${gi}`}>
                <div id={`${uid}-g${gi}`} className="tf-menu-label" role="presentation">
                  {g}
                </div>
                {items}
              </div>
            ) : (
              <React.Fragment key={"g" + gi}>{items}</React.Fragment>
            );
          })}
        </div>
      </Popover>
      <input ref={hidden} type="hidden" name={p.name} value={v[0]} />
      {error ? (
        <span id={`${id}-msg`} className="tf-field-error" role="alert">
          <Icon name="x" size={12} />
          {error}
        </span>
      ) : (
        p.hint && (
          <span id={`${id}-msg`} className="tf-field-hint">
            {p.hint}
          </span>
        )
      )}
    </div>
  );
}
