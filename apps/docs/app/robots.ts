import type { MetadataRoute } from "next";
import { ROOT_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** Everyone may read everything, AI crawlers included: the docs are written to be read by agents. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${ROOT_URL}/sitemap.xml`,
    host: ROOT_URL,
  };
}
