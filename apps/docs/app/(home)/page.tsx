import { Badge, TintIcon, type IconName, type Tint } from "@twentyfirstmedia/ui-core";
import type { Metadata } from "next";
import Link from "next/link";
import {
  AgentDemo,
  AgentSetup,
  HeroDemo,
  InstallCommand,
  ParityDemo,
} from "@/components/landing/demos";
import { KitLink, KitSwitch, KitText, LandingShell } from "@/components/landing/shell";
import { Logo } from "@/components/logo";
import {
  BASE_PATH,
  GITHUB,
  GROUP_ORDER,
  SITE_NAME,
  componentFiles,
  humanize,
  knowledge,
} from "@/lib/site";
import { JsonLd, ROOT_URL, ogImage } from "@/lib/seo";

const COMPONENTS = Object.values(componentFiles).flat().length;
const PAGES = knowledge.components.length;
const PATTERNS = knowledge.patterns.length;
const TITLE = "Twentyfirst UI: two React UI kits, one API";
const DESCRIPTION = `Halo and Pro: ${COMPONENTS} accessible React components and ${PATTERNS} screens in two looks with one API. Dark mode, Tailwind v4, MCP server for agents.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${ROOT_URL}/`, types: { "text/plain": `${ROOT_URL}/llms.txt` } },
  openGraph: {
    type: "website",
    url: `${ROOT_URL}/`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [ogImage("home")],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImage("home").url],
  },
};

const FEATURES: { icon: IconName; tint: Tint; title: string; text: string }[] = [
  {
    icon: "layers",
    tint: "sky",
    title: "One API, two looks",
    text: "Every component, prop, class and token exists in both kits. Load both and switch at runtime: markup and state stay.",
  },
  {
    icon: "phone",
    tint: "mint",
    title: "Mobile first",
    text: "Works from 320px up: shells collapse, tables scroll, dialogs become sheets and inputs never zoom.",
  },
  {
    icon: "check",
    tint: "lilac",
    title: "Accessible",
    text: "Keyboard paths, focus rings and ARIA on every component; axe (WCAG 2.1 AA) runs on every example, both kits, light and dark.",
  },
  {
    icon: "settings",
    tint: "butter",
    title: "Tokens only",
    text: "No colour literals in component CSS. One token file per kit feeds CSS variables and a Tailwind v4 preset.",
  },
  {
    icon: "bot",
    tint: "blush",
    title: "Made for AI products",
    text: "Chat, tool calls, reasoning, agent status and human approvals are first-class components, not afterthoughts.",
  },
  {
    icon: "lock",
    tint: "sky",
    title: "Private by default",
    text: "Self-hosted fonts, no telemetry, no requests from components. Tree-shakeable: one Button is about 3 KB.",
  },
];

const GROUP_ICON: Record<string, IconName> = {
  Foundations: "grid",
  Navigation: "menu",
  Forms: "edit",
  Data: "database",
  Charts: "chart",
  Overlays: "layers",
  AI: "bot",
  Commerce: "cart",
  Admin: "settings",
  "Real estate": "home",
  Media: "image",
};
const TINTS: Tint[] = ["sky", "mint", "butter", "lilac", "blush"];
const FEATURED = [
  "Dashboard",
  "AIChatScreen",
  "StorefrontScreen",
  "BillingScreen",
  "AnalyticsScreen",
  "AgentBuilderScreen",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${ROOT_URL}/`,
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: {
        "@type": "Organization",
        name: "Twentyfirst Media",
        url: "https://twentyfirst.media",
      },
    },
    {
      "@type": "SoftwareSourceCode",
      name: SITE_NAME,
      description: DESCRIPTION,
      codeRepository: GITHUB,
      programmingLanguage: ["TypeScript", "CSS"],
      runtimePlatform: "React 19",
      license: "https://opensource.org/licenses/MIT",
      url: `${ROOT_URL}/`,
      hasPart: [
        { "@type": "SoftwareSourceCode", name: "@twentyfirstmedia/halo", url: `${ROOT_URL}/halo/` },
        { "@type": "SoftwareSourceCode", name: "@twentyfirstmedia/pro", url: `${ROOT_URL}/pro/` },
        {
          "@type": "SoftwareApplication",
          name: "@twentyfirstmedia/ui",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Node.js",
        },
      ],
    },
  ],
};

export default function Landing() {
  const groups = GROUP_ORDER.map((g) => ({
    g,
    items: knowledge.components.filter((c) => c.group === g),
  })).filter((x) => x.items.length);
  const featured = FEATURED.map((n) => knowledge.patterns.find((p) => p.name === n)).filter(
    (p): p is NonNullable<typeof p> => !!p,
  );
  return (
    <LandingShell>
      <JsonLd data={jsonLd} />
      <main id="main" className="lp-main">
        <section className="lp-hero" aria-labelledby="lp-title">
          <div className="lp-hero-copy">
            <a className="lp-pill" href="#agents">
              <Badge tone="info">New</Badge>
              MCP server for Claude Code and Cursor
            </a>
            <h1 id="lp-title">
              One API.
              <br />
              Two looks.
            </h1>
            <p className="lp-lead">
              Halo and Pro are two React UI kits with the same {COMPONENTS} components, props and
              markup.{" "}
              <KitText
                halo="You are looking at Halo: soft, rounded and calm."
                pro="You are looking at Pro: sharp, dense and precise."
              />{" "}
              Switch, and the whole page changes; nothing else does.
            </p>
            <div className="lp-switch-row">
              <KitSwitch label="Switch the kit of this page" className="lp-hero-switch" />
              <span className="lp-hint">Try it: same markup, other CSS</span>
            </div>
            <div className="lp-actions">
              <KitLink className="tf-btn tf-btn-primary" to="installation/">
                Get started
              </KitLink>
              <KitLink className="tf-btn tf-btn-secondary" to="components/">
                Browse components
              </KitLink>
            </div>
            <div className="lp-install">
              <InstallCommand />
            </div>
          </div>
          <div className="lp-hero-visual">
            <HeroDemo />
          </div>
        </section>

        <section className="lp-stats" aria-label="In numbers">
          <dl>
            <div>
              <dt>Components</dt>
              <dd>{COMPONENTS}</dd>
            </div>
            <div>
              <dt>Complete screens</dt>
              <dd>{PATTERNS}</dd>
            </div>
            <div>
              <dt>Looks, light and dark</dt>
              <dd>2 × 2</dd>
            </div>
            <div>
              <dt>axe violations</dt>
              <dd>0</dd>
            </div>
          </dl>
        </section>

        <section className="lp-section" aria-labelledby="lp-parity">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Parity</p>
            <h2 id="lp-parity">Write it once. Ship it twice.</h2>
            <p>
              The kits differ only in tokens and CSS. The same JSX renders as Halo or Pro, and a
              test fails the build if a class or token exists in one kit but not the other.
            </p>
          </div>
          <ParityDemo />
        </section>

        <section className="lp-section" aria-labelledby="lp-features">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Why</p>
            <h2 id="lp-features">Finished screens from the first render</h2>
          </div>
          <ul className="lp-features">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <TintIcon icon={f.icon} tint={f.tint} />
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="lp-section lp-agents" id="agents" aria-labelledby="lp-agents">
          <div className="lp-agents-copy">
            <p className="lp-eyebrow">For coding agents</p>
            <h2 id="lp-agents">Your agent knows every component</h2>
            <p>
              The kits are newer than most models&apos; training data, and exact props matter. The
              MCP server gives Claude Code, Cursor, VS Code and Codex the docs of the version you
              installed: search, props, examples, tokens and a usage check. Offline, no account, one
              command.
            </p>
            <ul className="lp-checks">
              <li>8 tools: search, components, patterns, guides, tokens, icons and check_usage</li>
              <li>
                <a href={`${BASE_PATH}/llms.txt`}>llms.txt</a> and{" "}
                <a href={`${BASE_PATH}/llms-full.txt`}>llms-full.txt</a> for any LLM
              </li>
              <li>Every docs page as Markdown, one click to copy</li>
            </ul>
            <AgentSetup site={ROOT_URL} />
            <KitLink className="lp-more" to="ai/">
              Set up AI agents and MCP →
            </KitLink>
          </div>
          <AgentDemo />
        </section>

        <section className="lp-section" aria-labelledby="lp-groups">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Components</p>
            <h2 id="lp-groups">
              {PAGES} pages, {COMPONENTS} components
            </h2>
            <p>
              From buttons to approval inboxes. Every page has a live example, its code and the
              props.
            </p>
          </div>
          <div className="lp-groups">
            {groups.map(({ g, items }, i) => (
              <KitLink key={g} className="lp-group" to={`${items[0]?.path}/`}>
                <TintIcon icon={GROUP_ICON[g] ?? "grid"} tint={TINTS[i % TINTS.length]} />
                <span className="lp-group-text">
                  <b>{g}</b>
                  <small>
                    {items
                      .slice(0, 4)
                      .map((c) => humanize(c.name))
                      .join(", ")}
                  </small>
                </span>
                <span className="lp-count">{items.length}</span>
              </KitLink>
            ))}
          </div>
        </section>

        <section className="lp-section" aria-labelledby="lp-patterns">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Patterns</p>
            <h2 id="lp-patterns">{PATTERNS} complete screens to start from</h2>
            <p>
              Dashboards, chat, agents, shop, settings and more, built only from kit parts. Copy the
              code, change the data.
            </p>
          </div>
          <div className="lp-patterns">
            {featured.map((p) => (
              <KitLink key={p.name} className="lp-pattern" to={`${p.path}/`}>
                <b>{p.title}</b>
                <small>{p.summary}</small>
              </KitLink>
            ))}
          </div>
          <KitLink className="lp-more" to="patterns/">
            All {PATTERNS} patterns →
          </KitLink>
        </section>

        <section className="lp-cta" aria-labelledby="lp-cta">
          <h2 id="lp-cta">Start with one command</h2>
          <p>
            Registry, styles, provider and layout: the CLI sets up your React app, and copies
            components when you want to own them.
          </p>
          <div className="lp-install">
            <InstallCommand />
          </div>
          <div className="lp-actions">
            <KitLink className="tf-btn tf-btn-primary" to="installation/">
              Read the installation guide
            </KitLink>
            <KitLink className="tf-btn tf-btn-ghost" to="">
              Explore the docs
            </KitLink>
          </div>
        </section>
      </main>
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <Logo size={18} className="lp-logo" />
          <span>Twentyfirst UI</span>
          <small>Two React UI kits, one API. MIT licensed. Made by Twentyfirst Media.</small>
        </div>
        <nav aria-label="Docs">
          <h2>Docs</h2>
          <Link href="/halo/">Halo</Link>
          <Link href="/pro/">Pro</Link>
          <KitLink to="installation/">Installation</KitLink>
          <KitLink to="cli/">CLI</KitLink>
          <KitLink to="theming/">Theming</KitLink>
        </nav>
        <nav aria-label="Resources">
          <h2>Resources</h2>
          <KitLink to="ai/">AI agents and MCP</KitLink>
          <a href={`${BASE_PATH}/llms.txt`}>llms.txt</a>
          <a href={`${BASE_PATH}/llms-full.txt`}>llms-full.txt</a>
          <a href={`${BASE_PATH}/sitemap.xml`}>Sitemap</a>
          <a href={GITHUB}>GitHub</a>
          <a href="https://www.npmjs.com/package/@twentyfirstmedia/halo">npm</a>
        </nav>
      </footer>
    </LandingShell>
  );
}
