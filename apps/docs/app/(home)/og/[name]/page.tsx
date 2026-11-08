import { UIProvider } from "@twentyfirstmedia/ui-core";
import type { Metadata } from "next";
import { HeroDemo, ParityCard } from "@/components/landing/demos";
import { Logo } from "@/components/logo";
import { componentFiles, knowledge } from "@/lib/site";

/**
 * The social cards (1200 × 630), built from the kits themselves. Not a page for people:
 * scripts/brand.ts screenshots them into public/og/*.png.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ name: "home" }, { name: "halo" }, { name: "pro" }];
}
export const metadata: Metadata = { title: "Social card", robots: { index: false, follow: false } };

const COMPONENTS = Object.values(componentFiles).flat().length;

export default async function OgCard({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const kit = name === "pro" ? "pro" : "halo";
  const home = name === "home";
  return (
    <UIProvider kit={kit} theme={kit === "pro" ? "dark" : "light"}>
      <main className="og">
        <div className="og-copy">
          <p className="og-brand">
            <Logo size={34} className="lp-logo" />
            Twentyfirst UI
          </p>
          <h1>
            {home ? (
              <>
                One API.
                <br />
                Two looks.
              </>
            ) : kit === "halo" ? (
              <>
                Halo
                <br />
                <span>Soft, calm interfaces.</span>
              </>
            ) : (
              <>
                Pro
                <br />
                <span>Sharp, dense interfaces.</span>
              </>
            )}
          </h1>
          <p className="og-meta">
            React UI kit{home ? "s" : ""} · {COMPONENTS} components · {knowledge.patterns.length}{" "}
            screens · MCP server
          </p>
        </div>
        <div className="og-visual">
          {home ? (
            <div className="og-pair">
              <UIProvider scope="subtree" kit="halo" theme="light" className="og-frame">
                <ParityCard id="og-halo" />
              </UIProvider>
              <UIProvider scope="subtree" kit="pro" theme="dark" className="og-frame">
                <ParityCard id="og-pro" />
              </UIProvider>
            </div>
          ) : (
            <HeroDemo />
          )}
        </div>
      </main>
    </UIProvider>
  );
}
