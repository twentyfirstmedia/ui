import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown, PageHead } from "@/components/docs";
import { forKit, knowledge, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

/** Guides that are only Markdown (apps/docs/content); theming and status have their own pages. */
const SLUGS = ["installation", "cli", "ai", "html", "changelog"];

export const dynamicParams = false;
export function generateStaticParams() {
  return SLUGS.map((guide) => ({ guide }));
}

const find = (slug: string) =>
  knowledge.guides.find((g) => g.slug === slug && SLUGS.includes(slug));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName; guide: string }>;
}): Promise<Metadata> {
  const { kit, guide } = await params;
  const g = find(guide);
  return g ? pageMeta({ kit, path: g.slug, title: g.title, description: g.description }) : {};
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ kit: KitName; guide: string }>;
}) {
  const { kit, guide } = await params;
  const g = find(guide);
  if (!g) notFound();
  return (
    <>
      <PageHead
        kit={kit}
        path={g.slug}
        title={g.title}
        lead={forKit(knowledge, g.description, kit)}
      />
      <Markdown text={forKit(knowledge, g.markdown, kit)} />
    </>
  );
}
