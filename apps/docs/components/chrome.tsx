"use client";
import {
  CommandPalette,
  Icon,
  IconButton,
  Menu,
  Popover,
  Segmented,
  Tooltip,
  UIProvider,
  type Motion,
  type PaletteItem,
} from "@twentyfirstmedia/ui-core";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { GITHUB, KIT_LABEL, type KitName, type NavSection } from "@/lib/site";

type ThemeName = "light" | "dark";
const MOTION: { value: Motion; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "standard", label: "Standard" },
  { value: "expressive", label: "Expressive" },
];

function stored<T extends string>(key: string, fallback: T): T {
  try {
    return (localStorage.getItem(key) as T | null) ?? fallback;
  } catch {
    return fallback;
  }
}
function store(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* private mode */
  }
}

export function Chrome({
  kit,
  sections,
  children,
}: {
  kit: KitName;
  sections: NavSection[];
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? `/${kit}/`;
  // undefined until the saved theme is read: the inline script in <head> has already set it
  const [saved, setTheme] = useState<ThemeName | undefined>(undefined);
  const theme: ThemeName = saved ?? (kit === "pro" ? "dark" : "light");
  const [motion, setMotion] = useState<Motion | undefined>(undefined);
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setTheme(stored<ThemeName>(`docs-theme-${kit}`, kit === "pro" ? "dark" : "light"));
  }, [kit]);
  useEffect(() => {
    const m = stored<Motion>("docs-motion", "standard");
    setMotion(m === "standard" ? undefined : m);
  }, []);
  const chooseMotion = (m: Motion) => {
    setMotion(m === "standard" ? undefined : m);
    store("docs-motion", m);
  };
  const motionLabel = MOTION.find((m) => m.value === (motion ?? "standard"))?.label;
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);
  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    if (!menu) return;
    const root = document.documentElement;
    root.classList.add("docs-locked");
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", esc);
    return () => {
      root.classList.remove("docs-locked");
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const rest = pathname.replace(/^\/(halo|pro)/, "");
  const switchKit = (k: string) => router.push(`/${k}${rest || "/"}`);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    store(`docs-theme-${kit}`, next);
  };
  const items: PaletteItem[] = sections.flatMap((s) =>
    s.links.map((l) => ({
      id: l.href || "intro",
      group: s.title,
      label: l.label,
      icon: s.title === "Get started" ? "book" : s.title === "Patterns" ? "grid" : "layers",
      run: () => router.push(`/${kit}/${l.href ? `${l.href}/` : ""}`),
    })),
  );
  const isActive = (href: string) => {
    const target = `/${kit}/${href ? `${href}/` : ""}`;
    return pathname === target || pathname === target.replace(/\/$/, "");
  };
  const flat = sections.flatMap((s) => s.links);
  const here = flat.findIndex((l) => isActive(l.href));
  const prev = here > 0 ? flat[here - 1] : undefined;
  const next = here >= 0 && here < flat.length - 1 ? flat[here + 1] : undefined;
  const href = (h: string) => `/${kit}/${h ? `${h}/` : ""}`;

  /** Theme and GitHub: in the header on wide screens, in the menu on phones. */
  const prefs = () => (
    <>
      <Popover
        align="end"
        trigger={({ toggle }) => (
          <Tooltip label={`Motion: ${motionLabel}`}>
            <IconButton icon="sparkle" label={`Motion: ${motionLabel}`} onClick={toggle} />
          </Tooltip>
        )}
      >
        {({ close }) => (
          <Menu
            label="Motion"
            autoFocus
            onClose={close}
            items={MOTION.map((m) => ({
              label: m.label,
              type: "radio" as const,
              group: "motion",
              checked: (motion ?? "standard") === m.value,
              onClick: () => chooseMotion(m.value),
            }))}
          />
        )}
      </Popover>
      <Tooltip label={theme === "dark" ? "Light theme" : "Dark theme"}>
        <IconButton
          icon={theme === "dark" ? "sun" : "moon"}
          label={theme === "dark" ? "Light theme" : "Dark theme"}
          onClick={toggleTheme}
        />
      </Tooltip>
      <a
        className="tf-iconbtn tf-iconbtn-soft"
        href={GITHUB}
        aria-label="GitHub repository"
        title="GitHub repository"
      >
        <Icon name="code" />
      </a>
    </>
  );

  return (
    <UIProvider kit={kit} theme={saved} motion={motion}>
      <a className="docs-skip" href="#content">
        Skip to content
      </a>
      <header className="docs-header">
        <button
          type="button"
          className="docs-menu-btn tf-iconbtn tf-iconbtn-soft"
          aria-label="Menu"
          aria-controls="docs-nav"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          <Icon name={menu ? "x" : "menu"} />
        </button>
        <Link className="docs-brand" href="/">
          <Logo size={18} className="docs-logo" />
          Twentyfirst UI
          <span className="docs-brand-kit">{KIT_LABEL[kit]}</span>
        </Link>
        <div className="docs-header-tools">
          <button type="button" className="tf-search docs-search" onClick={() => setSearch(true)}>
            <Icon name="search" size={15} />
            <span>Search</span>
            <kbd className="tf-kbd">⌘K</kbd>
          </button>
          <Segmented
            className="docs-kit-switch"
            label="Kit"
            value={kit}
            onChange={switchKit}
            options={[
              { value: "halo", label: "Halo" },
              { value: "pro", label: "Pro" },
            ]}
          />
          <div className="docs-prefs">{prefs()}</div>
        </div>
      </header>
      <div className="docs-body">
        {menu && (
          <button
            type="button"
            className="docs-scrim"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setMenu(false)}
          />
        )}
        <nav id="docs-nav" className={`docs-nav${menu ? " open" : ""}`} aria-label="Docs">
          <div className="docs-nav-prefs">{prefs()}</div>
          {sections.map((s) => (
            <div key={s.title} className="docs-nav-section">
              <h2 className="docs-nav-title">{s.title}</h2>
              <ul>
                {s.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={`/${kit}/${l.href ? `${l.href}/` : ""}`}
                      aria-current={isActive(l.href) ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <main id="content" className="docs-main">
          {children}
          {(prev || next) && (
            <nav className="docs-pager" aria-label="Previous and next page">
              {prev && (
                <Link href={href(prev.href)} rel="prev">
                  <small>Previous</small>
                  <b>{prev.label}</b>
                </Link>
              )}
              {next && (
                <Link className="next" href={href(next.href)} rel="next">
                  <small>Next</small>
                  <b>{next.label}</b>
                </Link>
              )}
            </nav>
          )}
        </main>
      </div>
      {search && (
        <CommandPalette
          items={items}
          onClose={() => setSearch(false)}
          placeholder="Search the docs…"
        />
      )}
    </UIProvider>
  );
}
