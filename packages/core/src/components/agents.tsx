"use client";

import * as React from "react";
import { cx } from "../cx.js";
import { LineDiff } from "./approval-previews.js";
import { useFormat, useLinkAs, useStrings } from "../context.js";
import { Highlight } from "./common.js";
import { AGENTS_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { useControlled } from "../hooks.js";
import { AgentMark, TypingDots } from "./chat.js";
import { Avatar, Badge, Button, Chip, IconButton, TintIcon } from "./foundation.js";
import { StatusIndicator, StatusShape } from "./status.js";
import { Collapsible, KeyValue } from "./building-blocks.js";
import { SearchField } from "./inputs.js";
import { Alert, EmptyState } from "./feedback.js";
import { Meter } from "./developer.js";
import { Tooltip } from "./overlays.js";
import { weekdays } from "./forms.js";
import type {
  ActivityFeedProps,
  AgentCardProps,
  AgentDetailsProps,
  BudgetStopProps,
  ChatListItem,
  ChatListProps,
  ChatQuery,
  ChatWorkspaceProps,
  DailyBriefingProps,
  IconName,
  KeyValueItem,
  MemoryViewerProps,
  OrgChartProps,
  OrgNode,
  OverrideDiffProps,
  ScheduleCalendarProps,
  SearchHitsProps,
  ThinkingLineProps,
  TriggerListProps,
  VoiceModeProps,
} from "./types.js";

/* ── Agents ── */
export function AgentCard(p: AgentCardProps) {
  const t = useStrings(AGENTS_STRINGS);
  return (
    <div
      style={p.style}
      className={cx("tf-agentcard", p.onClick && "click", p.className)}
      onClick={p.onClick}
      tabIndex={p.onClick ? 0 : undefined}
    >
      <div className="tf-agentcard-top">
        <AgentMark tint={p.tint} live={p.status === "running"} size={40} />
        <div className="tf-option-text">
          <b>{p.name}</b>
          <small>{p.role}</small>
        </div>
        {p.onChat && (
          <IconButton
            icon="mail"
            label={t.chatWith(p.name)}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              p.onChat?.();
            }}
          />
        )}
      </div>
      <StatusIndicator status={p.status || "idle"} label={p.statusLabel} />
      <KeyValue
        dense
        items={
          [
            [t.model, p.model],
            [t.costToday, p.cost, true],
            [t.lastAction, p.last],
          ].filter((r) => r[1] != null) as KeyValueItem[]
        }
      />
    </div>
  );
}
export function AgentDetails(p: AgentDetailsProps) {
  return (
    <div style={p.style} className={cx("tf-agentdetails", p.className)}>
      <div className="tf-agentdetails-id">
        <AgentMark tint={p.tint} size={56} live={p.status === "running"} />
        <b>{p.name}</b>
        <span className="tf-card-desc">{p.role}</span>
        <StatusIndicator status={p.status || "idle"} label={p.statusLabel} />
      </div>
      {(p.sections || []).map((s, i) => (
        <Collapsible key={i} title={s.title} meta={s.meta} defaultOpen={s.open !== false}>
          {s.items ? <KeyValue dense items={s.items} /> : s.children}
        </Collapsible>
      ))}
      {p.actions && (
        <div
          className="tf-col"
          style={{
            gap: 8,
          }}
        >
          {p.actions}
        </div>
      )}
    </div>
  );
}
const QUERY_TOKEN = /(^|\s)(from|in|before|after):("[^"]*"|\S+)/gi;

/** Splits a chat search into `from:`, `in:`, `before:` and `after:` tokens and the free words. */
export function parseChatQuery(q: string): ChatQuery {
  const tokens: ChatQuery["tokens"] = [];
  const text = q
    .replace(QUERY_TOKEN, (all, lead: string, key: string, value: string) => {
      tokens.push({
        key: key.toLowerCase() as ChatQuery["tokens"][number]["key"],
        value: value.replace(/^"|"$/g, ""),
        raw: all.trim(),
      });
      return lead;
    })
    .replace(/\s+/g, " ")
    .trim();
  return { text, tokens };
}

const toDate = (d: Date | string | number | undefined) => {
  if (d === undefined) return undefined;
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? undefined : x;
};

function matches(c: ChatListItem, group: string, q: ChatQuery): boolean {
  const has = (hay: string, needle: string) => hay.toLowerCase().includes(needle.toLowerCase());
  const sub = typeof c.sub === "string" ? c.sub : "";
  if (q.text && !q.text.split(" ").every((w) => has(`${c.name} ${sub} ${c.project || ""}`, w)))
    return false;
  for (const tk of q.tokens) {
    if (tk.key === "from" && !has([c.name, ...(c.from || [])].join(" "), tk.value)) return false;
    if (tk.key === "in" && !has(`${c.project || ""} ${group}`, tk.value)) return false;
    if (tk.key === "before" || tk.key === "after") {
      const d = toDate(c.date),
        limit = toDate(tk.value);
      if (!d || !limit) return false;
      if (tk.key === "before" ? d >= limit : d <= limit) return false;
    }
  }
  return true;
}

export function ChatList(p: ChatListProps) {
  const t = useStrings(AGENTS_STRINGS);
  const { formatNumber, formatRelative } = useFormat();
  const Link = useLinkAs(p.linkAs);
  const [q, setQ] = useControlled(p.query, "", p.onQueryChange);
  const parsed = React.useMemo(() => parseChatQuery(q), [q]);
  const groups = (p.groups || [])
    .map((g) =>
      p.filter === false ? g : { ...g, items: g.items.filter((c) => matches(c, g.title, parsed)) },
    )
    .filter((g) => g.items.length);
  const change = (next: string) => {
    setQ(next);
    p.onSearch?.(next, parseChatQuery(next));
  };
  return (
    <div style={p.style} className={cx("tf-chatlist", p.className)}>
      <SearchField
        placeholder={p.searchPlaceholder || t.searchChats}
        value={q}
        onChange={(e) => {
          change(e.target.value);
        }}
      />
      {parsed.tokens.length > 0 && (
        <div className="tf-chatlist-tokens">
          {parsed.tokens.map((tk, i) => (
            <span key={i} className="tf-chatlist-token">
              <b>{tk.key}:</b>
              {tk.value}
              <button
                type="button"
                aria-label={t.removeFilter(tk.raw)}
                onClick={() => {
                  change(q.replace(tk.raw, "").replace(/\s+/g, " ").trim());
                }}
              >
                <Icon name="x" size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      {p.filters}
      <div className="tf-chatlist-scroll">
        {groups.length === 0 ? (
          <p
            className="tf-card-desc"
            style={{
              padding: 12,
            }}
          >
            {t.noChatsMatch}
          </p>
        ) : (
          groups.map((g) => (
            <div key={g.title} className="tf-chatlist-group" role="group" aria-label={g.title}>
              <div className="tf-menu-label" aria-hidden>
                {g.mark && <i className={"tf-sw tf-sw-" + g.mark} />}
                {g.title}
              </div>
              {g.items.map((c) => {
                const on = c.id === p.selected;
                const when = c.time || (c.date !== undefined ? formatRelative(c.date) : undefined);
                const inner = (
                  <>
                    {c.avatar || c.avatarSrc ? (
                      <Avatar name={c.name} src={c.avatarSrc} size={36} />
                    ) : (
                      <AgentMark tint={c.tint} live={c.status === "running"} size={36} />
                    )}
                    <span className="tf-chatrow-text">
                      <span className="tf-chatrow-top">
                        <b>{c.name}</b>
                        {when && <small>{when}</small>}
                      </span>
                      <span className="tf-chatrow-sub">
                        {c.status && <StatusShape status={c.status} />}
                        <span className="tf-chatrow-preview">{c.sub}</span>
                      </span>
                    </span>
                    {c.unread ? (
                      <span
                        className="tf-nav-count"
                        aria-label={t.unreadCount(c.unread, formatNumber(c.unread))}
                      >
                        {formatNumber(c.unread)}
                      </span>
                    ) : c.pinned ? (
                      <Icon name="star" size={13} className="tf-chatrow-pin" />
                    ) : null}
                  </>
                );
                return c.href ? (
                  <Link
                    key={c.id}
                    href={c.href}
                    className={cx("tf-chatrow", on && "on", c.unread && "unread")}
                    aria-current={on ? "page" : undefined}
                    onClick={() => {
                      p.onSelect && p.onSelect(c.id);
                    }}
                  >
                    {inner}
                  </Link>
                ) : (
                  <button
                    key={c.id}
                    type="button"
                    className={cx("tf-chatrow", on && "on", c.unread && "unread")}
                    aria-current={on ? "true" : undefined}
                    onClick={() => {
                      p.onSelect && p.onSelect(c.id);
                    }}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const DETAILS_MIN = 240,
  DETAILS_MAX = 560;

export function ChatWorkspace(p: ChatWorkspaceProps) {
  const t = useStrings(AGENTS_STRINGS);
  const [view, setView] = useControlled(p.view, p.defaultView ?? "list", p.onViewChange);
  const [w, setW] = useControlled(
    p.detailsWidth,
    p.defaultDetailsWidth ?? 304,
    p.onDetailsWidthChange,
  );
  const clamp = (n: number) => Math.round(Math.min(DETAILS_MAX, Math.max(DETAILS_MIN, n)));
  const drag = React.useRef<{ x: number; w: number } | null>(null);
  return (
    <div
      style={{ ...p.style, ["--details-w" as string]: clamp(w) + "px" }}
      className={cx("tf-chatws-frame", p.className)}
    >
      <div className={cx("tf-chatws", p.details && "with-details", "view-" + view)}>
        <div
          className="tf-chatws-list"
          onClickCapture={(e) => {
            // picking a conversation opens its thread on narrow screens
            if ((e.target as HTMLElement).closest?.(".tf-chatrow")) setView("thread");
          }}
        >
          {p.list}
        </div>
        <div className="tf-chatws-thread">
          <button type="button" className="tf-chatws-back" onClick={() => setView("list")}>
            <Icon name="chevronLeft" size={16} />
            {p.backLabel || t.backToChats}
          </button>
          {p.thread}
        </div>
        {p.details && (
          <>
            <div
              className="tf-chatws-resize"
              role="separator"
              aria-orientation="vertical"
              aria-label={t.resizeDetails}
              aria-valuenow={clamp(w)}
              aria-valuemin={DETAILS_MIN}
              aria-valuemax={DETAILS_MAX}
              tabIndex={0}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture?.(e.pointerId);
                drag.current = { x: e.clientX, w: clamp(w) };
              }}
              onPointerMove={(e) => {
                if (drag.current) setW(clamp(drag.current.w + drag.current.x - e.clientX));
              }}
              onPointerUp={() => {
                drag.current = null;
              }}
              onKeyDown={(e) => {
                const step = e.shiftKey ? 64 : 16;
                if (e.key === "ArrowLeft") setW(clamp(w + step));
                else if (e.key === "ArrowRight") setW(clamp(w - step));
                else if (e.key === "Home") setW(DETAILS_MAX);
                else if (e.key === "End") setW(DETAILS_MIN);
                else return;
                e.preventDefault();
              }}
            />
            <div className="tf-chatws-details">{p.details}</div>
          </>
        )}
      </div>
    </div>
  );
}
export function SearchHits(p: SearchHitsProps) {
  const t = useStrings(AGENTS_STRINGS);
  return (
    <div style={p.style} className={cx("tf-hits", p.className)}>
      {(p.items || []).length === 0 ? (
        <EmptyState icon="search" title={t.nothingFound} text={p.emptyText} />
      ) : (
        p.items.map((x) => (
          <button
            key={x.id}
            type="button"
            className="tf-hit"
            onClick={() => {
              p.onOpen && p.onOpen(x);
            }}
          >
            <span className="tf-hit-top">
              <b>{x.chat}</b>
              <small>{x.time}</small>
            </span>
            <span className="tf-hit-text">
              {x.who && <b>{x.who + ": "}</b>}
              <Highlight text={String(x.text)} query={p.query} />
            </span>
          </button>
        ))
      )}
    </div>
  );
}
export function ThinkingLine(p: ThinkingLineProps) {
  const t = useStrings(AGENTS_STRINGS);
  return (
    <div style={p.style} className={cx("tf-thinking", p.className)} role="status">
      <TypingDots />
      <span>{p.text || t.thinking}</span>
    </div>
  );
}
export function ActivityFeed(p: ActivityFeedProps) {
  return (
    <div style={p.style} className={cx("tf-activity", p.className)}>
      {(
        p.groups || [
          {
            items: p.items || [],
          },
        ]
      ).map((g, gi) => (
        <div key={gi} className="tf-activity-group">
          {g.title && <div className="tf-menu-label">{g.title}</div>}
          <ol>
            {g.items.map((it, i) => (
              <li key={i} className="tf-activity-item">
                <span className="tf-activity-time tf-mono">{it.time}</span>
                <span className="tf-activity-spine">
                  <StatusShape status={it.status || "ok"} />
                </span>
                <span className="tf-activity-text">
                  {it.actor && <b>{it.actor + " "}</b>}
                  {it.text}
                  {it.link && <span> {it.link}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
export function DailyBriefing(p: DailyBriefingProps) {
  const t = useStrings(AGENTS_STRINGS);
  return (
    <div style={p.style} className={cx("tf-briefing", p.className)}>
      <div className="tf-briefing-head">
        <AgentMark tint={p.tint || "lilac"} size={40} />
        <div className="tf-option-text">
          <b>{p.title}</b>
          <small>{p.time}</small>
        </div>
      </div>
      <p className="tf-briefing-text">{p.summary}</p>
      {p.attention && p.attention.length > 0 && (
        <div
          className="tf-col"
          style={{
            gap: 8,
          }}
        >
          <span
            className="tf-menu-label"
            style={{
              padding: 0,
            }}
          >
            {p.attentionTitle || t.needsYou}
          </span>
          {p.attention.map((a, i) => (
            <button key={i} type="button" className="tf-briefing-item" onClick={a.onClick}>
              <StatusShape status={a.status || "signal"} />
              <span>{a.text}</span>
              <Icon name="chevronRight" size={14} />
            </button>
          ))}
        </div>
      )}
      {p.suggestions && p.suggestions.length > 0 && (
        <div
          className="tf-col"
          style={{
            gap: 8,
          }}
        >
          <span
            className="tf-menu-label"
            style={{
              padding: 0,
            }}
          >
            {p.suggestionsTitle || t.suggestions}
          </span>
          <ul className="tf-briefing-sugg">
            {p.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export function BudgetStop(p: BudgetStopProps) {
  const t = useStrings(AGENTS_STRINGS);
  const { formatMoney } = useFormat();
  return (
    <div style={p.style} className={cx("tf-budgetstop", p.className)}>
      <Alert
        tone="danger"
        title={p.title || t.budgetUsedUp}
        action={
          p.onRaise && (
            <Button size="sm" variant="secondary" onClick={p.onRaise}>
              {p.actionLabel || t.raiseBudget}
            </Button>
          )
        }
      >
        {p.text || t.budgetText}
      </Alert>
      <Meter
        label={t.spentThisMonth}
        value={p.spent}
        max={p.budget}
        text={formatMoney(p.spent) + " / " + formatMoney(p.budget)}
        tone="blush"
      />
      {p.paused && (
        <KeyValue
          dense
          items={[
            [t.paused, p.paused],
            [t.stillRunning, p.running || t.nothing],
          ]}
        />
      )}
    </div>
  );
}
export function MemoryViewer(p: MemoryViewerProps) {
  const t = useStrings(AGENTS_STRINGS);
  const q = React.useState(""),
    scope = React.useState<string | null>(null);
  const scopes: string[] = [];
  (p.items || []).forEach((m) => {
    if (scopes.indexOf(m.scope) < 0) scopes.push(m.scope);
  });
  const list = (p.items || []).filter(
    (m) =>
      (!scope[0] || m.scope === scope[0]) &&
      (!q[0] || m.text.toLowerCase().indexOf(q[0].toLowerCase()) > -1),
  );
  return (
    <div style={p.style} className={cx("tf-memory", p.className)}>
      <div className="tf-filterbar">
        <SearchField
          placeholder={t.searchMemory}
          value={q[0]}
          onChange={(e) => {
            q[1](e.target.value);
          }}
          style={{
            flex: "1 1 200px",
            minWidth: 0,
          }}
        />
        {scopes.map((s) => (
          <Chip
            key={s}
            selected={scope[0] === s}
            onClick={() => {
              scope[1](scope[0] === s ? null : s);
            }}
          >
            {s}
          </Chip>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="tf-card-desc">{t.nothingRemembered}</p>
      ) : (
        list.map((m) => (
          <div key={m.id} className="tf-memitem">
            <p>{m.text}</p>
            <div className="tf-memitem-meta">
              <Badge tone="neutral" dot={false}>
                {m.scope}
              </Badge>
              {m.source && <span>{m.source}</span>}
              {m.date && <span>{m.date}</span>}
              <span
                className="tf-row"
                style={{
                  marginLeft: "auto",
                  gap: 4,
                  flexWrap: "nowrap",
                }}
              >
                {p.onEdit && (
                  <IconButton
                    icon="edit"
                    label={t.edit}
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      p.onEdit?.(m);
                    }}
                  />
                )}
                {p.onDelete && (
                  <IconButton
                    icon="trash"
                    label={t.forget}
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      p.onDelete?.(m);
                    }}
                  />
                )}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
export function OverrideDiff(p: OverrideDiffProps) {
  const t = useStrings(AGENTS_STRINGS);
  return (
    <div style={p.style} className={cx("tf-diff", p.className)}>
      <div className="tf-diff-head">
        <div className="tf-option-text">
          <b>{p.title}</b>
          <small>{[p.versions, p.by].filter(Boolean).join(" · ")}</small>
        </div>
        <span
          className="tf-row"
          style={{
            flexWrap: "nowrap",
          }}
        >
          {p.onDiscard && (
            <Button size="sm" variant="ghost" onClick={p.onDiscard}>
              {p.discardLabel || t.discardOverride}
            </Button>
          )}
          {p.onPromote && (
            <Button size="sm" variant="soft" icon="branch" onClick={p.onPromote}>
              {p.promoteLabel || t.moveToCode}
            </Button>
          )}
        </span>
      </div>
      <LineDiff before={p.before} after={p.after} context={p.context ?? Infinity} />
    </div>
  );
}
const TRIGGER_ICON: Record<string, IconName> = {
  schedule: "clock",
  event: "zap",
  webhook: "link",
  mail: "mail",
};
export function TriggerList(p: TriggerListProps) {
  const strings = useStrings(AGENTS_STRINGS);
  return (
    <div style={p.style} className={cx("tf-triggers", p.className)}>
      {(p.items || []).map((t) => (
        <div key={t.id} className={cx("tf-trigger", t.enabled === false && "off")}>
          <TintIcon
            icon={TRIGGER_ICON[t.type] || "zap"}
            tint={t.enabled === false ? "plain" : "sky"}
          />
          <span className="tf-option-text">
            <b>{t.rule}</b>
            <small>{[t.agent, t.by].filter(Boolean).join(" · ")}</small>
          </span>
          <span className="tf-trigger-next">{t.next}</span>
          {p.onToggle && (
            <input
              type="checkbox"
              role="switch"
              className="tf-switch"
              checked={t.enabled !== false}
              aria-label={typeof t.rule === "string" ? t.rule : undefined}
              onChange={() => {
                p.onToggle?.(t);
              }}
            />
          )}
          {p.onRun && (
            <Tooltip label={strings.runNow}>
              <button
                type="button"
                className="tf-iconbtn tf-iconbtn-soft tf-iconbtn-sm"
                aria-label={strings.runNow}
                onClick={() => {
                  p.onRun?.(t);
                }}
              >
                <Icon name="play" />
              </button>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
}
export function ScheduleCalendar(p: ScheduleCalendarProps) {
  const { locale } = useFormat();
  const from = p.from != null ? p.from : 6,
    to = p.to != null ? p.to : 22,
    hours = [];
  for (let i = from; i < to; i++) hours.push(i);
  const days = p.days || weekdays(locale),
    rowH = 32;
  return (
    <div
      className={cx("tf-sched", p.className)}
      style={{
        ...({
          "--rows": hours.length,
          "--row-h": rowH + "px",
        } as React.CSSProperties),
        ...p.style,
      }}
    >
      <span />
      {days.map((d, i) => (
        <span key={i} className="tf-sched-day">
          {d}
        </span>
      ))}
      <div className="tf-sched-times">
        {hours.map((hh) => (
          <span key={hh}>{(hh < 10 ? "0" : "") + hh + ":00"}</span>
        ))}
      </div>
      {days.map((_, di) => (
        <div key={di} className="tf-sched-col">
          {(p.events || [])
            .filter((e) => e.day === di)
            .map((e, k) => {
              const top = (e.start - from) * rowH,
                ht = Math.max(rowH / 2, (e.end - e.start) * rowH - 4);
              return (
                <button
                  key={k}
                  type="button"
                  className={cx("tf-sched-ev", "tf-bg-" + (e.tint || "sky"), e.self && "self")}
                  style={{
                    top: top,
                    height: ht,
                  }}
                  title={e.label}
                  onClick={() => {
                    p.onOpen && p.onOpen(e);
                  }}
                >
                  <b>{e.label}</b>
                  {ht > 30 && e.sub && <small>{e.sub}</small>}
                </button>
              );
            })}
        </div>
      ))}
    </div>
  );
}
export function OrgChart(p: OrgChartProps) {
  function node(n: OrgNode): React.ReactNode {
    return (
      <li key={n.id || n.name}>
        <div className={cx("tf-org-node", n.root && "root")}>
          {n.avatar ? (
            <Avatar name={n.name} size={32} />
          ) : (
            <AgentMark tint={n.tint} size={32} live={n.status === "running"} />
          )}
          <span className="tf-option-text">
            <b>{n.name}</b>
            <small>{n.role}</small>
          </span>
          {n.status && <StatusShape status={n.status} />}
        </div>
        {n.children && n.children.length > 0 && <ul>{n.children.map(node)}</ul>}
      </li>
    );
  }
  return (
    <div style={p.style} className={cx("tf-org", p.className)}>
      <ul>
        {node(
          Object.assign(
            {
              root: true,
            },
            p.root,
          ),
        )}
      </ul>
    </div>
  );
}
export function VoiceMode(p: VoiceModeProps) {
  const t = useStrings(AGENTS_STRINGS);
  const st = p.state || "listening",
    bars: number[] = [];
  for (let i = 0; i < 24; i++) bars.push(i);
  const turnsRef = React.useRef<HTMLOListElement>(null);
  const turns = p.turns || [];
  const last = turns[turns.length - 1];
  React.useEffect(() => {
    const el = turnsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns.length, last?.text]);
  const label =
    p.stateLabel ||
    (st === "listening"
      ? t.listening
      : st === "thinking"
        ? t.thinking
        : st === "speaking"
          ? t.speaking
          : st === "interrupted"
            ? t.interrupted
            : st === "connecting"
              ? t.connecting
              : t.paused);
  return (
    <div
      style={p.style}
      className={cx("tf-voice", "is-" + st, "fs-" + (p.fullscreen || "phone"), p.className)}
      role="region"
      aria-label={t.voiceWith(p.name)}
    >
      <AgentMark tint={p.tint || "lilac"} size={72} live={st !== "idle"} />
      <b className="tf-voice-name">{p.name}</b>
      <span className="tf-voice-state" role="status">
        {label}
      </span>
      <div className="tf-voice-wave" aria-hidden>
        {bars.map((b) => (
          <i
            key={b}
            style={{
              animationDelay: ((b * 47) % 600) + "ms",
              height: st === "idle" || st === "connecting" ? 4 : undefined,
            }}
          />
        ))}
      </div>
      {p.transcript && <p className="tf-voice-transcript">{p.transcript}</p>}
      {turns.length > 0 && (
        <ol ref={turnsRef} className="tf-voice-turns" aria-live="polite">
          {turns.map((x, i) => (
            <li key={x.id ?? i} className={cx(x.who === "user" ? "me" : "ai", x.live && "live")}>
              {x.name && <b>{x.name}</b>}
              <span>
                {x.text}
                {x.live && <span className="tf-caret" aria-hidden />}
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="tf-voice-controls">
        {p.onMute && (
          <IconButton
            icon={p.muted ? "micOff" : "mic"}
            label={p.muted ? t.unmute : t.mute}
            variant="soft"
            size="lg"
            aria-pressed={!!p.muted}
            onClick={p.onMute}
          />
        )}
        {p.onInterrupt && st === "speaking" && (
          <Button variant="secondary" icon="micOff" onClick={p.onInterrupt}>
            {t.interrupt}
          </Button>
        )}
        {p.onEnd && (
          <button
            type="button"
            className="tf-voice-end"
            onClick={p.onEnd}
            aria-label={t.endConversation}
          >
            <Icon name="x" size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Operations ── */
