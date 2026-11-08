import halo from "@twentyfirstmedia/halo/tokens.json";
import pro from "@twentyfirstmedia/pro/tokens.json";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Markdown, PageHead } from "@/components/docs";
import { KIT_LABEL, forKit, guide, knowledge, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const g = guide("theming");

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
      <div className="docs-table-wrap" tabIndex={0} role="region" aria-label={`${title} tokens`}>
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}): Promise<Metadata> {
  const { kit } = await params;
  return pageMeta({ kit, path: g.slug, title: g.title, description: g.description });
}

export default async function Theming({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  return (
    <>
      <PageHead
        kit={kit}
        path={g.slug}
        title={g.title}
        description={g.description}
        lead={`Both kits define exactly the same token names. The swatches show ${KIT_LABEL[kit]} in the current theme; Pro maps its own scale onto Halo's names, references like {bg-000} point at other tokens.`}
      />
      <Markdown text={forKit(knowledge, g.markdown, kit)} />
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
