"use client";
import * as React from "react";
import { useControlled } from "../hooks.js";
import { cx } from "../cx.js";
import { formatPercent } from "../format.js";
import { Icon } from "../Icon.js";
import { Portal } from "../portal.js";
import { StatusShape } from "./status.js";
import { IconButton } from "./foundation.js";
import type {
  BeforeAfterProps,
  GalleryItem,
  GalleryProps,
  ImageVariant,
  ImageVariantsProps,
  MediaPane,
} from "./types.js";

/* ── Media ── */
export function ImageVariants(p: ImageVariantsProps) {
  const sel = useControlled<string | number>(p.selected, p.variants?.[0]?.id ?? "", p.onSelect),
    cur: Partial<ImageVariant> = (p.variants || []).find((v) => v.id === sel[0]) || {};
  return (
    <div className="tf-imgvar">
      <div
        className="tf-imgvar-stage"
        style={
          cur.ratio
            ? {
                aspectRatio: cur.ratio,
              }
            : undefined
        }
      >
        {cur.src ? (
          <img src={cur.src} alt={p.alt || ""} />
        ) : (
          <div className={cx("tf-imgvar-ph", "tf-t-" + (p.tint || "sky"))}>
            <Icon name="image" size={32} />
          </div>
        )}
        {cur.label && <span className="tf-imgvar-tag">{cur.label}</span>}
      </div>
      <div className="tf-imgvar-list" role="listbox" aria-label="Variants">
        {(p.variants || []).map((v) => (
          <button
            key={v.id}
            type="button"
            role="option"
            aria-selected={v.id === sel[0]}
            className={cx("tf-imgvar-item", v.id === sel[0] && "on")}
            onClick={() => {
              sel[1](v.id);
            }}
          >
            <span
              className="tf-imgvar-thumb"
              style={
                v.ratio
                  ? {
                      aspectRatio: v.ratio,
                    }
                  : undefined
              }
            >
              {v.src ? <img src={v.src} alt="" /> : <Icon name="image" size={14} />}
            </span>
            <span className="tf-option-text">
              <b>{v.label}</b>
              <small className="tf-mono">
                {[v.size, v.format, v.weight].filter(Boolean).join(" · ")}
              </small>
            </span>
            {v.status && <StatusShape status={v.status} />}
          </button>
        ))}
      </div>
      {p.actions && (
        <div
          className="tf-row"
          style={{
            justifyContent: "flex-end",
          }}
        >
          {p.actions}
        </div>
      )}
    </div>
  );
}

export function Gallery(p: GalleryProps) {
  const items = p.items || [],
    i = React.useState(p.start || 0),
    full = React.useState(false),
    n = items.length,
    cur: GalleryItem = items[i[0]] || {};
  function go(d: number) {
    i[1]((i[0] + d + n) % n);
  }
  React.useEffect(() => {
    if (!full[0]) return;
    function k(e: KeyboardEvent) {
      if (e.key === "Escape") full[1](false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("keydown", k);
    };
  });
  function pic(it: GalleryItem, cls: string, loading: "lazy" | "eager" = p.loading || "lazy") {
    return it.src ? (
      <img
        className={cls}
        src={it.src}
        alt={it.alt || ""}
        loading={loading}
        decoding="async"
        referrerPolicy={p.referrerPolicy}
      />
    ) : (
      <div className={cx(cls, "tf-gallery-ph", "tf-t-" + (it.tint || "sky"))}>
        {it.art || <Icon name="image" size={28} />}
      </div>
    );
  }
  const stage = (
    <div
      className="tf-gallery-stage"
      style={{
        aspectRatio: p.ratio || "3 / 2",
      }}
    >
      {pic(cur, "tf-gallery-img")}
      {n > 1 && (
        <IconButton
          icon="chevronLeft"
          label="Previous image"
          className="tf-gallery-prev"
          onClick={() => {
            go(-1);
          }}
        />
      )}
      {n > 1 && (
        <IconButton
          icon="chevronRight"
          label="Next image"
          className="tf-gallery-next"
          onClick={() => {
            go(1);
          }}
        />
      )}
      <span className="tf-gallery-count">{i[0] + 1 + " / " + n}</span>
      {!full[0] && p.fullscreen !== false && (
        <IconButton
          icon="expand"
          label="Full screen"
          className="tf-gallery-full"
          onClick={() => {
            full[1](true);
          }}
        />
      )}
      {p.badge && <span className="tf-gallery-badge">{p.badge}</span>}
    </div>
  );
  return (
    <div className="tf-gallery">
      {stage}
      {p.thumbs !== false && n > 1 && (
        <div className="tf-gallery-thumbs" role="tablist" aria-label="Images">
          {items.map((it, k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={k === i[0]}
              className={cx(k === i[0] && "on")}
              onClick={() => {
                i[1](k);
              }}
              aria-label={it.caption || it.alt || (it.src ? `Image ${k + 1}` : undefined)}
            >
              {pic(it, "tf-gallery-thumb", "lazy")}
            </button>
          ))}
        </div>
      )}
      {full[0] && (
        <Portal>
          <div className="tf-lightbox" role="dialog" aria-modal="true" aria-label="Images">
            <IconButton
              icon="x"
              label="Close"
              className="tf-lightbox-close"
              onClick={() => {
                full[1](false);
              }}
            />
            <div className="tf-lightbox-stage">
              {pic(cur, "tf-gallery-img", "eager")}
              {n > 1 && (
                <IconButton
                  icon="chevronLeft"
                  label="Previous image"
                  className="tf-gallery-prev"
                  onClick={() => {
                    go(-1);
                  }}
                />
              )}
              {n > 1 && (
                <IconButton
                  icon="chevronRight"
                  label="Next image"
                  className="tf-gallery-next"
                  onClick={() => {
                    go(1);
                  }}
                />
              )}
            </div>
            <span className="tf-lightbox-cap">
              {(cur.caption ? cur.caption + " · " : "") + (i[0] + 1) + " / " + n}
            </span>
          </div>
        </Portal>
      )}
    </div>
  );
}

export function BeforeAfter(p: BeforeAfterProps) {
  const pos = React.useState(p.start != null ? p.start : 50),
    pct = Math.round(pos[0]),
    before = p.beforeLabel || "Before",
    after = p.afterLabel || "After",
    ref = React.useRef<HTMLDivElement>(null),
    drag = React.useRef(false);
  function at(e: { clientX: number }) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    pos[1](Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  }
  function pane(x: MediaPane | undefined, cls: string) {
    return x && x.src ? (
      <img
        className={cls}
        src={x.src}
        alt={x.alt || ""}
        loading={p.loading || "lazy"}
        decoding="async"
        referrerPolicy={p.referrerPolicy}
      />
    ) : (
      <div className={cx(cls, "tf-ba-ph", x && x.tint && "tf-t-" + x.tint)}>{x && x.art}</div>
    );
  }
  return (
    <div
      ref={ref}
      className="tf-ba"
      style={{
        aspectRatio: p.ratio || "3 / 2",
      }}
      onPointerDown={(e) => {
        drag.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        at(e);
      }}
      onPointerMove={(e) => {
        if (drag.current) at(e);
      }}
      onPointerUp={() => {
        drag.current = false;
      }}
    >
      {pane(p.after, "tf-ba-img")}
      <div
        className="tf-ba-before"
        style={{
          clipPath: "inset(0 " + (100 - pos[0]) + "% 0 0)",
        }}
      >
        {pane(p.before, "tf-ba-img")}
      </div>
      <span className="tf-ba-tag left">{before}</span>
      <span className="tf-ba-tag right">{after}</span>
      <div
        className="tf-ba-line"
        style={{
          left: pos[0] + "%",
        }}
      >
        <span
          className="tf-ba-knob"
          role="slider"
          tabIndex={0}
          aria-label={p.label || "Compare before and after"}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-valuetext={
            p.valueText
              ? p.valueText(pct)
              : `${before} ${formatPercent(pct)}, ${after} ${formatPercent(100 - pct)}`
          }
          onKeyDown={(e) => {
            const to =
              e.key === "ArrowLeft" || e.key === "ArrowDown"
                ? pos[0] - 5
                : e.key === "ArrowRight" || e.key === "ArrowUp"
                  ? pos[0] + 5
                  : e.key === "PageDown"
                    ? pos[0] - 25
                    : e.key === "PageUp"
                      ? pos[0] + 25
                      : e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 100
                          : null;
            if (to == null) return;
            e.preventDefault();
            pos[1](Math.max(0, Math.min(100, to)));
          }}
        >
          <Icon name="chevronLeft" size={12} />
          <Icon name="chevronRight" size={12} />
        </span>
      </div>
    </div>
  );
}

/* ── Real estate ── */
