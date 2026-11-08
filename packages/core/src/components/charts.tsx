"use client";

import * as React from "react";
import { useMounted, useWidth } from "../hooks.js";
import { L, formatNumber } from "../i18n.js";
import { cx, reduced } from "../cx.js";
import { Icon } from "../Icon.js";
import { CountUp } from "./data-display.js";
import type {
  AreaChartProps,
  BarChartProps,
  DonutProps,
  FunnelProps,
  GaugeProps,
  HeatmapProps,
  LegendProps,
  LineChartProps,
  Series,
  SparklineProps,
  StackedBarChartProps,
} from "./types.js";
function niceMax(m: number) {
  const p = Math.pow(10, Math.floor(Math.log10(m || 1)));
  return Math.ceil(m / p) * p;
}
export function BarChart(p: BarChartProps) {
  const mw = useWidth(p.width, 560),
    data = p.data || [],
    W = mw[1],
    Hh = p.height || 200,
    pad = 34,
    max = niceMax(Math.max.apply(null, data.map((d) => d.value).concat([1])));
  const n = data.length,
    gw = Math.max(1, (W - pad) / n),
    bw = Math.max(1, Math.min(p.barWidth || 28, gw * 0.62)),
    ticks = [0, 0.5, 1];
  return (
    <div ref={mw[0]} className="tf-chart-wrap">
      <svg
        className="tf-chart"
        width={W}
        height={Hh + 22}
        viewBox={"0 0 " + W + " " + (Hh + 22)}
        preserveAspectRatio="xMinYMin meet"
        role="img"
        aria-label={p.label || L("Bar chart")}
      >
        {ticks.map((t) => {
          const y = Hh - t * (Hh - 10);
          return (
            <g key={t}>
              <line
                className="grid"
                x1={pad}
                x2={W}
                y1={y}
                y2={y}
                strokeDasharray={t ? "3 5" : undefined}
              />
              <text x={0} y={y + 4}>
                {p.format ? p.format(max * t) : Math.round(max * t)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const bh = Math.max(4, (d.value / max) * (Hh - 10)),
            x = pad + gw * i + (gw - bw) / 2;
          return (
            <g key={i}>
              <rect
                className={cx("tf-bar", "tf-bar-" + (d.tint || p.tint || "ink"))}
                x={x}
                y={Hh - bh}
                width={bw}
                height={bh}
                rx={Math.min(10, bw / 2)}
                style={{
                  animationDelay: 120 + i * 55 + "ms",
                }}
              >
                <title>{d.label + ": " + d.value}</title>
              </rect>
              <text x={x + bw / 2} y={Hh + 18} textAnchor="middle">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
export function LineChart(p: LineChartProps) {
  const mw = useWidth(p.width, 560),
    series = p.series || [],
    labels = p.labels || [],
    W = mw[1],
    Hh = p.height || 200,
    pad = 44;
  let all: number[] = [];
  series.forEach((s) => {
    all = all.concat(s.values);
  });
  const max = niceMax(Math.max(...all, 1)),
    n = labels.length || (series[0] && series[0].values.length) || 1;
  function X(i: number) {
    return pad + 14 + (W - pad - 32) * (n === 1 ? 0 : i / (n - 1));
  }
  function Y(v: number) {
    return Hh - (v / max) * (Hh - 12);
  }
  function path(vals: number[]) {
    return vals.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
  }
  return (
    <div ref={mw[0]} className="tf-chart-wrap">
      <svg
        className="tf-chart"
        width={W}
        height={Hh + 22}
        viewBox={"0 0 " + W + " " + (Hh + 22)}
        preserveAspectRatio="xMinYMin meet"
        role="img"
        aria-label={p.label || L("Line chart")}
      >
        {[0, 0.5, 1].map((t) => {
          const y = Hh - t * (Hh - 12);
          return (
            <g key={t}>
              <line
                className="grid"
                x1={pad}
                x2={W}
                y1={y}
                y2={y}
                strokeDasharray={t ? "3 5" : undefined}
              />
              <text x={0} y={y + 4}>
                {p.format ? p.format(max * t) : Math.round(max * t)}
              </text>
            </g>
          );
        })}
        {labels.map((l, i) => (
          <text key={l + i} x={X(i)} y={Hh + 18} textAnchor="middle">
            {l}
          </text>
        ))}
        {series.map((s, si) => {
          const tint = s.tint || "ink",
            d = path(s.values),
            last = s.values.length - 1;
          return (
            <g key={si}>
              {s.area && (
                <path
                  className={cx("tf-area", "tf-area-" + tint)}
                  d={d + " L" + X(last) + " " + Hh + " L" + X(0) + " " + Hh + " Z"}
                />
              )}
              <path
                className={cx("tf-line", "tf-line-" + tint)}
                d={d}
                pathLength={1}
                style={{
                  animationDelay: 150 + si * 200 + "ms",
                }}
              />
              <circle
                className={cx("tf-dotpt", "tf-line-" + tint)}
                cx={X(last)}
                cy={Y(s.values[last])}
                r={4.5}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
export function Sparkline(p: SparklineProps) {
  const v = p.values || [],
    W = p.width || 120,
    Hh = p.height || 36,
    max = Math.max.apply(null, v),
    min = Math.min.apply(null, v),
    rng = max - min || 1;
  const d = v
    .map(
      (x, i) =>
        (i ? "L" : "M") +
        (2 + ((W - 4) * i) / (v.length - 1)).toFixed(1) +
        " " +
        (Hh - 3 - ((x - min) / rng) * (Hh - 6)).toFixed(1),
    )
    .join(" ");
  return (
    <svg
      className="tf-chart"
      viewBox={"0 0 " + W + " " + Hh}
      width={W}
      height={Hh}
      role="img"
      aria-label={p.label || L("Trend")}
    >
      <path
        className={cx("tf-line", "tf-line-" + (p.tint || "ink"))}
        d={d}
        pathLength={1}
        style={{
          strokeWidth: 2,
        }}
      />
    </svg>
  );
}
export function Donut(p: DonutProps) {
  const data = p.data || [],
    size = p.size || 168,
    sw = p.stroke || 22,
    r = (size - sw) / 2,
    c = 2 * Math.PI * r,
    total = data.reduce((a, d) => a + d.value, 0) || 1,
    on = useMounted(150);
  let acc = 0;
  const gap = data.length > 1 ? 6 : 0;
  return (
    <div
      className="tf-donut"
      style={{
        gap: 24,
      }}
    >
      <div
        className="tf-ring"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={"0 0 " + size + " " + size}
          role="img"
          aria-label={p.label || L("Breakdown")}
        >
          <circle className="tf-arc-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} />
          {data.map((d, i) => {
            const len = Math.max(0, (c * d.value) / total - gap),
              off = acc;
            acc += (c * d.value) / total;
            return (
              <circle
                key={i}
                className={cx("tf-arc", "tf-arc-" + (d.tint || "ink"))}
                cx={size / 2}
                cy={size / 2}
                r={r}
                strokeWidth={sw}
                strokeDasharray={(on || reduced() ? len : 0) + " " + c}
                strokeDashoffset={-off}
                style={{
                  transition: "stroke-dasharray var(--dur-slow) var(--ease-out) " + i * 90 + "ms",
                }}
              />
            );
          })}
        </svg>
        {p.center && (
          <span className="tf-ring-label">
            <span>
              <CountUp value={p.center} />
              {p.caption && <small>{p.caption}</small>}
            </span>
          </span>
        )}
      </div>
      {p.legend !== false && (
        <div
          className="tf-col tf-donut-legend"
          style={{
            gap: 12,
          }}
        >
          {data.map((d, i) => (
            <div
              key={i}
              className="tf-legend"
              style={{
                justifyContent: "space-between",
              }}
            >
              <span>
                <i
                  style={{
                    background:
                      (d.tint || "ink") === "ink" ? "var(--accent)" : "var(--" + d.tint + "-ink)",
                  }}
                />
                {d.label}
              </span>
              <b
                style={{
                  color: "var(--ink)",
                }}
              >
                {Math.round((d.value / total) * 100) + "%"}
              </b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── More charts ── */
export interface ChartTipProps {
  x: number;
  y: number;
  title: React.ReactNode;
  rows: {
    label: string;
    tint?: string;
    value: React.ReactNode;
  }[];
}
export function ChartTip(p: ChartTipProps) {
  return (
    <div
      className="tf-chart-tip"
      style={{
        left: p.x,
        top: p.y,
      }}
    >
      <b>{p.title}</b>
      {p.rows.map((r) => (
        <span key={r.label}>
          <i className={"tf-sw tf-sw-" + r.tint} />
          {r.label}
          <em>{r.value}</em>
        </span>
      ))}
    </div>
  );
}
export function Legend(p: LegendProps) {
  return (
    <div className="tf-legend">
      {(p.items || []).map((s) => (
        <span key={s.name || s.label}>
          <i className={"tf-sw tf-sw-" + (s.tint || "ink")} />
          {s.name || s.label}
        </span>
      ))}
    </div>
  );
}
export function StackedBarChart(p: StackedBarChartProps) {
  const mw = useWidth(p.width, 560),
    W = mw[1],
    Hh = p.height || 200,
    pad = 40,
    series = p.series || [],
    labels = p.labels || [],
    hov = React.useState<number | null>(null),
    f = p.format || ((v) => Math.round(v));
  const totals = labels.map((_, i) => series.reduce((a, s) => a + (s.values[i] || 0), 0)),
    max = niceMax(Math.max.apply(null, totals.concat([1])));
  const n = labels.length || 1,
    gw = Math.max(1, (W - pad) / n),
    bw = Math.max(1, Math.min(p.barWidth || 28, gw * 0.62));
  return (
    <div ref={mw[0]} className="tf-chart-wrap tf-chart-hover">
      <svg
        className="tf-chart"
        width={W}
        height={Hh + 22}
        viewBox={"0 0 " + W + " " + (Hh + 22)}
        role="img"
        aria-label={p.label || L("Stacked bar chart")}
        onPointerLeave={() => {
          hov[1](null);
        }}
      >
        {[0, 0.5, 1].map((t) => {
          const y = Hh - t * (Hh - 10);
          return (
            <g key={t}>
              <line
                className="grid"
                x1={pad}
                x2={W}
                y1={y}
                y2={y}
                strokeDasharray={t ? "3 5" : undefined}
              />
              <text x={0} y={y + 4}>
                {f(max * t)}
              </text>
            </g>
          );
        })}
        {labels.map((l, i) => {
          const x = pad + gw * i + (gw - bw) / 2;
          let acc = 0;
          return (
            <g
              key={i}
              onPointerEnter={() => {
                hov[1](i);
              }}
              className={hov[0] != null && hov[0] !== i ? "dim" : undefined}
            >
              <rect x={pad + gw * i} y={0} width={gw} height={Hh} fill="transparent" />
              {series.map((s, si) => {
                const v = s.values[i] || 0,
                  bh = (v / max) * (Hh - 10),
                  y = Hh - acc - bh;
                acc += bh;
                const top =
                  si === series.length - 1 || series.slice(si + 1).every((z) => !(z.values[i] > 0));
                return (
                  v > 0 && (
                    <path
                      key={si}
                      className={cx("tf-seg-bar", "tf-sf-" + (s.tint || "ink"))}
                      style={{
                        animationDelay: 120 + i * 45 + "ms",
                      }}
                      d={
                        top
                          ? roundTop(x, y, bw, Math.max(bh - 2, 1), Math.min(8, bw / 2))
                          : "M" +
                            x +
                            " " +
                            y +
                            "h" +
                            bw +
                            "v" +
                            Math.max(bh - 2, 1) +
                            "h-" +
                            bw +
                            "z"
                      }
                    />
                  )
                );
              })}
              <text x={x + bw / 2} y={Hh + 18} textAnchor="middle">
                {l}
              </text>
            </g>
          );
        })}
      </svg>
      {hov[0] != null && (
        <ChartTip
          x={Math.min(W - 180, pad + gw * hov[0] + gw / 2 + 12)}
          y={8}
          title={labels[hov[0]] + " · " + f(totals[hov[0]])}
          rows={series
            .slice()
            .reverse()
            .map((s) => ({
              label: s.name,
              tint: s.tint || "ink",
              value: f(s.values[hov[0] as number] || 0),
            }))}
        />
      )}
      {p.legend !== false && <Legend items={series} />}
    </div>
  );
}
function roundTop(x: number, y: number, w: number, hh: number, r: number) {
  r = Math.min(r, hh);
  return (
    "M" +
    x +
    " " +
    (y + hh) +
    "V" +
    (y + r) +
    "Q" +
    x +
    " " +
    y +
    " " +
    (x + r) +
    " " +
    y +
    "H" +
    (x + w - r) +
    "Q" +
    (x + w) +
    " " +
    y +
    " " +
    (x + w) +
    " " +
    (y + r) +
    "V" +
    (y + hh) +
    "Z"
  );
}
function smooth(pts: number[][]) {
  if (pts.length < 2) return "";
  let d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i],
      b = pts[i + 1],
      mx = (a[0] + b[0]) / 2;
    d +=
      " C" +
      mx.toFixed(1) +
      " " +
      a[1].toFixed(1) +
      " " +
      mx.toFixed(1) +
      " " +
      b[1].toFixed(1) +
      " " +
      b[0].toFixed(1) +
      " " +
      b[1].toFixed(1);
  }
  return d;
}
export function AreaChart(p: AreaChartProps) {
  const mw = useWidth(p.width, 560),
    W = mw[1],
    Hh = p.height || 200,
    pad = 44,
    series = p.series || [],
    labels = p.labels || [],
    hov = React.useState<number | null>(null),
    f = p.format || ((v) => Math.round(v));
  const n = labels.length,
    stacked = p.stacked !== false;
  let base = labels.map(() => 0);
  const layers: {
    s: Series;
    lo: number[];
    hi: number[];
  }[] = [];
  series.forEach((s) => {
    const top = s.values.map((v, i) => (stacked ? base[i] : 0) + v);
    layers.push({
      s: s,
      lo: stacked ? base.slice() : labels.map(() => 0),
      hi: top,
    });
    if (stacked) base = top;
  });
  const max = niceMax(Math.max(...layers.reduce<number[]>((a, l) => a.concat(l.hi), [1])));
  function X(i: number) {
    return pad + 8 + (W - pad - 16) * (n === 1 ? 0 : i / (n - 1));
  }
  function Y(v: number) {
    return Hh - (v / max) * (Hh - 12);
  }
  return (
    <div ref={mw[0]} className="tf-chart-wrap tf-chart-hover">
      <svg
        className="tf-chart"
        width={W}
        height={Hh + 22}
        viewBox={"0 0 " + W + " " + (Hh + 22)}
        role="img"
        aria-label={p.label || L("Area chart")}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect(),
            x = ((e.clientX - r.left) * W) / r.width;
          hov[1](
            Math.max(
              0,
              Math.min(n - 1, Math.round((x - pad - 8) / ((W - pad - 16) / Math.max(1, n - 1)))),
            ),
          );
        }}
        onPointerLeave={() => {
          hov[1](null);
        }}
      >
        {[0, 0.5, 1].map((t) => {
          const y = Hh - t * (Hh - 12);
          return (
            <g key={t}>
              <line
                className="grid"
                x1={pad}
                x2={W}
                y1={y}
                y2={y}
                strokeDasharray={t ? "3 5" : undefined}
              />
              <text x={0} y={y + 4}>
                {f(max * t)}
              </text>
            </g>
          );
        })}
        {labels.map(
          (l, i) =>
            (n <= 12 || i % Math.ceil(n / 8) === 0) && (
              <text key={i} x={X(i)} y={Hh + 18} textAnchor="middle">
                {l}
              </text>
            ),
        )}
        {layers
          .slice()
          .reverse()
          .map((L, k) => {
            const top = L.hi.map((v, i) => [X(i), Y(v)]),
              bot = L.lo.map((v, i) => [X(i), Y(v)]).reverse(),
              tint = L.s.tint || "ink";
            const line = smooth(top),
              back = smooth(bot).replace(/^M/, "L");
            return (
              <g key={k}>
                <path className={cx("tf-area2", "tf-af-" + tint)} d={line + " " + back + " Z"} />
                <path
                  className={cx("tf-line", "tf-line-" + tint)}
                  d={line}
                  pathLength={1}
                  style={{
                    strokeWidth: 2,
                  }}
                />
              </g>
            );
          })}
        {hov[0] != null && (
          <g>
            <line className="tf-crosshair" x1={X(hov[0])} x2={X(hov[0])} y1={0} y2={Hh} />
            {layers.map((L, k) => (
              <circle
                key={k}
                className={cx("tf-hoverpt", "tf-line-" + (L.s.tint || "ink"))}
                cx={X(hov[0] as number)}
                cy={Y(L.hi[hov[0] as number])}
                r={4}
              />
            ))}
          </g>
        )}
      </svg>
      {hov[0] != null && (
        <ChartTip
          x={X(hov[0]) > W - 200 ? X(hov[0]) - 192 : X(hov[0]) + 12}
          y={8}
          title={labels[hov[0]]}
          rows={series
            .slice()
            .reverse()
            .map((s) => ({
              label: s.name,
              tint: s.tint || "ink",
              value: f(s.values[hov[0] as number]),
            }))}
        />
      )}
      {p.legend !== false && <Legend items={series} />}
    </div>
  );
}
export function Heatmap(p: HeatmapProps) {
  const rows = p.rows || [],
    cols = p.cols || [],
    vals = p.values || [],
    flat = vals.flat(),
    max = Math.max(...flat, 1),
    f = p.format || String,
    hov = React.useState<[number, number] | null>(null);
  function lvl(v: number) {
    return v <= 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4));
  }
  return (
    <div className="tf-heat-wrap">
      <div
        className="tf-heat"
        style={{
          gridTemplateColumns: "auto repeat(" + cols.length + ", minmax(0, 1fr))",
        }}
        role="img"
        aria-label={p.label || L("Heatmap")}
        onPointerLeave={() => {
          hov[1](null);
        }}
      >
        <span />
        {cols.map((c, i) => (
          <span key={"c" + i} className="tf-heat-col">
            {(p.colEvery ? i % p.colEvery === 0 : true) ? c : ""}
          </span>
        ))}
        {rows.map((r, ri) => (
          <React.Fragment key={ri}>
            <span className="tf-heat-row">{r}</span>
            {cols.map((c, ci) => {
              const v = (vals[ri] || [])[ci] || 0;
              return (
                <span
                  key={ci}
                  className={cx(
                    "tf-heat-cell",
                    "l" + lvl(v),
                    hov[0] && hov[0][0] === ri && hov[0][1] === ci && "hov",
                  )}
                  style={{
                    animationDelay: ci * 12 + ri * 30 + "ms",
                  }}
                  onPointerEnter={() => {
                    hov[1]([ri, ci]);
                  }}
                  title={r + " " + c + ": " + f(v)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="tf-heat-foot">
        <span>
          {hov[0]
            ? rows[hov[0][0]] +
              " · " +
              cols[hov[0][1]] +
              " — " +
              f((vals[hov[0][0]] || [])[hov[0][1]] || 0)
            : p.caption || ""}
        </span>
        <span className="tf-heat-scale">
          {L("Less")}
          {[0, 1, 2, 3, 4].map((l) => (
            <i key={l} className={"tf-heat-cell l" + l} />
          ))}
          {L("More")}
        </span>
      </div>
    </div>
  );
}
export function Funnel(p: FunnelProps) {
  const steps = p.steps || [],
    top = (steps[0] && steps[0].value) || 1,
    f = p.format || ((v) => formatNumber(v)),
    on = useMounted(120);
  return (
    <div className="tf-funnel">
      {steps.map((s, i) => {
        const pct = (s.value / top) * 100,
          conv = i ? (s.value / (steps[i - 1].value || 1)) * 100 : null;
        return (
          <div key={i} className="tf-funnel-row">
            <div className="tf-funnel-label">
              <b>{s.label}</b>
              <span>{f(s.value)}</span>
            </div>
            <div className="tf-funnel-track">
              <span
                className={cx("tf-funnel-bar", "tf-sf-" + (s.tint || p.tint || "sky"))}
                style={{
                  width: (on || reduced() ? Math.max(pct, 2) : 0) + "%",
                  transitionDelay: i * 90 + "ms",
                }}
              />
              <em>{Math.round(pct) + "%"}</em>
            </div>
            <div className="tf-funnel-conv">
              {conv != null ? (
                <>
                  <Icon name="chevronDown" size={12} />
                  {Math.round(conv) + "%"}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export function Gauge(p: GaugeProps) {
  const size = p.size || 200,
    sw = p.stroke || 18,
    r = (size - sw) / 2,
    c = Math.PI * r,
    max = p.max || 100,
    v = Math.max(0, Math.min(max, p.value || 0)),
    on = useMounted(150);
  const tone =
    p.tint ||
    (p.thresholds
      ? v >= p.thresholds[1]
        ? "blush"
        : v >= p.thresholds[0]
          ? "butter"
          : "mint"
      : "ink");
  return (
    <div
      className="tf-gauge"
      style={{
        width: size,
      }}
    >
      <svg
        width={size}
        height={size / 2 + sw / 2}
        viewBox={"0 0 " + size + " " + (size / 2 + sw / 2)}
        role="img"
        aria-label={L("{label}: {value} of {max}", {
          label: p.label || L("Gauge"),
          value: v,
          max: max,
        })}
      >
        <path
          className="tf-arc-track"
          d={
            "M" +
            sw / 2 +
            " " +
            size / 2 +
            " A" +
            r +
            " " +
            r +
            " 0 0 1 " +
            (size - sw / 2) +
            " " +
            size / 2
          }
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          className={cx("tf-gauge-arc", "tf-arc-" + tone)}
          d={
            "M" +
            sw / 2 +
            " " +
            size / 2 +
            " A" +
            r +
            " " +
            r +
            " 0 0 1 " +
            (size - sw / 2) +
            " " +
            size / 2
          }
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={on || reduced() ? c * (1 - v / max) : c}
        />
      </svg>
      <div className="tf-gauge-label">
        <b>{p.format ? p.format(v) : <CountUp value={v} />}</b>
        {p.caption && <span>{p.caption}</span>}
      </div>
      {p.showRange !== false && (
        <div className="tf-gauge-range">
          <span>{p.format ? p.format(0) : 0}</span>
          <span>{p.format ? p.format(max) : max}</span>
        </div>
      )}
    </div>
  );
}

/* ════════ Kit 3: AI chat & agents, e-commerce, system screens ════════ */

/* ── Rich text: paragraphs, **bold**, `code`, - lists, 1. lists, ```code blocks``` ── */
