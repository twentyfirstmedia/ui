"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { formatMoney } from "../format.js";
import { useFormat, useStrings } from "../context.js";
import { COMMERCE_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { useControlled } from "../hooks.js";
import { Badge, Button, IconButton } from "./foundation.js";
import type {
  ArtKind,
  CartLineProps,
  CheckoutStepsProps,
  OrderSummaryProps,
  OrderTimelineProps,
  PlanCardProps,
  PriceProps,
  ProductArtProps,
  ProductCardProps,
  RatingProps,
  StockBadgeProps,
  VariantPickerProps,
} from "./types.js";

/* ── E-commerce ── */
const ART = {
  tee: "M38 22l-14 8 6 12 8-4v38h48V38l8 4 6-12-14-8c-3 6-10 10-24 10S41 28 38 22z",
  mug: "M30 34h44v36a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V34zM74 42h6a8 8 0 0 1 0 16h-6",
  bottle: "M52 18h16v10l6 8v42a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6V36l6-8V18z",
  cap: "M24 64c0-20 16-32 36-32s36 12 36 32H24zM24 64h60c8 0 14 4 16 8H24v-8z",
  tote: "M32 42h56l-4 40H36l-4-40zM46 42v-6a14 14 0 0 1 28 0v6",
  sneaker: "M20 62l6-20c10 2 18 0 24-6l8 4c4 8 14 12 28 14 8 2 14 6 14 12v4H20v-8z",
  watch: "M48 20h24v14H48zM48 86h24V72H48zM60 34a20 20 0 1 1 0 40 20 20 0 0 1 0-40zM60 46v10l6 4",
  lamp: "M44 24h32l10 26H34l10-26zM60 50v28M44 82h32",
};

export function ProductArt(p: ProductArtProps) {
  const size = p.size;
  return (
    <span
      className={cx("tf-art", "tf-bg-" + (p.tint || "sky"), p.className)}
      style={{
        ...(size
          ? {
              width: size,
              height: size,
            }
          : undefined),
        ...p.style,
      }}
      role={p.label ? "img" : undefined}
      aria-label={p.label}
      aria-hidden={p.label ? undefined : true}
    >
      <svg
        viewBox="0 0 120 100"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={ART[p.kind] || ART.tote} />
      </svg>
    </span>
  );
}

ProductArt.kinds = Object.keys(ART) as ArtKind[];

/** Formats an amount in a currency (default euros) and locale (default en-US). */
export function money(v: number | string, cur?: string, locale?: string) {
  return formatMoney(Number(v), cur, undefined, locale);
}
/** `money` in the locale of the nearest `UIProvider`. */
function useMoney() {
  const { locale } = useFormat();
  return (v: number | string, cur?: string) => money(v, cur, locale);
}

export function Price(p: PriceProps) {
  const money = useMoney();
  const { formatPercent } = useFormat();
  const sale = p.compareAt && p.compareAt > p.value;
  return (
    <span style={p.style} className={cx("tf-price", p.size && "tf-price-" + p.size, p.className)}>
      <b>{money(p.value, p.currency)}</b>
      {sale && <s>{money(p.compareAt ?? 0, p.currency)}</s>}
      {sale && p.showSave !== false && (
        <span className="tf-price-save">
          {"−" + formatPercent(Math.round((1 - p.value / (p.compareAt || p.value)) * 100))}
        </span>
      )}
    </span>
  );
}

export function Rating(p: RatingProps) {
  const t = useStrings(COMMERCE_STRINGS);
  const { formatNumber } = useFormat();
  const v = p.value || 0,
    shown = formatNumber(v, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <span
      style={p.style}
      className={cx("tf-rating", p.className)}
      role="img"
      aria-label={t.ratingLabel(shown, p.count)}
    >
      <span className="tf-stars" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const f = Math.max(0, Math.min(1, v - i));
          return (
            <span key={i} className="tf-star">
              <Icon name="star" size={p.size || 14} />
              <span
                className="tf-star-fill"
                style={{
                  width: f * 100 + "%",
                }}
              >
                <Icon name="star" size={p.size || 14} />
              </span>
            </span>
          );
        })}
      </span>
      <b>{shown}</b>
      {p.count != null && <span>{"(" + formatNumber(p.count) + ")"}</span>}
    </span>
  );
}

export function StockBadge(p: StockBadgeProps) {
  const t = useStrings(COMMERCE_STRINGS);
  const s = p.stock;
  if (s == null) return null;
  return s <= 0 ? (
    <Badge tone="danger">{t.outOfStock}</Badge>
  ) : s <= (p.low || 10) ? (
    <Badge tone="warning">{t.lowStock(s)}</Badge>
  ) : (
    <Badge tone="success">{p.compact ? t.inStock : t.inStockCount(s)}</Badge>
  );
}

export function ProductCard(p: ProductCardProps) {
  const t = useStrings(COMMERCE_STRINGS);
  return (
    <div style={p.style} className={cx("tf-product", p.className)} onClick={p.onClick}>
      <div className="tf-product-media">
        <ProductArt kind={p.art} tint={p.tint} />
        {p.badge && (
          <span className="tf-product-badge">
            <Badge tone={p.badgeTone || "highlight"} dot={false}>
              {p.badge}
            </Badge>
          </span>
        )}
        {p.onWish && (
          <button
            type="button"
            className={cx("tf-product-wish", p.wished && "on")}
            aria-pressed={!!p.wished}
            aria-label={`${p.wished ? "Remove" : "Save"} ${p.name}`}
            onClick={(e) => {
              e.stopPropagation();
              p.onWish?.();
            }}
          >
            <Icon name="heart" size={16} />
          </button>
        )}
      </div>
      <div className="tf-product-body">
        <div className="tf-product-top">
          <b className="tf-product-name">{p.name}</b>
          {p.meta && <span className="tf-product-meta">{p.meta}</span>}
        </div>
        {p.rating != null && <Rating value={p.rating} count={p.reviews} size={12} />}
        <div className="tf-product-foot">
          <Price value={p.price} compareAt={p.compareAt} />
          {p.onAdd &&
            (p.stock === 0 ? (
              <span className="tf-card-desc">{t.soldOut}</span>
            ) : (
              <IconButton
                icon={p.added ? "check" : "plus"}
                label={t.addToCart(p.name)}
                variant={p.added ? "solid" : "soft"}
                size="sm"
                onClick={(e) => {
                  e && e.stopPropagation && e.stopPropagation();
                  p.onAdd?.();
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export function VariantPicker(p: VariantPickerProps) {
  const t = useStrings(COMMERCE_STRINGS);
  const opts = (p.options || []).map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const v = useControlled(p.value, p.defaultValue ?? "", p.onChange),
    color = p.type === "color";
  const cur = opts.find((o) => o.value === v[0]);
  return (
    <fieldset style={p.style} className={cx("tf-variants", p.className)}>
      <legend className="tf-field-label">
        {p.label}
        {cur && <span className="tf-variants-cur">{cur.label || cur.value}</span>}
      </legend>
      <div className={cx("tf-variants-row", color ? "colors" : "sizes")}>
        {opts.map((o) => {
          const val = o.value,
            lab = o.label || o.value,
            on = val === v[0],
            off = o.disabled;
          return (
            <button
              key={val}
              type="button"
              className={cx("tf-variant", on && "on", off && "off")}
              aria-pressed={on}
              disabled={off}
              aria-label={color ? (off ? t.variantSoldOut(lab) : lab) : undefined}
              title={color ? lab : undefined}
              onClick={() => {
                v[1](val);
              }}
            >
              {color ? (
                <span
                  className="tf-swatch"
                  style={{
                    background: o.color,
                  }}
                />
              ) : (
                lab
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CartLine(p: CartLineProps) {
  const t = useStrings(COMMERCE_STRINGS);
  return (
    <div style={p.style} className={cx("tf-cartline", p.className)}>
      <ProductArt kind={p.art} tint={p.tint} size={64} />
      <div className="tf-cartline-text">
        <b>{p.name}</b>
        {p.variant && <span>{p.variant}</span>}
        {p.note && <span className="tf-cartline-note">{p.note}</span>}
      </div>
      {p.onQty ? (
        <div className="tf-number tf-number-sm">
          <IconButton
            icon={p.qty <= 1 ? "trash" : "minus"}
            label={p.qty <= 1 ? t.removeItem(p.name) : t.oneLess}
            size="sm"
            onClick={() => {
              p.qty <= 1 ? p.onRemove && p.onRemove() : p.onQty?.(p.qty - 1);
            }}
          />
          <span className="tf-number-input" aria-live="polite">
            {p.qty}
          </span>
          <IconButton
            icon="plus"
            label={t.oneMore}
            size="sm"
            onClick={() => {
              p.onQty?.(p.qty + 1);
            }}
          />
        </div>
      ) : (
        <span className="tf-card-desc">{"× " + p.qty}</span>
      )}
      <b className="tf-cartline-total">{money(p.price * p.qty)}</b>
    </div>
  );
}

export function OrderSummary(p: OrderSummaryProps) {
  const t = useStrings(COMMERCE_STRINGS);
  const money = useMoney();
  const { formatPercent } = useFormat();
  const lines = p.lines || [],
    sub = lines.reduce((a, l) => a + l.price * l.qty, 0),
    disc = p.discount
      ? p.discount.pct
        ? (sub * p.discount.pct) / 100
        : p.discount.amount || 0
      : 0;
  const ship = p.shipping != null ? p.shipping : sub - disc >= (p.freeShippingFrom || 75) ? 0 : 4.9,
    total = sub - disc + ship,
    vat = total - total / (1 + (p.vat || 19) / 100);
  const code = React.useState(""),
    err = React.useState<string | null>(null),
    toFree = (p.freeShippingFrom || 75) - (sub - disc);
  return (
    <div style={p.style} className={cx("tf-summary", p.className)}>
      {p.title !== false && <b className="tf-summary-title">{p.title || t.orderSummary}</b>}
      {p.showLines && (
        <div
          className="tf-col"
          style={{
            gap: 12,
          }}
        >
          {lines.map((l, i) => (
            <div key={i} className="tf-summary-line">
              <span className="tf-summary-thumb">
                <ProductArt kind={l.art} tint={l.tint} size={40} />
                <i>{l.qty}</i>
              </span>
              <span className="tf-summary-name">
                {l.name}
                {l.variant && <small>{l.variant}</small>}
              </span>
              <b>{money(l.price * l.qty)}</b>
            </div>
          ))}
        </div>
      )}
      {toFree > 0 && p.freeShippingFrom !== 0 && (
        <div className="tf-freeship">
          <span>{t.freeShippingIn(<b>{money(Math.ceil(toFree * 100) / 100)}</b>)}</span>
          <span className="tf-usage-track">
            <span
              className="tf-usage-fill tf-sf-mint"
              style={{
                width: Math.min(100, ((sub - disc) / (p.freeShippingFrom || 75)) * 100) + "%",
              }}
            />
          </span>
        </div>
      )}
      {p.onCoupon &&
        (p.discount ? (
          <div className="tf-coupon-on">
            <Icon name="tag" size={14} />
            <b>{p.discount.code}</b>
            <span>{p.discount.label}</span>
            <button
              type="button"
              className="tf-linkbtn"
              onClick={() => {
                p.onCoupon?.(null);
              }}
            >
              {t.remove}
            </button>
          </div>
        ) : (
          <form
            className="tf-coupon"
            onSubmit={(e) => {
              e.preventDefault();
              const r = p.onCoupon?.(code[0].trim().toUpperCase());
              err[1](r === false ? t.invalidCode : null);
              if (r !== false) code[1]("");
            }}
          >
            <input
              className="tf-input"
              placeholder={t.discountCode}
              aria-label={t.discountCode}
              value={code[0]}
              onChange={(e) => {
                code[1](e.target.value);
                err[1](null);
              }}
              aria-invalid={err[0] ? "true" : undefined}
            />
            <Button type="submit" variant="soft" disabled={!code[0].trim()}>
              {t.apply}
            </Button>
            {err[0] && (
              <span
                className="tf-field-error"
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                {err[0]}
              </span>
            )}
          </form>
        ))}
      <dl className="tf-summary-rows">
        <div>
          <dt>{t.subtotal}</dt>
          <dd>{money(sub)}</dd>
        </div>
        {disc > 0 && (
          <div className="save">
            <dt>{t.discount}</dt>
            <dd>{"−" + money(disc)}</dd>
          </div>
        )}
        <div>
          <dt>{t.shipping}</dt>
          <dd>{ship === 0 ? t.free : money(ship)}</dd>
        </div>
        <div className="total">
          <dt>{t.total}</dt>
          <dd>{money(total)}</dd>
        </div>
        <div className="vat">
          <dt>{t.inclVat(formatPercent(p.vat || 19))}</dt>
          <dd>{money(Math.round(vat * 100) / 100)}</dd>
        </div>
      </dl>
      {p.action}
    </div>
  );
}

export function CheckoutSteps(p: CheckoutStepsProps) {
  const t = useStrings(COMMERCE_STRINGS);
  const steps = p.steps || t.checkoutSteps,
    cur = p.current || 0;
  return (
    <ol
      style={p.style}
      className={cx("tf-csteps", p.compact && "compact", p.className)}
      aria-label={t.checkoutProgress}
    >
      {steps.map((s, i) => (
        <li
          key={s}
          className={cx(i < cur && "done", i === cur && "cur")}
          aria-current={i === cur ? "step" : undefined}
        >
          <button
            type="button"
            disabled={i > cur || !p.onPick}
            onClick={() => {
              p.onPick && p.onPick(i);
            }}
          >
            <span className="tf-cstep-n">{i < cur ? <Icon name="check" size={12} /> : i + 1}</span>
            <span className="tf-cstep-label">{s}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/* Status keys and their visible text. */
const ORDER_STEPS = ["Placed", "Paid", "Packed", "Shipped", "Delivered"] as const;

export function OrderTimeline(p: OrderTimelineProps) {
  const t = useStrings(COMMERCE_STRINGS);
  const orderStepLabel = (s: string) => t.orderStatus[s] ?? s;
  const cur = (ORDER_STEPS as readonly string[]).indexOf(p.status),
    times = p.times || {},
    cancelled = p.status === "Cancelled" || p.status === "Refunded";
  return (
    <div style={p.style} className={cx("tf-otl", cancelled && "cancelled", p.className)}>
      {ORDER_STEPS.map((s, i) => {
        const done = !cancelled && i <= cur;
        return (
          <div
            key={s}
            className={cx("tf-otl-step", done && "done", i === cur && !cancelled && "cur")}
          >
            <span className="tf-otl-dot">
              {done ? (
                <Icon name={i === cur && s !== "Delivered" ? "clock" : "check"} size={12} />
              ) : null}
            </span>
            <b>{orderStepLabel(s)}</b>
            <small>{times[s] || (done ? "" : "—")}</small>
          </div>
        );
      })}
      {cancelled && (
        <div className="tf-otl-cancel">
          <Badge tone="danger">{orderStepLabel(p.status)}</Badge>
        </div>
      )}
    </div>
  );
}

/* ── System screens ── */

export function PlanCard(p: PlanCardProps) {
  const t = useStrings(COMMERCE_STRINGS);
  const money = useMoney();
  const Link = (p.linkAs || "a") as React.ElementType;
  return (
    <div
      style={p.style}
      className={cx("tf-plan", p.featured && "featured", p.current && "current", p.className)}
    >
      {p.featured && <span className="tf-plan-flag">{p.flag || t.mostPopular}</span>}
      <div className="tf-plan-head">
        <b>{p.name}</b>
        {p.current && <span className="tf-plan-current">{t.currentPlan}</span>}
        {p.text && <span>{p.text}</span>}
      </div>
      <div className="tf-plan-price">
        {p.pricePrefix && <span className="tf-plan-prefix">{p.pricePrefix}</span>}
        {p.price === 0 ? (
          <b>{t.free}</b>
        ) : p.price === null || p.price === undefined ? (
          <b>{t.letsTalk}</b>
        ) : typeof p.price === "number" ? (
          <>
            <b>{money(p.price)}</b>
            <span>{p.per || t.perSeatMonth}</span>
          </>
        ) : (
          <>
            <b>{p.price}</b>
            {p.per && <span>{p.per}</span>}
          </>
        )}
        {p.was && <s>{money(p.was)}</s>}
      </div>
      {p.priceNote && <p className="tf-plan-note">{p.priceNote}</p>}
      {p.href && !p.current && !p.disabled ? (
        <Button variant={p.featured ? "primary" : "secondary"} className="tf-plan-cta" asChild>
          <Link href={p.href} onClick={p.onPick}>
            {p.cta || t.choosePlan(p.name)}
          </Link>
        </Button>
      ) : (
        <Button
          variant={p.current ? "soft" : p.featured ? "primary" : "secondary"}
          disabled={p.current || p.disabled}
          onClick={p.onPick}
          className="tf-plan-cta"
        >
          {p.current ? t.currentPlan : p.cta || t.choosePlan(p.name)}
        </Button>
      )}
      <ul className="tf-plan-feats">
        {(p.features || []).map((f, i) => (
          <li key={i} className={f[0] === "-" ? "no" : undefined}>
            <Icon name={f[0] === "-" ? "minus" : "check"} size={14} />
            {f.replace(/^-/, "")}
          </li>
        ))}
      </ul>
    </div>
  );
}
