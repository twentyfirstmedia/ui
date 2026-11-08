import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown, PageHead, PropsTable } from "@/components/docs";
import { ExampleView } from "@/components/example-view";
import { canonical, components, humanize, props, readmes, type KitName } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return components.map((c) => ({ name: c.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName; name: string }>;
}): Promise<Metadata> {
  const { kit, name } = await params;
  return { title: humanize(name), alternates: { canonical: canonical(kit, `components/${name}`) } };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ kit: KitName; name: string }>;
}) {
  const { name } = await params;
  const ex = components.find((c) => c.name === name);
  if (!ex) notFound();
  const shown = ex.components.filter((c) => props[c]);
  return (
    <>
      <PageHead title={humanize(name)} lead={`${ex.group} · ${shown.join(", ") || name}`} />
      {readmes[name] && <Markdown text={readmes[name]} />}
      <ExampleView name={ex.name} code={ex.code} width={ex.width} />
      {shown.length > 0 && (
        <>
          <h2>Props</h2>
          {shown.map((c) => (
            <PropsTable key={c} component={c} />
          ))}
        </>
      )}
    </>
  );
}
