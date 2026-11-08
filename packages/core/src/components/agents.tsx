"use client";

import * as React from "react";
import { cx } from "../cx.js";
import { L, formatMoney } from "../i18n.js";
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
  ChatListProps,
  ChatWorkspaceProps,
  DailyBriefingProps,
  FeedbackRatingProps,
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
  return (
    <div
      className={cx("tf-agentcard", p.onClick && "click")}
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
            label={L("Chat with {name}", {
              name: p.name,
            })}
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
            [L("Model"), p.model],
            [L("Cost today"), p.cost, true],
            [L("Last action"), p.last],
          ].filter((r) => r[1] != null) as KeyValueItem[]
        }
      />
    </div>
  );
}
export function AgentDetails(p: AgentDetailsProps) {
  return (
    <div className="tf-agentdetails">
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
export function ChatList(p: ChatListProps) {
  const q = React.useState("");
  const groups = (p.groups || [])
    .map((g) =>
      Object.assign({}, g, {
        items: g.items.filter(
          (c) =>
            !q[0] || (c.name + " " + (c.sub || "")).toLowerCase().indexOf(q[0].toLowerCase()) > -1,
        ),
      }),
    )
    .filter((g) => g.items.length);
  return (
    <div className="tf-chatlist">
      <SearchField
        placeholder={p.searchPlaceholder || L("Search chats")}
        value={q[0]}
        onChange={(e) => {
          q[1](e.target.value);
          p.onSearch && p.onSearch(e.target.value);
        }}
      />
      {p.filters}
      <div className="tf-chatlist-scroll">
        {groups.length === 0 ? (
          <p
            className="tf-card-desc"
            style={{
              padding: 12,
            }}
          >
            {L("No chats match")}
          </p>
        ) : (
          groups.map((g) => (
            <div key={g.title} className="tf-chatlist-group">
              <div className="tf-menu-label">
                {g.mark && <i className={"tf-sw tf-sw-" + g.mark} />}
                {g.title}
              </div>
              {g.items.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={cx("tf-chatrow", c.id === p.selected && "on")}
                  onClick={() => {
                    p.onSelect && p.onSelect(c.id);
                  }}
                >
                  {c.avatar ? (
                    <Avatar name={c.name} size={36} />
                  ) : (
                    <AgentMark tint={c.tint} live={c.status === "running"} size={36} />
                  )}
                  <span className="tf-chatrow-text">
                    <span className="tf-chatrow-top">
                      <b>{c.name}</b>
                      <small>{c.time}</small>
                    </span>
                    <span className="tf-chatrow-sub">
                      {c.status && <StatusShape status={c.status} />}
                      {c.sub}
                    </span>
                  </span>
                  {c.unread ? (
                    <span className="tf-nav-count">{c.unread}</span>
                  ) : c.pinned ? (
                    <Icon name="star" size={13} className="tf-chatrow-pin" />
                  ) : null}
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export function ChatWorkspace(p: ChatWorkspaceProps) {
  return (
    <div className={cx("tf-chatws", p.details && "with-details", p.className)}>
      <div className="tf-chatws-list">{p.list}</div>
      <div className="tf-chatws-thread">{p.thread}</div>
      {p.details && <div className="tf-chatws-details">{p.details}</div>}
    </div>
  );
}
export function SearchHits(p: SearchHitsProps) {
  return (
    <div className="tf-hits">
      {(p.items || []).length === 0 ? (
        <EmptyState icon="search" title={L("Nothing found")} text={p.emptyText} />
      ) : (
        p.items.map((x) => {
          const parts = String(x.text).split(
            new RegExp("(" + (p.query || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"),
          );
          return (
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
                {parts.map((t, i) => (i % 2 ? <mark key={i}>{t}</mark> : t))}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}
export function ThinkingLine(p: ThinkingLineProps) {
  return (
    <div className="tf-thinking" role="status">
      <TypingDots />
      <span>{p.text || L("Thinking…")}</span>
    </div>
  );
}
export function FeedbackRating(p: FeedbackRatingProps) {
  const v = useControlled<"up" | "down" | null>(p.value, null, (x) => {
      if (x) p.onRate?.(x);
    }),
    c = React.useState(""),
    sent = React.useState(false);
  if (sent[0])
    return (
      <span className="tf-feedback-done">
        <Icon name="check" size={13} />
        {p.thanks || L("Thanks, noted")}
      </span>
    );
  return (
    <div className="tf-feedback">
      <div
        className="tf-row"
        style={{
          gap: 4,
          flexWrap: "nowrap",
        }}
      >
        {p.label && <span className="tf-card-desc">{p.label}</span>}
        <button
          type="button"
          className={cx("tf-msg-act", v[0] === "up" && "on")}
          aria-pressed={v[0] === "up"}
          aria-label={L("Good")}
          onClick={() => {
            v[1]("up");
            if (!p.askOnUp) {
              sent[1](true);
              p.onSubmit && p.onSubmit("up", "");
            }
          }}
        >
          <Icon name="thumbUp" size={14} />
        </button>
        <button
          type="button"
          className={cx("tf-msg-act", v[0] === "down" && "on")}
          aria-pressed={v[0] === "down"}
          aria-label={L("Not good")}
          onClick={() => {
            v[1]("down");
          }}
        >
          <Icon name="thumbDown" size={14} />
        </button>
      </div>
      {v[0] === "down" && (
        <form
          className="tf-feedback-form tf-in"
          onSubmit={(e) => {
            e.preventDefault();
            sent[1](true);
            p.onSubmit && p.onSubmit("down", c[0]);
          }}
        >
          <input
            className="tf-input"
            autoFocus
            placeholder={p.placeholder || L("What should be different?")}
            value={c[0]}
            onChange={(e) => {
              c[1](e.target.value);
            }}
          />
          <Button type="submit" size="sm">
            {L("Send")}
          </Button>
        </form>
      )}
    </div>
  );
}
export function ActivityFeed(p: ActivityFeedProps) {
  return (
    <div className="tf-activity">
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
  return (
    <div className="tf-briefing">
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
            {p.attentionTitle || L("Needs you")}
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
            {p.suggestionsTitle || L("Suggestions")}
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
  return (
    <div className="tf-budgetstop">
      <Alert
        tone="danger"
        title={p.title || L("Budget used up · agents paused")}
        action={
          p.onRaise && (
            <Button size="sm" variant="secondary" onClick={p.onRaise}>
              {p.actionLabel || L("Raise budget")}
            </Button>
          )
        }
      >
        {p.text ||
          L("Everything is kept. Agents continue where they stopped once the budget allows it.")}
      </Alert>
      <Meter
        label={L("Spent this month")}
        value={p.spent}
        max={p.budget}
        text={formatMoney(p.spent) + " / " + formatMoney(p.budget)}
        tone="blush"
      />
      {p.paused && (
        <KeyValue
          dense
          items={[
            [L("Paused"), p.paused],
            [L("Still running"), p.running || L("Nothing")],
          ]}
        />
      )}
    </div>
  );
}
export function MemoryViewer(p: MemoryViewerProps) {
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
    <div className="tf-memory">
      <div className="tf-filterbar">
        <SearchField
          placeholder={L("Search memory")}
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
        <p className="tf-card-desc">{L("Nothing remembered here yet.")}</p>
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
                    label={L("Edit")}
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
                    label={L("Forget")}
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
  const a = String(p.before || "").split("\n"),
    b = String(p.after || "").split("\n"),
    rows = [];
  let i = 0,
    j = 0;
  while (i < a.length || j < b.length) {
    if (a[i] === b[j]) {
      rows.push([" ", a[i]]);
      i++;
      j++;
    } else if (j < b.length && a.indexOf(b[j], i) < 0) {
      rows.push(["+", b[j]]);
      j++;
    } else if (i < a.length) {
      rows.push(["-", a[i]]);
      i++;
    } else {
      rows.push(["+", b[j]]);
      j++;
    }
  }
  return (
    <div className="tf-diff">
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
              {p.discardLabel || L("Discard override")}
            </Button>
          )}
          {p.onPromote && (
            <Button size="sm" variant="soft" icon="branch" onClick={p.onPromote}>
              {p.promoteLabel || L("Move to code")}
            </Button>
          )}
        </span>
      </div>
      <pre className="tf-diff-body">
        {rows.map((r, k) => (
          <span key={k} className={r[0] === "+" ? "add" : r[0] === "-" ? "del" : ""}>
            <i>{r[0]}</i>
            {r[1]}
            {"\n"}
          </span>
        ))}
      </pre>
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
  return (
    <div className="tf-triggers">
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
            <Tooltip label={L("Run now")}>
              <button
                type="button"
                className="tf-iconbtn tf-iconbtn-soft tf-iconbtn-sm"
                aria-label={L("Run now")}
                onClick={() => {
                  p.onRun?.(t);
                }}
              >
                <Icon name="play" size={12} />
              </button>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
}
export function ScheduleCalendar(p: ScheduleCalendarProps) {
  const from = p.from != null ? p.from : 6,
    to = p.to != null ? p.to : 22,
    hours = [];
  for (let i = from; i < to; i++) hours.push(i);
  const days = p.days || weekdays(),
    rowH = 32;
  return (
    <div
      className="tf-sched"
      style={
        {
          "--rows": hours.length,
          "--row-h": rowH + "px",
        } as React.CSSProperties
      }
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
    <div className="tf-org">
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
  const st = p.state || "listening",
    bars = [];
  for (let i = 0; i < 24; i++) bars.push(i);
  return (
    <div className={cx("tf-voice", "is-" + st)}>
      <AgentMark tint={p.tint || "lilac"} size={72} live={st !== "idle"} />
      <b className="tf-voice-name">{p.name}</b>
      <span className="tf-voice-state">
        {p.stateLabel ||
          L(
            st === "listening"
              ? "Listening…"
              : st === "thinking"
                ? "Thinking…"
                : st === "speaking"
                  ? "Speaking…"
                  : "Paused",
          )}
      </span>
      <div className="tf-voice-wave" aria-hidden>
        {bars.map((b) => (
          <i
            key={b}
            style={{
              animationDelay: ((b * 47) % 600) + "ms",
              height: st === "idle" ? 4 : undefined,
            }}
          />
        ))}
      </div>
      {p.transcript && <p className="tf-voice-transcript">{p.transcript}</p>}
      <div
        className="tf-row"
        style={{
          justifyContent: "center",
        }}
      >
        {p.onMute && (
          <IconButton
            icon={p.muted ? "x" : "user"}
            label={p.muted ? L("Unmute") : L("Mute")}
            variant="soft"
            size="lg"
            onClick={p.onMute}
          />
        )}
        {p.onEnd && (
          <button
            type="button"
            className="tf-voice-end"
            onClick={p.onEnd}
            aria-label={L("End conversation")}
          >
            <Icon name="x" size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Operations ── */
