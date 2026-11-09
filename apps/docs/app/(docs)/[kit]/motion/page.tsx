import type { Metadata } from "next";
import { Markdown, PageHead } from "@/components/docs";
import { MotionDemo } from "@/components/motion-demo";
import { forKit, guide, knowledge, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const g = guide("motion");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}): Promise<Metadata> {
  const { kit } = await params;
  return pageMeta({ kit, path: g.slug, title: g.title, description: g.description });
}

export default async function MotionPage({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  return (
    <>
      <PageHead kit={kit} path={g.slug} title={g.title} lead={g.description} />
      <MotionDemo />
      <Markdown text={forKit(knowledge, g.markdown, kit)} />
    </>
  );
}
