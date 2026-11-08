import halo from "@twentyfirstmedia/halo/tokens.json";
import pro from "@twentyfirstmedia/pro/tokens.json";
import type { Metadata, Viewport } from "next";
import { forKit, mdPath, plain } from "../../../packages/cli/src/knowledge.ts";
import {
  BASE_PATH,
  GITHUB,
  KIT_LABEL,
  SITE_NAME,
  SITE_URL,
  canonical,
  knowledge,
  type KitName,
} from "./site";

/** Site root including the base path, no trailing slash. */
export const ROOT_URL = `${SITE_URL}${BASE_PATH}`;
export const ogImage = (name: "home" | KitName) => ({
  url: `${ROOT_URL}/og/${name}.png`,
  width: 1200,
  height: 630,
  alt: name === "home" ? `${SITE_NAME}: Halo and Pro` : `${SITE_NAME} · ${KIT_LABEL[name]}`,
});

const TOKENS = { halo, pro } as const;
/** A colour token of a kit, for browser chrome (theme-color) and the manifest. */
export function tokenColor(kit: KitName, name: string, mode: "light" | "dark"): string {
  const list = TOKENS[kit].color as {
    name: string;
    value: string | { light: string; dark: string };
  }[];
  const v = list.find((x) => x.name === name)?.value;
  const value = typeof v === "string" ? v : (v?.[mode] ?? "");
  // Pro maps its scale onto Halo's names: {bg-100} points at another token
  const ref = /^\{([\w-]+)\}$/.exec(value);
  return ref ? tokenColor(kit, ref[1] as string, mode) : value;
}

export function themeColors(kit: KitName): NonNullable<Viewport["themeColor"]> {
  return [
    { media: "(prefers-color-scheme: light)", color: tokenColor(kit, "surface", "light") },
    { media: "(prefers-color-scheme: dark)", color: tokenColor(kit, "surface", "dark") },
  ];
}

/** Defaults every page inherits: base URL, app name, social cards, robots. */
export function baseMeta(kit: KitName | "home"): Metadata {
  const img = ogImage(kit);
  return {
    metadataBase: new URL(`${ROOT_URL}/`),
    applicationName: SITE_NAME,
    authors: [{ name: "Twentyfirst Media", url: "https://twentyfirst.media" }],
    creator: "Twentyfirst Media",
    publisher: "Twentyfirst Media",
    category: "technology",
    keywords: [
      "React UI kit",
      "React components",
      "design system",
      "design tokens",
      "Tailwind v4",
      "dark mode",
      "accessible components",
      "MCP server",
      "Halo",
      "Pro",
    ],
    formatDetection: { telephone: false, email: false, address: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: { siteName: SITE_NAME, locale: "en_US", type: "website", images: [img] },
    twitter: { card: "summary_large_image", images: [img.url] },
    manifest: `${ROOT_URL}/manifest.webmanifest`,
    other: { "llms-txt": `${ROOT_URL}/llms.txt` },
  };
}

/** Meta descriptions stay within what search results show. */
export function clip(s: string, max = 158): string {
  const t = plain(s).replace(/\s+/g, " ");
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function pageMeta({
  kit,
  path,
  title,
  description,
}: {
  kit: KitName;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = canonical(kit, path);
  const desc = clip(forKit(knowledge, description, kit));
  const full = `${title} · ${KIT_LABEL[kit]} · ${SITE_NAME}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url, types: { "text/markdown": `${ROOT_URL}${mdPath(kit, path)}` } },
    openGraph: {
      type: "article",
      url,
      title: full,
      description: desc,
      siteName: SITE_NAME,
      locale: "en_US",
      images: [ogImage(kit)],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description: desc,
      images: [ogImage(kit).url],
    },
  };
}

/** schema.org data for a docs page: the article and where it sits. */
export function pageJsonLd(kit: KitName, path: string, title: string, description: string) {
  const crumbs = [
    { name: SITE_NAME, url: `${ROOT_URL}/` },
    { name: KIT_LABEL[kit], url: canonical(kit, "") },
  ];
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "components" && parts.length > 1)
    crumbs.push({ name: "Components", url: canonical(kit, "components") });
  if (parts[0] === "patterns" && parts.length > 1)
    crumbs.push({ name: "Patterns", url: canonical(kit, "patterns") });
  if (path) crumbs.push({ name: title, url: canonical(kit, path) });
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: `${title} · ${KIT_LABEL[kit]}`,
        description: clip(forKit(knowledge, description, kit)),
        url: canonical(kit, path),
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${ROOT_URL}/` },
        about: {
          "@type": "SoftwareSourceCode",
          name: `@twentyfirstmedia/${kit}`,
          codeRepository: GITHUB,
        },
        encoding: {
          "@type": "MediaObject",
          encodingFormat: "text/markdown",
          contentUrl: `${ROOT_URL}${mdPath(kit, path)}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: c.url,
        })),
      },
    ],
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot close the script element
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
