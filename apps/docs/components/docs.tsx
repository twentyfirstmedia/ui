import { RichText } from "@twentyfirstmedia/ui-core";
import type { ReactNode } from "react";
import { props as allProps } from "@/lib/site";

export function PageHead({ title, lead }: { title: string; lead?: ReactNode }) {
  return (
    <>
      <h1>{title}</h1>
      {lead && <p className="docs-lead">{lead}</p>}
    </>
  );
}

/** Markdown-ish text (paragraphs, lists, **bold**, `code`, links) rendered with the kit's RichText. */
export function Markdown({ text }: { text: string }) {
  return (
    <div className="docs-prose">
      <RichText text={text} />
    </div>
  );
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
