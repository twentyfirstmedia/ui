import halo from "@twentyfirstmedia/halo/tokens.json";
import pro from "@twentyfirstmedia/pro/tokens.json";
import { CodeBlock } from "@twentyfirstmedia/ui-core";
import type { CSSProperties } from "react";
import { Code, PageHead } from "@/components/docs";
import { KIT_LABEL, type KitName } from "@/lib/site";

export const metadata = { title: "Theming and tokens" };

type Value = string | { light: string; dark: string };
interface Token {
  name: string;
  value: Value;
  usage?: string;
}
const show = (v: Value | undefined) =>
  v == null
    ? "–"
    : typeof v === "string"
      ? v
      : v.light === v.dark
        ? v.light
        : `${v.light} / ${v.dark}`;

function TokenTable({
  title,
  group,
  swatch,
}: {
  title: string;
  group: "color" | "shadow" | "space" | "radius" | "motion" | "size" | "component";
  swatch?: boolean;
}) {
  const proMap = new Map((pro[group] as Token[]).map((t) => [t.name, t]));
  return (
    <>
      <h2>{title}</h2>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th scope="col">Token</th>
              {swatch && <th scope="col">Here</th>}
              <th scope="col">Halo</th>
              <th scope="col">Pro</th>
              <th scope="col">Use</th>
            </tr>
          </thead>
          <tbody>
            {(halo[group] as Token[]).map((t) => (
              <tr key={t.name}>
                <td>
                  <code>--{t.name}</code>
                </td>
                {swatch && (
                  <td>
                    <span
                      className="docs-swatch"
                      style={{ background: `var(--${t.name})` } as CSSProperties}
                    />
                  </td>
                )}
                <td>
                  <code>{show(t.value)}</code>
                </td>
                <td>
                  <code>{show(proMap.get(t.name)?.value)}</code>
                </td>
                <td>{proMap.get(t.name)?.usage || t.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default async function Theming({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  return (
    <>
      <PageHead
        title="Theming and tokens"
        lead={`Both kits define exactly the same token names. The swatches show ${KIT_LABEL[kit]} in the current theme; Pro maps its own scale onto Halo's names, references like {bg-000} point at other tokens.`}
      />
      <div className="docs-prose">
        <p>
          Theme and density are attributes: <Code>data-theme=&quot;light|dark|system&quot;</Code>{" "}
          and <Code>data-density=&quot;compact|comfortable&quot;</Code> on <Code>&lt;html&gt;</Code>{" "}
          or any subtree, or the <Code>theme</Code> and <Code>density</Code> props of{" "}
          <Code>UIProvider</Code>. Halo follows the system theme and is comfortable by default; Pro
          is dark and compact by default.
        </p>
      </div>
      <CodeBlock
        lang="tsx"
        code={`<UIProvider theme="dark" density="compact">…</UIProvider>\n// Tailwind: bg-surface text-ink rounded-lg shadow-card text-h2`}
      />
      <TokenTable title="Colour" group="color" swatch />
      <TokenTable title="Shadow" group="shadow" />
      <TokenTable title="Component knobs" group="component" />
      <TokenTable title="Spacing" group="space" />
      <TokenTable title="Radius" group="radius" />
      <TokenTable title="Motion" group="motion" />
      <TokenTable title="Sizes" group="size" />
    </>
  );
}
