import "@twentyfirstmedia/ui-core/themes.css";
import "../docs.css";
import "./landing.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { landingScript } from "@/components/landing/shell";
import { baseMeta, themeColors } from "@/lib/seo";

export const metadata: Metadata = baseMeta("home");
export const viewport: Viewport = { themeColor: themeColors("halo"), colorScheme: "light dark" };

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-kit="halo" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: landingScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
