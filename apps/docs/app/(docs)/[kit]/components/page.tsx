import Link from "next/link";
import { PageHead } from "@/components/docs";
import type { Metadata } from "next";
import { componentFiles, examples, humanize, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const total = Object.values(componentFiles).reduce((a, l) => a + l.length, 0);
const LEAD = `${total} components in ${Object.keys(componentFiles).length} groups. Each links to the example that shows it.`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}): Promise<Metadata> {
  const { kit } = await params;
  return pageMeta({
    kit,
    path: "components",
    title: "All components",
    description: `All ${total} React components of the kit by group: foundations, navigation, forms, data, charts, overlays, AI, commerce, admin and media.`,
  });
}

export default async function AllComponents({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  const shownIn = new Map<string, string>();
  for (const e of examples)
    for (const c of e.components) if (!shownIn.has(c)) shownIn.set(c, e.name);
  return (
    <>
      <PageHead kit={kit} path="components" title="All components" lead={LEAD} />
      {Object.entries(componentFiles).map(([file, names]) => (
        <section key={file}>
          <h2>
            {humanize(
              file.replace(
                /(^|-)(\w)/g,
                (_m, d: string, c: string) => (d ? " " : "") + c.toUpperCase(),
              ),
            )}
          </h2>
          <div className="docs-chips">
            {names.map((n) => {
              const ex = shownIn.get(n);
              const pattern = examples.find((e) => e.name === ex)?.group === "Pages";
              return ex ? (
                <Link
                  key={n}
                  className="tf-chip"
                  href={`/${kit}/${pattern ? "patterns" : "components"}/${ex}/#props-${n}`}
                >
                  {n}
                </Link>
              ) : (
                <span key={n} className="tf-chip">
                  {n}
                </span>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
