"use client";
import {
  ICON_PATHS,
  Icon,
  SearchField,
  Segmented,
  Select,
  registerIcons,
  type IconName,
} from "@twentyfirstmedia/ui-core";
import { ICON_CATEGORIES, ICON_KEYWORDS, ICON_LIBRARY } from "@twentyfirstmedia/ui-core/icons";
import { useMemo, useRef, useState } from "react";

// the gallery shows every icon, so it registers the whole library
registerIcons(ICON_LIBRARY);

const ALL = "All categories";
const SOURCES = ["All", "Built in", "Library"];
const kit = new Set(Object.keys(ICON_PATHS));

/** Words to find an icon by: its name split into words, its category and its keywords. */
function words(name: string, cat: string): string {
  const split = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return `${name} ${split} ${cat} ${ICON_KEYWORDS[name] ?? ""}`.toLowerCase();
}

/** Every icon of the kit and the library: search, filter, click to copy the name. */
export function IconGallery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [source, setSource] = useState("All");
  const [copied, setCopied] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return Object.entries(ICON_CATEGORIES)
      .filter(([cat]) => category === ALL || cat === category)
      .map(
        ([cat, names]) =>
          [
            cat,
            names.filter(
              (n) =>
                (source === "All" || (source === "Built in") === kit.has(n)) &&
                q.every((w) => words(n, cat).includes(w)),
            ),
          ] as const,
      )
      .filter(([, names]) => names.length);
  }, [query, category, source]);
  const count = groups.reduce((s, [, names]) => s + names.length, 0);

  async function copy(name: string) {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
    } catch {
      setCopied("");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(""), 2000);
  }

  return (
    <section className="docs-example docs-icons" aria-label="Icon gallery">
      <div className="docs-icons-bar">
        <SearchField
          label="Search icons"
          placeholder="Search icons (passkey, share, brand …)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="docs-icons-search"
        />
        <Select
          label="Category"
          options={[ALL, ...Object.keys(ICON_CATEGORIES)]}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Segmented label="Source" options={SOURCES} value={source} onChange={setSource} />
      </div>
      <p className="docs-icons-count" aria-live="polite">
        {copied ? `Copied “${copied}”` : `${count} icons · click one to copy its name`}
      </p>
      {groups.map(([cat, names]) => (
        <div key={cat} className="docs-icons-group">
          <h2 className="docs-icons-title">{cat}</h2>
          <ul className="docs-icons-grid">
            {names.map((n) => (
              <li key={n}>
                <button
                  type="button"
                  className="docs-icon-tile"
                  data-copied={copied === n || undefined}
                  onClick={() => copy(n)}
                >
                  <Icon name={n as IconName} size={22} />
                  <span>{n}</span>
                  {kit.has(n) && <span className="docs-icon-kit">built in</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {!count && <p className="docs-icons-count">No icon matches “{query}”.</p>}
    </section>
  );
}
