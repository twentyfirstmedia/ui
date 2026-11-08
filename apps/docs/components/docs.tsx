import type { ReactNode } from "react";
import { MarkdownDoc } from "@/components/markdown";
import { PageActions } from "@/components/page-actions";
import { props as allProps, type KitName } from "@/lib/site";
import { JsonLd, pageJsonLd } from "@/lib/seo";

/**
 * Page title, lead, the Markdown actions and the page's structured data. `kit` and `path` give
 * the structured data; `description` defaults to the lead when that is plain text.
 */
export function PageHead({
  title,
  lead,
  kit,
  path,
  description,
}: {
  title: string;
  lead?: ReactNode;
  kit?: KitName;
  path?: string;
  description?: string;
}) {
  const desc = description ?? (typeof lead === "string" ? lead : "");
  return (
    <>
      {kit && path != null && <JsonLd data={pageJsonLd(kit, path, title, desc)} />}
      <h1>{title}</h1>
      {lead && <p className="docs-lead">{lead}</p>}
      <PageActions />
    </>
  );
}

/** Markdown (the guides and component descriptions), rendered with the kit. */
export function Markdown({ text }: { text: string }) {
  return <MarkdownDoc text={text} />;
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="docs-code-inline">{children}</code>;
}

export function PropsTable({ component }: { component: string }) {
  const list = allProps[component];
  if (!list || !list.length) return null;
  return (
    <>
      <h3 id={`props-${component}`}>{component}</h3>
      <div className="docs-table-wrap" tabIndex={0} role="region" aria-label={`${component} props`}>
        <table className="docs-table">
          <thead>
            <tr>
              <th scope="col">Prop</th>
              <th scope="col">Type</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.name}>
                <td>
                  <code>
                    {p.name}
                    {p.optional ? "?" : ""}
                  </code>
                </td>
                <td>
                  <code>{p.type}</code>
                </td>
                <td>{p.doc || (p.optional ? "" : "Required")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
