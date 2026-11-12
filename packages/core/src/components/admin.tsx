"use client";
import * as React from "react";
import { useControlled, useId } from "../hooks.js";
import { useFormat, useStrings } from "../context.js";
import { ADMIN_STRINGS } from "../strings.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { toast } from "../toast-store.js";
import { Portal } from "../portal.js";
import { DatePicker, FormField, OtpInput, Segmented } from "./forms.js";
import { Popover } from "./overlays.js";
import { StatusIndicator, StatusShape } from "./status.js";
import { Avatar, Button, Chip, IconButton, TintIcon } from "./foundation.js";
import { Sparkline } from "./charts.js";
import { Checkbox, SearchField, Switch, cbox } from "./inputs.js";
import { Menu } from "./feedback.js";
import { Collapsible } from "./building-blocks.js";
import { Rating } from "./commerce.js";
import { Meter } from "./developer.js";
import { Progress } from "./data-display.js";
import type {
  BackupListProps,
  BalanceCardProps,
  BarListProps,
  BlockListProps,
  ColorFieldProps,
  CouponCardProps,
  DateRange,
  ExportDialogProps,
  LiveFeedItem,
  LiveFeedProps,
  LocaleFieldProps,
  LocaleSwitcherProps,
  MapPoint,
  MapViewProps,
  RangeSliderProps,
  ReviewCardProps,
  RunHistoryProps,
  ServiceMonitorProps,
  Status,
  StatusSelectProps,
  TilePickerProps,
  TwoFactorSetupProps,
  WebhookEndpointProps,
  WorkspaceSwitcherProps,
} from "./types.js";

/* ── Shared: range slider, bar list, status select, tile picker ── */
export function RangeSlider(p: RangeSliderProps) {
  const t = useStrings(ADMIN_STRINGS);
  const { formatNumber } = useFormat();
  const id = useId("rs"),
    min = p.min || 0,
    max = p.max != null ? p.max : 100,
    step = p.step || 1,
    f = p.format || formatNumber;
  const v = useControlled(p.value, p.defaultValue || [min, max], p.onChange),
    lo = v[0][0],
    hi = v[0][1];
  function pc(x: number) {
    return ((x - min) / (max - min)) * 100;
  }
  function set(i: number, raw: number | string) {
    const x = Math.max(min, Math.min(max, Number(raw)));
    let n = v[0].slice() as [number, number];
    n[i] = x;
    if (n[0] > n[1]) n = i ? [x, x] : [x, x];
    v[1](n);
  }
  return (
    <FormField style={p.style} className={p.className} id={id} label={p.label} hint={p.hint}>
      <div className="tf-range">
        <div className="tf-range-track">
          <span
            style={{
              left: pc(lo) + "%",
              width: pc(hi) - pc(lo) + "%",
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={lo}
            aria-label={t.minimum}
            onChange={(e) => {
              set(0, e.target.value);
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={hi}
            aria-label={t.maximum}
            onChange={(e) => {
              set(1, e.target.value);
            }}
          />
        </div>
        {p.inputs !== false ? (
          <div className="tf-range-inputs">
            <label className="tf-range-num">
              <small>{t.min}</small>
              <input
                id={id}
                className="tf-input"
                inputMode="numeric"
                value={formatNumber(lo)}
                onChange={(e) => {
                  set(0, e.target.value.replace(/\D/g, "") || min);
                }}
              />
              {p.unit && <span>{p.unit}</span>}
            </label>
            <span className="tf-range-dash" aria-hidden>
              –
            </span>
            <label className="tf-range-num">
              <small>{t.max}</small>
              <input
                className="tf-input"
                inputMode="numeric"
                value={formatNumber(hi)}
                onChange={(e) => {
                  set(1, e.target.value.replace(/\D/g, "") || max);
                }}
              />
              {p.unit && <span>{p.unit}</span>}
            </label>
          </div>
        ) : (
          <div className="tf-range-vals">
            <span>{f(lo)}</span>
            <span>{hi >= max && p.openEnd ? f(hi) + "+" : f(hi)}</span>
          </div>
        )}
      </div>
    </FormField>
  );
}

export function BarList(p: BarListProps) {
  const { formatNumber } = useFormat();
  const items = p.items || [],
    max = Math.max.apply(null, items.map((i) => i.value).concat([1])),
    f = p.format || formatNumber;
  return (
    <div style={p.style} className={cx("tf-barlist", p.className)} role="list" aria-label={p.label}>
      {items.map((it, i) => (
        <div
          key={it.id || (typeof it.label === "string" ? it.label : i)}
          role="listitem"
          className={cx("tf-barlist-row", p.onPick && "is-btn")}
          onClick={
            p.onPick &&
            (() => {
              p.onPick?.(it);
            })
          }
        >
          <span
            className={cx("tf-barlist-bar", it.tint && "tf-t-" + it.tint)}
            style={{
              width: (it.value / max) * 100 + "%",
            }}
          />
          <span className="tf-barlist-label">
            {it.mark && (
              <span className="tf-barlist-mark" aria-hidden>
                {it.mark}
              </span>
            )}
            {it.label}
          </span>
          <span className="tf-barlist-val">
            {f(it.value)}
            {it.share != null && (
              <small>
                {formatNumber(it.share, {
                  style: "percent",
                  maximumFractionDigits: 1,
                })}
              </small>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StatusSelect(p: StatusSelectProps) {
  const opts = p.options || [],
    v = useControlled(
      p.value,
      p.defaultValue != null ? p.defaultValue : opts[0] && opts[0].value,
      p.onChange,
    ),
    cur = opts.find((o) => o.value === v[0]) || opts[0] || {};
  return (
    <Popover
      style={p.style}
      className={p.className}
      width={p.width || 220}
      trigger={(s) => (
        <button
          type="button"
          className={cx("tf-statussel", p.size === "sm" && "sm")}
          aria-haspopup="listbox"
          aria-expanded={s.open}
          aria-label={p.label ? `${p.label}: ${cur.label ?? ""}` : undefined}
          onClick={(e) => {
            e.stopPropagation();
            s.toggle();
          }}
        >
          <StatusShape status={cur.status || "idle"} />
          <span>{cur.label}</span>
          <Icon name="chevronDown" size={13} />
        </button>
      )}
    >
      {(s) => (
        <div className="tf-menu" role="listbox" aria-label={p.label}>
          {opts.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === v[0]}
              className={cx("tf-menu-item", o.value === v[0] && "on")}
              onClick={() => {
                v[1](o.value);
                s.close && s.close();
              }}
            >
              <StatusShape status={o.status || "idle"} />
              <span
                style={{
                  flex: 1,
                }}
              >
                {o.label}
              </span>
              {o.value === v[0] && <Icon name="check" size={14} />}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}

export function TilePicker(p: TilePickerProps) {
  const multi = !!p.multiple,
    v = useControlled<string | string[] | null>(
      p.value,
      p.defaultValue != null ? p.defaultValue : multi ? [] : null,
      p.onChange,
    );
  const list: string[] = multi ? (v[0] as string[] | null) || [] : [];
  function on(x: string) {
    return multi ? list.indexOf(x) > -1 : v[0] === x;
  }
  function pick(x: string) {
    if (!multi) return v[1](x);
    v[1](on(x) ? list.filter((y) => y !== x) : list.concat([x]));
  }
  return (
    <div
      className={cx("tf-tiles", p.className)}
      role={multi ? "group" : "radiogroup"}
      aria-label={p.label}
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(" + (p.min || 120) + "px, 1fr))",
        ...p.style,
      }}
    >
      {(p.options || []).map((o) => (
        <button
          key={o.value}
          type="button"
          role={multi ? "checkbox" : "radio"}
          aria-checked={on(o.value)}
          disabled={o.disabled}
          className={cx("tf-tile", on(o.value) && "on")}
          onClick={() => {
            pick(o.value);
          }}
        >
          <span
            className={cx("tf-tile-art", o.tint && "tf-t-" + o.tint)}
            style={
              o.color
                ? {
                    background: o.color,
                  }
                : undefined
            }
          >
            {o.image ? (
              <img src={o.image} alt="" />
            ) : o.icon ? (
              <Icon name={o.icon} size={22} />
            ) : (
              o.art
            )}
          </span>
          <span className="tf-tile-label">
            {o.label}
            {o.meta && <small>{o.meta}</small>}
          </span>
          {on(o.value) && (
            <span className="tf-tile-check" aria-hidden>
              <Icon name="check" size={12} />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Live feed ── */
export function LiveFeed(p: LiveFeedProps) {
  const t = useStrings(ADMIN_STRINGS);
  const { formatMoney } = useFormat();
  const paused = useControlled(p.paused, false, p.onPause),
    held = React.useRef<LiveFeedItem[] | null>(null),
    filter = React.useState<string | null>(null);
  if (!paused[0] || !held.current) held.current = p.items || [];
  const heldItems = held.current;
  const shown = (paused[0] ? heldItems : p.items || []).filter(
      (it) => !filter[0] || it.type === filter[0],
    ),
    waiting = paused[0] ? Math.max(0, (p.items || []).length - heldItems.length) : 0;
  const types = p.types || [];
  return (
    <div style={p.style} className={cx("tf-livefeed", p.className)}>
      <div className="tf-livefeed-head">
        <span className={cx("tf-live", paused[0] && "off")}>
          <span className="tf-live-dot" aria-hidden />
          {paused[0] ? t.paused : t.live}
        </span>
        {types.length > 0 && (
          <div
            className="tf-row"
            style={{
              gap: 4,
            }}
          >
            <Chip
              selected={!filter[0]}
              onClick={() => {
                filter[1](null);
              }}
            >
              {t.all}
            </Chip>
            {types.map((t) => (
              <Chip
                key={t.value}
                selected={filter[0] === t.value}
                onClick={() => {
                  filter[1](filter[0] === t.value ? null : t.value);
                }}
              >
                {t.label}
              </Chip>
            ))}
          </div>
        )}
        <span
          style={{
            flex: 1,
          }}
        />
        {waiting > 0 && (
          <button
            type="button"
            className="tf-livefeed-new"
            onClick={() => {
              paused[1](false);
            }}
          >
            {t.newCount(waiting)}
          </button>
        )}
        <IconButton
          icon={paused[0] ? "play" : "pause"}
          size="sm"
          label={paused[0] ? t.resume : t.pause}
          onClick={() => {
            paused[1](!paused[0]);
          }}
        />
      </div>
      <div
        className="tf-livefeed-list"
        role="log"
        aria-live={paused[0] ? "off" : "polite"}
        style={
          p.maxHeight
            ? {
                maxHeight: p.maxHeight,
              }
            : undefined
        }
      >
        {shown.length === 0 ? (
          <p
            className="tf-card-desc"
            style={{
              padding: 16,
            }}
          >
            {p.emptyText || t.waitingForEvents}
          </p>
        ) : (
          shown.map((it) => (
            <div key={it.id} className={cx("tf-livefeed-row", it.fresh && "fresh")}>
              <TintIcon icon={it.icon || "zap"} tint={it.tint || "sky"} size={32} />
              <span className="tf-livefeed-text">
                <b>{it.title}</b>
                {it.text && <small>{it.text}</small>}
              </span>
              {it.amount != null && (
                <span className={cx("tf-livefeed-amt", it.amount < 0 && "neg")}>
                  {(it.amount > 0 ? "+" : "") + formatMoney(it.amount, it.currency)}
                </span>
              )}
              <span className="tf-livefeed-time">{it.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const WORLD =
  "0000000001fe03ff000000000000000000000000000079f7ffff8001c01000070000000000000010439fffff0002c0000000000000000000007cdf007fff00000001800ffc01e000000003c4af003ffe0000000408ffffe0000001f8001e67f83ffc000070001bffffffff0083ffffc67e5c1fe00003ff2ffbffffffffff67fffffff83a1f01c007bcffffffffffffff03ffffffe0080e00001e7fffffffffffffff03fbffffc0700200003e5ffffffffffffc6000403fffe07e000002063fffffffffff018001001ffffc7f0000021cfffffffffffc038000000ffffe7fc0000f3fffffffffffff8200000003ffffff0000027fffffffffffff4000000003fffffce00003ffffffffffffff0000000003ffffff000000fbf5e7fffffffe0000000003fffff000000f8de0e7fffffffcc000000003ffffc000000f12eff7ffffff708000000001ffff8000000f00dff3fffffe300000000000ffffc0000001f043ffffffff1700000000007fff0000000ff803ffffffff0800000000001ffe0000000ffeffffffffff8000000000003f810000001fffffe7ffffff0000000000001f810000003ffffdfbffffff00000000000007800000007ffffcff0ffffe80000000400003884000007ffffefe07e7e000000000000001f83400003ffffe7e07c3e0800000000000005c0000007fffff780701e0800000000000000e0000007fffffc00301f0c0000000000000023900003ffffff003016040000000000000017f00001ffffff000810060000000000000007fc0000f3ffff000008200000000000000007ff000000fffe00001860000000000000000fff000000fffc000008ec000000000000000fffc00000fff800000ce8400000000000000ffff80000fff0000004003c0000000000000ffffc00007ff0000002801e00000000000007fffc00007ff0000000000808000000000007fff800007ff0000000000000000000000007fff000007ff100000002c000000000000001fff000007ff300000007ec00000000000000fff000007fc300000007fe00000000000000fff000003fc60000003fff02000000000000ffc000003fc60000007fff80000000000000ff8000003f800000003fff80000000000001ff0000001f800000003fff80000000000001ff0000001f000000003fff80000000000001fe0000001800000000303f80000000000001f80000000000000000000f00000000000001f00000000000000000000200200000000003c00000000000000000000200400000000001c000000000000000000000008000000000038000000000000000000000010000000000038000000000000000000000000000000000030800000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

let worldPath: string | null = null;

export function WorldDots() {
  if (!worldPath) {
    const d = [],
      cols = 144;
    for (let i = 0; i < WORLD.length; i++) {
      const v = parseInt(WORLD[i], 16);
      for (let b = 0; b < 4; b++)
        if (v & (8 >> b)) {
          const k = i * 4 + b,
            x = k % cols,
            y = Math.floor(k / cols);
          d.push("M" + (x + 0.5) + " " + (y + 0.5) + "h0");
        }
    }
    worldPath = d.join("");
  }
  return (
    <svg className="tf-map-world" viewBox="0 0 144 58" preserveAspectRatio="none" aria-hidden>
      <path d={worldPath} />
    </svg>
  );
}
/* ── Map with pins (background is yours: tiles, an SVG, an image) ── */

/* ── Map with pins (background is yours: tiles, an SVG, an image) ── */
export function MapView(p: MapViewProps) {
  const t = useStrings(ADMIN_STRINGS);
  const { formatNumber } = useFormat();
  const b = p.bounds || {
      n: 84,
      s: -60,
      w: -180,
      e: 180,
    },
    sel = useControlled(p.selected, null, p.onSelect),
    Hh = p.height || 320;
  const pts = p.points || [],
    maxV = Math.max.apply(null, pts.map((x) => x.value || 1).concat([1]));
  function xy(pt: MapPoint) {
    return {
      x: ((pt.lng - b.w) / (b.e - b.w)) * 100,
      y: ((b.n - pt.lat) / (b.n - b.s)) * 100,
    };
  }
  const cur = pts.find((x) => x.id === sel[0]);
  return (
    <div
      className={cx("tf-map", p.className)}
      style={{
        height: Hh,
        ...p.style,
      }}
      role="region"
      aria-label={p.label || t.viewMap}
    >
      {p.background || (!p.bounds ? <WorldDots /> : null) || (
        <svg className="tf-map-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((g) => (
            <g key={g}>
              <line x1={g} x2={g} y1={0} y2={100} />
              <line y1={g} y2={g} x1={0} x2={100} />
            </g>
          ))}
        </svg>
      )}
      {pts.map((pt) => {
        const c = xy(pt),
          r = p.bubbles ? 10 + Math.sqrt((pt.value || 1) / maxV) * 26 : null;
        return (
          <button
            key={pt.id}
            type="button"
            className={cx(
              p.bubbles ? "tf-map-bubble" : "tf-map-pin",
              "tf-t-" + (pt.tint || "sky"),
              sel[0] === pt.id && "on",
              pt.pulse && "pulse",
            )}
            style={{
              left: c.x + "%",
              top: c.y + "%",
              width: r || undefined,
              height: r || undefined,
            }}
            aria-label={[
              typeof pt.text === "string" && !p.bubbles ? pt.text : null,
              pt.label,
              pt.value != null ? formatNumber(pt.value) : null,
            ]
              .filter(Boolean)
              .join(", ")}
            onClick={() => {
              sel[1](sel[0] === pt.id ? null : pt.id);
            }}
          >
            {p.bubbles ? null : pt.text != null ? (
              <span>{pt.text}</span>
            ) : (
              <Icon name="pin" size={14} />
            )}
          </button>
        );
      })}
      {cur && (
        <div
          className={cx("tf-map-pop", p.surface && "tf-" + p.surface)}
          style={{
            left: Math.min(72, Math.max(28, xy(cur).x)) + "%",
            top: xy(cur).y + "%",
          }}
        >
          {p.renderPopup ? (
            p.renderPopup(cur)
          ) : (
            <div className="tf-option-text">
              <b>{cur.label}</b>
              {cur.sub && <small>{cur.sub}</small>}
            </div>
          )}
        </div>
      )}
      {p.legend && (
        <div className={cx("tf-map-legend", p.surface && "tf-" + p.surface)}>{p.legend}</div>
      )}
      {p.controls && (
        <div className={cx("tf-map-ctl", p.surface && "tf-" + p.surface)}>{p.controls}</div>
      )}
    </div>
  );
}

/* ── Rich text editor (Selection/Range based, no execCommand) ── */

/* ── Money and operations for admins ── */
export function BalanceCard(p: BalanceCardProps) {
  const t = useStrings(ADMIN_STRINGS);
  const { formatMoney } = useFormat();
  const days = p.perDay && p.perDay > 0 ? Math.floor(p.balance / p.perDay) : null,
    low = p.low != null && p.balance <= p.low,
    st = p.status || (p.balance <= 0 ? "danger" : low ? "warn" : "ok");
  return (
    <div style={p.style} className={cx("tf-balance", "is-" + st, p.className)}>
      <div className="tf-balance-head">
        {p.logo || <TintIcon icon={p.icon || "wallet"} tint={p.tint || "butter"} size={36} />}
        <div className="tf-option-text">
          <b>{p.name}</b>
          {p.sub && <small>{p.sub}</small>}
        </div>
        <StatusIndicator
          status={st}
          label={
            p.statusLabel || (st === "danger" ? t.balanceEmpty : low ? t.balanceLow : t.balanceOk)
          }
          size="sm"
        />
      </div>
      <div className="tf-balance-main">
        <div
          className="tf-col"
          style={{
            gap: 2,
          }}
        >
          <span className="tf-balance-amt">
            {formatMoney(p.balance, p.currency, {
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="tf-balance-meta">
            {[
              p.perDay != null && t.perDay(formatMoney(p.perDay, p.currency)),
              days != null && p.balance > 0 && t.lastsAbout(days),
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
          {p.low != null && (
            <span className="tf-balance-meta">{t.warnsBelow(formatMoney(p.low, p.currency))}</span>
          )}
        </div>
        {p.spark && (
          <Sparkline
            values={p.spark}
            width={96}
            height={32}
            tint={st === "ok" ? "mint" : st === "warn" ? "butter" : "blush"}
          />
        )}
      </div>
      {(p.onTopUp || p.action) && (
        <div
          className="tf-row"
          style={{
            justifyContent: "flex-end",
          }}
        >
          {p.action}
          {p.onTopUp && (
            <Button size="sm" variant={low ? "primary" : "soft"} icon="plus" onClick={p.onTopUp}>
              {p.topUpLabel || t.topUp}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function ServiceMonitor(p: ServiceMonitorProps) {
  const { formatNumber } = useFormat();
  return (
    <div style={p.style} className={cx("tf-svcmon", p.className)} role="list" aria-label={p.label}>
      {(p.items || []).map((s) => (
        <div key={s.id || s.name} role="listitem" className="tf-svcmon-row">
          <StatusShape status={s.status} />
          <span className="tf-option-text">
            <b>{s.name}</b>
            <small>{s.statusLabel || s.status}</small>
          </span>
          {s.history && (
            <span className="tf-svcmon-hist" aria-hidden>
              {s.history.map((x, i) => (
                <i key={i} className={"tf-st-" + x} />
              ))}
            </span>
          )}
          <span className="tf-svcmon-num">
            {s.latency != null ? formatNumber(s.latency) + " ms" : "—"}
          </span>
          <span className={cx("tf-svcmon-num", (s.errorRate ?? 0) > 1 && "bad")}>
            {s.errorRate != null
              ? formatNumber(s.errorRate / 100, {
                  style: "percent",
                  maximumFractionDigits: 1,
                })
              : "—"}
          </span>
          <span className="tf-svcmon-time">{s.checked}</span>
        </div>
      ))}
    </div>
  );
}

export function RunHistory(p: RunHistoryProps) {
  const { formatNumber } = useFormat();
  const open = React.useState<string | number | null>(null);
  return (
    <div style={p.style} className={cx("tf-runs", p.className)} role="list" aria-label={p.label}>
      {(p.items || []).map((r) => {
        const on = open[0] === r.id;
        return (
          <div key={r.id} role="listitem" className={cx("tf-runs-row", on && "open")}>
            <button
              type="button"
              className="tf-runs-main"
              aria-expanded={r.detail ? on : undefined}
              onClick={
                r.detail
                  ? () => {
                      open[1](on ? null : r.id);
                    }
                  : undefined
              }
            >
              <StatusShape status={r.status} />
              <span className="tf-option-text">
                <b>{r.name}</b>
                <small>{[r.started, r.duration, r.by].filter(Boolean).join(" · ")}</small>
              </span>
              <span className="tf-runs-counts">
                {(r.counts || []).map((c, i) => (
                  <span key={i} className={c.tone ? "tf-tone-" + c.tone : undefined}>
                    <b>{formatNumber(c.value)}</b> {c.label}
                  </span>
                ))}
              </span>
              {r.detail && <Icon name={on ? "chevronDown" : "chevronRight"} size={14} />}
            </button>
            {on && <div className="tf-runs-detail">{r.detail}</div>}
          </div>
        );
      })}
    </div>
  );
}

export function WebhookEndpoint(p: WebhookEndpointProps) {
  const t = useStrings(ADMIN_STRINGS);
  const { formatNumber } = useFormat();
  const open = React.useState(!!p.defaultOpen);
  return (
    <div style={p.style} className={cx("tf-hook", p.className)}>
      <div className="tf-hook-head">
        <TintIcon icon="webhook" tint="lilac" size={36} />
        <div
          className="tf-option-text"
          style={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <b className="tf-mono tf-hook-url">{p.url}</b>
          <small>{(p.events || []).join(", ")}</small>
        </div>
        <StatusIndicator status={p.status || "ok"} label={p.statusLabel} size="sm" />
        {p.successRate != null && (
          <span className="tf-hook-rate">
            {formatNumber(p.successRate / 100, {
              style: "percent",
              maximumFractionDigits: 1,
            })}
          </span>
        )}
        {p.onToggle && (
          <Switch checked={p.enabled !== false} onChange={p.onToggle} label={t.enabled} />
        )}
        {p.menu && (
          <Popover
            width={200}
            trigger={(s) => <IconButton icon="more" size="sm" label={t.more} onClick={s.toggle} />}
          >
            {() => <Menu items={p.menu || []} />}
          </Popover>
        )}
      </div>
      {p.secret && p.secret}
      {(p.deliveries || []).length > 0 && (
        <Collapsible
          title={t.recentDeliveries}
          meta={formatNumber((p.deliveries || []).length)}
          open={open[0]}
          onOpenChange={open[1]}
        >
          <div className="tf-hook-dl">
            {(p.deliveries || []).map((d) => {
              const ok = d.code != null && d.code >= 200 && d.code < 300;
              return (
                <div key={d.id} className="tf-hook-dl-row">
                  <span className={cx("tf-hook-code", ok ? "ok" : "bad")}>{d.code || "—"}</span>
                  <span className="tf-mono">{d.event}</span>
                  <span className="tf-hook-dl-time">
                    {d.time}
                    {d.ms != null && " · " + formatNumber(d.ms) + " ms"}
                  </span>
                  {!ok && p.onRetry && (
                    <Button
                      size="sm"
                      variant="soft"
                      icon="refresh"
                      onClick={() => {
                        p.onRetry?.(d);
                      }}
                    >
                      {t.retry}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Collapsible>
      )}
    </div>
  );
}

export function BackupList(p: BackupListProps) {
  const t = useStrings(ADMIN_STRINGS);
  return (
    <div style={p.style} className={cx("tf-backups", p.className)} role="list" aria-label={p.label}>
      {(p.items || []).map((b) => (
        <div key={b.id} role="listitem" className="tf-backups-row">
          <StatusShape status={b.status || "ok"} />
          <span className="tf-option-text">
            <b>{b.name || b.time}</b>
            <small>{[b.kind, b.where, b.retention].filter(Boolean).join(" · ")}</small>
          </span>
          <span className="tf-backups-size">{b.size}</span>
          <span
            className="tf-row"
            style={{
              gap: 4,
            }}
          >
            {p.onDownload && (
              <IconButton
                icon="download"
                size="sm"
                label={t.download}
                onClick={() => {
                  p.onDownload?.(b);
                }}
              />
            )}
            {p.onRestore && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  p.onRestore?.(b);
                }}
              >
                {t.restore}
              </Button>
            )}
          </span>
        </div>
      ))}
      {p.footer && <div className="tf-backups-foot">{p.footer}</div>}
    </div>
  );
}

export function BlockList(p: BlockListProps) {
  const t = useStrings(ADMIN_STRINGS);
  const q = React.useState("");
  const list = (p.items || []).filter(
    (b) =>
      !q[0] || (b.value + " " + (b.reason || "")).toLowerCase().indexOf(q[0].toLowerCase()) > -1,
  );
  return (
    <div
      className={cx("tf-col", p.className)}
      style={{
        gap: 12,
        ...p.style,
      }}
    >
      <div className="tf-filterbar">
        <SearchField
          placeholder={p.searchPlaceholder || t.searchBlocked}
          value={q[0]}
          onChange={(e) => {
            q[1](e.target.value);
          }}
          style={{
            flex: "1 1 220px",
            minWidth: 0,
          }}
        />
        {p.onAdd && (
          <Button size="sm" icon="plus" onClick={p.onAdd}>
            {p.addLabel || t.block}
          </Button>
        )}
      </div>
      {list.length === 0 ? (
        <p className="tf-card-desc">{p.emptyText || t.nothingBlocked}</p>
      ) : (
        <div className="tf-blocks" role="list">
          {list.map((b) => (
            <div key={b.id} role="listitem" className="tf-blocks-row">
              <Icon name="ban" size={15} />
              <span
                className="tf-option-text"
                style={{
                  minWidth: 0,
                }}
              >
                <b className="tf-mono">{b.value}</b>
                <small>{[b.kind, b.reason].filter(Boolean).join(" · ")}</small>
              </span>
              <span className="tf-blocks-meta">
                {[b.by, b.until ? t.until(b.until) : t.permanent].filter(Boolean).join(" · ")}
              </span>
              {p.onRemove && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    p.onRemove?.(b);
                  }}
                >
                  {p.removeLabel || t.unblock}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Reviews and coupons ── */

/* ── Reviews and coupons ── */
export function ReviewCard(p: ReviewCardProps) {
  const t = useStrings(ADMIN_STRINGS);
  const reply = React.useState(false),
    txt = React.useState(p.reply || "");
  const st = (
    {
      pending: ["signal", t.reviewState.pending],
      published: ["ok", t.reviewState.published],
      hidden: ["idle", t.reviewState.hidden],
      flagged: ["warn", t.reviewState.flagged],
    } as Record<string, [Status, string]>
  )[p.state || "pending"] as [Status, string];
  return (
    <article
      style={p.style}
      className={cx("tf-review", "is-" + (p.state || "pending"), p.className)}
    >
      <div className="tf-review-head">
        <Avatar name={p.author} size={36} />
        <div
          className="tf-option-text"
          style={{
            flex: 1,
          }}
        >
          <b>
            {p.author}
            {p.verified && (
              <span className="tf-review-ver">
                {" · "}
                {t.verifiedPurchase}
              </span>
            )}
          </b>
          <small>{[p.product, p.date].filter(Boolean).join(" · ")}</small>
        </div>
        <Rating value={p.rating} />
        <StatusIndicator status={st[0]} label={p.stateLabel || st[1]} size="sm" />
      </div>
      {p.title && <b className="tf-review-title">{p.title}</b>}
      <p className="tf-review-text">{p.highlight ? markWords(p.text, p.highlight) : p.text}</p>
      {p.reply && !reply[0] && (
        <div className="tf-review-reply">
          <small>{p.replyLabel || t.yourReply}</small>
          {p.reply}
        </div>
      )}
      {reply[0] && (
        <div
          className="tf-col"
          style={{
            gap: 8,
          }}
        >
          <textarea
            className="tf-input"
            rows={3}
            value={txt[0]}
            onChange={(e) => {
              txt[1](e.target.value);
            }}
            placeholder={t.writeReply}
            aria-label={t.reply}
          />
          <div
            className="tf-row"
            style={{
              justifyContent: "flex-end",
            }}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                reply[1](false);
              }}
            >
              {t.cancel}
            </Button>
            <Button
              size="sm"
              icon="send"
              onClick={() => {
                p.onReply && p.onReply(txt[0]);
                reply[1](false);
              }}
            >
              {t.postReply}
            </Button>
          </div>
        </div>
      )}
      {!reply[0] && (
        <div className="tf-review-actions">
          {p.state !== "published" && p.onPublish && (
            <Button size="sm" icon="check" onClick={p.onPublish}>
              {t.publish}
            </Button>
          )}
          {p.state !== "hidden" && p.onHide && (
            <Button size="sm" variant="secondary" icon="eye" onClick={p.onHide}>
              {t.hide}
            </Button>
          )}
          {p.onReply && (
            <Button
              size="sm"
              variant="ghost"
              icon="reply"
              onClick={() => {
                reply[1](true);
              }}
            >
              {p.reply ? t.editReply : t.reply}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

function markWords(text: string, words: string[]) {
  const re = new RegExp(
    "(" + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")",
    "gi",
  );
  return String(text)
    .split(re)
    .map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

export function CouponCard(p: CouponCardProps) {
  const t = useStrings(ADMIN_STRINGS);
  const { formatMoney, formatNumber } = useFormat();
  const used = p.used || 0,
    st = p.status || (p.limit && used >= p.limit ? "idle" : "ok");
  return (
    <div style={p.style} className={cx("tf-coupon", st !== "ok" && "off", p.className)}>
      <div className="tf-coupon-val">
        <b>
          {p.kind === "fixed"
            ? formatMoney(p.value, p.currency)
            : formatNumber(p.value / 100, {
                style: "percent",
              })}
        </b>
        <small>{p.kind === "fixed" ? "off" : "off"}</small>
      </div>
      <div className="tf-coupon-main">
        <div
          className="tf-row"
          style={{
            gap: 8,
          }}
        >
          <button
            type="button"
            className="tf-coupon-code"
            title={t.copy}
            onClick={() => {
              try {
                navigator.clipboard.writeText(p.code);
              } catch {
                /* clipboard unavailable */
              }
              toast &&
                toast({
                  text: t.copied,
                });
              p.onCopy && p.onCopy();
            }}
          >
            {p.code}
            <Icon name="copy" size={13} />
          </button>
          <StatusIndicator status={st} label={p.statusLabel} size="sm" />
        </div>
        {p.text && <small className="tf-coupon-text">{p.text}</small>}
        <Meter
          value={used}
          max={p.limit || Math.max(used, 1)}
          text={
            p.limit
              ? t.usedOf(formatNumber(used), formatNumber(p.limit))
              : t.used(formatNumber(used))
          }
          tone="sky"
          warn={101}
          danger={101}
        />
        <span className="tf-coupon-foot">
          {[
            p.until && t.validUntil(p.until),
            p.min != null && t.fromAmount(formatMoney(p.min, p.currency)),
            p.revenue != null && t.revenue(formatMoney(p.revenue, p.currency)),
          ]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>
      {p.menu && (
        <Popover
          width={200}
          trigger={(s) => <IconButton icon="more" size="sm" label={t.more} onClick={s.toggle} />}
        >
          {() => <Menu items={p.menu || []} />}
        </Popover>
      )}
    </div>
  );
}

/* ── Locale, workspace and translations ── */
export function LocaleField(p: LocaleFieldProps) {
  const t = useStrings(ADMIN_STRINGS);
  const locs = p.locales || [],
    v = useControlled(p.value, p.defaultValue || {}, p.onChange),
    cur = React.useState(p.active || (locs[0] && locs[0].code)),
    id = useId("lf");
  const base = p.source || (locs[0] && locs[0].code),
    val = v[0][cur[0]] || "";
  function set(t: string) {
    const n: Record<string, string> = Object.assign({}, v[0]);
    n[cur[0]] = t;
    v[1](n);
  }
  const done = locs.filter((l) => (v[0][l.code] || "").trim()).length;
  return (
    <FormField
      style={p.style}
      className={p.className}
      id={id}
      label={p.label}
      hint={p.hint}
      error={p.error}
    >
      <div className="tf-locfield">
        <div className="tf-locfield-tabs" role="tablist" aria-label={t.languages}>
          {locs.map((l) => {
            const has = (v[0][l.code] || "").trim();
            return (
              <button
                key={l.code}
                type="button"
                role="tab"
                aria-selected={cur[0] === l.code}
                className={cx("tf-locfield-tab", cur[0] === l.code && "on", !has && "missing")}
                onClick={() => {
                  cur[1](l.code);
                }}
              >
                {l.flag && <span aria-hidden>{l.flag}</span>}
                {l.label || l.code.toUpperCase()}
                {!has && <span className="tf-locfield-miss" title={t.missing} />}
              </button>
            );
          })}
          <span className="tf-locfield-done">{t.doneOf(done, locs.length)}</span>
        </div>
        {p.multiline ? (
          <textarea
            id={id}
            className="tf-input"
            rows={p.rows || 3}
            value={val}
            onChange={(e) => {
              set(e.target.value);
            }}
            placeholder={cur[0] !== base ? v[0][base] || "" : p.placeholder}
          />
        ) : (
          <input
            id={id}
            className="tf-input"
            value={val}
            onChange={(e) => {
              set(e.target.value);
            }}
            placeholder={cur[0] !== base ? v[0][base] || "" : p.placeholder}
          />
        )}
        {cur[0] !== base && (
          <div
            className="tf-row"
            style={{
              gap: 8,
            }}
          >
            <Button
              size="sm"
              variant="ghost"
              icon="copy"
              onClick={() => {
                set(v[0][base] || "");
              }}
            >
              {t.copyFrom((locs.find((l) => l.code === base) || {}).label || base)}
            </Button>
            {p.onTranslate && (
              <Button
                size="sm"
                variant="ghost"
                icon="sparkle"
                onClick={() => {
                  Promise.resolve(p.onTranslate?.(v[0][base] || "", cur[0])).then((t) => {
                    if (t) set(t);
                  });
                }}
              >
                {t.translate}
              </Button>
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}

export function LocaleSwitcher(p: LocaleSwitcherProps) {
  const t = useStrings(ADMIN_STRINGS);
  const lang = useControlled(
      p.language,
      p.languages && p.languages[0] && p.languages[0].code,
      p.onLanguage,
    ),
    cur = useControlled(p.currency, p.currencies && p.currencies[0], p.onCurrency);
  const L0: { code?: string; label?: string; short?: string; flag?: string } =
    (p.languages || []).find((l) => l.code === lang[0]) || {};
  return (
    <Popover
      style={p.style}
      className={p.className}
      width={280}
      trigger={(s) => (
        <button
          type="button"
          className={cx("tf-locsw", p.variant === "frame" && "on-frame")}
          aria-haspopup="dialog"
          aria-expanded={s.open}
          onClick={s.toggle}
          title={t.languageAndCurrency}
        >
          {L0.flag ? <span>{L0.flag}</span> : <Icon name="globe" size={15} />}
          <span>{(L0.short || lang[0] || "").toUpperCase()}</span>
          {cur[0] && <span className="tf-locsw-cur">{cur[0]}</span>}
          <Icon name="chevronDown" size={13} />
        </button>
      )}
    >
      {() => (
        <div
          className="tf-col"
          style={{
            gap: 12,
          }}
        >
          {p.languages && (
            <div
              className="tf-col"
              style={{
                gap: 4,
              }}
            >
              <span
                className="tf-menu-label"
                style={{
                  padding: "0 8px",
                }}
              >
                {t.language}
              </span>
              <div
                className="tf-menu"
                style={{
                  padding: 0,
                  boxShadow: "none",
                }}
              >
                {p.languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={cx("tf-menu-item", l.code === lang[0] && "on")}
                    onClick={() => {
                      lang[1](l.code);
                    }}
                  >
                    {l.flag && <span aria-hidden>{l.flag}</span>}
                    <span
                      style={{
                        flex: 1,
                      }}
                    >
                      {l.label}
                    </span>
                    {l.code === lang[0] && <Icon name="check" size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}
          {p.currencies && (
            <div
              className="tf-col"
              style={{
                gap: 6,
              }}
            >
              <span
                className="tf-menu-label"
                style={{
                  padding: "0 8px",
                }}
              >
                {t.currency}
              </span>
              <Segmented size="sm" block value={cur[0]} onChange={cur[1]} options={p.currencies} />
            </div>
          )}
        </div>
      )}
    </Popover>
  );
}

export function WorkspaceSwitcher(p: WorkspaceSwitcherProps) {
  const t = useStrings(ADMIN_STRINGS);
  const items = p.items || [],
    v = useControlled(p.value, items[0] && items[0].id, p.onChange),
    cur: Partial<WorkspaceSwitcherProps["items"][number]> = items.find((x) => x.id === v[0]) || {};
  return (
    <Popover
      style={p.style}
      className={p.className}
      width={p.width || 300}
      trigger={(s) => (
        <button
          type="button"
          className={cx("tf-wssw", p.variant === "frame" && "on-frame", p.compact && "compact")}
          aria-haspopup="listbox"
          aria-expanded={s.open}
          aria-label={p.compact ? `${t.switchWorkspace}: ${cur.name || ""}` : undefined}
          onClick={s.toggle}
        >
          {cur.logo || (
            <span className={cx("tf-wssw-mark", "tf-t-" + (cur.tint || "sky"))}>
              {(cur.name || "?").charAt(0)}
            </span>
          )}
          {!p.compact && (
            <>
              <span className="tf-option-text">
                <b>{cur.name}</b>
                {cur.sub && <small>{cur.sub}</small>}
              </span>
              <Icon name="chevronDown" size={14} />
            </>
          )}
        </button>
      )}
    >
      {(s) => (
        <div
          className="tf-col"
          style={{
            gap: 8,
          }}
        >
          {p.label && (
            <span
              className="tf-menu-label"
              style={{
                padding: "0 8px",
              }}
            >
              {p.label}
            </span>
          )}
          <div
            className="tf-menu"
            role="listbox"
            style={{
              padding: 0,
              boxShadow: "none",
            }}
          >
            {items.map((x) => (
              <button
                key={x.id}
                type="button"
                role="option"
                aria-selected={x.id === v[0]}
                className={cx("tf-menu-item", x.id === v[0] && "on")}
                onClick={() => {
                  v[1](x.id);
                  s.close && s.close();
                }}
              >
                {x.logo || (
                  <span className={cx("tf-wssw-mark sm", "tf-t-" + (x.tint || "sky"))}>
                    {x.name.charAt(0)}
                  </span>
                )}
                <span
                  className="tf-option-text"
                  style={{
                    flex: 1,
                  }}
                >
                  <span>{x.name}</span>
                  {x.sub && <small>{x.sub}</small>}
                </span>
                {x.id === v[0] && <Icon name="check" size={14} />}
              </button>
            ))}
          </div>
          {p.footer}
        </div>
      )}
    </Popover>
  );
}

/* ── Export and 2FA ── */

/* ── Export and 2FA ── */
export function ExportDialog(p: ExportDialogProps) {
  const t = useStrings(ADMIN_STRINGS);
  const { formatNumber, formatPercent } = useFormat();
  const fmt = React.useState(p.format || (p.formats || ["csv"])[0]),
    cols = React.useState((p.columns || []).filter((c) => c.default !== false).map((c) => c.key)),
    range = React.useState<DateRange | null>(p.range || null),
    st = React.useState("form"),
    prog = React.useState(0);
  if (!p.open && !p.inline) return null;
  function start() {
    st[1]("running");
    prog[1](0);
    const res = p.onExport?.(
      {
        format: fmt[0],
        columns: cols[0],
        range: range[0],
      },
      (x) => {
        prog[1](x);
      },
    );
    Promise.resolve(res).then(() => {
      prog[1](100);
      st[1]("done");
    });
  }
  const body = (
    <div
      className="tf-modal tf-export"
      role="dialog"
      aria-modal={p.inline ? undefined : "true"}
      aria-label={p.title || t.export}
    >
      <span className="tf-modal-close">
        <IconButton icon="x" label={t.close} size="sm" onClick={p.onClose} />
      </span>
      <div>
        <h2 className="tf-modal-title">{p.title || t.export}</h2>
        <p
          className="tf-modal-text"
          style={{
            marginTop: 6,
          }}
        >
          {p.text || t.rowsMatch(formatNumber(p.count || 0), p.count || 0)}
        </p>
      </div>
      {st[0] === "form" ? (
        <React.Fragment>
          <FormField label={t.format}>
            <Segmented
              block
              value={fmt[0]}
              onChange={fmt[1]}
              options={(p.formats || ["csv", "xlsx", "json"]).map((f) => ({
                value: f,
                label: f.toUpperCase(),
              }))}
            />
          </FormField>
          {p.ranges !== false && (
            <DatePicker
              label={t.period}
              range
              value={range[0]}
              onChange={(r) => range[1](r as DateRange | null)}
              placeholder={t.allTime}
            />
          )}
          {(p.columns || []).length > 0 && (
            <FormField label={t.columns} hint={t.selectedCount(cols[0].length)}>
              <div className="tf-export-cols">
                {(p.columns || []).map((c) => {
                  const on = cols[0].indexOf(c.key) > -1;
                  return (
                    <label key={c.key} className="tf-check">
                      {cbox({
                        checked: on,
                        onChange: () => {
                          cols[1](
                            on ? cols[0].filter((k) => k !== c.key) : cols[0].concat([c.key]),
                          );
                        },
                      })}
                      {c.label}
                    </label>
                  );
                })}
              </div>
            </FormField>
          )}
          {p.note && (
            <p
              className="tf-card-desc"
              style={{
                margin: 0,
              }}
            >
              {p.note}
            </p>
          )}
          <div className="tf-modal-foot">
            <Button variant="ghost" onClick={p.onClose}>
              {t.cancel}
            </Button>
            <Button
              icon="download"
              disabled={!cols[0].length && (p.columns || []).length > 0}
              onClick={start}
            >
              {t.export}
            </Button>
          </div>
        </React.Fragment>
      ) : st[0] === "running" ? (
        <div
          className="tf-col"
          style={{
            gap: 8,
          }}
        >
          <Progress value={prog[0]} label={t.exportProgress} />
          <span className="tf-card-desc">
            {t.preparingFile + " " + formatPercent(Math.round(prog[0]))}
          </span>
        </div>
      ) : (
        <React.Fragment>
          <StatusIndicator status="ok" label={p.doneText || t.fileReady} />
          <div className="tf-modal-foot">
            <Button
              variant="ghost"
              onClick={() => {
                st[1]("form");
              }}
            >
              {t.newExport}
            </Button>
            {p.download || (
              <Button icon="download" onClick={p.onDownload}>
                {t.download}
              </Button>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
  return p.inline ? (
    body
  ) : (
    <Portal>
      <div className="tf-overlay">
        <div className="tf-backdrop" onClick={p.onClose} />
        {body}
      </div>
    </Portal>
  );
}

export function TwoFactorSetup(p: TwoFactorSetupProps) {
  const t = useStrings(ADMIN_STRINGS);
  const step = React.useState(p.step || 0),
    err = React.useState<string | null>(null),
    saved = React.useState(false);
  const steps = t.twoFactorSteps;
  return (
    <div style={p.style} className={cx("tf-2fa", p.className)}>
      <ol className="tf-2fa-steps">
        {steps.map((s, i) => (
          <li key={i} className={cx(i === step[0] && "on", i < step[0] && "done")}>
            <span>{i < step[0] ? <Icon name="check" size={12} /> : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      {step[0] === 0 && (
        <div className="tf-2fa-scan">
          <div className="tf-2fa-qr" role="img" aria-label={t.qrCode}>
            {p.qr || <Icon name="grid" size={48} />}
          </div>
          <div
            className="tf-col"
            style={{
              gap: 12,
              minWidth: 0,
            }}
          >
            <p
              className="tf-card-desc"
              style={{
                margin: 0,
              }}
            >
              {p.scanText || t.scanText}
            </p>
            <button
              type="button"
              className="tf-2fa-key"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(p.secret);
                } catch {
                  /* clipboard unavailable */
                }
                toast && toast({ text: t.copied });
              }}
            >
              <span className="tf-mono">{(p.secret || "").replace(/(.{4})/g, "$1 ").trim()}</span>
              <Icon name="copy" size={14} />
            </button>
            <div>
              <Button
                onClick={() => {
                  step[1](1);
                }}
              >
                {t.next}
              </Button>
            </div>
          </div>
        </div>
      )}
      {step[0] === 1 && (
        <div
          className="tf-col"
          style={{
            gap: 12,
          }}
        >
          <p
            className="tf-card-desc"
            style={{
              margin: 0,
            }}
          >
            {t.enterCode}
          </p>
          <OtpInput
            error={!!err[0]}
            onComplete={(c) => {
              Promise.resolve(p.onVerify ? p.onVerify(c) : true).then((ok) => {
                if (ok) {
                  err[1](null);
                  step[1](2);
                } else err[1](t.codeFailed);
              });
            }}
          />
          {err[0] && <span className="tf-field-error">{err[0]}</span>}
          <div>
            <Button
              variant="ghost"
              onClick={() => {
                step[1](0);
              }}
            >
              {t.back}
            </Button>
          </div>
        </div>
      )}
      {step[0] === 2 && (
        <div
          className="tf-col"
          style={{
            gap: 12,
          }}
        >
          <p
            className="tf-card-desc"
            style={{
              margin: 0,
            }}
          >
            {p.codesText || t.codesText}
          </p>
          <div className="tf-2fa-codes">
            {(p.codes || []).map((c) => (
              <code key={c}>{c}</code>
            ))}
          </div>
          <div className="tf-row">
            <Button
              variant="secondary"
              icon="copy"
              onClick={() => {
                try {
                  navigator.clipboard.writeText((p.codes || []).join("\n"));
                } catch {
                  /* clipboard unavailable */
                }
                toast && toast({ text: t.copied });
              }}
            >
              {t.copy}
            </Button>
            {p.onDownload && (
              <Button variant="secondary" icon="download" onClick={p.onDownload}>
                {t.download}
              </Button>
            )}
          </div>
          <Checkbox
            checked={saved[0]}
            onChange={() => {
              saved[1](!saved[0]);
            }}
          >
            {t.savedCodes}
          </Checkbox>
          <div>
            <Button icon="check" disabled={!saved[0]} onClick={p.onDone}>
              {t.turnOnTwoFactor}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Media ── */

export function ColorField(p: ColorFieldProps) {
  const t = useStrings(ADMIN_STRINGS);
  const { formatNumber } = useFormat();
  const id = useId("cf"),
    v = useControlled(p.value, p.defaultValue || "#000000", p.onChange);
  function lum(hx: string) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hx || "");
    if (!m) return null;
    const n = parseInt(m[1], 16),
      c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => {
        x /= 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  const a = lum(v[0]),
    b = lum(p.against || "#ffffff"),
    ratio = a != null && b != null ? (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) : null;
  return (
    <FormField style={p.style} className={p.className} id={id} label={p.label} hint={p.hint}>
      <div className="tf-colorf">
        <label
          className="tf-colorf-sw"
          style={{
            background: v[0],
          }}
        >
          <input
            type="color"
            value={/^#[0-9a-f]{6}$/i.test(v[0]) ? v[0] : "#000000"}
            onChange={(e) => {
              v[1](e.target.value);
            }}
            aria-label={t.pickColour}
          />
        </label>
        <input
          id={id}
          aria-label={p.label ? undefined : t.pickColour}
          className="tf-input tf-mono"
          value={v[0]}
          onChange={(e) => {
            v[1](e.target.value);
          }}
          spellCheck={false}
        />
        {ratio != null && p.against !== false && (
          <span
            className={cx("tf-colorf-ratio", ratio >= 4.5 ? "ok" : ratio >= 3 ? "warn" : "bad")}
            title={t.contrastAgainst(p.against || "#ffffff")}
          >
            {formatNumber(ratio, {
              maximumFractionDigits: 1,
            }) +
              ":1 " +
              (ratio >= 4.5 ? t.contrastAA : ratio >= 3 ? t.contrastAALarge : t.contrastFails)}
          </span>
        )}
      </div>
    </FormField>
  );
}

/* Page helper: mounts a page with a Replay control that re-runs all entrance motion */
