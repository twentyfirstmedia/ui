"use client";
import * as React from "react";
import { cx, initials } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { CONNECTOR_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { iconData, registerIcons } from "../icons.js";
import { refreshCwOff } from "../icon-library.js";
import { Badge, Button, Chip } from "./foundation.js";
import { SearchField } from "./inputs.js";
import { EmptyState } from "./feedback.js";
import type {
  ConnectionListProps,
  AgentActivityProps,
  AgentAction,
  ConnectorGalleryProps,
  Connector,
  ServiceMarkProps,
  SyncStatusProps,
} from "./types.js";

// default icons of these components come from the icon library
registerIcons({ refreshCwOff });

const MARK_SIZE = { sm: 14, md: 20, lg: 26 } as const;

function isWide(name: string): boolean {
  const d = iconData(name);
  return typeof d === "object" && d.wide === true;
}

/**
 * A service's mark: its brand logo, your own logo, or a monogram when neither exists, with an
 * optional state dot. Use it wherever a connected service appears (lists, chips, activity).
 */
export function ServiceMark(p: ServiceMarkProps) {
  const t = useStrings(CONNECTOR_STRINGS);
  const size = p.size || "md";
  const label = p.status ? `${p.name}, ${t.serviceStates[p.status]}` : p.name;
  return (
    <span
      style={p.style}
      className={cx(
        "tf-svc",
        "tf-svc-" + size,
        "tf-t-" + (p.tint || "plain"),
        !p.icon && !p.logo && "is-monogram",
        p.className,
      )}
      role={p.decorative ? undefined : "img"}
      aria-label={p.decorative ? undefined : label}
      aria-hidden={p.decorative ? true : undefined}
    >
      {p.logo ||
        (p.icon ? (
          isWide(p.icon) ? (
            <Icon name={p.icon} style={{ width: "88%", height: "88%" }} />
          ) : (
            <Icon name={p.icon} size={MARK_SIZE[size]} />
          )
        ) : (
          <span className="tf-svc-mono">{(p.monogram || initials(p.name)).slice(0, 2)}</span>
        ))}
      {p.status && <span className={cx("tf-svc-dot", "is-" + p.status)} />}
    </span>
  );
}

/**
 * Every service an assistant can connect to, grouped by category, with search and category chips.
 * Each tile says whether the service is connected, needs a reconnect or comes later.
 */
export function ConnectorGallery(p: ConnectorGalleryProps) {
  const t = useStrings(CONNECTOR_STRINGS);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string | null>(null);
  const order = React.useMemo(() => {
    const seen = [...(p.categories || [])];
    for (const c of p.connectors) if (!seen.includes(c.category)) seen.push(c.category);
    return seen.filter((c) => p.connectors.some((x) => x.category === c));
  }, [p.connectors, p.categories]);
  const q = query.trim().toLowerCase();
  const shown = p.connectors.filter(
    (c) =>
      (!category || c.category === category) &&
      (!q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)),
  );
  const filters = p.filters !== false;
  return (
    <div style={p.style} className={cx("tf-connectors", p.className)}>
      {filters && (
        <div className="tf-connectors-filters">
          <SearchField
            label={t.searchConnectors}
            placeholder={t.searchConnectors}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          <div className="tf-connectors-chips" role="group" aria-label={t.connectors}>
            <Chip selected={!category} onClick={() => setCategory(null)}>
              {t.allCategories}
            </Chip>
            {order.map((c) => (
              <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>
      )}
      {shown.length === 0 ? (
        <EmptyState icon="search" title={t.noConnectorMatch(query.trim())} />
      ) : (
        order
          .filter((c) => shown.some((x) => x.category === c))
          .map((c) => (
            <section key={c} className="tf-connectors-group" aria-label={c}>
              <h3 className="tf-connectors-title">{c}</h3>
              <ul className="tf-connectors-grid">
                {shown
                  .filter((x) => x.category === c)
                  .map((x) => (
                    <ConnectorTile key={x.id} c={x} onConnect={p.onConnect} onOpen={p.onOpen} />
                  ))}
              </ul>
            </section>
          ))
      )}
    </div>
  );
}

function ConnectorTile({
  c,
  onConnect,
  onOpen,
}: {
  c: Connector;
  onConnect?: (id: string) => void;
  onOpen?: (id: string) => void;
}) {
  const t = useStrings(CONNECTOR_STRINGS);
  const state = c.state || "available";
  return (
    <li className={cx("tf-connector", "is-" + state)}>
      <div className="tf-connector-head">
        <ServiceMark
          name={c.name}
          icon={c.icon}
          logo={c.logo}
          monogram={c.monogram}
          tint={c.tint}
          status={state === "connected" ? "connected" : state === "error" ? "error" : undefined}
          decorative
        />
        <span className="tf-option-text">
          <b>{c.name}</b>
          {c.account && <small>{c.account}</small>}
        </span>
      </div>
      {c.description && <p className="tf-connector-desc">{c.description}</p>}
      {c.note && <p className="tf-connector-note">{c.note}</p>}
      <div className="tf-connector-foot">
        {state === "connected" && (
          <>
            <Badge tone="success" dot>
              {t.serviceStates.connected}
            </Badge>
            {onOpen && (
              <Button
                variant="ghost"
                size="sm"
                aria-label={t.openService(c.name)}
                onClick={() => onOpen(c.id)}
              >
                {t.openAction}
              </Button>
            )}
          </>
        )}
        {state === "error" && (
          <>
            <Badge tone="danger" dot>
              {t.serviceStates.error}
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              aria-label={t.reconnectService(c.name)}
              onClick={() => (onOpen || onConnect)?.(c.id)}
            >
              {t.reconnect}
            </Button>
          </>
        )}
        {state === "soon" && <Badge tone="neutral">{t.comingSoon}</Badge>}
        {state === "available" && (
          <Button
            variant="secondary"
            size="sm"
            icon="plus"
            aria-label={t.connectService(c.name)}
            onClick={() => onConnect?.(c.id)}
          >
            {t.connect}
          </Button>
        )}
      </div>
    </li>
  );
}

/** When a connected service last synced, what it brought and when it syncs next. */
export function SyncStatus(p: SyncStatusProps) {
  const t = useStrings(CONNECTOR_STRINGS);
  const { formatRelative, formatNumber } = useFormat();
  const now = p.now ?? Date.now();
  const text =
    p.state === "syncing"
      ? t.syncingNow
      : p.state === "error"
        ? t.syncFailed
        : p.state === "paused"
          ? t.syncPaused
          : p.state === "never" || p.last == null
            ? t.neverSynced
            : t.syncedAgo(formatRelative(p.last, now));
  const icon =
    p.state === "error"
      ? "x"
      : p.state === "paused"
        ? "pause"
        : p.state === "never"
          ? "refreshCwOff"
          : p.state === "syncing"
            ? "refresh"
            : "check";
  return (
    <div
      style={p.style}
      className={cx("tf-sync", "is-" + p.state, p.compact && "compact", p.className)}
      role="status"
    >
      <div className="tf-sync-line">
        <span className="tf-sync-icon" aria-hidden>
          <Icon name={icon} size={14} />
        </span>
        <span className="tf-sync-text">
          {text}
          {p.state === "error" && p.last != null && !p.compact && (
            <small> · {t.syncedAgo(formatRelative(p.last, now))}</small>
          )}
        </span>
        {!p.compact && p.next != null && p.state !== "paused" && p.state !== "syncing" && (
          <small className="tf-sync-next">{t.nextSync(formatRelative(p.next, now))}</small>
        )}
        {p.onSync && p.state !== "syncing" && (
          <Button variant="ghost" size="sm" icon="refresh" onClick={p.onSync}>
            {t.syncNow}
          </Button>
        )}
      </div>
      {!p.compact && p.error && <p className="tf-sync-error">{p.error}</p>}
      {!p.compact && p.counts && p.counts.length > 0 && (
        <ul className="tf-sync-counts">
          {p.counts.map((c) => (
            <li key={c.label}>
              <b>{formatNumber(c.value)}</b> {c.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const DAY = 86400000;
function dayStart(v: Date | string | number): number {
  const d = new Date(v);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * What agents did with your connected services, newest first and grouped by day: what they read,
 * what they changed and what waits for your approval, with "Undo" where it can be undone.
 */
export function AgentActivity(p: AgentActivityProps) {
  const t = useStrings(CONNECTOR_STRINGS);
  const { formatDate, locale } = useFormat();
  const now = p.now ?? Date.now();
  const sorted = [...p.items].sort((a, b) => +new Date(b.at) - +new Date(a.at));
  const groups: { key: number; items: AgentAction[] }[] = [];
  for (const it of sorted) {
    const k = dayStart(it.at);
    const last = groups[groups.length - 1];
    if (last && last.key === k) last.items.push(it);
    else groups.push({ key: k, items: [it] });
  }
  const heading = (k: number, sample: AgentAction["at"]) => {
    const diff = Math.round((k - dayStart(now)) / DAY);
    if (diff === 0 || diff === -1) {
      try {
        const w = new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(diff, "day");
        return w.charAt(0).toLocaleUpperCase(locale) + w.slice(1);
      } catch {
        /* fall through to the date */
      }
    }
    return formatDate(sample, { weekday: "long", day: "numeric", month: "long" });
  };
  return (
    <div style={p.style} className={cx("tf-agentlog", p.className)}>
      {groups.map((g) => (
        <section
          key={g.key}
          className="tf-agentlog-day"
          aria-label={heading(g.key, g.items[0]!.at)}
        >
          <h3 className="tf-agentlog-title" aria-hidden>
            {heading(g.key, g.items[0]!.at)}
          </h3>
          <ul aria-label={p.label || t.agentActivity}>
            {g.items.map((a) => {
              const state = a.state || "done";
              const kind = a.kind || "read";
              return (
                <li key={a.id} className={cx("tf-agentlog-item", "is-" + state, "kind-" + kind)}>
                  {a.service ? (
                    <ServiceMark
                      name={a.service.name}
                      icon={a.service.icon}
                      logo={a.service.logo}
                      size="sm"
                    />
                  ) : (
                    <span className="tf-svc tf-svc-sm tf-t-plain" aria-hidden>
                      <Icon name="bot" size={14} />
                    </span>
                  )}
                  <div className="tf-agentlog-main">
                    <p className="tf-agentlog-text">{a.text}</p>
                    {a.detail && <p className="tf-agentlog-detail">{a.detail}</p>}
                    <p className="tf-agentlog-meta">
                      {[a.agent, formatDate(a.at, { hour: "numeric", minute: "2-digit" })]
                        .filter(Boolean)
                        .join(" · ")}
                      <span className={cx("tf-agentlog-kind", "kind-" + kind)}>
                        {t.actionKinds[kind]}
                      </span>
                      {state !== "done" && (
                        <span className={cx("tf-agentlog-state", "is-" + state)}>
                          {t.actionStates[state]}
                        </span>
                      )}
                    </p>
                  </div>
                  {state === "waiting" && p.onReview && (
                    <Button variant="primary" size="sm" onClick={() => p.onReview?.(a.id)}>
                      {t.reviewAction}
                    </Button>
                  )}
                  {state === "done" && kind !== "read" && p.onUndo && (
                    <Button variant="ghost" size="sm" icon="undo" onClick={() => p.onUndo?.(a.id)}>
                      {t.undo}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** The services you are connected to: account, state, how fresh the data is, and Manage. */
export function ConnectionList(p: ConnectionListProps) {
  const t = useStrings(CONNECTOR_STRINGS);
  return (
    <ul
      style={p.style}
      className={cx("tf-connlist", p.className)}
      aria-label={p.label || t.connectionsLabel}
    >
      {p.items.map((c) => (
        <li key={c.id} className={cx("tf-connlist-item", "is-" + c.state)}>
          <ServiceMark
            name={c.name}
            icon={c.icon}
            logo={c.logo}
            monogram={c.monogram}
            tint={c.tint}
            status={c.state}
          />
          <span className="tf-option-text">
            <b>{c.name}</b>
            {c.account && <small>{c.account}</small>}
          </span>
          {c.sync && <SyncStatus state={c.sync.state} last={c.sync.last} now={p.now} compact />}
          {c.state === "error" && p.onReconnect ? (
            <Button
              variant="secondary"
              size="sm"
              aria-label={t.reconnectService(c.name)}
              onClick={() => p.onReconnect?.(c.id)}
            >
              {t.reconnect}
            </Button>
          ) : (
            p.onManage && (
              <Button
                variant="ghost"
                size="sm"
                aria-label={t.manageService(c.name)}
                onClick={() => p.onManage?.(c.id)}
              >
                {t.manageAction}
              </Button>
            )
          )}
        </li>
      ))}
    </ul>
  );
}
