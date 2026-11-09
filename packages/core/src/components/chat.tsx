"use client";
import * as React from "react";
import { useFormat, useStrings } from "../context.js";
import { CHAT_STRINGS } from "../strings.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { useControlled } from "../hooks.js";
import { Avatar, Badge, TintIcon } from "./foundation.js";
import { Popover, Tooltip } from "./overlays.js";
import type {
  AgentMarkProps,
  AgentStatusProps,
  ChatMessageProps,
  CodeBlockProps,
  ComposerCommand,
  ComposerProps,
  IconName,
  ModelPickerProps,
  PromptStartersProps,
  ReasoningProps,
  RichTextProps,
  RunTraceProps,
  Tone,
  ToolCallProps,
  UsageMeterProps,
} from "./types.js";

/* ════════ Kit 3: AI chat & agents, e-commerce, system screens ════════ */

/* ── Rich text: paragraphs, **bold**, `code`, - lists, 1. lists, ```code blocks``` ── */
/** Only http(s), mailto and relative links are rendered as links. */
function safeHref(url: string): string | undefined {
  return /^(https?:|mailto:|\/|#|\.)/i.test(url.trim()) ? url : undefined;
}

function inline(s: string, k: string): React.ReactNode[] {
  const out: React.ReactNode[] = [],
    re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0,
    m: RegExpExecArray | null,
    i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    if (t[0] === "*") out.push(<b key={k + "b" + i++}>{t.slice(2, -2)}</b>);
    else if (t[0] === "`")
      out.push(
        <code key={k + "c" + i++} className="tf-icode">
          {t.slice(1, -1)}
        </code>,
      );
    else {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(t) as RegExpExecArray;
      out.push(
        <a key={k + "a" + i++} href={safeHref(mm[2] as string)} target="_blank" rel="noreferrer">
          {mm[1]}
        </a>,
      );
    }
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function RichText(p: RichTextProps) {
  const src = String(p.text || ""),
    blocks: React.ReactNode[] = [],
    parts = src.split(/```/);
  parts.forEach((part, pi) => {
    if (pi % 2 === 1) {
      const nl = part.indexOf("\n"),
        lang = nl > -1 ? part.slice(0, nl).trim() : "",
        code = nl > -1 ? part.slice(nl + 1) : part;
      blocks.push(
        <CodeBlock
          key={"cb" + pi}
          lang={lang}
          code={code.replace(/\n$/, "")}
          open={p.streaming && pi === parts.length - 1}
        />,
      );
      return;
    }
    part.split(/\n{2,}/).forEach((para, j) => {
      const lines = para.split("\n").filter((l) => l.trim() !== "");
      if (!lines.length) return;
      const key = pi + "-" + j;
      if (lines.every((l) => /^\s*[-*] /.test(l)))
        blocks.push(
          <ul key={key}>
            {lines.map((l, li) => (
              <li key={li}>{inline(l.replace(/^\s*[-*] /, ""), key + li)}</li>
            ))}
          </ul>,
        );
      else if (lines.every((l) => /^\s*\d+\. /.test(l)))
        blocks.push(
          <ol key={key}>
            {lines.map((l, li) => (
              <li key={li}>{inline(l.replace(/^\s*\d+\. /, ""), key + li)}</li>
            ))}
          </ol>,
        );
      else if (/^#{1,3} /.test(lines[0] as string))
        blocks.push(
          <p key={key} className="tf-rt-h">
            {inline((lines[0] as string).replace(/^#+ /, ""), key)}
          </p>,
          lines.length > 1 && <p key={key + "r"}>{inline(lines.slice(1).join(" "), key + "r")}</p>,
        );
      else
        blocks.push(
          <p key={key}>
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, key + li)}
              </React.Fragment>
            ))}
          </p>,
        );
    });
  });
  return (
    <div className={cx("tf-rt", p.className)}>
      {blocks}
      {p.streaming && <span className="tf-caret" aria-hidden />}
    </div>
  );
}

export function hl(line: string, k: string | number): React.ReactNode[] {
  const out: React.ReactNode[] = [],
    re =
      /("[^"]*"|'[^']*'|\/\/.*$|#.*$|\b\d+(\.\d+)?\b|\b(?:const|let|var|function|return|if|else|for|await|async|import|from|export|new|true|false|null|SELECT|FROM|WHERE|LIMIT|def|class)\b)/g;
  let last = 0,
    m: RegExpExecArray | null,
    i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const t = m[0],
      c = /^["']/.test(t) ? "s" : /^(\/\/|#)/.test(t) ? "c" : /^\d/.test(t) ? "n" : "k";
    out.push(
      <span key={k + "-" + i++} className={"tk-" + c}>
        {t}
      </span>,
    );
    last = m.index + t.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeBlock(p: CodeBlockProps) {
  const t = useStrings(CHAT_STRINGS);
  const copied = React.useState(false);
  function copy() {
    try {
      void navigator.clipboard.writeText(p.code);
    } catch {
      /* clipboard unavailable */
    }
    copied[1](true);
    setTimeout(() => {
      copied[1](false);
    }, 1400);
  }
  return (
    <div className="tf-code">
      <div className="tf-code-head">
        <span>{p.lang || "text"}</span>
        <button type="button" className="tf-code-copy" onClick={copy} aria-label={t.copyCode}>
          <Icon name={copied[0] ? "check" : "file"} size={13} />
          {copied[0] ? t.copied : t.copy}
        </button>
      </div>
      <pre tabIndex={0}>
        <code>
          {String(p.code || "")
            .split("\n")
            .map((l, i) => (
              <span key={i} className="tf-code-line">
                {hl(l, i)}
                {"\n"}
              </span>
            ))}
        </code>
      </pre>
    </div>
  );
}

/* ── Chat building blocks ── */
export function TypingDots(p: { label?: string }) {
  const t = useStrings(CHAT_STRINGS);
  return (
    <span className="tf-typing" role="status" aria-label={p.label || t.working}>
      <i />
      <i />
      <i />
    </span>
  );
}

export function AgentMark(p: AgentMarkProps) {
  const s = p.size || 32;
  return (
    <span
      className={cx("tf-agentmark", "tf-t-" + (p.tint || "lilac"), p.live && "live", p.className)}
      style={{
        width: s,
        height: s,
      }}
      aria-hidden
    >
      <Icon name={p.icon || "bot"} size={Math.round(s * 0.5)} />
    </span>
  );
}

export function ChatMessage(p: ChatMessageProps) {
  const t = useStrings(CHAT_STRINGS);
  const me = p.role === "user",
    copied = React.useState(false),
    fb = React.useState(p.feedback || null);
  if (p.role === "system")
    return (
      <div className="tf-msg-system">
        <span>{p.children || p.text}</span>
      </div>
    );
  function copy() {
    try {
      navigator.clipboard.writeText(p.text || "");
    } catch {
      /* clipboard unavailable */
    }
    copied[1](true);
    setTimeout(() => {
      copied[1](false);
    }, 1400);
  }
  return (
    <div className={cx("tf-msg", me ? "me" : "ai", p.className)}>
      {me ? (
        <Avatar name={p.name || t.you} size={32} />
      ) : (
        <AgentMark tint={p.tint} live={p.streaming} />
      )}
      <div className="tf-msg-col">
        {(p.name || p.time) && (
          <div className="tf-msg-meta">
            <b>{p.name}</b>
            {p.time && <span>{p.time}</span>}
            {p.model && <span className="tf-msg-model">{p.model}</span>}
          </div>
        )}
        {p.before}
        {(p.text || p.children || p.streaming) && (
          <div className="tf-bubble">
            {p.children ||
              (me ? (
                <p className="tf-rt-plain">{p.text}</p>
              ) : p.text ? (
                <RichText text={p.text} streaming={p.streaming} />
              ) : (
                <TypingDots />
              ))}
          </div>
        )}
        {p.attachments && p.attachments.length > 0 && (
          <div className="tf-msg-attach">
            {p.attachments.map((a) => (
              <span key={a.name} className="tf-attach-chip">
                <Icon name={a.kind === "img" ? "file" : "paperclip"} size={13} />
                {a.name}
                {a.size && <small>{a.size}</small>}
              </span>
            ))}
          </div>
        )}
        {p.sources && p.sources.length > 0 && (
          <div className="tf-msg-sources">
            {p.sources.map((s, i) => (
              <a
                key={i}
                className="tf-source"
                href={s.url || "#"}
                onClick={
                  s.onClick
                    ? (e) => {
                        e.preventDefault();
                        s.onClick?.();
                      }
                    : undefined
                }
              >
                <span className="tf-source-n">{i + 1}</span>
                <Icon name={s.icon || "book"} size={12} />
                {s.title}
              </a>
            ))}
          </div>
        )}
        {!me && !p.streaming && p.actions !== false && (
          <div className="tf-msg-actions">
            <Tooltip label={copied[0] ? t.copied : t.copy}>
              <button type="button" className="tf-msg-act" aria-label={t.copyReply} onClick={copy}>
                <Icon name={copied[0] ? "check" : "file"} size={14} />
              </button>
            </Tooltip>
            {p.onRetry && (
              <Tooltip label={t.regenerate}>
                <button
                  type="button"
                  className="tf-msg-act"
                  aria-label={t.regenerateReply}
                  onClick={p.onRetry}
                >
                  <Icon name="refresh" size={14} />
                </button>
              </Tooltip>
            )}
            <Tooltip label={t.goodReply}>
              <button
                type="button"
                className={cx("tf-msg-act", fb[0] === "up" && "on")}
                aria-pressed={fb[0] === "up"}
                aria-label={t.goodReply}
                onClick={() => {
                  fb[1](fb[0] === "up" ? null : "up");
                  p.onFeedback && p.onFeedback("up");
                }}
              >
                <Icon name="thumbUp" size={14} />
              </button>
            </Tooltip>
            <Tooltip label={t.badReply}>
              <button
                type="button"
                className={cx("tf-msg-act", fb[0] === "down" && "on")}
                aria-pressed={fb[0] === "down"}
                aria-label={t.badReply}
                onClick={() => {
                  fb[1](fb[0] === "down" ? null : "down");
                  p.onFeedback && p.onFeedback("down");
                }}
              >
                <Icon name="thumbDown" size={14} />
              </button>
            </Tooltip>
            {p.usage && <span className="tf-msg-usage">{p.usage}</span>}
          </div>
        )}
        {p.after}
      </div>
    </div>
  );
}

const TOOL_ICON: Record<string, IconName | null> = {
  running: null,
  done: "check",
  error: "x",
  waiting: "clock",
};

export function ToolCall(p: ToolCallProps) {
  const t = useStrings(CHAT_STRINGS);
  const open = React.useState(!!p.defaultOpen),
    st = p.status || "done";
  return (
    <div className={cx("tf-tool", "is-" + st, open[0] && "open")}>
      <button
        type="button"
        className="tf-tool-head"
        aria-expanded={open[0]}
        onClick={() => {
          open[1](!open[0]);
        }}
      >
        <span className="tf-tool-ico">
          {st === "running" ? (
            <span className="tf-spin" aria-hidden />
          ) : (
            <Icon name={TOOL_ICON[st] || "zap"} size={12} />
          )}
        </span>
        <Icon name={p.icon || "zap"} size={14} className="tf-tool-kind" />
        <b>{p.name}</b>
        <span className="tf-tool-sum">{p.summary}</span>
        {p.duration && <span className="tf-tool-time">{p.duration}</span>}
        <Icon name="chevronDown" size={14} className="tf-tool-chev" />
      </button>
      {open[0] && (
        <div className="tf-tool-body">
          {p.input != null && (
            <div>
              <span className="tf-tool-label">{t.toolInput}</span>
              <pre>{typeof p.input === "string" ? p.input : JSON.stringify(p.input, null, 2)}</pre>
            </div>
          )}
          {p.output != null && (
            <div>
              <span className="tf-tool-label">{st === "error" ? t.toolError : t.toolResult}</span>
              <pre className={st === "error" ? "err" : undefined}>
                {typeof p.output === "string" ? p.output : JSON.stringify(p.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Reasoning(p: ReasoningProps) {
  const t = useStrings(CHAT_STRINGS);
  const open = React.useState(!!p.defaultOpen);
  return (
    <div className={cx("tf-reason", open[0] && "open", p.streaming && "live")}>
      <button
        type="button"
        className="tf-reason-head"
        aria-expanded={open[0]}
        onClick={() => {
          open[1](!open[0]);
        }}
      >
        <Icon name="sparkle" size={13} />
        {p.streaming ? t.thinking : t.thoughtFor(p.duration)}
        <Icon name="chevronDown" size={13} className="tf-tool-chev" />
      </button>
      {open[0] && (
        <div className="tf-reason-body">
          {p.steps ? (
            <ol>
              {p.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          ) : (
            p.text
          )}
        </div>
      )}
    </div>
  );
}

export function PromptStarters(p: PromptStartersProps) {
  return (
    <div className="tf-starters">
      {(p.items || []).map((s, i) => (
        <button
          key={i}
          type="button"
          className="tf-starter tf-in"
          style={
            {
              "--d": i * 60 + "ms",
            } as React.CSSProperties
          }
          onClick={() => {
            p.onPick && p.onPick(s.prompt || s.title);
          }}
        >
          <TintIcon icon={s.icon || "sparkle"} tint={s.tint || "sky"} />
          <b>{s.title}</b>
          {s.text && <span>{s.text}</span>}
        </button>
      ))}
    </div>
  );
}

export function ModelPicker(p: ModelPickerProps) {
  const t = useStrings(CHAT_STRINGS);
  const models = p.models || [],
    cur = models.find((m) => m.id === p.value) || models[0] || {};
  return (
    <Popover
      side={p.side || "top"}
      width={300}
      flush
      trigger={(s) => (
        <button
          type="button"
          className="tf-model-btn"
          aria-haspopup="menu"
          aria-expanded={s.open}
          onClick={s.toggle}
        >
          <Icon name="sparkle" size={13} />
          {cur.label}
          <Icon name="chevronDown" size={13} />
        </button>
      )}
    >
      {(s) => (
        <div className="tf-menu tf-menu-static" role="menu">
          <div className="tf-menu-label">{t.model}</div>
          {models.map((m) => (
            <button
              key={m.id}
              type="button"
              role="menuitemradio"
              aria-checked={m.id === cur.id}
              className="tf-menu-item tf-model-item"
              onClick={() => {
                p.onChange && p.onChange(m.id);
                s.close();
              }}
            >
              <span className="tf-option-text">
                <b>{m.label}</b>
                {m.hint && <small>{m.hint}</small>}
              </span>
              {m.id === cur.id && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}

export function Composer(p: ComposerProps) {
  const t = useStrings(CHAT_STRINGS);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const ta = React.useRef<HTMLTextAreaElement>(null),
    v = useControlled(p.value, "", p.onChange),
    files = p.attachments || [],
    slash = React.useState(0);
  const cmds = (p.commands || []).filter(
    (c) => /^\/\S*$/.test(v[0]) && ("/" + c.name).indexOf(v[0]) === 0,
  );
  React.useLayoutEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [v[0]]);
  function send() {
    if (p.busy) return;
    if (!v[0].trim() && !files.length) return;
    p.onSend && p.onSend(v[0], files);
    v[1]("");
  }
  function pick(c: ComposerCommand) {
    v[1]("");
    p.onCommand ? p.onCommand(c) : v[1]((c.insert || "") + " ");
    ta.current && ta.current.focus();
  }
  return (
    <div
      className={cx("tf-composer", p.busy && "busy")}
      onDragOver={(e) => {
        if (p.onAttach) e.preventDefault();
      }}
      onDrop={(e) => {
        if (!p.onAttach) return;
        e.preventDefault();
        p.onAttach?.(e.dataTransfer.files);
      }}
    >
      {cmds.length > 0 && (
        <div className="tf-popover tf-composer-cmds top" role="listbox">
          <div className="tf-menu-label">{t.commands}</div>
          {cmds.map((c, i) => (
            <button
              key={c.name}
              type="button"
              role="option"
              aria-selected={i === slash[0]}
              className={cx("tf-option", i === slash[0] && "active")}
              onPointerDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                pick(c);
              }}
            >
              <Icon name={c.icon || "zap"} size={15} />
              <span className="tf-option-text">
                <b>{"/" + c.name}</b>
                {c.hint && <small>{c.hint}</small>}
              </span>
            </button>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="tf-composer-files">
          {files.map((f, i) => (
            <span key={f.name + i} className="tf-attach-chip">
              <Icon name="paperclip" size={13} />
              {f.name}
              {p.onRemoveAttachment && (
                <button
                  type="button"
                  aria-label={t.removeItem(f.name)}
                  onClick={() => {
                    p.onRemoveAttachment?.(i);
                  }}
                >
                  <Icon name="x" size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      <textarea
        ref={ta}
        rows={1}
        className="tf-composer-input"
        placeholder={p.placeholder || t.messagePlaceholder}
        aria-label={p.label || p.placeholder || t.message}
        value={v[0]}
        disabled={p.disabled}
        onChange={(e) => {
          v[1](e.target.value);
          slash[1](0);
        }}
        onKeyDown={(e) => {
          if (cmds.length) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              slash[1]((slash[0] + 1) % cmds.length);
              return;
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              slash[1]((slash[0] - 1 + cmds.length) % cmds.length);
              return;
            }
            if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              pick(cmds[slash[0]]);
              return;
            }
          }
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            send();
          }
        }}
      />
      <div className="tf-composer-bar">
        {p.onAttach && (
          <Tooltip label={t.attachFiles}>
            <button
              type="button"
              className="tf-composer-tool"
              aria-label={t.attachFiles}
              onClick={() => fileRef.current?.click()}
            >
              <Icon name="paperclip" size={16} />
              <input
                ref={fileRef}
                type="file"
                multiple
                hidden
                tabIndex={-1}
                onChange={(e) => {
                  if (e.target.files) p.onAttach?.(e.target.files);
                  e.target.value = "";
                }}
              />
            </button>
          </Tooltip>
        )}
        {p.commands && (
          <Tooltip label={t.commands} shortcut="/">
            <button
              type="button"
              className="tf-composer-tool"
              aria-label={t.commands}
              onClick={() => {
                v[1]("/");
                ta.current && ta.current.focus();
              }}
            >
              <Icon name="code" size={16} />
            </button>
          </Tooltip>
        )}
        {p.models && <ModelPicker models={p.models} value={p.model} onChange={p.onModel} />}
        {p.left}
        <span className="tf-composer-hint">{p.hint != null ? p.hint : t.composerHint}</span>
        {p.busy ? (
          <button type="button" className="tf-send stop" aria-label={t.stop} onClick={p.onStop}>
            <span className="tf-stop-sq" />
          </button>
        ) : (
          <button
            type="button"
            className="tf-send"
            aria-label={t.send}
            disabled={!v[0].trim() && !files.length}
            onClick={send}
          >
            <Icon name="arrowUp" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

const AGENT_TONE: Record<string, Tone> = {
  ["Running"]: "success",
  ["Thinking"]: "info",
  ["Waiting for approval"]: "highlight",
  ["Idle"]: "neutral",
  ["Paused"]: "neutral",
  ["Error"]: "danger",
};

export function AgentStatus(p: AgentStatusProps) {
  const t = useStrings(CHAT_STRINGS);
  const s = p.status || "Idle";
  return (
    <span className="tf-agentstatus">
      <Badge tone={AGENT_TONE[s] || "neutral"} live={s === "Running" || s === "Thinking"}>
        {t.agentStatus[s] ?? s}
      </Badge>
      {p.step && <span className="tf-agentstatus-step">{p.step}</span>}
    </span>
  );
}

const TRACE_ICON: Record<string, IconName> = {
  model: "sparkle",
  tool: "zap",
  search: "search",
  approval: "lock",
  message: "send",
  error: "x",
  memory: "book",
};

export function RunTrace(p: RunTraceProps) {
  const t = useStrings(CHAT_STRINGS);
  const { formatNumber } = useFormat();
  const steps = p.steps || [],
    total = steps.reduce((a, s) => Math.max(a, (s.start || 0) + (s.ms || 0)), 1),
    sel = React.useState(p.defaultOpen != null ? p.defaultOpen : null);
  function fms(ms: number) {
    return ms >= 1000
      ? `${formatNumber(ms / 1000, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`
      : `${formatNumber(ms)} ms`;
  }
  return (
    <div className="tf-trace">
      <div className="tf-trace-head">
        <span>{t.step}</span>
        <span>{t.timeline(fms(total))}</span>
      </div>
      {steps.map((s, i) => {
        const open = sel[0] === i,
          st = s.status || "done";
        return (
          <div key={i} className={cx("tf-trace-row", "is-" + st, open && "open")}>
            <button
              type="button"
              className="tf-trace-main"
              aria-expanded={open}
              onClick={() => {
                sel[1](open ? null : i);
              }}
            >
              <span className={cx("tf-trace-ico", "k-" + (s.kind || "tool"))}>
                <Icon name={(s.kind && TRACE_ICON[s.kind]) || "zap"} size={13} />
              </span>
              <span className="tf-trace-label">
                <b>{s.label}</b>
                {s.meta && <small>{s.meta}</small>}
              </span>
              <span className="tf-trace-bar">
                <i
                  style={{
                    left: ((s.start || 0) / total) * 100 + "%",
                    width: Math.max(1.5, ((s.ms || 0) / total) * 100) + "%",
                  }}
                />
                <em>{st === "running" ? t.stepRunning : fms(s.ms || 0)}</em>
              </span>
            </button>
            {open && s.detail && (
              <div className="tf-trace-detail tf-in">
                {typeof s.detail === "string" ? <pre>{s.detail}</pre> : s.detail}
              </div>
            )}
          </div>
        );
      })}
      {p.footer && <div className="tf-trace-foot">{p.footer}</div>}
    </div>
  );
}

export function UsageMeter(p: UsageMeterProps) {
  const t = useStrings(CHAT_STRINGS);
  const pct = Math.min(100, ((p.used || 0) / (p.limit || 1)) * 100),
    tone = pct >= 90 ? "blush" : pct >= 70 ? "butter" : "mint";
  return (
    <div className="tf-usage">
      <div className="tf-usage-top">
        <span>{p.label || t.context}</span>
        <b>{(p.format || String)(p.used) + " / " + (p.format || String)(p.limit)}</b>
      </div>
      <span className="tf-usage-track">
        <span
          className={"tf-usage-fill tf-sf-" + tone}
          style={{
            width: pct + "%",
          }}
        />
      </span>
      {p.caption && <small>{p.caption}</small>}
    </div>
  );
}

/* ── E-commerce ── */
