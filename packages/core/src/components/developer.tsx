"use client";
import * as React from "react";
import { leaving, usePresence } from "../presence.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { useFormat, useStrings } from "../context.js";
import { DEVELOPER_STRINGS } from "../strings.js";
import { useControlled, useId } from "../hooks.js";
import { Portal } from "../portal.js";
import { CodeBlock } from "./chat.js";
import { Tooltip } from "./overlays.js";
import { Button, IconButton, TintIcon } from "./foundation.js";
import { FormField } from "./forms.js";
import { Kbd } from "./building-blocks.js";
import { CountUp } from "./data-display.js";
import { Sparkline } from "./charts.js";
import type {
  CodeViewerProps,
  LogViewProps,
  MeterProps,
  MoneyInputProps,
  SecretFieldProps,
  SettingsLayoutProps,
  ShortcutsOverlayProps,
  StatCellProps,
  UptimeBarProps,
} from "./types.js";

export function LogView(p: LogViewProps) {
  const ref = React.useRef<HTMLPreElement>(null),
    hover = React.useRef(false);
  React.useEffect(() => {
    if (p.follow !== false && !hover.current && ref.current)
      ref.current.scrollTop = ref.current.scrollHeight;
  }, [(p.lines || []).length]);
  return (
    <div
      className={cx("tf-log", p.className)}
      style={{
        maxHeight: p.maxHeight,
        ...p.style,
      }}
    >
      {p.title && (
        <div className="tf-code-head">
          <span>{p.title}</span>
          {p.right}
        </div>
      )}
      <pre
        ref={ref}
        onPointerEnter={() => {
          hover.current = true;
        }}
        onPointerLeave={() => {
          hover.current = false;
        }}
      >
        {(p.lines || []).map((l, i) => {
          const r =
            typeof l === "string"
              ? {
                  text: l,
                }
              : l;
          return (
            <span
              key={i}
              className={cx("tf-log-line", r.level && "lv-" + r.level, r.fresh && "fresh")}
            >
              {p.numbers !== false && <i>{i + 1}</i>}
              {r.time && <em>{r.time}</em>}
              {r.text}
              {"\n"}
            </span>
          );
        })}
      </pre>
    </div>
  );
}

export function CodeViewer(p: CodeViewerProps) {
  const code = typeof p.value === "string" ? p.value : JSON.stringify(p.value, null, 2);
  return <CodeBlock code={code} lang={p.lang || (typeof p.value === "string" ? "text" : "json")} />;
}

export function SecretField(p: SecretFieldProps) {
  const t = useStrings(DEVELOPER_STRINGS);
  const shown = React.useState(false),
    copied = React.useState(false);
  const masked = (p.prefix || "") + "••••••••" + (p.last4 || "");
  return (
    <div style={p.style} className={cx("tf-secret", p.className)}>
      <Icon name="key" size={15} />
      <span className="tf-mono tf-secret-val">{shown[0] && p.value ? p.value : masked}</span>
      {p.meta && <span className="tf-secret-meta">{p.meta}</span>}
      <span
        className="tf-row"
        style={{
          flexWrap: "nowrap",
          gap: 4,
        }}
      >
        {p.onReveal && (
          <Tooltip label={shown[0] ? t.hide : t.reveal}>
            <button
              type="button"
              className="tf-iconbtn tf-iconbtn-ghost tf-iconbtn-sm"
              aria-label={shown[0] ? t.hide : t.reveal}
              onClick={() => {
                if (shown[0]) return shown[1](false);
                Promise.resolve(p.onReveal?.()).then((ok) => {
                  if (ok !== false) shown[1](true);
                });
              }}
            >
              <Icon name="eye" size={16} />
            </button>
          </Tooltip>
        )}
        {p.onCopy && (
          <Tooltip label={copied[0] ? t.copied : t.copy}>
            <button
              type="button"
              className="tf-iconbtn tf-iconbtn-ghost tf-iconbtn-sm"
              aria-label={t.copy}
              onClick={() => {
                p.onCopy?.();
                copied[1](true);
                setTimeout(() => {
                  copied[1](false);
                }, 1400);
              }}
            >
              <Icon name={copied[0] ? "check" : "file"} size={16} />
            </button>
          </Tooltip>
        )}
        {p.onRotate && (
          <Button size="sm" variant="soft" icon="refresh" onClick={p.onRotate}>
            {t.rotate}
          </Button>
        )}
      </span>
    </div>
  );
}

export function MoneyInput(p: MoneyInputProps) {
  const t = useStrings(DEVELOPER_STRINGS);
  const { formatMoney, formatNumber, formatPercent } = useFormat();
  const id = useId("mi"),
    v = useControlled<number | null>(
      p.value,
      p.defaultValue != null ? p.defaultValue : null,
      p.onChange,
    ),
    txt = React.useState(
      v[0] != null
        ? formatNumber(v[0], {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "",
    );
  const dec = (formatNumber(1.5).match(/[^0-9]/) || ["."])[0];
  function parse(s: string) {
    const t = s
      .replace(new RegExp("[^0-9" + (dec === "," ? "," : ".") + "-]", "g"), "")
      .replace(",", ".");
    const n = parseFloat(t);
    return isNaN(n) ? null : Math.round(n * 100) / 100;
  }
  const sym = formatMoney(0, p.currency).replace(/[\d.,\s]/g, "");
  return (
    <FormField
      style={p.style}
      className={p.className}
      id={id}
      label={p.label}
      hint={p.hint}
      error={p.error}
      required={p.required}
    >
      <div className="tf-money">
        <span
          className="tf-inputwrap"
          style={{
            flex: 1,
          }}
        >
          <input
            id={id}
            className="tf-input tf-money-input"
            inputMode="decimal"
            value={txt[0]}
            placeholder={formatNumber(0, {
              minimumFractionDigits: 2,
            })}
            onChange={(e) => {
              txt[1](e.target.value);
            }}
            onBlur={() => {
              const n = parse(txt[0]);
              v[1](n);
              txt[1](
                n == null
                  ? ""
                  : formatNumber(n, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
              );
            }}
          />
          <span className="tf-input-suffix">{sym}</span>
        </span>
        {p.vatOptions && (
          <select
            className="tf-input tf-money-vat"
            aria-label={t.vatRate}
            value={p.vat}
            onChange={(e) => {
              p.onVat && p.onVat(e.target.value);
            }}
          >
            {p.vatOptions.map((o) => {
              const r =
                typeof o === "object"
                  ? o
                  : {
                      value: o,
                      label: formatPercent(Number(o)),
                    };
              return (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              );
            })}
          </select>
        )}
      </div>
      {p.showGross && v[0] != null && p.vat != null && !isNaN(+p.vat) && (
        <span className="tf-field-hint">
          {t.gross(
            formatMoney(v[0] * (1 + Number(p.vat) / 100), p.currency, {
              minimumFractionDigits: 2,
            }),
          )}
        </span>
      )}
    </FormField>
  );
}

export function SettingsLayout(p: SettingsLayoutProps) {
  return (
    <div style={p.style} className={cx("tf-settings", p.className)}>
      {(p.sections || []).map((s, i) => (
        <section key={s.id || i} className="tf-settings-row">
          <div className="tf-settings-label">
            <b>{s.title}</b>
            {s.text && <span>{s.text}</span>}
            {s.badge}
          </div>
          <div className="tf-settings-ctl">{s.children}</div>
        </section>
      ))}
      {p.footer && <div className="tf-settings-foot">{p.footer}</div>}
    </div>
  );
}

export function ShortcutsOverlay(p: ShortcutsOverlayProps) {
  const t = useStrings(DEVELOPER_STRINGS);
  const pr = usePresence(!!p.open);
  React.useEffect(() => {
    if (!p.open) return;
    function k(e: KeyboardEvent) {
      if (e.key === "Escape") p.onClose && p.onClose();
    }
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("keydown", k);
    };
  }, [p.open]);
  if (!pr.mounted) return null;
  return (
    <Portal>
      <div {...leaving(pr.closing)} className="tf-overlay">
        <div className="tf-backdrop" onClick={p.onClose} />
        <div
          className="tf-modal tf-shortcuts"
          role="dialog"
          aria-modal="true"
          aria-label={p.title || t.keyboardShortcuts}
        >
          <div
            className="tf-row"
            style={{
              justifyContent: "space-between",
            }}
          >
            <h2 className="tf-modal-title">{p.title || t.keyboardShortcuts}</h2>
            <IconButton icon="x" label={t.close} size="sm" onClick={p.onClose} />
          </div>
          <div className="tf-shortcuts-grid">
            {(p.groups || []).map((g) => (
              <div key={g.title} className="tf-shortcuts-group">
                <span className="tf-menu-label">{g.title}</span>
                {g.items.map((it) => (
                  <div key={it[0]} className="tf-shortcut">
                    <span>{it[0]}</span>
                    <Kbd keys={it[1]} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export function StatCell(p: StatCellProps) {
  const { formatNumber } = useFormat();
  const up = p.delta != null && p.delta >= 0,
    good = p.invert ? !up : up;
  return (
    <div style={p.style} className={cx("tf-statcell", p.tint && "tf-bg-" + p.tint, p.className)}>
      <div className="tf-statcell-top">
        <span className="tf-statcell-label">{p.label}</span>
        {p.icon && <TintIcon icon={p.icon} tint={p.iconTint || "plain"} />}
      </div>
      <div className="tf-statcell-mid">
        <div
          style={{
            minWidth: 0,
          }}
        >
          {typeof p.value === "string" || typeof p.value === "number" ? (
            <CountUp className="tf-statcell-value" value={p.value} />
          ) : (
            <span className="tf-statcell-value">{p.value}</span>
          )}
          {p.delta != null && (
            <div className={cx("tf-delta", good ? "good" : "bad")}>
              <span aria-hidden>{up ? "▲" : "▼"}</span>{" "}
              {(p.deltaText ||
                formatNumber(Math.abs(p.delta), {
                  maximumFractionDigits: 1,
                }) + "%") + (p.compare ? " " + p.compare : "")}
            </div>
          )}
        </div>
        {p.spark && (
          <div className="tf-statcell-spark">
            <Sparkline values={p.spark} tint={good ? "mint" : "blush"} width={88} height={32} />
          </div>
        )}
      </div>
    </div>
  );
}

export function UptimeBar(p: UptimeBarProps) {
  const t = useStrings(DEVELOPER_STRINGS);
  const { formatPercent } = useFormat();
  const days = (p.days || []).map((d) => (typeof d === "string" ? { status: d } : d)),
    hov = React.useState<number | null>(null);
  return (
    <div style={p.style} className={cx("tf-uptime", p.className)}>
      <div
        className="tf-uptime-bar"
        onPointerLeave={() => {
          hov[1](null);
        }}
      >
        {days.map((d, i) => {
          const r = d;
          return (
            <i
              key={i}
              className={"st-" + (r.status || "none")}
              onPointerEnter={() => {
                hov[1](i);
              }}
            />
          );
        })}
      </div>
      <div className="tf-uptime-foot">
        <span>
          {hov[0] != null
            ? (days[hov[0]].label || t.daysAgo(days.length - hov[0] - 1)) +
              (days[hov[0]].note ? " · " + days[hov[0]].note : "")
            : p.caption || t.lastDays(days.length)}
        </span>
        {p.uptime != null && (
          <b className="tf-mono">
            {formatPercent(p.uptime, {
              maximumFractionDigits: 2,
            })}
          </b>
        )}
      </div>
    </div>
  );
}

export function Meter(p: MeterProps) {
  const { formatPercent } = useFormat();
  const pct = Math.max(0, Math.min(100, ((p.value || 0) / (p.max || 100)) * 100)),
    tone =
      p.tone || (pct >= (p.danger || 90) ? "blush" : pct >= (p.warn || 75) ? "butter" : "mint");
  return (
    <div style={p.style} className={cx("tf-meter", p.className)}>
      <div className="tf-usage-top">
        <span>{p.label}</span>
        <b>{p.text || formatPercent(pct)}</b>
      </div>
      <span className="tf-usage-track">
        <span
          className={"tf-usage-fill tf-sf-" + tone}
          style={{
            width: pct + "%",
          }}
        />
      </span>
    </div>
  );
}

/* ── Agents ── */
