import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown, PageHead, PropsTable } from "@/components/docs";
import { ExampleView } from "@/components/example-view";
import { components, humanize, knowledge, props, readmes, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const entry = (name: string) => knowledge.components.find((e) => e.name === name);
/** "Tabs: React component in the Pro kit. A tab bar that switches views. With panels it…" */
const describe = (name: string, kit: KitName) => {
  const e = entry(name);
  const text = (e?.description ?? "").replace(/```[\s\S]*?```/g, "").replace(/^\s*[-*] /gm, "");
  return `${humanize(name)}: React component in the ${kit === "halo" ? "Halo" : "Pro"} kit. ${text || "Live example, code and props."}`;
};

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
  return pageMeta({
    kit,
    path: `components/${name}`,
    title: humanize(name),
    description: describe(name, kit),
  });
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ kit: KitName; name: string }>;
}) {
  const { kit, name } = await params;
  const ex = components.find((c) => c.name === name);
  if (!ex) notFound();
  const shown = ex.components.filter((c) => props[c]);
  return (
    <>
      <PageHead
        kit={kit}
        path={`components/${name}`}
        title={humanize(name)}
        description={describe(name, kit)}
        lead={`${ex.group} · ${shown.join(", ") || name}`}
      />
      {readmes[name] && <Markdown text={readmes[name]} />}
      <ExampleView name={ex.name} code={ex.code} />
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
