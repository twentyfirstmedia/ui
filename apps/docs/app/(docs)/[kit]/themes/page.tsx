import type { Metadata } from "next";
import { Markdown, PageHead } from "@/components/docs";
import { ThemeBuilder } from "@/components/theme-builder";
import { forKit, guide, knowledge, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const g = guide("themes");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}): Promise<Metadata> {
  const { kit } = await params;
  return pageMeta({ kit, path: g.slug, title: g.title, description: g.description });
}

export default async function Themes({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  return (
    <>
      <PageHead
        kit={kit}
        path={g.slug}
        title={g.title}
        lead={forKit(knowledge, g.description, kit)}
      />
      <ThemeBuilder kit={kit} />
      <Markdown text={forKit(knowledge, g.markdown, kit)} />
    </>
  );
}
