import type { Metadata } from "next";
import { Markdown, PageHead } from "@/components/docs";
import { ExampleView } from "@/components/example-view";
import { examples, forKit, guide, knowledge, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const g = guide("status-and-approvals");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}): Promise<Metadata> {
  const { kit } = await params;
  return pageMeta({ kit, path: g.slug, title: g.title, description: g.description });
}

export default async function StatusAndApprovals({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}) {
  const { kit } = await params;
  const pick = (n: string) => examples.find((e) => e.name === n);
  return (
    <>
      <PageHead kit={kit} path={g.slug} title={g.title} lead={g.description} />
      <Markdown text={forKit(knowledge, g.markdown, kit)} />
      {["StatusIndicator", "ApprovalCard", "ApprovalInbox"].map((n) => {
        const ex = pick(n);
        return ex ? (
          <div key={n}>
            <h2>{n}</h2>
            <ExampleView name={ex.name} code={ex.code} />
          </div>
        ) : null;
      })}
    </>
  );
}
