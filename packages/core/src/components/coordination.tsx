"use client";
/**
 * Coordination views for multi-agent systems: AgentNetwork (the hierarchy of an orchestrator, its
 * leads and the agents that do the work, as a live graph with handoffs moving along the edges) and
 * CoordinationTicker (the latest handoffs, runs and approvals as a live list).
 */
import * as React from "react";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { useFormat, useLinkAs, useStrings } from "../context.js";
import { useMotion } from "../motion.js";
import { COORDINATION_STRINGS } from "../strings.js";
import { useControlled, useWidth } from "../hooks.js";
import { AgentMark } from "./chat.js";
import { Avatar } from "./foundation.js";
import { StatusShape } from "./status.js";
import type {
  AgentNetworkHandoff,
  AgentNetworkNode,
  AgentNetworkProps,
  CoordinationEvent,
  CoordinationTickerProps,
  IconName,
} from "./types.js";

/* ── Layout ── */
const NODE_W = 196;
const NODE_H = 60;
const GAP_X = 20;
const GAP_Y = 64;
const PAD = 24;

interface Placed {
  node: AgentNetworkNode;
  parent: string | null;
  depth: number;
  x: number;
  y: number;
}

/** A tidy tree: leaves side by side, each parent centred over its children. */
export function layoutAgentNetwork(root: AgentNetworkNode): {
  nodes: Map<string, Placed>;
  width: number;
  height: number;
} {
  const nodes = new Map<string, Placed>();
  let leaf = 0;
  let maxDepth = 0;
  function walk(n: AgentNetworkNode, parent: string | null, depth: number): number {
    maxDepth = Math.max(maxDepth, depth);
    const kids = n.children || [];
    let x: number;
    if (!kids.length) x = leaf++ * (NODE_W + GAP_X);
    else {
      const xs = kids.map((k) => walk(k, n.id, depth + 1));
      x = (xs[0]! + xs[xs.length - 1]!) / 2;
    }
    nodes.set(n.id, { node: n, parent, depth, x, y: depth * (NODE_H + GAP_Y) });
    return x;
  }
  walk(root, null, 0);
  return {
    nodes,
    width: Math.max(1, leaf) * (NODE_W + GAP_X) - GAP_X,
    height: (maxDepth + 1) * (NODE_H + GAP_Y) - GAP_Y,
  };
}

type Pt = [number, number];

/** The way a handoff travels: up the edges to the shared lead, then down to the receiver. */
export function handoffPath(nodes: Map<string, Placed>, from: string, to: string): Pt[] {
  const chain = (id: string) => {
    const out: string[] = [];
    let cur: string | null = id;
    while (cur && nodes.has(cur)) {
      out.push(cur);
      cur = nodes.get(cur)!.parent;
    }
    return out;
  };
  const up = chain(from);
  const down = chain(to);
  if (!up.length || !down.length) return [];
  const common = up.find((id) => down.includes(id));
  if (!common) return [];
  const pts: Pt[] = [];
  const centre = (id: string): Pt => {
    const p = nodes.get(id)!;
    return [p.x + NODE_W / 2, p.y + NODE_H / 2];
  };
  // child → parent along the elbow: child top, middle line, parent bottom
  const step = (child: string, parent: string): Pt[] => {
    const c = nodes.get(child)!;
    const p = nodes.get(parent)!;
    const mid = p.y + NODE_H + GAP_Y / 2;
    return [
      [c.x + NODE_W / 2, c.y],
      [c.x + NODE_W / 2, mid],
      [p.x + NODE_W / 2, mid],
      [p.x + NODE_W / 2, p.y + NODE_H],
    ];
  };
  pts.push(centre(from));
  for (let i = 0; up[i] !== common; i++) pts.push(...step(up[i]!, up[i + 1]!));
  const downTo = down.slice(0, down.indexOf(common));
  for (let i = downTo.length - 1; i >= 0; i--) {
    const parent = i + 1 < downTo.length ? downTo[i + 1]! : common;
    pts.push(...step(downTo[i]!, parent).reverse());
  }
  pts.push(centre(to));
  return pts;
}

function pointAt(pts: Pt[], t: number): Pt {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
    lens.push(l);
    total += l;
  }
  let d = t * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]! || i === lens.length - 1) {
      const k = lens[i] ? Math.min(1, d / lens[i]!) : 1;
      const a = pts[i]!;
      const b = pts[i + 1]!;
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    }
    d -= lens[i]!;
  }
  return pts[pts.length - 1] ?? [0, 0];
}

const STATUS_OF = (n: AgentNetworkNode) => n.status || "idle";

function flatten(n: AgentNetworkNode, depth = 0, out: [AgentNetworkNode, number][] = []) {
  out.push([n, depth]);
  for (const c of n.children || []) flatten(c, depth + 1, out);
  return out;
}

function NodeMark({ node, size }: { node: AgentNetworkNode; size: number }) {
  return node.avatar !== undefined ? (
    <Avatar name={node.name} src={node.avatar || undefined} size={size} />
  ) : (
    <AgentMark tint={node.tint} icon={node.icon} size={size} />
  );
}

interface Packet {
  key: string;
  label?: string;
  pts: Pt[];
  start: number;
  ms: number;
}

/* ── AgentNetwork ── */
export function AgentNetwork(p: AgentNetworkProps) {
  const t = useStrings(COORDINATION_STRINGS);
  const motion = useMotion();
  const Link = useLinkAs(p.linkAs);
  const [boxRef, width] = useWidth<HTMLDivElement>(undefined, 720);
  const layout = p.layout === "auto" || !p.layout ? (width < 560 ? "list" : "graph") : p.layout;
  const placed = React.useMemo(() => layoutAgentNetwork(p.root), [p.root]);
  const [selected, setSelected] = useControlled<string | null>(
    p.selected,
    p.defaultSelected ?? null,
    p.onSelect ? (id) => p.onSelect?.(id ? placed.nodes.get(id)?.node || null : null) : undefined,
  );
  const sel = selected ? placed.nodes.get(selected)?.node : undefined;

  // Pan and zoom
  const height = p.height ?? 440;
  const [view, setView] = React.useState({ x: 0, y: 0, k: 1 });
  const fit = React.useCallback(() => {
    const w = placed.width + PAD * 2;
    const h = placed.height + PAD * 2;
    const k = Math.min(1.2, Math.max(0.3, Math.min(width / w, height / h)));
    setView({ x: (width - w * k) / 2, y: (height - h * k) / 2, k });
  }, [placed.width, placed.height, width, height]);
  React.useEffect(() => {
    fit();
  }, [fit]);
  const zoom = (factor: number, cx = width / 2, cy = height / 2) =>
    setView((v) => {
      const k = Math.min(2.5, Math.max(0.25, v.k * factor));
      return { k, x: cx - ((cx - v.x) * k) / v.k, y: cy - ((cy - v.y) * k) / v.k };
    });
  const drag = React.useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    // pinch on a trackpad and Ctrl/⌘ + wheel zoom; a plain wheel keeps scrolling the page
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoom(Math.exp(-e.deltaY / 300), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  // Handoffs: each new one sends a packet along the edges
  const seen = React.useRef<Set<string> | null>(null);
  const [packets, setPackets] = React.useState<Packet[]>([]);
  const [received, setReceived] = React.useState<Record<string, number>>({});
  React.useEffect(() => {
    const list = p.handoffs || [];
    if (!seen.current) {
      seen.current = new Set(p.animateInitial ? [] : list.map((h) => h.id));
      if (!p.animateInitial) return;
    }
    const fresh = list.filter((h) => !seen.current!.has(h.id));
    if (!fresh.length) return;
    for (const h of fresh) seen.current.add(h.id);
    const now = performance.now();
    if (motion === "off" || layout === "list") {
      // no travelling dot: the receiver is marked for a moment instead
      setReceived((r) => {
        const next = { ...r };
        for (const h of fresh) next[h.to] = now;
        return next;
      });
      return;
    }
    setPackets((ps) => [
      ...ps,
      ...fresh.flatMap((h: AgentNetworkHandoff, i) => {
        const pts = handoffPath(placed.nodes, h.from, h.to);
        if (pts.length < 2) return [];
        const ms = Math.min(2400, 700 + pts.length * 90);
        return [{ key: h.id, label: h.label, pts, start: now + i * 120, ms }];
      }),
    ]);
  }, [p.handoffs, p.animateInitial, placed, motion, layout]);
  // received marks fade after a moment
  React.useEffect(() => {
    const ids = Object.keys(received);
    if (!ids.length) return;
    const timer = setTimeout(() => setReceived({}), 1600);
    return () => clearTimeout(timer);
  }, [received]);
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!packets.length) return;
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      const done = packets.filter((k) => now - k.start >= k.ms);
      if (done.length) {
        setPackets((ps) => ps.filter((k) => !done.includes(k)));
        setReceived((r) => {
          const next = { ...r };
          for (const k of done) {
            const h = (p.handoffs || []).find((x) => x.id === k.key);
            if (h) next[h.to] = now;
          }
          return next;
        });
        return;
      }
      setTick((n) => n + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [packets, p.handoffs]);

  const statusWord = (n: AgentNetworkNode) =>
    n.statusLabel || t.agentNetworkStatus[STATUS_OF(n)] || STATUS_OF(n);
  // the visible name and project start the accessible name; status and approvals follow
  const srStatus = (n: AgentNetworkNode) =>
    ", " +
    [statusWord(n), n.approvals ? t.approvalsWaiting(n.approvals) : null]
      .filter(Boolean)
      .join(", ");

  const details = sel && (
    <div className="tf-agentnet-details" role="region" aria-label={sel.name}>
      <div className="tf-agentnet-details-head">
        <NodeMark node={sel} size={32} />
        <span className="tf-option-text">
          <b>{sel.name}</b>
          <small>{[sel.role, sel.project].filter(Boolean).join(" · ")}</small>
        </span>
        <button
          type="button"
          className="tf-iconbtn tf-iconbtn-ghost tf-iconbtn-sm"
          aria-label={t.close}
          title={t.close}
          onClick={() => setSelected(null)}
        >
          <Icon name="x" />
        </button>
      </div>
      <div className="tf-agentnet-details-row">
        <StatusShape status={STATUS_OF(sel)} />
        <span>{statusWord(sel)}</span>
        {sel.approvals ? (
          <span className="tf-agentnet-beacon inline">{t.approvalsWaiting(sel.approvals)}</span>
        ) : null}
      </div>
      {sel.detail && <div className="tf-agentnet-details-text">{sel.detail}</div>}
      {p.renderDetails?.(sel)}
      {sel.href && (
        <Link href={sel.href} className="tf-btn tf-btn-secondary tf-btn-sm">
          {p.openLabel || t.openAgent}
          <Icon name="chevronRight" />
        </Link>
      )}
    </div>
  );

  if (layout === "list") {
    return (
      <div
        ref={boxRef}
        className={cx("tf-agentnet", "is-list", p.className)}
        style={p.style}
        aria-label={p.label || t.agentNetwork}
        role="group"
      >
        <ul className="tf-agentnet-list">
          {flatten(p.root).map(([n, depth]) => (
            <li key={n.id} style={{ "--depth": depth } as React.CSSProperties}>
              <button
                type="button"
                className={cx(
                  "tf-agentnet-row",
                  selected === n.id && "on",
                  received[n.id] && "received",
                )}
                aria-expanded={selected === n.id}
                onClick={() => setSelected(selected === n.id ? null : n.id)}
              >
                <NodeMark node={n} size={28} />
                <span className="tf-option-text">
                  <b>{n.name}</b>
                  {n.project && <small>{n.project}</small>}
                </span>
                <span className="tf-sr-only">{srStatus(n)}</span>
                {n.approvals ? (
                  <span className="tf-agentnet-beacon" aria-hidden>
                    {n.approvals}
                  </span>
                ) : null}
                <StatusShape status={STATUS_OF(n)} />
              </button>
              {selected === n.id && details}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const edges: React.ReactNode[] = [];
  for (const [id, pl] of placed.nodes) {
    if (!pl.parent) continue;
    const parent = placed.nodes.get(pl.parent)!;
    const mid = parent.y + NODE_H + GAP_Y / 2;
    const busy = STATUS_OF(pl.node) === "running";
    edges.push(
      <path
        key={id}
        className={cx("tf-agentnet-edge", busy && "busy")}
        d={`M${parent.x + NODE_W / 2} ${parent.y + NODE_H}V${mid}H${pl.x + NODE_W / 2}V${pl.y}`}
      />,
    );
  }
  const now = performance.now();

  return (
    <div
      ref={boxRef}
      className={cx("tf-agentnet", p.className)}
      style={p.style}
      role="group"
      aria-label={p.label || t.agentNetwork}
    >
      <div
        ref={viewportRef}
        className="tf-agentnet-viewport"
        style={{ height }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button, a")) return;
          drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          setView((v) => ({ ...v, x: d.vx + e.clientX - d.x, y: d.vy + e.clientY - d.y }));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div
          className="tf-agentnet-stage"
          style={{
            width: placed.width + PAD * 2,
            height: placed.height + PAD * 2,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
          }}
        >
          <svg
            className="tf-agentnet-edges"
            width={placed.width + PAD * 2}
            height={placed.height + PAD * 2}
            aria-hidden
          >
            <g transform={`translate(${PAD} ${PAD})`}>
              {edges}
              {packets.map((k) => {
                const tt = Math.max(0, Math.min(1, (now - k.start) / k.ms));
                const [x, y] = pointAt(k.pts, tt);
                return (
                  <g key={k.key} className="tf-agentnet-packet" transform={`translate(${x} ${y})`}>
                    <circle r={6} />
                  </g>
                );
              })}
            </g>
          </svg>
          {[...placed.nodes.values()].map((pl) => {
            const n = pl.node;
            return (
              <button
                key={n.id}
                type="button"
                className={cx(
                  "tf-agentnet-node",
                  pl.depth === 0 && "root",
                  selected === n.id && "on",
                  received[n.id] && "received",
                )}
                data-status={STATUS_OF(n)}
                style={{ left: pl.x + PAD, top: pl.y + PAD, width: NODE_W, height: NODE_H }}
                aria-pressed={selected === n.id}
                onClick={() => setSelected(selected === n.id ? null : n.id)}
              >
                <NodeMark node={n} size={32} />
                <span className="tf-option-text">
                  <b>{n.name}</b>
                  <small>{n.project || n.role}</small>
                </span>
                <span className="tf-sr-only">{srStatus(n)}</span>
                <StatusShape status={STATUS_OF(n)} />
                {n.approvals ? (
                  <span className="tf-agentnet-beacon" aria-hidden>
                    {n.approvals}
                  </span>
                ) : null}
              </button>
            );
          })}
          {packets.map((k) => {
            if (!k.label) return null;
            const tt = Math.max(0, Math.min(1, (now - k.start) / k.ms));
            const [x, y] = pointAt(k.pts, tt);
            return (
              <span
                key={k.key}
                className="tf-agentnet-packet-label"
                style={{ left: x + PAD, top: y + PAD }}
                aria-hidden
              >
                {k.label}
              </span>
            );
          })}
        </div>
        <div className="tf-agentnet-tools">
          <button
            type="button"
            className="tf-iconbtn tf-iconbtn-soft tf-iconbtn-sm"
            aria-label={t.zoomIn}
            title={t.zoomIn}
            onClick={() => zoom(1.25)}
          >
            <Icon name="plus" />
          </button>
          <button
            type="button"
            className="tf-iconbtn tf-iconbtn-soft tf-iconbtn-sm"
            aria-label={t.zoomOut}
            title={t.zoomOut}
            onClick={() => zoom(0.8)}
          >
            <Icon name="minus" />
          </button>
          <button
            type="button"
            className="tf-iconbtn tf-iconbtn-soft tf-iconbtn-sm"
            aria-label={t.fitToView}
            title={t.fitToView}
            onClick={fit}
          >
            <Icon name="expand" />
          </button>
        </div>
      </div>
      {details}
      {/* handoffs read out for screen readers, since the travelling dot is visual only */}
      <div className="tf-sr-only" aria-live="polite">
        {packets.length > 0 &&
          packets
            .map((k) => {
              const h = (p.handoffs || []).find((x) => x.id === k.key);
              const from = h && placed.nodes.get(h.from)?.node.name;
              const to = h && placed.nodes.get(h.to)?.node.name;
              return from && to ? t.handoffAnnounce(from, to, k.label) : "";
            })
            .join(" ")}
      </div>
    </div>
  );
}

/* ── CoordinationTicker ── */
const KIND_ICON: Record<CoordinationEvent["kind"], IconName> = {
  handoff: "arrowUpRight",
  run: "zap",
  approval: "lock",
  message: "send",
  error: "x",
  done: "check",
};

export function CoordinationTicker(p: CoordinationTickerProps) {
  const t = useStrings(COORDINATION_STRINGS);
  const { formatRelative } = useFormat();
  const Link = useLinkAs(p.linkAs);
  const items = p.max ? p.items.slice(0, p.max) : p.items;
  return (
    <div className={cx("tf-ticker", p.className)} style={p.style}>
      {items.length === 0 ? (
        <p className="tf-ticker-empty">{p.emptyText || t.noActivity}</p>
      ) : (
        <div
          role="log"
          aria-live={p.live === false ? "off" : "polite"}
          aria-label={p.label || t.coordination}
        >
          <ol className="tf-ticker-list">
            {items.map((e) => {
              const body = (
                <>
                  <span className={cx("tf-ticker-icon", "is-" + e.kind)} aria-hidden>
                    <Icon name={e.icon || KIND_ICON[e.kind] || "zap"} size={14} />
                  </span>
                  <span className="tf-ticker-text">
                    {(e.from || e.to) && (
                      <b className="tf-ticker-route">
                        {e.from}
                        {e.from && e.to && (
                          <>
                            {" "}
                            <span aria-hidden>→</span>
                            <span className="tf-sr-only">{t.to}</span>{" "}
                          </>
                        )}
                        {e.to}
                        {e.text ? ": " : ""}
                      </b>
                    )}
                    {e.text}
                  </span>
                  <time className="tf-ticker-time" dateTime={new Date(e.time).toISOString()}>
                    {formatRelative(e.time, p.now)}
                  </time>
                </>
              );
              return (
                <li key={e.id} className={cx("tf-ticker-item", e.kind === "error" && "danger")}>
                  {e.href ? (
                    <Link href={e.href} className="tf-ticker-link">
                      {body}
                    </Link>
                  ) : (
                    <div className="tf-ticker-link">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
