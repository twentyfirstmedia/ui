"use client";
import {
  IconButton,
  Icon,
  Segmented,
  Tooltip,
  UIProvider,
  useUI,
  type Motion,
} from "@twentyfirstmedia/ui-core";
import Link from "next/link";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { GITHUB, type KitName } from "@/lib/site";

type ThemeName = "light" | "dark";
const KIT_KEY = "docs-landing-kit";
const themeKey = (kit: KitName) => `docs-theme-${kit}`;
const defaultTheme = (kit: KitName): ThemeName => (kit === "pro" ? "dark" : "light");

function load(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function save(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* private mode */
  }
}

const KitCtx = createContext<{ kit: KitName; switchKit: (k: string) => void }>({
  kit: "halo",
  switchKit: () => {},
});

/** Sets the saved kit and theme before the first paint, so nothing flashes. */
export const landingScript = `try{var k=localStorage.getItem("${KIT_KEY}")==="pro"?"pro":"halo";var t=localStorage.getItem("docs-theme-"+k)||(k==="pro"?"dark":"light");var d=document.documentElement;d.setAttribute("data-kit",k);d.setAttribute("data-theme",t);d.setAttribute("data-motion",localStorage.getItem("docs-motion")||"expressive")}catch(e){}`;

/**
 * The landing page frame: header with the kit and theme switch, and the provider that restyles the
 * whole page when the kit changes. Markup and state stay; only the CSS that applies changes.
 */
export function LandingShell({ children }: { children: ReactNode }) {
  // undefined until the saved values are read: the inline script has already set the attributes
  const [kit, setKit] = useState<KitName | undefined>(undefined);
  const [theme, setTheme] = useState<ThemeName | undefined>(undefined);
  // the landing page shows the expressive motion unless the reader chose a level in the docs
  const [motion, setMotion] = useState<Motion>("expressive");
  useEffect(() => {
    const m = load("docs-motion");
    if (m === "off" || m === "standard" || m === "expressive") setMotion(m);
  }, []);
  useEffect(() => {
    const k: KitName = load(KIT_KEY) === "pro" ? "pro" : "halo";
    setKit(k);
    setTheme((load(themeKey(k)) as ThemeName | null) ?? defaultTheme(k));
  }, []);
  const current: KitName = kit ?? "halo";
  const currentTheme: ThemeName = theme ?? defaultTheme(current);
  const switchKit = (v: string) => {
    const k: KitName = v === "pro" ? "pro" : "halo";
    setKit(k);
    setTheme((load(themeKey(k)) as ThemeName | null) ?? defaultTheme(k));
    save(KIT_KEY, k);
  };
  const toggleTheme = () => {
    const next: ThemeName = currentTheme === "dark" ? "light" : "dark";
    setTheme(next);
    save(themeKey(current), next);
  };
  return (
    <UIProvider kit={kit} theme={theme} motion={motion}>
      <a className="docs-skip" href="#main">
        Skip to content
      </a>
      <header className="lp-header">
        <Link className="lp-brand" href="/" aria-label="Twentyfirst UI home">
          <Logo size={20} className="lp-logo" />
          <span>Twentyfirst UI</span>
        </Link>
        <nav className="lp-nav" aria-label="Main">
          <Link href={`/${current}/components/`}>Components</Link>
          <Link href={`/${current}/patterns/`}>Patterns</Link>
          <Link href={`/${current}/`}>Docs</Link>
          <a href="#agents">For agents</a>
        </nav>
        <div className="lp-tools">
          <KitSwitch value={current} onChange={switchKit} />
          <Tooltip label={currentTheme === "dark" ? "Light theme" : "Dark theme"}>
            <IconButton
              icon={currentTheme === "dark" ? "sun" : "moon"}
              label={currentTheme === "dark" ? "Light theme" : "Dark theme"}
              onClick={toggleTheme}
            />
          </Tooltip>
          <a
            className="tf-iconbtn tf-iconbtn-soft lp-github"
            href={GITHUB}
            aria-label="GitHub repository"
            title="GitHub repository"
          >
            <Icon name="code" />
          </a>
        </div>
      </header>
      <KitCtx value={{ kit: current, switchKit }}>{children}</KitCtx>
    </UIProvider>
  );
}

export const useKit = () => useContext(KitCtx);

export function KitSwitch({
  value,
  onChange,
  label = "Kit",
  className,
}: {
  value?: KitName;
  onChange?: (v: string) => void;
  label?: string;
  className?: string;
}) {
  const ctx = useKit();
  return (
    <Segmented
      className={className}
      label={label}
      value={value ?? ctx.kit}
      onChange={onChange ?? ctx.switchKit}
      options={[
        { value: "halo", label: "Halo" },
        { value: "pro", label: "Pro" },
      ]}
    />
  );
}

/** A link into the docs of the kit the page shows: `<KitLink to="components/">`. */
export function KitLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  const { kit } = useKit();
  return (
    <Link className={className} href={`/${kit}/${to}`}>
      {children}
    </Link>
  );
}

/** Text that differs per kit. */
export function KitText({ halo, pro }: { halo: ReactNode; pro: ReactNode }) {
  const { kit } = useKit();
  return <>{kit === "pro" ? pro : halo}</>;
}

/** The theme the page is in, for subtree providers that must follow it. */
export function usePageTheme(): ThemeName | undefined {
  const ui = useUI();
  return ui.theme === "dark" || ui.theme === "light" ? ui.theme : undefined;
}
