"use client";
/**
 * The pieces of a chat thread around the messages: the thread itself (scrolls, sticks to the
 * newest message, jumps to a search hit), editing a sent message, switching between versions,
 * handoffs between agents, system lines, voice notes and the record of a voice conversation,
 * who is typing, and the bar for reading along.
 */
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useLinkAs, useStrings } from "../context.js";
import { CHAT_THREAD_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { useControlled } from "../hooks.js";
import { Avatar, Button } from "./foundation.js";
import { highlightParts } from "./common.js";
import type {
  ChatThreadProps,
  HandoffLineProps,
  HandoffParty,
  Mention,
  MessageEditorProps,
  ReadOnlyBarProps,
  SystemLineProps,
  TypingIndicatorProps,
  VersionSwitchProps,
  VoiceLogProps,
  VoiceNoteProps,
} from "./types.js";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── ChatThread ── */
export function ChatThread(p: ChatThreadProps) {
  const t = useStrings(CHAT_THREAD_STRINGS);
  const box = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLDivElement>(null);
  const atEnd = React.useRef(true);
  const [away, setAway] = React.useState(false);
  const stick = p.stickToBottom !== false;

  const toEnd = React.useCallback((smooth: boolean) => {
    const el = box.current;
    if (!el) return;
    if (smooth && !reducedMotion() && el.scrollTo)
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    else el.scrollTop = el.scrollHeight;
  }, []);

  // stay at the newest message while it grows (streaming), unless the reader scrolled up
  React.useLayoutEffect(() => {
    const el = inner.current;
    if (!el || !stick) return;
    toEnd(false);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (atEnd.current) toEnd(false);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [stick, toEnd]);

  // jump to a message (a search hit, a deep link) and mark it for a moment
  React.useEffect(() => {
    if (!p.jumpTo || !box.current) return;
    const id = String(p.jumpTo).replace(/["\\]/g, "\\$&");
    const el = box.current.querySelector<HTMLElement>(`[data-message-id="${id}"]`);
    if (!el) return;
    atEnd.current = false;
    el.scrollIntoView?.({ block: "center", behavior: reducedMotion() ? "auto" : "smooth" });
    el.classList.add("tf-msg-flash");
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    const timer = setTimeout(() => el.classList.remove("tf-msg-flash"), 1800);
    return () => clearTimeout(timer);
  }, [p.jumpTo, p.jumpKey]);

  return (
    <div className={cx("tf-thread", p.className)} style={p.style}>
      <div
        ref={box}
        className="tf-thread-scroll"
        role="log"
        aria-label={p.label || t.conversation}
        aria-relevant="additions"
        tabIndex={0}
        onScroll={(e) => {
          const el = e.currentTarget;
          const end = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
          atEnd.current = end;
          if (end === away) setAway(!end);
        }}
      >
        <div ref={inner} className="tf-thread-inner">
          {p.children}
        </div>
      </div>
      {away && (
        <button
          type="button"
          className="tf-thread-latest"
          aria-label={t.jumpToLatest}
          title={t.jumpToLatest}
          onClick={() => {
            atEnd.current = true;
            setAway(false);
            toEnd(true);
          }}
        >
          <Icon name="chevronDown" size={16} />
        </button>
      )}
    </div>
  );
}

/* ── Mentions in text ── */
/** `text` with its mentions as tinted chips (and search terms marked). */
export function MentionText(p: { text: string; mentions?: Mention[]; highlight?: string }) {
  const terms = p.highlight ? p.highlight.split(/\s+/).filter(Boolean) : [];
  const mark = (s: string, k: string) =>
    terms.length
      ? highlightParts(s, terms).map((x, i) =>
          x.hit ? (
            <mark key={k + i}>{x.text}</mark>
          ) : (
            <React.Fragment key={k + i}>{x.text}</React.Fragment>
          ),
        )
      : s;
  const ms = [...(p.mentions || [])]
    .filter((m) => m.start >= 0 && m.end <= p.text.length && m.end > m.start)
    .sort((a, b) => a.start - b.start);
  const out: React.ReactNode[] = [];
  let at = 0;
  ms.forEach((m, i) => {
    if (m.start < at) return;
    if (m.start > at)
      out.push(
        <React.Fragment key={"t" + i}>{mark(p.text.slice(at, m.start), "t" + i)}</React.Fragment>,
      );
    out.push(
      <span
        key={"m" + i}
        className={cx("tf-mention", "tf-t-" + (m.tint || "sky"))}
        data-mention-id={m.id}
      >
        {p.text.slice(m.start, m.end)}
      </span>,
    );
    at = m.end;
  });
  if (at < p.text.length)
    out.push(<React.Fragment key="end">{mark(p.text.slice(at), "end")}</React.Fragment>);
  return <>{out}</>;
}

/* ── MessageEditor ── */
export function MessageEditor(p: MessageEditorProps) {
  const t = useStrings(CHAT_THREAD_STRINGS);
  const [v, setV] = useControlled(p.value, p.defaultValue ?? "", p.onChange);
  const ta = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    const el = ta.current;
    if (!el || p.autoFocus === false) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const submit = () => {
    if (p.busy || !v.trim()) return;
    p.onSubmit?.(v);
  };
  return (
    <div className={cx("tf-msgedit", p.className)} style={p.style}>
      <div className="tf-msgedit-field">
        <div className="tf-msgedit-mirror" aria-hidden>
          {v + "\u200b"}
        </div>
        <textarea
          ref={ta}
          rows={1}
          className="tf-msgedit-input"
          aria-label={p.label || t.editHint}
          value={v}
          disabled={p.busy}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              p.onCancel?.();
            } else if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
        />
      </div>
      <div className="tf-msgedit-bar">
        <span className="tf-msgedit-hint">
          <Icon name="refresh" size={13} />
          {p.hint ?? t.editHint}
        </span>
        <Button size="sm" variant="ghost" onClick={p.onCancel}>
          {t.cancel}
        </Button>
        <Button size="sm" onClick={submit} disabled={p.busy || !v.trim()}>
          {p.submitLabel || t.send}
        </Button>
      </div>
    </div>
  );
}

/* ── VersionSwitch ── */
export function VersionSwitch(p: VersionSwitchProps) {
  const t = useStrings(CHAT_THREAD_STRINGS);
  const { formatNumber } = useFormat();
  const count = Math.max(1, p.count);
  const [i, setI] = useControlled(p.index, p.defaultIndex ?? count - 1, p.onChange);
  const cur = Math.min(Math.max(0, i), count - 1);
  const n = formatNumber(cur + 1),
    c = formatNumber(count);
  return (
    <span
      className={cx("tf-versions", p.busy && "busy", p.className)}
      style={p.style}
      role="group"
      aria-label={p.label || t.versionLabel(n, c)}
      aria-busy={p.busy || undefined}
    >
      <button
        type="button"
        className="tf-msg-act"
        aria-label={t.previousVersion}
        disabled={p.busy || cur === 0}
        onClick={() => setI(cur - 1)}
      >
        <Icon name="chevronLeft" size={14} />
      </button>
      <span className="tf-versions-n" aria-live="polite">
        {t.versionOf(n, c)}
      </span>
      <button
        type="button"
        className="tf-msg-act"
        aria-label={t.nextVersion}
        disabled={p.busy || cur >= count - 1}
        onClick={() => setI(cur + 1)}
      >
        <Icon name="chevronRight" size={14} />
      </button>
    </span>
  );
}

/* ── Thread lines: handoff, system ── */
function PartyMark(p: { party: HandoffParty }) {
  if (p.party.avatar || p.party.kind === "person")
    return <Avatar name={p.party.name} src={p.party.avatar} size={20} />;
  return (
    <span
      className={cx("tf-agentmark", "tf-t-" + (p.party.tint || "lilac"))}
      style={{ width: 20, height: 20 }}
      aria-hidden
    >
      <Icon name={p.party.icon || "bot"} size={11} />
    </span>
  );
}

export function HandoffLine(p: HandoffLineProps) {
  const t = useStrings(CHAT_THREAD_STRINGS);
  const Link = useLinkAs(p.linkAs);
  const body = (
    <>
      <span className="tf-handoff-who">
        <PartyMark party={p.from} />
        <b>{p.from.name}</b>
      </span>
      <Icon name="chevronRight" size={14} className="tf-handoff-arrow" />
      <span className="tf-sr-only">{t.handedOverTo}</span>
      <span className="tf-handoff-who">
        <PartyMark party={p.to} />
        <b>{p.to.name}</b>
      </span>
      {p.reason && <span className="tf-handoff-reason">{p.reason}</span>}
      {p.time && <time className="tf-handoff-time">{p.time}</time>}
    </>
  );
  return (
    <div className={cx("tf-handoff", p.className)} style={p.style} data-message-id={p.id}>
      {p.href ? (
        <Link className="tf-handoff-body link" href={p.href}>
          {body}
        </Link>
      ) : p.onClick ? (
        <button type="button" className="tf-handoff-body link" onClick={p.onClick}>
          {body}
        </button>
      ) : (
        <span className="tf-handoff-body">{body}</span>
      )}
    </div>
  );
}

export function SystemLine(p: SystemLineProps) {
  return (
    <div
      className={cx("tf-msg-system", p.tone && "tone-" + p.tone, p.className)}
      style={p.style}
      data-message-id={p.id}
    >
      <span>
        {p.icon && <Icon name={p.icon} size={13} />}
        {p.children}
        {p.time && <time>{p.time}</time>}
      </span>
    </div>
  );
}

/* ── Voice notes ── */
function clock(sec: number, fmt: (v: number, o?: Intl.NumberFormatOptions) => string) {
  const s = Math.max(0, Math.round(sec || 0));
  return `${fmt(Math.floor(s / 60))}:${fmt(s % 60, { minimumIntegerDigits: 2 })}`;
}

const BARS = 28;
/** A steady pseudo-waveform for a voice note without peaks. */
const fakePeaks = (seed: string) =>
  Array.from({ length: BARS }, (_, i) => {
    const c = seed.charCodeAt(i % Math.max(1, seed.length)) || 7;
    return 0.3 + ((c * (i + 3) * 37) % 70) / 100;
  });

export function VoiceNote(p: VoiceNoteProps) {
  const t = useStrings(CHAT_THREAD_STRINGS);
  const { formatNumber } = useFormat();
  const audio = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [cur, setCur] = React.useState(0);
  const [meta, setMeta] = React.useState(0);
  const [open, setOpen] = useControlled(p.transcriptOpen, false, p.onTranscriptOpenChange);
  const dur = p.duration || meta;
  const peaks = React.useMemo(() => {
    const src = p.peaks && p.peaks.length ? p.peaks : fakePeaks(p.src || "voice");
    return Array.from({ length: BARS }, (_, i) => src[Math.floor((i * src.length) / BARS)] ?? 0.5);
  }, [p.peaks, p.src]);
  const pct = dur ? Math.min(1, cur / dur) : 0;
  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) void el.play?.()?.catch?.(() => setPlaying(false));
    else el.pause();
  };
  return (
    <div className={cx("tf-voicenote", p.mine && "mine", p.className)} style={p.style}>
      <div className="tf-voicenote-row">
        <button
          type="button"
          className="tf-voicenote-play"
          aria-label={playing ? t.pause : t.play}
          onClick={toggle}
        >
          <Icon name={playing ? "pause" : "play"} size={14} />
        </button>
        <span className="tf-voicenote-wave" style={{ "--p": pct } as React.CSSProperties}>
          {peaks.map((h, i) => (
            <i
              key={i}
              className={i / BARS < pct ? "on" : undefined}
              style={{ height: Math.round(4 + h * 20) }}
            />
          ))}
          <input
            type="range"
            min={0}
            max={dur || 0}
            step={0.1}
            value={cur}
            aria-label={p.label || t.voiceMessage}
            aria-valuetext={`${clock(cur, formatNumber)} / ${clock(dur, formatNumber)}`}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCur(v);
              if (audio.current) audio.current.currentTime = v;
            }}
          />
        </span>
        <span className="tf-voicenote-time">
          {clock(playing || cur > 0 ? cur : dur, formatNumber)}
        </span>
        {p.src && (
          <audio
            ref={audio}
            src={p.src}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setCur(0);
            }}
            onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              if (Number.isFinite(d)) setMeta(d);
            }}
          />
        )}
      </div>
      {p.transcript && (
        <>
          <button
            type="button"
            className="tf-voicenote-more"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? t.hideTranscript : t.showTranscript}
            <Icon name="chevronDown" size={12} />
          </button>
          {open && <p className="tf-voicenote-transcript">{p.transcript}</p>}
        </>
      )}
    </div>
  );
}

export function VoiceLog(p: VoiceLogProps) {
  const t = useStrings(CHAT_THREAD_STRINGS);
  const { formatNumber } = useFormat();
  const [open, setOpen] = useControlled(p.open, p.defaultOpen ?? false, p.onOpenChange);
  const turns = p.turns || [];
  return (
    <div
      className={cx("tf-voicelog", open && "open", p.className)}
      style={p.style}
      data-message-id={p.id}
    >
      <button
        type="button"
        className="tf-voicelog-head"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="tf-voicelog-ico" aria-hidden>
          <Icon name="volume" size={14} />
        </span>
        <b>{p.title || t.voiceConversation}</b>
        <span className="tf-voicelog-meta">
          {[p.duration, t.voiceTurns(turns.length, formatNumber(turns.length)), p.time]
            .filter(Boolean)
            .join(" · ")}
        </span>
        <Icon name="chevronDown" size={14} className="tf-tool-chev" />
      </button>
      {open && (
        <div className="tf-voicelog-body">
          {p.audio && <VoiceNote src={p.audio} duration={p.audioDuration} />}
          <ol className="tf-voicelog-turns">
            {turns.map((x, i) => (
              <li key={x.id ?? i} className={x.who === "user" ? "me" : "ai"}>
                <b>{x.name || (x.who === "user" ? t.you : "")}</b>
                <span>{x.text}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/* ── Typing, reading along ── */
export function TypingIndicator(p: TypingIndicatorProps) {
  const t = useStrings(CHAT_THREAD_STRINGS);
  const { formatNumber } = useFormat();
  const names = p.names || [];
  if (!names.length) return null;
  const text =
    p.text ||
    (names.length === 1
      ? t.typingOne(names[0] as string)
      : names.length === 2
        ? t.typingTwo(names[0] as string, names[1] as string)
        : t.typingMany(names.length, formatNumber(names.length)));
  return (
    <div className={cx("tf-typingline", p.className)} style={p.style} role="status">
      <span className="tf-typing" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span>{text}</span>
    </div>
  );
}

export function ReadOnlyBar(p: ReadOnlyBarProps) {
  const t = useStrings(CHAT_THREAD_STRINGS);
  return (
    <div className={cx("tf-readonly", p.className)} style={p.style} role="status">
      <Icon name="eye" size={16} />
      <span className="tf-readonly-text">{p.text || t.readingAlong}</span>
      {p.children}
      {p.onAction && (
        <Button size="sm" variant="secondary" onClick={p.onAction}>
          {p.actionLabel || t.stepIn}
        </Button>
      )}
    </div>
  );
}
