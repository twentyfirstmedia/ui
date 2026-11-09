"use client";
import * as React from "react";
import { Icon } from "../Icon.js";
import { useFormat, useStrings, type Formatters } from "../context.js";
import { REAL_ESTATE_STRINGS, type UIStrings } from "../strings.js";
import { cx } from "../cx.js";
import { Switch, cbox } from "./inputs.js";
import { Badge, Button, IconButton, TintIcon } from "./foundation.js";
import { StatusSelect } from "./admin.js";
import { Segmented } from "./forms.js";
import { StatusIndicator } from "./status.js";
import { KeyValue } from "./building-blocks.js";
import type {
  EnergyClassProps,
  Listing,
  ListingCardProps,
  ResultsToolbarProps,
  SavedSearchProps,
  Status,
  ValuationCardProps,
} from "./types.js";

/* ── Real estate ── */
type ListingStrings = Pick<UIStrings, "rooms" | "priceOnRequest" | "perMonth">;

function listingFacts(x: Listing, t: ListingStrings, { formatNumber }: Formatters) {
  return [
    x.area != null && [<Icon key="i" name="ruler" size={14} />, `${formatNumber(x.area)} m²`],
    x.rooms != null && [
      <Icon key="i" name="bed" size={14} />,
      t.rooms(formatNumber(x.rooms), x.rooms),
    ],
    x.place && [<Icon key="i" name="pin" size={14} />, x.place],
  ]
    .filter(Boolean)
    .map((f, i) => <span key={i}>{f}</span>);
}

function listingPrice(x: Listing, t: ListingStrings, { formatMoney }: Formatters) {
  if (x.price == null) return <b className="tf-listing-price">{t.priceOnRequest}</b>;
  return (
    <b className="tf-listing-price">
      {formatMoney(x.price, x.currency)}
      {x.rent && <small> {t.perMonth}</small>}
    </b>
  );
}

export function ListingCard(p: ListingCardProps) {
  const t = useStrings(REAL_ESTATE_STRINGS);
  const fm = useFormat();
  const { formatMoney, formatNumber } = fm;
  const x = p.listing || p;
  return (
    <article
      className={cx(
        "tf-listing",
        p.layout === "row" && "row",
        p.selected && "selected",
        x.status === "unread" && "unread",
      )}
      onClick={
        p.onOpen &&
        (() => {
          p.onOpen?.(x);
        })
      }
    >
      <div className="tf-listing-media">
        {x.image ? (
          <img src={x.image} alt="" />
        ) : (
          <div className={cx("tf-listing-ph", "tf-t-" + (x.tint || "sky"))}>
            <Icon name="image" size={24} />
          </div>
        )}
        {x.isNew && <span className="tf-listing-new">{t.isNew}</span>}
        {(x.photos ?? 0) > 1 && (
          <span className="tf-listing-photos">
            <Icon name="image" size={12} />
            {formatNumber(x.photos ?? 0)}
          </span>
        )}
        {p.onSelect && (
          <label
            className="tf-listing-sel"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {cbox({
              checked: !!p.selected,
              onChange: () => {
                p.onSelect?.(x);
              },
              label: t.select,
            })}
          </label>
        )}
      </div>
      <div className="tf-listing-body">
        <div className="tf-listing-top">
          {listingPrice(x, t, fm)}
          {x.pricePerSqm != null && (
            <span className="tf-listing-ppsqm">
              {formatMoney(x.pricePerSqm, x.currency) + " / m²"}
            </span>
          )}
          {p.onWish && (
            <IconButton
              icon="heart"
              size="sm"
              label={x.wished ? t.removeFromSaved : t.save}
              className={cx("tf-listing-wish", x.wished && "on")}
              onClick={(e) => {
                e.stopPropagation();
                p.onWish?.(x);
              }}
            />
          )}
        </div>
        <b className="tf-listing-title">{x.title}</b>
        <div className="tf-listing-facts">{listingFacts(x, t, fm)}</div>
        <div className="tf-listing-foot">
          {x.source && <span className="tf-listing-src">{x.source}</span>}
          {x.seller && (
            <Badge tone={x.seller === "private" ? "success" : "neutral"} dot={false}>
              {x.sellerLabel || (x.seller === "private" ? t.privateSeller : t.agent)}
            </Badge>
          )}
          {x.phone && (
            <span className="tf-listing-flag" title={t.phoneAvailable}>
              <Icon name="phone" size={13} />
            </span>
          )}
          <span
            style={{
              flex: 1,
            }}
          />
          {x.age && <span className="tf-listing-age">{x.age}</span>}
          {p.statusOptions && (
            <span
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <StatusSelect
                size="sm"
                options={p.statusOptions}
                value={x.status}
                onChange={(s) => {
                  p.onStatus && p.onStatus(x, s);
                }}
                label={t.status}
              />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ResultsToolbar(p: ResultsToolbarProps) {
  const t = useStrings(REAL_ESTATE_STRINGS);
  const { formatNumber } = useFormat();
  const all = p.total > 0 && p.selected === p.total,
    some = (p.selected ?? 0) > 0 && !all;
  return (
    <div className="tf-results">
      {p.onSelectAll && (
        <label className="tf-check">
          {cbox({
            checked: all,
            indeterminate: some,
            onChange: () => {
              p.onSelectAll?.(!all);
            },
            label: all ? t.deselectAll : t.selectAll,
          })}
        </label>
      )}
      <div
        className="tf-option-text"
        style={{
          marginRight: "auto",
        }}
      >
        <b>
          {(p.selected ?? 0) > 0
            ? t.selectedCount(p.selected ?? 0, formatNumber(p.selected ?? 0))
            : p.title || t.results}
        </b>
        <small>
          {t.foundCount(p.total || 0, formatNumber(p.total || 0)) + (p.meta ? " · " + p.meta : "")}
        </small>
      </div>
      {(p.selected ?? 0) > 0 &&
        (p.bulkActions || []).map((a, i) => (
          <Button
            key={i}
            size="sm"
            variant={a.variant || "secondary"}
            icon={a.icon}
            disabled={a.busy}
            onClick={a.onClick}
          >
            {a.busy ? a.busyLabel || t.workingEllipsis : a.label}
          </Button>
        ))}
      {p.sortOptions && (
        <label className="tf-results-sort">
          <span>{t.sort}</span>
          <select
            className="tf-input"
            value={p.sort}
            onChange={(e) => {
              p.onSort && p.onSort(e.target.value);
            }}
          >
            {p.sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {p.views && (
        <Segmented
          size="sm"
          value={p.view}
          onChange={p.onView}
          label={t.view}
          options={p.views.map((v) => ({
            value: v,
            icon: v === "grid" ? "grid" : v === "map" ? "map" : "list",
            label: v === "grid" ? t.viewGrid : v === "map" ? t.viewMap : t.viewList,
          }))}
        />
      )}
    </div>
  );
}

export function SavedSearch(p: SavedSearchProps) {
  const t = useStrings(REAL_ESTATE_STRINGS);
  const { formatNumber } = useFormat();
  return (
    <div className={cx("tf-saved", p.enabled === false && "off")}>
      <div className="tf-saved-head">
        <TintIcon icon={p.icon || "search"} tint={p.tint || "sky"} size={36} />
        <div
          className="tf-option-text"
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <b>{p.name}</b>
          <small>
            {[p.lastRun && t.checkedAt(p.lastRun), p.frequency].filter(Boolean).join(" · ")}
          </small>
        </div>
        {(p.newCount ?? 0) > 0 && (
          <span className="tf-nav-count">{formatNumber(p.newCount ?? 0)}</span>
        )}
        {p.onToggle && (
          <Switch checked={p.enabled !== false} onChange={p.onToggle} label={t.enabled} />
        )}
      </div>
      <div className="tf-saved-crit">
        {(p.criteria || []).map((c, i) => (
          <span key={i} className="tf-saved-chip">
            {c}
          </span>
        ))}
      </div>
      {(p.onOpen || p.onEdit) && (
        <div
          className="tf-row"
          style={{
            justifyContent: "flex-end",
          }}
        >
          {p.onEdit && (
            <Button size="sm" variant="ghost" icon="edit" onClick={p.onEdit}>
              {t.edit}
            </Button>
          )}
          {p.onOpen && (
            <Button size="sm" variant="soft" onClick={p.onOpen}>
              {p.openLabel || t.showResults}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function ValuationCard(p: ValuationCardProps) {
  const t = useStrings(REAL_ESTATE_STRINGS);
  const { formatMoney, formatNumber } = useFormat();
  const lo = p.low,
    hi = p.high,
    v = p.value,
    span = hi - lo || 1,
    pos = ((v - lo) / span) * 100;
  const conf = p.confidence,
    cl: [Status, string] | null =
      conf == null
        ? null
        : conf >= 0.75
          ? ["ok", t.highConfidence]
          : conf >= 0.5
            ? ["warn", t.mediumConfidence]
            : ["danger", t.lowConfidence];
  return (
    <div className="tf-valuation">
      <div className="tf-valuation-head">
        <span
          className="tf-menu-label"
          style={{
            padding: 0,
          }}
        >
          {p.title || t.estimatedValue}
        </span>
        {cl && <StatusIndicator status={cl[0]} label={p.confidenceLabel || cl[1]} size="sm" />}
      </div>
      <div className="tf-valuation-val">{formatMoney(v, p.currency)}</div>
      {p.perSqm != null && (
        <span className="tf-valuation-sub">
          {formatMoney(p.perSqm, p.currency) + " / m²" + (p.compare ? " · " + p.compare : "")}
        </span>
      )}
      <div
        className="tf-valuation-range"
        role="img"
        aria-label={t.range(formatMoney(lo, p.currency), formatMoney(hi, p.currency))}
      >
        <div className="tf-valuation-bar">
          {p.asking != null && (
            <span
              className="tf-valuation-ask"
              style={{
                left: Math.max(0, Math.min(100, ((p.asking - lo) / span) * 100)) + "%",
              }}
              title={t.askingPrice}
            />
          )}
          <span
            className="tf-valuation-mark"
            style={{
              left: pos + "%",
            }}
          />
        </div>
        <div className="tf-valuation-ends">
          <span>{formatMoney(lo, p.currency)}</span>
          <span>{formatMoney(hi, p.currency)}</span>
        </div>
      </div>
      {p.asking != null && (
        <span
          className={cx("tf-valuation-diff", p.asking > hi ? "bad" : p.asking < lo ? "good" : "")}
        >
          {t.askingPrice +
            " " +
            formatMoney(p.asking, p.currency) +
            " · " +
            (p.asking > v ? "+" : "") +
            formatNumber((p.asking - v) / v, {
              style: "percent",
              maximumFractionDigits: 1,
            })}
        </span>
      )}
      {p.facts && <KeyValue dense items={p.facts} />}
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
      {p.action}
    </div>
  );
}

const ENERGY = ["A+", "A", "B", "C", "D", "E", "F", "G", "H"];

export function EnergyClass(p: EnergyClassProps) {
  const t = useStrings(REAL_ESTATE_STRINGS);
  const { formatNumber } = useFormat();
  const scale = p.scale || ENERGY,
    i = scale.indexOf(p.value);
  return (
    <div
      className="tf-energy"
      role="img"
      aria-label={
        t.energyClass(p.value) + (p.kwh != null ? ", " + formatNumber(p.kwh) + " kWh/(m²·a)" : "")
      }
    >
      <div
        className="tf-energy-scale"
        style={{
          gridTemplateColumns: "repeat(" + scale.length + ", 1fr)",
        }}
      >
        {scale.map((c, k) => (
          <span
            key={c}
            className={cx("tf-energy-c", k === i && "on")}
            style={
              {
                "--e": k / (scale.length - 1),
              } as React.CSSProperties
            }
          >
            {c}
          </span>
        ))}
      </div>
      {(p.kwh != null || p.kind) && (
        <span className="tf-energy-meta">
          {[p.kwh != null && formatNumber(p.kwh) + " kWh/(m²·a)", p.kind]
            .filter(Boolean)
            .join(" · ")}
        </span>
      )}
    </div>
  );
}

/* ── Site chrome: assistant launcher, cookie consent, announcement ── */
