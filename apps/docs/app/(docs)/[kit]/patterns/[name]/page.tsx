import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown, PageHead } from "@/components/docs";
import { ExampleView } from "@/components/example-view";
import { humanize, knowledge, patterns, readmes, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const describe = (name: string) => {
  const e = knowledge.patterns.find((p) => p.name === name);
  return `${e?.summary ? `${e.summary} ` : ""}A complete screen built only from kit components, with its code.`;
};

export const dynamicParams = false;
export function generateStaticParams() {
  return patterns.map((p) => ({ name: p.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName; name: string }>;
}): Promise<Metadata> {
  const { kit, name } = await params;
  return pageMeta({
    kit,
    path: `patterns/${name}`,
    title: humanize(name),
    description: describe(name),
  });
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ kit: KitName; name: string }>;
}) {
  const { kit, name } = await params;
  const ex = patterns.find((p) => p.name === name);
  if (!ex) notFound();
  return (
    <div className="docs-pattern">
      <PageHead
        kit={kit}
        path={`patterns/${name}`}
        description={describe(name)}
        title={humanize(name)}
        lead={`A complete screen built only from kit parts: ${ex.components.slice(0, 8).join(", ")}${ex.components.length > 8 ? " …" : ""}`}
      />
      {readmes[name] && <Markdown text={readmes[name]} />}
      <ExampleView name={ex.name} code={ex.code} />
    </div>
  );
}
