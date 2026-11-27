"use client";
/**
 * Brand studio: PaletteSwatches (a palette as data, with HEX, OKLCH and WCAG contrast on light
 * and dark) and AssetCard (a generated image or asset with its state, versions, regenerate, make
 * current and download).
 */
import * as React from "react";
import { cx } from "../cx.js";
import { useStrings } from "../context.js";
import { BRAND_STUDIO_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { useControlled, useId } from "../hooks.js";
import { contrastRatio, formatOklch, wcagLevel } from "../color.js";
import { Badge, Button, IconButton } from "./foundation.js";
import { Spinner } from "./building-blocks.js";
import type { AssetCardProps, AssetState, PaletteSwatchesProps } from "./types.js";

/* ── PaletteSwatches ── */

// Backgrounds the contrast is measured against when the palette does not say: white and the
// near-black most dark themes use. They are data for the maths, not theme colours.
const ON_LIGHT = "#ffffff";
const ON_DARK = "#111114";

function CopyValue(p: { value: string; label: string }) {
  const t = useStrings(BRAND_STUDIO_STRINGS);
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 1400);
    return () => clearTimeout(id);
  }, [done]);
  return (
    <button
      type="button"
      className="tf-swatch-value"
      aria-label={t.copyValue(p.label, p.value)}
      onClick={() => {
        try {
          void navigator.clipboard?.writeText(p.value);
        } catch {
          /* clipboard unavailable */
        }
        setDone(true);
      }}
    >
      <span className="tf-mono">{p.value}</span>
      <Icon name={done ? "check" : "copy"} size={12} />
      <span className="tf-sr-only" aria-live="polite">
        {done ? t.copied : ""}
      </span>
    </button>
  );
}

function ContrastRow(p: { color: string; bg: string; label: string }) {
  const t = useStrings(BRAND_STUDIO_STRINGS);
  const ratio = contrastRatio(p.color, p.bg);
  if (Number.isNaN(ratio)) return null;
  const level = wcagLevel(ratio);
  const text = ratio.toFixed(ratio >= 10 ? 1 : 2).replace(/\.?0+$/, "");
  return (
    <div className="tf-swatch-contrast">
      <span className="tf-swatch-sample" style={{ background: p.bg, color: p.color }} aria-hidden>
        Aa
      </span>
      <span className="tf-swatch-on">{p.label}</span>
      <span className="tf-mono">{t.contrastRatio(text)}</span>
      <Badge tone={level === "Fail" ? "danger" : level === "AA Large" ? "warning" : "success"}>
        {level === "Fail" ? t.contrastFail : level === "AA Large" ? t.contrastLarge : level}
      </Badge>
    </div>
  );
}

export function PaletteSwatches(p: PaletteSwatchesProps) {
  const t = useStrings(BRAND_STUDIO_STRINGS);
  const light = p.light ?? ON_LIGHT;
  const dark = p.dark ?? ON_DARK;
  return (
    <ul
      className={cx("tf-swatches", p.compact && "compact", p.className)}
      style={p.style}
      aria-label={p.label || t.palette}
    >
      {p.colors.map((c) => (
        <li key={c.name + c.value} className={cx("tf-swatch", p.surface && "tf-" + p.surface)}>
          <span className="tf-swatch-chip" style={{ background: c.value }} aria-hidden />
          <div className="tf-swatch-body">
            <div className="tf-swatch-head">
              <b>{c.name}</b>
              {c.role && <small>{c.role}</small>}
            </div>
            <CopyValue value={c.value.toUpperCase()} label={t.hex} />
            {formatOklch(c.value) && <CopyValue value={formatOklch(c.value)} label={t.oklch} />}
            {p.contrast !== false && !p.compact && (
              <div className="tf-swatch-contrasts">
                <ContrastRow color={c.value} bg={light} label={t.onLight} />
                <ContrastRow color={c.value} bg={dark} label={t.onDark} />
              </div>
            )}
            {c.note && <p className="tf-swatch-note">{c.note}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── AssetCard ── */

const STATE_TONE: Record<AssetState, "neutral" | "info" | "success" | "danger"> = {
  queued: "neutral",
  generating: "info",
  done: "success",
  failed: "danger",
};

export function AssetCard(p: AssetCardProps) {
  const t = useStrings(BRAND_STUDIO_STRINGS);
  const uid = useId("asset");
  const versions = p.versions.length ? p.versions : [{ id: "empty" }];
  const [index, setIndex] = useControlled<number>(
    p.version,
    p.defaultVersion ?? p.current ?? versions.length - 1,
    p.onVersionChange,
  );
  const i = Math.min(Math.max(0, index), versions.length - 1);
  const v = versions[i] ?? versions[0]!;
  const state: AssetState = p.state ?? v.state ?? (v.src ? "done" : "queued");
  const busy = state === "queued" || state === "generating";
  const [editing, setEditing] = React.useState(false);
  const [prompt, setPrompt] = React.useState(v.prompt ?? p.prompt ?? "");
  React.useEffect(() => {
    if (!editing) setPrompt(v.prompt ?? p.prompt ?? "");
  }, [v.prompt, p.prompt, editing]);
  const stateWord = {
    queued: t.assetQueued,
    generating: t.assetGenerating,
    done: t.assetDone,
    failed: t.assetFailed,
  }[state];
  const isCurrent = p.current === i;
  const watermark = p.watermark === true ? t.watermark : p.watermark || null;
  const download = v.downloadHref;
  return (
    <article
      className={cx("tf-asset", state, p.surface && "tf-" + p.surface, p.className)}
      style={p.style}
      aria-labelledby={uid + "-t"}
      aria-busy={busy || undefined}
    >
      <div
        className="tf-asset-media"
        style={p.ratio ? ({ aspectRatio: String(p.ratio) } as React.CSSProperties) : undefined}
      >
        {state === "done" && v.src ? (
          <img src={v.src} alt={p.alt ?? p.title} loading="lazy" draggable={false} />
        ) : (
          <div className="tf-asset-placeholder">
            {state === "generating" ? (
              <Spinner label={stateWord} />
            ) : (
              <Icon name={state === "failed" ? "x" : "clock"} size={22} />
            )}
            <span>{state === "failed" ? v.error || p.error || stateWord : stateWord}</span>
          </div>
        )}
        {watermark && state === "done" && (
          <span className="tf-asset-mark">
            <Badge tone="neutral">{watermark}</Badge>
          </span>
        )}
      </div>
      <div className="tf-asset-head">
        <b id={uid + "-t"}>{p.title}</b>
        <Badge tone={STATE_TONE[state]} dot>
          {stateWord}
        </Badge>
      </div>
      {(p.meta || isCurrent || versions.length > 1) && (
        <div className="tf-asset-meta">
          {versions.length > 1 && (
            <span className="tf-asset-versions" role="group" aria-label={t.versions}>
              <IconButton
                icon="chevronLeft"
                variant="ghost"
                size="sm"
                label={t.previousVersion}
                disabled={i === 0}
                onClick={() => setIndex(i - 1)}
              />
              <span
                className="tf-mono"
                aria-live="polite"
                aria-label={t.versionOf(i + 1, versions.length)}
              >
                {i + 1}/{versions.length}
              </span>
              <IconButton
                icon="chevronRight"
                variant="ghost"
                size="sm"
                label={t.nextVersion}
                disabled={i === versions.length - 1}
                onClick={() => setIndex(i + 1)}
              />
            </span>
          )}
          {isCurrent && <Badge tone="info">{t.currentVersion}</Badge>}
          {p.meta && <span className="tf-asset-info">{p.meta}</span>}
        </div>
      )}
      {editing && p.onRegenerate && (
        <form
          className="tf-asset-prompt"
          onSubmit={(e) => {
            e.preventDefault();
            p.onRegenerate?.(prompt.trim());
            setEditing(false);
          }}
        >
          <label className="tf-label" htmlFor={uid + "-p"}>
            {t.prompt}
          </label>
          <textarea
            id={uid + "-p"}
            className="tf-input"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditing(false);
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                e.currentTarget.form?.requestSubmit();
            }}
          />
          <div className="tf-asset-actions">
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              {t.cancel}
            </Button>
            <Button size="sm" type="submit" icon="sparkle" disabled={!prompt.trim()}>
              {t.generate}
            </Button>
          </div>
        </form>
      )}
      {!editing && (p.onRegenerate || p.onMakeCurrent || p.onDownload || download || p.actions) && (
        <div className="tf-asset-actions">
          {p.onMakeCurrent && !isCurrent && state === "done" && (
            <Button size="sm" variant="secondary" icon="check" onClick={() => p.onMakeCurrent?.(i)}>
              {t.makeCurrent}
            </Button>
          )}
          {p.onRegenerate && (
            <Button
              size="sm"
              variant="soft"
              icon="refresh"
              disabled={busy}
              onClick={() => setEditing(true)}
            >
              {t.regenerate}
            </Button>
          )}
          {p.actions}
          {download ? (
            <a
              className="tf-iconbtn tf-iconbtn-ghost tf-iconbtn-sm"
              href={download}
              download=""
              aria-label={t.downloadVersion(i + 1)}
              title={t.downloadVersion(i + 1)}
            >
              <Icon name="download" />
            </a>
          ) : p.onDownload ? (
            <IconButton
              icon="download"
              variant="ghost"
              size="sm"
              label={t.downloadVersion(i + 1)}
              disabled={state !== "done"}
              onClick={() => p.onDownload?.(i)}
            />
          ) : null}
        </div>
      )}
    </article>
  );
}
