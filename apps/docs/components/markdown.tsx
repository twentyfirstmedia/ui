import { CodeBlock } from "@twentyfirstmedia/ui-core";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The Markdown of the guides and component descriptions, rendered with the kit: headings with
 * anchors, paragraphs, lists (with wrapped lines), tables, fenced code as CodeBlock, and inline
 * code, bold, italics and links. The same files are served as .md to agents.
 */
type Block =
  | { t: "h"; level: 2 | 3 | 4; text: string }
  | { t: "p"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "code"; lang: string; code: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "quote"; text: string };

export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[`*]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const splitRow = (l: string) =>
  l
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"));

export function parse(src: string): Block[] {
  const lines = src.replace(/\r/g, "").split("\n");
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] as string;
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = /^```(\w*)/.exec(line);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] as string).startsWith("```"))
        code.push(lines[i++] as string);
      i++;
      out.push({ t: "code", lang: fence[1] || "", code: code.join("\n") });
      continue;
    }
    const h = /^(#{2,4}) (.*)$/.exec(line);
    if (h) {
      out.push({ t: "h", level: (h[1] as string).length as 2 | 3 | 4, text: h[2] as string });
      i++;
      continue;
    }
    if (/^\s*\|/.test(line) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? "")) {
      const head = splitRow(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && /^\s*\|/.test(lines[i] as string))
        rows.push(splitRow(lines[i++] as string));
      out.push({ t: "table", head, rows });
      continue;
    }
    const list = /^\s*([-*]|\d+\.) /.exec(line);
    if (list) {
      const ordered = /\d/.test(list[1] as string);
      const items: string[] = [];
      while (i < lines.length) {
        const l = lines[i] as string;
        if (/^\s*([-*]|\d+\.) /.test(l)) items.push(l.replace(/^\s*([-*]|\d+\.) /, ""));
        else if (l.trim() && /^\s{2,}/.test(l) && items.length)
          items[items.length - 1] += " " + l.trim();
        else break;
        i++;
      }
      out.push({ t: ordered ? "ol" : "ul", items });
      continue;
    }
    const para: string[] = [];
    const quote = line.startsWith("> ");
    while (i < lines.length) {
      const l = lines[i] as string;
      if (!l.trim() || /^(```|#{2,4} |\s*([-*]|\d+\.) |\s*\|)/.test(l)) break;
      para.push(quote ? l.replace(/^> ?/, "") : l);
      i++;
    }
    out.push(quote ? { t: "quote", text: para.join(" ") } : { t: "p", text: para.join(" ") });
  }
  return out;
}

export function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1] != null)
      out.push(
        <code key={k} className="docs-code-inline">
          {m[1]}
        </code>,
      );
    else if (m[2] != null) out.push(<strong key={k}>{inline(m[2], k)}</strong>);
    else if (m[3] != null) out.push(<em key={k}>{inline(m[3], k)}</em>);
    else {
      const href = m[5] as string;
      const label = inline(m[4] as string, k);
      out.push(
        href.startsWith("/") && !/\.(md|txt)$/.test(href) ? (
          <Link key={k} href={href}>
            {label}
          </Link>
        ) : (
          <a key={k} href={href}>
            {label}
          </a>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Prose blocks are grouped in `docs-prose`; code and tables sit between them at full width. */
export function MarkdownDoc({ text }: { text: string }) {
  const blocks = parse(text);
  const groups: { prose: boolean; blocks: Block[] }[] = [];
  for (const b of blocks) {
    const prose = b.t !== "code" && b.t !== "table";
    const g = groups[groups.length - 1];
    if (g && g.prose && prose) g.blocks.push(b);
    else groups.push({ prose, blocks: [b] });
  }
  return (
    <>
      {groups.map((g, gi) =>
        g.prose ? (
          <div key={gi} className="docs-prose">
            {g.blocks.map((b, bi) => render(b, `${gi}-${bi}`))}
          </div>
        ) : (
          g.blocks.map((b, bi) => render(b, `${gi}-${bi}`))
        ),
      )}
    </>
  );
}

function render(b: Block, key: string): ReactNode {
  switch (b.t) {
    case "h": {
      const H = `h${b.level}` as "h2" | "h3" | "h4";
      return (
        <H key={key} id={slug(b.text)}>
          {inline(b.text, key)}
        </H>
      );
    }
    case "p":
      return <p key={key}>{inline(b.text, key)}</p>;
    case "quote":
      return (
        <p key={key} className="docs-note">
          {inline(b.text, key)}
        </p>
      );
    case "ul":
    case "ol": {
      const L = b.t;
      return (
        <L key={key}>
          {b.items.map((it, i) => (
            <li key={i}>{inline(it, `${key}-${i}`)}</li>
          ))}
        </L>
      );
    }
    case "code":
      return <CodeBlock key={key} lang={b.lang} code={b.code} />;
    case "table":
      return (
        <div
          key={key}
          className="docs-table-wrap"
          tabIndex={0}
          role="region"
          aria-label={b.head.join(", ")}
        >
          <table className="docs-table">
            <thead>
              <tr>
                {b.head.map((h, i) => (
                  <th key={i} scope="col">
                    {inline(h, `${key}-h${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td key={ci}>{inline(c, `${key}-${ri}-${ci}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
