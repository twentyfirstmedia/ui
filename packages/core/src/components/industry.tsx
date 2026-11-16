"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { INDUSTRY_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { Avatar, Badge, Button } from "./foundation.js";
import { TagInput } from "./forms.js";
import type {
  ConflictCheckProps,
  MatchListProps,
  Tone,
  ViewingListProps,
  ViewingState,
} from "./types.js";

/* ── MatchList ────────────────────────────────────────────────────────────── */

/**
 * Who fits: buyers or tenants for a property (or properties for a buyer), best first, with the
 * match in percent and which criteria are met.
 */
export function MatchList(p: MatchListProps) {
  const t = useStrings(INDUSTRY_STRINGS);
  const { formatPercent } = useFormat();
  const sorted = [...p.matches].sort((a, b) => b.score - a.score);
  return (
    <ul
      style={p.style}
      className={cx("tf-match", p.className)}
      aria-label={p.label || t.matchesLabel}
    >
      {sorted.map((m) => {
        const score = Math.max(0, Math.min(100, Math.round(m.score)));
        const met = (m.criteria || []).filter((c) => c.met).length;
        return (
          <li key={m.id} className="tf-match-row">
            {m.avatar && <Avatar name={m.name} size={36} />}
            <span className="tf-match-who">
              {p.onOpen ? (
                <button type="button" className="tf-match-name" onClick={() => p.onOpen?.(m.id)}>
                  {m.name}
                </button>
              ) : (
                <b className="tf-match-name">{m.name}</b>
              )}
              {m.subtitle && <small>{m.subtitle}</small>}
            </span>
            <span
              className={cx(
                "tf-match-score",
                score >= 80 ? "is-high" : score >= 60 ? "is-mid" : "is-low",
              )}
            >
              <b>{t.matchScore(formatPercent(score))}</b>
              <span className="tf-match-bar" aria-hidden>
                <span style={{ width: `${score}%` }} />
              </span>
              {m.criteria && m.criteria.length > 0 && (
                <small>{t.criteriaMet(met, m.criteria.length)}</small>
              )}
            </span>
            {p.onContact && (
              <Button
                variant="secondary"
                size="sm"
                className="tf-match-action"
                onClick={() => p.onContact?.(m.id)}
              >
                {p.contactLabel || t.contactMatch}
              </Button>
            )}
            {m.criteria && m.criteria.length > 0 && (
              <ul className="tf-match-criteria">
                {m.criteria.map((c) => (
                  <li key={c.label} className={c.met ? "is-met" : "is-missed"}>
                    <Icon name={c.met ? "check" : "x"} size={12} />
                    {c.label}
                    {!c.met && <span className="tf-sidebar-sr">, {t.criterionMissed}</span>}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ── ViewingList ──────────────────────────────────────────────────────────── */

const VIEWING: Record<ViewingState, Tone> = {
  requested: "warning",
  confirmed: "info",
  done: "success",
  cancelled: "neutral",
  noshow: "danger",
};

/** Viewings of a property: when, who, how many, the state and the feedback afterwards. */
export function ViewingList(p: ViewingListProps) {
  const t = useStrings(INDUSTRY_STRINGS);
  const { formatDate } = useFormat();
  const sorted = [...p.viewings].sort((a, b) => +new Date(a.at) - +new Date(b.at));
  return (
    <ul
      style={p.style}
      className={cx("tf-viewings", p.className)}
      aria-label={p.label || t.viewingsLabel}
    >
      {sorted.map((v) => (
        <li key={v.id} className={cx("tf-viewing", "is-" + v.state)}>
          <span className="tf-viewing-date" aria-hidden>
            <small>{formatDate(v.at, { month: "short" })}</small>
            <b>{formatDate(v.at, { day: "numeric" })}</b>
          </span>
          <span className="tf-viewing-main">
            <b>{v.name}</b>
            <small>
              {[
                formatDate(v.at, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                }),
                v.attendees ? t.viewingAttendees(v.attendees) : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </small>
            {v.subtitle && <small>{v.subtitle}</small>}
            {v.feedback && (
              <span className="tf-viewing-feedback">
                <span
                  className="tf-viewing-stars"
                  role="img"
                  aria-label={t.viewingRating(v.feedback.rating)}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon
                      key={i}
                      name="star"
                      size={14}
                      className={i <= v.feedback!.rating ? "is-on" : undefined}
                    />
                  ))}
                </span>
                {v.feedback.note && <q>{v.feedback.note}</q>}
              </span>
            )}
          </span>
          <span className="tf-viewing-side">
            <Badge tone={VIEWING[v.state]}>{t.viewingStates[v.state]}</Badge>
            {p.onConfirm && v.state === "requested" && (
              <Button size="sm" onClick={() => p.onConfirm?.(v.id)}>
                {t.confirmViewing}
              </Button>
            )}
            {p.onFeedback && v.state === "done" && !v.feedback && (
              <Button variant="secondary" size="sm" onClick={() => p.onFeedback?.(v.id)}>
                {t.addFeedback}
              </Button>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── ConflictCheck ────────────────────────────────────────────────────────── */

/**
 * A conflict-of-interest check before taking on a matter: the parties to check, what was found in
 * earlier matters (possible or real conflicts) and the decision.
 */
export function ConflictCheck(p: ConflictCheckProps) {
  const t = useStrings(INDUSTRY_STRINGS);
  const { formatDate } = useFormat();
  const conflicts = p.hits.filter((h) => h.level === "conflict").length;
  const possible = p.hits.length - conflicts;
  const checked = p.checkedAt != null;
  return (
    <section
      style={p.style}
      className={cx("tf-conflict", p.className)}
      aria-label={t.conflictLabel}
    >
      <div className="tf-conflict-input">
        {p.onParties ? (
          <TagInput
            label={t.conflictParties}
            value={p.parties}
            onChange={p.onParties}
            placeholder={t.conflictPartiesPlaceholder}
          />
        ) : (
          <div className="tf-conflict-parties">
            <span className="tf-field-label">{t.conflictParties}</span>
            <ul>
              {p.parties.map((x) => (
                <li key={x}>
                  <Badge tone="neutral">{x}</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
        {p.onCheck && (
          <Button variant="secondary" icon="search" onClick={p.onCheck}>
            {t.runConflictCheck}
          </Button>
        )}
      </div>
      {checked && (
        <>
          <div
            className={cx(
              "tf-conflict-result",
              conflicts ? "is-conflict" : possible ? "is-possible" : "is-clear",
            )}
            role="status"
          >
            <Icon name={conflicts || possible ? "flag" : "check"} size={18} />
            <span>
              <b>{p.hits.length ? t.conflictSummary(conflicts, possible) : t.conflictNone}</b>
              <small>
                {t.conflictCheckedAt(
                  formatDate(p.checkedAt!, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                )}
              </small>
            </span>
          </div>
          {p.hits.length > 0 && (
            <ul className="tf-conflict-hits">
              {[...p.hits]
                .sort((a, b) => (a.level === b.level ? 0 : a.level === "conflict" ? -1 : 1))
                .map((h) => (
                  <li key={h.id} className={"is-" + h.level}>
                    <span className="tf-conflict-hit">
                      <b>{h.party}</b>
                      <small>{[h.role, h.matter].filter(Boolean).join(" · ")}</small>
                      {h.reason && <small className="tf-conflict-reason">{h.reason}</small>}
                    </span>
                    <Badge tone={h.level === "conflict" ? "danger" : "warning"}>
                      {t.conflictLevels[h.level]}
                    </Badge>
                  </li>
                ))}
            </ul>
          )}
          {p.decision ? (
            <p className={cx("tf-conflict-decision", "is-" + p.decision)} role="status">
              <Icon name={p.decision === "cleared" ? "check" : "ban"} size={16} />
              {t.conflictDecisions[p.decision]}
            </p>
          ) : (
            p.onDecide && (
              <div className="tf-row tf-conflict-actions">
                <Button variant="secondary" onClick={() => p.onDecide?.("declined")}>
                  {t.conflictDecline}
                </Button>
                <Button onClick={() => p.onDecide?.("cleared")}>{t.conflictClear}</Button>
              </div>
            )
          )}
        </>
      )}
    </section>
  );
}
