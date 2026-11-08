import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown, PageHead } from "@/components/docs";
import { ExampleView } from "@/components/example-view";
import { canonical, humanize, patterns, readmes, type KitName } from "@/lib/site";

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
  return { title: humanize(name), alternates: { canonical: canonical(kit, `patterns/${name}`) } };
}

export default async function PatternPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const ex = patterns.find((p) => p.name === name);
  if (!ex) notFound();
  return (
    <div className="docs-pattern">
      <PageHead
        title={humanize(name)}
        lead={`A complete screen built only from kit parts: ${ex.components.slice(0, 8).join(", ")}${ex.components.length > 8 ? " …" : ""}`}
      />
      {readmes[name] && <Markdown text={readmes[name]} />}
      <ExampleView name={ex.name} code={ex.code} width={ex.width} />
    </div>
  );
}
