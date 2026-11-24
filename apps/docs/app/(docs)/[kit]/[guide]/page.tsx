import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Markdown, PageHead } from "@/components/docs";
import { ShadcnAlertDemo, ShadcnSwitchDemo } from "@/components/shadcn-demo";
import { forKit, knowledge, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

/** Guides that are only Markdown (apps/docs/content); theming and status have their own pages. */
/** Live demos a guide places with a marker such as `<!-- demo: shadcn-switch -->`. */
const DEMOS: Record<string, () => ReactNode> = {
  "shadcn-switch": () => <ShadcnSwitchDemo />,
  "shadcn-alerts": () => <ShadcnAlertDemo />,
};
const SLUGS = ["installation", "cli", "text", "ai", "html", "shadcn", "changelog"];

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
      {forKit(knowledge, g.markdown, kit)
        .split(/<!-- demo: ([\w-]+) -->/)
        .map((part, i) =>
          i % 2 ? <div key={i}>{DEMOS[part]?.()}</div> : <Markdown key={i} text={part} />,
        )}
    </>
  );
}
