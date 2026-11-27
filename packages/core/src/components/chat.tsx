"use client";
import * as React from "react";
import { useFormat, useLinkAs, useStrings } from "../context.js";
import { CHAT_STRINGS } from "../strings.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { useControlled, useId, useScrollFocus } from "../hooks.js";
import { highlightParts } from "./common.js";
import { Avatar, Badge, Button, TintIcon } from "./foundation.js";
import {
  MentionText,
  MessageEditor,
  ReadOnlyBar,
  SystemLine,
  TypingIndicator,
  VersionSwitch,
  VoiceNote,
} from "./chat-thread.js";
import { Popover, Tooltip } from "./overlays.js";
import type {
  BaseProps,
  AgentMarkProps,
  AgentStatusProps,
  ChatAttachment,
  ChatMessageProps,
  FeedbackRatingProps,
  CodeBlockProps,
  ComposerAttachment,
  ComposerCommand,
  ComposerProps,
  IconName,
  Mention,
  MentionOption,
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

/* ── Rich text: a Markdown subset for chat answers ── */
/**
 * Only http(s), mailto, tel and relative links become links; `javascript:`, `data:` and other
 * schemes render as plain text. Control characters and spaces are dropped first, because browsers
 * ignore them inside a scheme ("java\tscript:").
 */
export function safeHref(url: string): string | undefined {
  // eslint-disable-next-line no-control-regex
  const u = url.replace(/[\u0000- \u007f]/g, "");
  if (!u) return undefined;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return /^(https?:|mailto:|tel:)/i.test(u) ? u : undefined;
  return u;
}

interface RtContext {
  terms: string[];
  streaming?: boolean;
  t: typeof CHAT_STRINGS;
  linkAs: React.ElementType;
}

// 1 backticks, 2 code, 3 **bold**, 4 __bold__, 5 ~~strike~~, 6 *em*, 7 _em_, 8 link text,
// 9 link target, 10 bare URL
const INLINE =
  "(`+)([\\s\\S]*?[^`])\\1(?!`)" +
  "|\\*\\*(?=\\S)([\\s\\S]*?\\S)\\*\\*" +
  "|__(?=\\S)([\\s\\S]*?\\S)__" +
  "|~~(?=\\S)([\\s\\S]*?\\S)~~" +
  "|\\*(?=[^\\s*])([^*]*?[^\\s*]|[^\\s*])\\*" +
  "|(?<![\\p{L}\\p{N}_])_(?=[^\\s_])([^_]*?[^\\s_]|[^\\s_])_(?![\\p{L}\\p{N}_])" +
  '|\\[([^\\]]+)\\]\\(\\s*<?([^)\\s>]+)>?(?:\\s+"[^"]*")?\\s*\\)' +
  "|(?<![\\w/@])((?:https?:\\/\\/|www\\.)[^\\s<]*[^\\s<.,;:!?)\\]'\"*_~])";

function marked(s: string, k: string, ctx: RtContext): React.ReactNode[] {
  if (!ctx.terms.length) return [s];
  return highlightParts(s, ctx.terms).map((part, i) =>
    part.hit ? <mark key={k + "m" + i}>{part.text}</mark> : part.text,
  );
}

function inline(s: string, k: string, ctx: RtContext): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = new RegExp(INLINE, "gu");
  let last = 0,
    m: RegExpExecArray | null,
    i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(...marked(s.slice(last, m.index), k + "t" + i, ctx));
    const key = k + "-" + i++;
    if (m[2] !== undefined)
      out.push(
        <code key={key} className="tf-icode">
          {marked(m[2].replace(/^ (.+) $/, "$1"), key, ctx)}
        </code>,
      );
    else if (m[3] !== undefined || m[4] !== undefined)
      out.push(<b key={key}>{inline((m[3] ?? m[4]) as string, key, ctx)}</b>);
    else if (m[5] !== undefined) out.push(<s key={key}>{inline(m[5], key, ctx)}</s>);
    else if (m[6] !== undefined || m[7] !== undefined)
      out.push(<em key={key}>{inline((m[6] ?? m[7]) as string, key, ctx)}</em>);
    else {
      const label = m[8] !== undefined ? inline(m[8], key, ctx) : marked(m[10] as string, key, ctx);
      const raw = (m[9] ?? m[10]) as string;
      const href = safeHref(/^www\./i.test(raw) ? "https://" + raw : raw);
      const external = !!href && /^https?:/i.test(href);
      const Link = external ? "a" : ctx.linkAs;
      out.push(
        href ? (
          <Link
            key={key}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {label}
          </Link>
        ) : (
          <span key={key}>{label}</span>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(...marked(s.slice(last), k + "t" + i, ctx));
  return out;
}

const FENCE = /^\s{0,3}(`{3,}|~{3,})\s*([\w+#.-]*)[^`]*$/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/;
const RULE = /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/;
const QUOTE = /^\s{0,3}>/;
const LIST = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const TABLE_SEP = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const indentOf = (s: string) => s.replace(/\t/g, "    ").length;
const isTableStart = (lines: string[], i: number) =>
  (lines[i] as string).includes("|") &&
  i + 1 < lines.length &&
  (lines[i + 1] as string).includes("-") &&
  TABLE_SEP.test(lines[i + 1] as string) &&
  ((lines[i + 1] as string).includes("|") || (lines[i] as string).trim().startsWith("|"));
const startsBlock = (lines: string[], i: number) => {
  const l = lines[i] as string;
  return (
    FENCE.test(l) ||
    HEADING.test(l) ||
    RULE.test(l) ||
    QUOTE.test(l) ||
    LIST.test(l) ||
    isTableStart(lines, i)
  );
};
const cells = (row: string) =>
  row
    .trim()
    .replace(/^\|/, "")
    .replace(/(?<!\\)\|$/, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"));

interface ListEntry {
  indent: number;
  ordered: boolean;
  num: number;
  text: string;
}

function RtTable(p: {
  head: string[];
  align: string[];
  rows: string[][];
  k: string;
  ctx: RtContext;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  useScrollFocus(box);
  const align = (i: number) =>
    (p.align[i] || undefined) as React.CSSProperties["textAlign"] | undefined;
  return (
    <div ref={box} className="tf-rt-table" role="region" aria-label={p.ctx.t.table}>
      <table>
        <thead>
          <tr>
            {p.head.map((c, i) => (
              <th key={i} scope="col" style={{ textAlign: align(i) }}>
                {inline(c, p.k + "h" + i, p.ctx)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {p.rows.map((r, ri) => (
            <tr key={ri}>
              {p.head.map((_, ci) => (
                <td key={ci} style={{ textAlign: align(ci) }}>
                  {inline(r[ci] ?? "", p.k + "c" + ri + "-" + ci, p.ctx)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderList(entries: ListEntry[], k: string, ctx: RtContext): React.ReactNode {
  const base = (entries[0] as ListEntry).indent;
  const items: { e: ListEntry; children: ListEntry[] }[] = [];
  for (const e of entries) {
    const prev = items[items.length - 1];
    if (prev && e.indent >= base + 2) prev.children.push(e);
    else items.push({ e, children: [] });
  }
  const first = entries[0] as ListEntry;
  const Tag = first.ordered ? "ol" : "ul";
  return (
    <Tag key={k} start={first.ordered && first.num !== 1 ? first.num : undefined}>
      {items.map(({ e, children }, ii) => {
        const task = /^\[([ xX])\]\s+([\s\S]*)$/.exec(e.text);
        const done = !!task && task[1] !== " ";
        return (
          <li key={ii} className={task ? "tf-rt-task" : undefined}>
            {task ? (
              <>
                <span
                  className={cx("tf-rt-check", done && "on")}
                  role="img"
                  aria-label={done ? ctx.t.taskDone : ctx.t.taskOpen}
                >
                  {done && <Icon name="check" size={12} />}
                </span>
                <span>{inline(task[2] as string, k + ii, ctx)}</span>
              </>
            ) : (
              inline(e.text, k + ii, ctx)
            )}
            {children.length > 0 && renderList(children, k + ii + "n", ctx)}
          </li>
        );
      })}
    </Tag>
  );
}

function rtBlocks(lines: string[], k: string, ctx: RtContext): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] as string;
    const key = k + "-" + i;
    if (!line.trim()) {
      i++;
      continue;
    }
    let m = FENCE.exec(line);
    if (m) {
      const fence = m[1] as string;
      const body: string[] = [];
      let closed = false;
      i++;
      while (i < lines.length) {
        const l = lines[i] as string;
        if (l.trim().startsWith(fence) && /^\s*(`{3,}|~{3,})\s*$/.test(l)) {
          closed = true;
          i++;
          break;
        }
        body.push(l);
        i++;
      }
      out.push(
        <CodeBlock
          key={key}
          lang={m[2] || ""}
          code={body.join("\n")}
          open={!closed && ctx.streaming}
        />,
      );
      continue;
    }
    if ((m = HEADING.exec(line))) {
      out.push(
        <p key={key} className={cx("tf-rt-h", "h" + (m[1] as string).length)}>
          {inline(m[2] as string, key, ctx)}
        </p>,
      );
      i++;
      continue;
    }
    if (RULE.test(line)) {
      out.push(<hr key={key} className="tf-rt-hr" />);
      i++;
      continue;
    }
    if (QUOTE.test(line)) {
      const inner: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i] as string))
        inner.push((lines[i++] as string).replace(/^\s{0,3}> ?/, ""));
      out.push(<blockquote key={key}>{rtBlocks(inner, key, ctx)}</blockquote>);
      continue;
    }
    if (isTableStart(lines, i)) {
      const head = cells(line);
      const align = cells(lines[i + 1] as string).map((c) =>
        /^:-+:$/.test(c) ? "center" : /-:$/.test(c) ? "right" : /^:/.test(c) ? "left" : "",
      );
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && (lines[i] as string).includes("|") && (lines[i] as string).trim())
        rows.push(cells(lines[i++] as string));
      out.push(<RtTable key={key} k={key} head={head} align={align} rows={rows} ctx={ctx} />);
      continue;
    }
    if (LIST.test(line)) {
      const entries: ListEntry[] = [];
      while (i < lines.length) {
        const l = lines[i] as string;
        const lm = LIST.exec(l);
        if (lm && !RULE.test(l)) {
          entries.push({
            indent: indentOf(lm[1] as string),
            ordered: /\d/.test(lm[2] as string),
            num: parseInt(lm[2] as string, 10) || 1,
            text: lm[3] as string,
          });
          i++;
        } else if (!l.trim()) {
          // a blank line inside a list: the list goes on if an item or an indented line follows
          let j = i + 1;
          while (j < lines.length && !(lines[j] as string).trim()) j++;
          const next = lines[j];
          if (next !== undefined && (LIST.test(next) || /^\s{2,}\S/.test(next))) i = j;
          else break;
        } else if (/^\s{2,}\S/.test(l) && entries.length) {
          const last = entries[entries.length - 1] as ListEntry;
          last.text += " " + l.trim();
          i++;
        } else break;
      }
      out.push(renderList(entries, key, ctx));
      continue;
    }
    const para: string[] = [line];
    i++;
    while (i < lines.length && (lines[i] as string).trim() && !startsBlock(lines, i))
      para.push(lines[i++] as string);
    out.push(
      <p key={key}>
        {para.map((l, li) => (
          <React.Fragment key={li}>
            {li > 0 && <br />}
            {inline(l.trim(), key + "l" + li, ctx)}
          </React.Fragment>
        ))}
      </p>,
    );
  }
  return out;
}

export function RichText(p: RichTextProps) {
  const t = useStrings(CHAT_STRINGS);
  const linkAs = useLinkAs(p.linkAs);
  const ctx: RtContext = {
    terms: p.highlight ? p.highlight.split(/\s+/).filter(Boolean) : [],
    streaming: p.streaming,
    t,
    linkAs,
  };
  const lines = String(p.text || "")
    .replace(/\r\n?/g, "\n")
    .split("\n");
  return (
    <div style={p.style} className={cx("tf-rt", p.className)}>
      {rtBlocks(lines, "b", ctx)}
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
    <div style={p.style} className={cx("tf-code", p.className)}>
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
export function TypingDots(p: BaseProps & { label?: string }) {
  const t = useStrings(CHAT_STRINGS);
  return (
    <span
      style={p.style}
      className={cx("tf-typing", p.className)}
      role="status"
      aria-label={p.label || t.working}
    >
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
        ...p.style,
      }}
      aria-hidden
    >
      <Icon name={p.icon || "bot"} size={Math.round(s * 0.5)} />
    </span>
  );
}

function copyText(text: string) {
  try {
    void navigator.clipboard?.writeText(text);
  } catch {
    /* clipboard unavailable */
  }
}

const isImage = (a: ChatAttachment) => a.kind === "image" || a.kind === "img";

function MessageAttachments(p: { items: ChatAttachment[] }) {
  const t = useStrings(CHAT_STRINGS);
  const images = p.items.filter(isImage);
  const files = p.items.filter((a) => !isImage(a));
  return (
    <>
      {images.length > 0 && (
        <div className="tf-msg-images">
          {images.map((a, i) =>
            a.url ? (
              <a
                key={a.name + i}
                className="tf-msg-image"
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.openImage(a.name)}
              >
                <img src={a.thumb || a.url} alt={a.name} loading="lazy" />
              </a>
            ) : (
              <span key={a.name + i} className="tf-msg-image">
                {a.thumb ? (
                  <img src={a.thumb} alt={a.name} loading="lazy" />
                ) : (
                  <Icon name="image" size={20} />
                )}
              </span>
            ),
          )}
        </div>
      )}
      {files.length > 0 && (
        <div className="tf-msg-attach">
          {files.map((a, i) => (
            <span key={a.name + i} className="tf-attach-chip">
              <Icon name="paperclip" size={13} />
              <span className="tf-attach-name">{a.name}</span>
              {a.size && <small>{a.size}</small>}
              {a.url && (
                <a href={a.url} download={a.name} aria-label={t.downloadFile(a.name)}>
                  <Icon name="download" size={12} />
                </a>
              )}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export function ChatMessage(p: ChatMessageProps) {
  const t = useStrings(CHAT_STRINGS);
  const me = p.role === "user",
    [copied, setCopied] = React.useState(false);
  const [editing, setEditing] = useControlled(p.editing, false, p.onEditingChange);
  const [fb, setFb] = useControlled<"up" | "down" | null>(p.feedback, null, p.onFeedback);
  if (p.role === "system")
    return (
      <SystemLine id={p.id} icon={p.icon} time={p.time} className={p.className} style={p.style}>
        {p.children || p.text}
      </SystemLine>
    );
  function copy() {
    copyText(p.text || "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1400);
  }
  const versioned = (p.versionCount || 0) > 1;
  const showActions = p.actions !== false && !p.streaming && !editing;
  const visible = p.actionsVisible || ((!me && p.onRetry) || versioned ? "always" : "hover");
  const hasBody = !!(p.text || p.children || p.streaming);
  return (
    <div
      style={p.style}
      className={cx("tf-msg", me ? "me" : "ai", editing && "editing", p.className)}
      data-message-id={p.id}
    >
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
        {editing ? (
          <MessageEditor
            defaultValue={p.text || ""}
            onCancel={() => setEditing(false)}
            onSubmit={(text) => {
              setEditing(false);
              p.onEdit?.(text);
            }}
          />
        ) : p.voice ? (
          <VoiceNote
            mine={me}
            src={p.voice.src}
            duration={p.voice.duration}
            transcript={p.voice.transcript}
            peaks={p.voice.peaks}
          />
        ) : (
          hasBody && (
            <div className="tf-bubble">
              {p.children ||
                (me ? (
                  <p className="tf-rt-plain">
                    <MentionText
                      text={p.text || ""}
                      mentions={p.mentions}
                      highlight={p.highlight}
                    />
                  </p>
                ) : p.text ? (
                  <RichText
                    text={p.text}
                    streaming={p.streaming}
                    highlight={p.highlight}
                    linkAs={p.linkAs}
                  />
                ) : (
                  <TypingDots />
                ))}
            </div>
          )
        )}
        {p.attachments && p.attachments.length > 0 && <MessageAttachments items={p.attachments} />}
        {(p.dictated || p.inVoice) && (
          <div className="tf-msg-markers">
            {p.dictated && (
              <span className="tf-msg-marker">
                <Icon name="mic" size={12} />
                {t.dictated}
              </span>
            )}
            {p.inVoice && (
              <span className="tf-msg-marker">
                <Icon name="volume" size={12} />
                {t.inVoice}
              </span>
            )}
          </div>
        )}
        {p.sources && p.sources.length > 0 && (
          <div className="tf-msg-sources">
            {p.sources.map((s, i) => {
              const chip = (
                <a
                  key={i}
                  className="tf-source"
                  href={s.url || "#"}
                  title={s.detail ? undefined : s.title}
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
                  <span className="tf-source-title">{s.title}</span>
                </a>
              );
              return s.detail ? (
                <Tooltip key={i} label={s.detail}>
                  {chip}
                </Tooltip>
              ) : (
                chip
              );
            })}
          </div>
        )}
        {showActions && (
          <div className={cx("tf-msg-actions", visible === "hover" && "reveal")}>
            <Tooltip label={copied ? t.copied : t.copy}>
              <button
                type="button"
                className="tf-msg-act"
                aria-label={me ? t.copyMessage : t.copyReply}
                onClick={copy}
              >
                <Icon name={copied ? "check" : "copy"} size={14} />
              </button>
            </Tooltip>
            {me && p.onEdit && (
              <Tooltip label={t.edit}>
                <button
                  type="button"
                  className="tf-msg-act"
                  aria-label={t.editMessage}
                  onClick={() => setEditing(true)}
                >
                  <Icon name="edit" size={14} />
                </button>
              </Tooltip>
            )}
            {!me && p.onRetry && (
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
            {versioned && (
              <VersionSwitch
                count={p.versionCount as number}
                index={p.versionIndex}
                onChange={p.onVersionChange}
                busy={p.versionBusy}
              />
            )}
            {!me && (
              <FeedbackRating
                inline
                value={fb}
                onRate={(v) => setFb(v)}
                onSubmit={p.onFeedbackComment}
                upLabel={t.goodReply}
                downLabel={t.badReply}
                askOnUp={false}
              />
            )}
            {p.usage && <span className="tf-msg-usage">{p.usage}</span>}
          </div>
        )}
        {p.after}
      </div>
    </div>
  );
}

export function FeedbackRating(p: FeedbackRatingProps) {
  const t = useStrings(CHAT_STRINGS);
  const [v, setV] = useControlled<"up" | "down" | null>(p.value, null, p.onRate),
    [comment, setComment] = React.useState(""),
    [sent, setSent] = React.useState(false),
    [asking, setAsking] = React.useState(false);
  if (sent && !p.inline)
    return (
      <span className="tf-feedback-done">
        <Icon name="check" size={13} />
        {p.thanks || t.thanksNoted}
      </span>
    );
  const press = (x: "up" | "down") => {
    if (p.inline && v === x) {
      setV(null);
      setAsking(false);
      return;
    }
    setV(x);
    if (x === "down" || p.askOnUp) setAsking(true);
    else {
      setAsking(false);
      setSent(true);
      p.onSubmit?.("up", "");
    }
  };
  const buttons = (
    <>
      {p.label && <span className="tf-card-desc">{p.label}</span>}
      <button
        type="button"
        className={cx("tf-msg-act", v === "up" && "on")}
        aria-pressed={v === "up"}
        aria-label={p.upLabel || t.good}
        onClick={() => press("up")}
      >
        <Icon name="thumbUp" size={14} />
      </button>
      <button
        type="button"
        className={cx("tf-msg-act", v === "down" && "on")}
        aria-pressed={v === "down"}
        aria-label={p.downLabel || t.notGood}
        onClick={() => press("down")}
      >
        <Icon name="thumbDown" size={14} />
      </button>
    </>
  );
  const form = asking && v && (
    <form
      className="tf-feedback-form tf-in"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        setAsking(false);
        p.onSubmit?.(v, comment);
        setComment("");
      }}
    >
      <input
        className="tf-input"
        autoFocus
        aria-label={p.placeholder || t.whatShouldBeDifferent}
        placeholder={p.placeholder || t.whatShouldBeDifferent}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setAsking(false);
        }}
      />
      <Button type="submit" size="sm">
        {t.send}
      </Button>
    </form>
  );
  if (p.inline)
    return (
      <>
        {buttons}
        {sent && !asking && v && (
          <span className="tf-feedback-done" role="status">
            <Icon name="check" size={13} />
            {p.thanks || t.thanksNoted}
          </span>
        )}
        {form}
      </>
    );
  return (
    <div style={p.style} className={cx("tf-feedback", p.className)}>
      <div className="tf-row" style={{ gap: 4, flexWrap: "nowrap" }}>
        {buttons}
      </div>
      {form}
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
  const Link = useLinkAs(p.linkAs);
  const open = React.useState(!!p.defaultOpen),
    st = p.status || "done";
  const trace = (p.traceHref || p.onTrace) && (
    <Link
      className="tf-tool-trace"
      href={p.traceHref || "#"}
      aria-label={t.openTrace(p.name)}
      onClick={
        p.onTrace
          ? (e: React.MouseEvent) => {
              e.preventDefault();
              p.onTrace?.();
            }
          : undefined
      }
    >
      {p.traceLabel || t.trace}
      <Icon name="arrowUpRight" size={12} />
    </Link>
  );
  return (
    <div style={p.style} className={cx("tf-tool", "is-" + st, open[0] && "open", p.className)}>
      <div className="tf-tool-top">
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
        {trace}
      </div>
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
    <div
      style={p.style}
      className={cx("tf-reason", open[0] && "open", p.streaming && "live", p.className)}
    >
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
    <div style={p.style} className={cx("tf-starters", p.className)}>
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
      style={p.style}
      className={p.className}
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

/** Mentions after an edit of the text: before the edit they stay, after it they move, inside it they go. */
export function shiftMentions(prev: string, next: string, mentions: Mention[]): Mention[] {
  let a = 0;
  while (a < prev.length && a < next.length && prev[a] === next[a]) a++;
  let b = 0;
  while (
    b < prev.length - a &&
    b < next.length - a &&
    prev[prev.length - 1 - b] === next[next.length - 1 - b]
  )
    b++;
  const oldEnd = prev.length - b,
    delta = next.length - prev.length;
  return mentions.flatMap((m) =>
    m.end <= a
      ? [m]
      : m.start >= oldEnd && oldEnd >= a && !(oldEnd === a && m.start === a && delta < 0)
        ? [{ ...m, start: m.start + delta, end: m.end + delta }]
        : [],
  );
}

/** The `@query` the caret is in, if any. */
function mentionQuery(text: string, caret: number, mentions: Mention[]) {
  const before = text.slice(0, caret);
  const m = /(^|\s)@([^\s@]{0,40})$/.exec(before);
  if (!m) return null;
  const start = caret - (m[2] as string).length - 1;
  if (mentions.some((x) => start >= x.start && start < x.end)) return null;
  return { start, query: (m[2] as string).toLowerCase() };
}

const HOLD_MS = 350,
  CANCEL_PX = 72;

function useObjectUrls(files: (File | ComposerAttachment)[]): (string | undefined)[] {
  const urls = React.useMemo(
    () =>
      files.map((f) =>
        typeof File !== "undefined" &&
        f instanceof File &&
        f.type.startsWith("image/") &&
        typeof URL !== "undefined" &&
        URL.createObjectURL
          ? URL.createObjectURL(f)
          : (f as ComposerAttachment).thumb,
      ),
    [files],
  );
  React.useEffect(
    () => () => {
      files.forEach((f, i) => {
        if (typeof File !== "undefined" && f instanceof File && urls[i])
          URL.revokeObjectURL(urls[i]);
      });
    },
    [files, urls],
  );
  return urls;
}

export function Composer(p: ComposerProps) {
  const t = useStrings(CHAT_STRINGS);
  const { formatNumber, formatPercent } = useFormat();
  const uid = useId("composer");
  const fileRef = React.useRef<HTMLInputElement>(null);
  const camRef = React.useRef<HTMLInputElement>(null);
  const ta = React.useRef<HTMLTextAreaElement>(null);
  const mirror = React.useRef<HTMLDivElement>(null);
  const [value, setValueRaw] = useControlled(p.value, "", p.onChange);
  const [mentions, setMentions] = useControlled(p.mentions, [] as Mention[], p.onMentionsChange);
  const files = p.attachments || [];
  const thumbs = useObjectUrls(files);
  const [slash, setSlash] = React.useState(0);
  const [active, setActive] = React.useState(0);
  const [caret, setCaret] = React.useState(0);
  const [closedAt, setClosedAt] = React.useState<string | null>(null);
  const pendingCaret = React.useRef<number | null>(null);
  const dictated = React.useRef(false);
  const lastTyping = React.useRef(0);
  const [rec, setRec] = React.useState<{
    started: number;
    cancel: boolean;
    keyboard: boolean;
  } | null>(null);
  const [, tick] = React.useState(0);
  const [micError, setMicError] = React.useState<string | null>(null);
  const recorder = React.useRef<{
    mr?: MediaRecorder;
    stream?: MediaStream;
    chunks: Blob[];
    cancel: boolean;
    started: number;
  } | null>(null);
  const hold = React.useRef<{ timer?: ReturnType<typeof setTimeout>; x: number; y: number }>({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    if (p.dictation?.active) dictated.current = true;
  }, [p.dictation?.active]);

  React.useLayoutEffect(() => {
    if (pendingCaret.current == null || !ta.current) return;
    const at = pendingCaret.current;
    pendingCaret.current = null;
    ta.current.setSelectionRange(at, at);
    setCaret(at);
  }, [value, mentions]);

  // the recording timer
  React.useEffect(() => {
    if (!rec) return;
    const id = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, [rec]);

  function setText(next: string, nextMentions?: Mention[]) {
    const ms = nextMentions ?? shiftMentions(value, next, mentions);
    if (ms !== mentions) setMentions(ms);
    setValueRaw(next);
    if (p.onTyping && next.trim()) {
      const now = Date.now();
      if (now - lastTyping.current > (p.typingInterval ?? 3000)) {
        lastTyping.current = now;
        p.onTyping();
      }
    } else if (!next.trim()) lastTyping.current = 0;
  }

  const cmds = (p.commands || []).filter(
    (c) => /^\/\S*$/.test(value) && ("/" + c.name).indexOf(value) === 0,
  );
  const mq =
    p.mentionOptions && !cmds.length && closedAt !== value
      ? mentionQuery(value, caret, mentions)
      : null;
  const options = mq
    ? (p.mentionOptions || [])
        .filter((o) =>
          (o.label + " " + o.id + " " + (o.keywords || "") + " " + (o.role || ""))
            .toLowerCase()
            .includes(mq.query),
        )
        .slice(0, 8)
    : [];
  const groups: { title: string; items: MentionOption[] }[] = [];
  for (const o of options) {
    const title = o.group || (o.kind === "person" ? t.peopleGroup : t.agentsGroup);
    let g = groups.find((x) => x.title === title);
    if (!g) groups.push((g = { title, items: [] }));
    g.items.push(o);
  }
  const flat = groups.flatMap((g) => g.items);
  const cur = Math.min(active, Math.max(flat.length - 1, 0));

  function send() {
    if (p.busy || rec) return;
    if (!value.trim() && !files.length) return;
    p.onSend?.(value, files, { mentions, dictated: dictated.current });
    dictated.current = false;
    lastTyping.current = 0;
    setClosedAt(null);
    setText("", []);
  }
  function pickCommand(c: ComposerCommand) {
    setText("", []);
    p.onCommand ? p.onCommand(c) : setText((c.insert || "") + " ", []);
    ta.current?.focus();
  }
  function pickMention(o: MentionOption) {
    if (!mq) return;
    const label = "@" + o.label;
    const next = value.slice(0, mq.start) + label + " " + value.slice(caret);
    const shifted = shiftMentions(value, next, mentions).filter(
      (m) => m.end <= mq.start || m.start >= mq.start + label.length + 1,
    );
    const mention: Mention = {
      id: o.id,
      label: o.label,
      start: mq.start,
      end: mq.start + label.length,
      tint: o.tint,
    };
    setText(
      next,
      [...shifted, mention].sort((a, b) => a.start - b.start),
    );
    pendingCaret.current = mq.start + label.length + 1;
    setActive(0);
    ta.current?.focus();
  }
  function removeMentionAt(pos: number, forward: boolean): boolean {
    const m = mentions.find((x) =>
      forward ? pos >= x.start && pos < x.end : pos > x.start && pos <= x.end,
    );
    if (!m) return false;
    const next = value.slice(0, m.start) + value.slice(m.end);
    const len = m.end - m.start;
    setText(
      next,
      mentions
        .filter((x) => x !== m)
        .map((x) => (x.start >= m.end ? { ...x, start: x.start - len, end: x.end - len } : x)),
    );
    pendingCaret.current = m.start;
    return true;
  }
  function attach(list: FileList | File[]) {
    if (list.length) p.onAttach?.(list);
  }

  /* ── voice messages: hold the microphone ── */
  async function startRecording(keyboard: boolean) {
    setMicError(null);
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setMicError(t.micUnavailable);
      return;
    }
    const started = Date.now();
    recorder.current = { chunks: [], cancel: false, started };
    setRec({ started, cancel: false, keyboard });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = recorder.current;
      if (!r || r.cancel) {
        stream.getTracks().forEach((x) => x.stop());
        return;
      }
      const mr = new MediaRecorder(stream);
      r.mr = mr;
      r.stream = stream;
      mr.ondataavailable = (e) => {
        if (e.data.size) r.chunks.push(e.data);
      };
      mr.onstop = () => {
        stream.getTracks().forEach((x) => x.stop());
        if (!r.cancel && r.chunks.length)
          p.onVoiceMessage?.(
            new Blob(r.chunks, { type: mr.mimeType || "audio/webm" }),
            Date.now() - r.started,
          );
      };
      mr.start();
    } catch {
      recorder.current = null;
      setRec(null);
      setMicError(t.micUnavailable);
    }
  }
  function stopRecording(cancel: boolean) {
    const r = recorder.current;
    recorder.current = null;
    setRec(null);
    if (!r) return;
    r.cancel = cancel;
    if (r.mr && r.mr.state !== "inactive") r.mr.stop();
    else r.stream?.getTracks().forEach((x) => x.stop());
  }
  React.useEffect(() => () => stopRecording(true), []);

  const micShown = !!(p.onDictate || p.onVoiceMessage);
  const listening = !!p.dictation?.active;
  const micLabel = rec
    ? t.sendVoice
    : listening
      ? t.stopDictating
      : p.onDictate && p.onVoiceMessage
        ? t.dictateOrHold
        : p.onDictate
          ? t.dictate
          : t.recordVoice;
  const elapsed = rec ? (Date.now() - rec.started) / 1000 : 0;
  const clock = `${formatNumber(Math.floor(elapsed / 60))}:${formatNumber(Math.floor(elapsed % 60), { minimumIntegerDigits: 2 })}`;
  const hint =
    micError ||
    p.dictation?.error ||
    (listening ? t.dictating : p.hint != null ? p.hint : t.composerHint);
  const interim = listening && p.dictation?.interim ? p.dictation.interim : "";
  const listId = uid + "-mentions";
  const optId = (i: number) => uid + "-opt-" + i;

  if (p.readOnly)
    return (
      <ReadOnlyBar
        className={p.className}
        style={p.style}
        text={p.readOnlyText}
        onAction={p.onStepIn}
      />
    );

  // the text as the mirror draws it: mentions as tinted chips, dictation's words greyed after it
  const mirrorParts: React.ReactNode[] = [];
  let at = 0;
  [...mentions]
    .sort((a, b) => a.start - b.start)
    .forEach((m, i) => {
      if (m.start < at || m.end > value.length) return;
      mirrorParts.push(value.slice(at, m.start));
      mirrorParts.push(
        <span key={i} className={cx("tf-mention", "tf-t-" + (m.tint || "sky"))}>
          {value.slice(m.start, m.end)}
        </span>,
      );
      at = m.end;
    });
  mirrorParts.push(value.slice(at));

  return (
    <div
      style={p.style}
      className={cx(
        "tf-composer",
        p.busy && "busy",
        listening && "dictating",
        rec && "recording",
        p.className,
      )}
      onDragOver={(e) => {
        if (p.onAttach) e.preventDefault();
      }}
      onDrop={(e) => {
        if (!p.onAttach) return;
        e.preventDefault();
        attach(e.dataTransfer.files);
      }}
    >
      {cmds.length > 0 && (
        <div className="tf-popover tf-composer-cmds top" role="listbox" aria-label={t.commands}>
          <div className="tf-menu-label">{t.commands}</div>
          {cmds.map((c, i) => (
            <button
              key={c.name}
              type="button"
              role="option"
              aria-selected={i === slash}
              className={cx("tf-option", i === slash && "active")}
              onPointerDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                pickCommand(c);
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
      {flat.length > 0 && (
        <div
          className="tf-popover tf-composer-cmds tf-composer-mentions top"
          role="listbox"
          id={listId}
          aria-label={t.mentionSuggestions}
        >
          {groups.map((g) => (
            <div key={g.title} role="group" aria-label={g.title}>
              <div className="tf-menu-label" aria-hidden>
                {g.title}
              </div>
              {g.items.map((o) => {
                const i = flat.indexOf(o);
                return (
                  <button
                    key={o.id}
                    id={optId(i)}
                    type="button"
                    role="option"
                    tabIndex={-1}
                    aria-selected={i === cur}
                    className={cx("tf-option", i === cur && "active")}
                    onPointerDown={(e) => {
                      e.preventDefault();
                    }}
                    onPointerEnter={() => setActive(i)}
                    onClick={() => {
                      pickMention(o);
                    }}
                  >
                    {o.kind === "person" ? (
                      <Avatar name={o.label} src={o.avatarSrc} size={24} />
                    ) : (
                      <AgentMark tint={o.tint} size={24} />
                    )}
                    <span className="tf-option-text">
                      <b>{o.label}</b>
                      {o.role && <small>{o.role}</small>}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {p.typing && p.typing.length > 0 && (
        <TypingIndicator names={p.typing} className="tf-composer-typing" />
      )}
      {files.length > 0 && (
        <div className="tf-composer-files">
          {files.map((f, i) => {
            const a = f as ComposerAttachment;
            const pct =
              typeof a.progress === "number" ? Math.max(0, Math.min(1, a.progress)) : undefined;
            return (
              <span
                key={f.name + i}
                className={cx("tf-attach-chip", thumbs[i] && "has-thumb", a.error && "error")}
                title={a.error}
              >
                {thumbs[i] ? (
                  <img className="tf-attach-thumb" src={thumbs[i]} alt="" />
                ) : (
                  <Icon name={a.error ? "ban" : "paperclip"} size={13} />
                )}
                <span className="tf-attach-name">{f.name}</span>
                {a.error ? (
                  <small>{t.uploadFailed}</small>
                ) : pct !== undefined && pct < 1 ? (
                  <small
                    className="tf-attach-progress"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(pct * 100)}
                    aria-label={t.uploading(formatPercent(pct))}
                    style={{ "--p": pct } as React.CSSProperties}
                  >
                    {formatPercent(pct)}
                  </small>
                ) : (
                  a.size && <small>{a.size}</small>
                )}
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
            );
          })}
        </div>
      )}
      {rec ? (
        <div className={cx("tf-composer-rec", rec.cancel && "cancel")} role="status">
          <span className="tf-composer-recdot" aria-hidden />
          <b>{t.recordingVoice(clock)}</b>
          <span className="tf-composer-rechint">
            {rec.cancel ? t.releaseToCancel : t.slideToCancel}
          </span>
        </div>
      ) : (
        <div className="tf-composer-field">
          <div ref={mirror} className="tf-composer-mirror" aria-hidden>
            {mirrorParts}
            {interim && (
              <span className="tf-composer-interim">
                {(value && !/\s$/.test(value) ? " " : "") + interim}
              </span>
            )}
            {"​"}
          </div>
          <textarea
            ref={ta}
            rows={1}
            className="tf-composer-input"
            placeholder={interim ? undefined : p.placeholder || t.messagePlaceholder}
            aria-label={p.label || p.placeholder || t.message}
            aria-autocomplete={p.mentionOptions || p.commands ? "list" : undefined}
            aria-controls={flat.length ? listId : undefined}
            aria-activedescendant={flat.length ? optId(cur) : undefined}
            value={value}
            disabled={p.disabled}
            onScroll={(e) => {
              if (mirror.current) mirror.current.scrollTop = e.currentTarget.scrollTop;
            }}
            onChange={(e) => {
              setText(e.target.value);
              setCaret(e.target.selectionStart ?? e.target.value.length);
              setSlash(0);
              setActive(0);
            }}
            onSelect={(e) => setCaret(e.currentTarget.selectionStart ?? 0)}
            onPaste={(e) => {
              if (!p.onAttach) return;
              const list = Array.from(e.clipboardData?.files || []);
              if (!list.length) return;
              if (!e.clipboardData.getData("text/plain")) e.preventDefault();
              attach(list);
            }}
            onKeyDown={(e) => {
              if (e.altKey && e.code === "Space" && p.onDictate) {
                e.preventDefault();
                p.onDictate();
                return;
              }
              if (cmds.length) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSlash((slash + 1) % cmds.length);
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSlash((slash - 1 + cmds.length) % cmds.length);
                  return;
                }
                if (e.key === "Enter" || e.key === "Tab") {
                  e.preventDefault();
                  pickCommand(cmds[slash] as ComposerCommand);
                  return;
                }
              }
              if (flat.length) {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const step = e.key === "ArrowDown" ? 1 : -1;
                  setActive((cur + step + flat.length) % flat.length);
                  return;
                }
                if (e.key === "Enter" || e.key === "Tab") {
                  e.preventDefault();
                  pickMention(flat[cur] as MentionOption);
                  return;
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setClosedAt(value);
                  return;
                }
              }
              const el = e.currentTarget;
              if (
                (e.key === "Backspace" || e.key === "Delete") &&
                el.selectionStart === el.selectionEnd &&
                removeMentionAt(el.selectionStart, e.key === "Delete")
              ) {
                e.preventDefault();
                return;
              }
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
          />
        </div>
      )}
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
                  if (e.target.files) attach(e.target.files);
                  e.target.value = "";
                }}
              />
            </button>
          </Tooltip>
        )}
        {p.onAttach && p.camera && (
          <button
            type="button"
            className="tf-composer-tool tf-composer-camera"
            aria-label={t.takePhoto}
            title={t.takePhoto}
            onClick={() => camRef.current?.click()}
          >
            <Icon name="camera" size={16} />
            <input
              ref={camRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              tabIndex={-1}
              onChange={(e) => {
                if (e.target.files) attach(e.target.files);
                e.target.value = "";
              }}
            />
          </button>
        )}
        {p.commands && (
          <Tooltip label={t.commands} shortcut="/">
            <button
              type="button"
              className="tf-composer-tool"
              aria-label={t.commands}
              onClick={() => {
                setText("/", []);
                ta.current && ta.current.focus();
              }}
            >
              <Icon name="code" size={16} />
            </button>
          </Tooltip>
        )}
        {p.models && <ModelPicker models={p.models} value={p.model} onChange={p.onModel} />}
        {p.left}
        <span
          className={cx("tf-composer-hint", (micError || p.dictation?.error) && "error")}
          aria-live="polite"
        >
          {hint}
        </span>
        {rec && (
          <button
            type="button"
            className="tf-composer-tool"
            aria-label={t.cancelRecording}
            title={t.cancelRecording}
            onClick={() => stopRecording(true)}
          >
            <Icon name="x" size={16} />
          </button>
        )}
        {micShown && (
          <button
            type="button"
            className={cx("tf-composer-tool", "tf-composer-mic", (listening || rec) && "on")}
            aria-label={micLabel}
            title={micLabel}
            aria-pressed={p.onDictate && !rec ? listening : undefined}
            disabled={p.disabled}
            onPointerDown={(e) => {
              if (e.button !== 0 || listening || !p.onVoiceMessage || rec) return;
              e.currentTarget.setPointerCapture?.(e.pointerId);
              hold.current = {
                x: e.clientX,
                y: e.clientY,
                timer: setTimeout(() => {
                  hold.current.timer = undefined;
                  void startRecording(false);
                }, HOLD_MS),
              };
            }}
            onPointerMove={(e) => {
              if (!rec || rec.keyboard) return;
              const far =
                Math.hypot(e.clientX - hold.current.x, e.clientY - hold.current.y) > CANCEL_PX;
              if (far !== rec.cancel) setRec({ ...rec, cancel: far });
            }}
            onPointerUp={(e) => {
              if (e.button !== 0) return;
              if (hold.current.timer) {
                clearTimeout(hold.current.timer);
                hold.current.timer = undefined;
                p.onDictate?.();
                if (!p.onDictate) void startRecording(true);
              } else if (rec && !rec.keyboard) stopRecording(rec.cancel);
              else if (!p.onVoiceMessage || listening) {
                if (p.onDictate) p.onDictate();
              } else if (rec) stopRecording(false);
            }}
            onPointerCancel={() => {
              if (hold.current.timer) clearTimeout(hold.current.timer);
              hold.current.timer = undefined;
              if (rec && !rec.keyboard) stopRecording(true);
            }}
            onClick={(e) => {
              // keyboard (Enter, Space): dictation, or start and send a voice message
              if (e.detail !== 0) return;
              if (rec) stopRecording(false);
              else if (p.onDictate) p.onDictate();
              else void startRecording(true);
            }}
          >
            <Icon name={rec ? "arrowUp" : "mic"} size={16} />
          </button>
        )}
        {p.busy ? (
          <button type="button" className="tf-send stop" aria-label={t.stop} onClick={p.onStop}>
            <span className="tf-stop-sq" />
          </button>
        ) : (
          !rec && (
            <button
              type="button"
              className="tf-send"
              aria-label={t.send}
              disabled={!value.trim() && !files.length}
              onClick={send}
            >
              <Icon name="arrowUp" size={16} />
            </button>
          )
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
    <span style={p.style} className={cx("tf-agentstatus", p.className)}>
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
    <div style={p.style} className={cx("tf-trace", p.className)}>
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
    <div style={p.style} className={cx("tf-usage", p.className)}>
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
