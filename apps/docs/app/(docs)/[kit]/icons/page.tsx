import type { Metadata } from "next";
import { Markdown, PageHead } from "@/components/docs";
import { IconGallery } from "@/components/icon-gallery";
import { forKit, guide, knowledge, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const g = guide("icons");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}): Promise<Metadata> {
  const { kit } = await params;
  return pageMeta({ kit, path: g.slug, title: g.title, description: g.description });
}

export default async function IconsPage({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  return (
    <>
      <PageHead kit={kit} path={g.slug} title={g.title} lead={g.description} />
      <Markdown text={forKit(knowledge, g.markdown, kit)} />
      <IconGallery />
    </>
  );
}
