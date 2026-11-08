import type { MetadataRoute } from "next";
import { GUIDES, KITS, canonical, knowledge } from "@/lib/site";
import { ROOT_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** Every page of both kits, plus the landing page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...GUIDES.map((g) => g.href),
    "components",
    "patterns",
    ...knowledge.components.map((e) => e.path),
    ...knowledge.patterns.map((e) => e.path),
  ];
  return [
    { url: `${ROOT_URL}/`, changeFrequency: "weekly", priority: 1 },
    ...KITS.flatMap((kit) =>
      paths.map((p) => ({
        url: canonical(kit, p),
        changeFrequency: "weekly" as const,
        priority: p === "" ? 0.9 : p.includes("/") ? 0.6 : 0.8,
      })),
    ),
  ];
}
