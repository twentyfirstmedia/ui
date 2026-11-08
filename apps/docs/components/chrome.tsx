"use client";
import de from "@twentyfirstmedia/ui-core/labels/de.json";
import {
  CommandPalette,
  Icon,
  IconButton,
  Segmented,
  Tooltip,
  UIProvider,
  type PaletteItem,
} from "@twentyfirstmedia/ui-core";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { GITHUB, KIT_LABEL, type KitName, type NavSection } from "@/lib/site";

type ThemeName = "light" | "dark";
type Lang = "en" | "de";

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
  const [theme, setTheme] = useState<ThemeName>(kit === "pro" ? "dark" : "light");
  const [lang, setLang] = useState<Lang>("en");
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setTheme(stored<ThemeName>(`docs-theme-${kit}`, kit === "pro" ? "dark" : "light"));
    setLang(stored<Lang>("docs-lang", "en"));
  }, [kit]);
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

  const rest = pathname.replace(/^\/(halo|pro)/, "");
  const switchKit = (k: string) => router.push(`/${k}${rest || "/"}`);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    store(`docs-theme-${kit}`, next);
  };
  const pick = (l: Lang) => {
    setLang(l);
    store("docs-lang", l);
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

  return (
    <UIProvider
      kit={kit}
      theme={theme}
      locale={lang === "de" ? "de-DE" : "en-US"}
      labels={lang === "de" ? de : undefined}
    >
      <a className="docs-skip" href="#content">
        Skip to content
      </a>
      <header className="docs-header">
        <button
          type="button"
          className="docs-menu-btn tf-iconbtn tf-iconbtn-soft"
          aria-label="Menu"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          <Icon name="menu" />
        </button>
        <Link className="docs-brand" href={`/${kit}/`}>
          <span className="tf-brand-dot" aria-hidden />
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
            size="sm"
            label="Kit"
            value={kit}
            onChange={switchKit}
            options={[
              { value: "halo", label: "Halo" },
              { value: "pro", label: "Pro" },
            ]}
          />
          <Segmented
            className="docs-lang"
            size="sm"
            label="Language"
            value={lang}
            onChange={(v) => pick(v as Lang)}
            options={[
              { value: "en", label: "EN" },
              { value: "de", label: "DE" },
            ]}
          />
          <Tooltip label={theme === "dark" ? "Light theme" : "Dark theme"}>
            <IconButton
              icon={theme === "dark" ? "sun" : "moon"}
              label={theme === "dark" ? "Light theme" : "Dark theme"}
              onClick={toggleTheme}
            />
          </Tooltip>
          <a
            className="tf-iconbtn tf-iconbtn-soft docs-gh"
            href={GITHUB}
            aria-label="GitHub repository"
            title="GitHub repository"
          >
            <Icon name="code" />
          </a>
        </div>
      </header>
      <div className="docs-body">
        <nav className={`docs-nav${menu ? " open" : ""}`} aria-label="Docs">
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
