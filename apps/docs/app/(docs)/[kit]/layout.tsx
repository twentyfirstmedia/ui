import "@twentyfirstmedia/ui-core/themes.css";
import "../../docs.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Chrome } from "@/components/chrome";
import { KITS, KIT_LABEL, nav, type KitName } from "@/lib/site";
import { baseMeta, themeColors } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return KITS.map((kit) => ({ kit }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: string }>;
}): Promise<Metadata> {
  const { kit } = await params;
  const name = KIT_LABEL[kit as KitName] ?? "Halo";
  return {
    ...baseMeta((kit as KitName) ?? "halo"),
    title: { default: `${name} · Twentyfirst UI`, template: `%s · ${name} · Twentyfirst UI` },
    description: `${name}: React components, tokens and patterns of the Twentyfirst UI kits.`,
  };
}

export async function generateViewport({
  params,
}: {
  params: Promise<{ kit: string }>;
}): Promise<Viewport> {
  const { kit } = await params;
  return { themeColor: themeColors(kit as KitName), colorScheme: "light dark" };
}

/** Sets the saved theme before the first paint, so dark mode does not flash. */
const themeScript = (kit: string) =>
  `try{var t=localStorage.getItem("docs-theme-${kit}");document.documentElement.setAttribute("data-theme",t||"${kit === "pro" ? "dark" : "light"}")}catch(e){}`;

export default async function KitLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ kit: string }>;
}) {
  const { kit } = (await params) as { kit: KitName };
  return (
    <html
      lang="en"
      data-kit={kit}
      data-theme={kit === "pro" ? "dark" : "light"}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript(kit) }} />
      </head>
      <body>
        <Chrome kit={kit} sections={nav()}>
          {children}
        </Chrome>
      </body>
    </html>
  );
}
