# Plan: Twentyfirst UI

Zwei UI-Kits (Halo, Pro) mit einer gemeinsamen Komponenten-API, private npm-Packages, eine CLI wie shadcn und eine Doku-Seite wie ui.shadcn.com.

## Ausgangslage (`reference/`)

| Ordner | Inhalt | Rolle |
|---|---|---|
| `reference/halo/source/` | `halo.js` (React-UMD-Bundle, ~190 Komponenten, `window.Halo`), `halo.css`, `tokens.css`, Font-Import | **Verhalten und API** aller Komponenten, Look von Halo |
| `reference/halo/design-system/` | `README.md` (Regeln, Spacing, Typo, Farben, Status, Freigaben, Texte), `tokens.json`, `components/index.d.ts` (Props), `components/labels.json` (alle Texte), pro Komponente `preview.html` + `README.md` | Doku-Inhalt, Beispiele, Props-Referenz |
| `reference/halo/demo/` | `halo-workspace.html` (gebaute Demo-App), `app.js`, `demo.css` | Beispiel-Screens und Seitenmuster |
| `reference/pro/` | `README.md` (Look „Clean Dark Pro“), `tokens.css/json`, `Status-and-Approvals.md`, `Implementation.md`, Komponenten-Previews, Screens | **Nur der Look** von Pro (Tokens, Dichte, Hairline-Grid, Radien, Typo). Texte und HQ-spezifische Inhalte (Stadt, deutsche HQ-Copy, Firmen) nicht übernehmen. |

Die Previews in `reference/halo/design-system/components/*/preview.html` laden `window.Halo` aus dem Bundle. Zum Ansehen: `reference/halo/demo/halo-workspace.html` direkt im Browser öffnen.

## Entscheidungen

1. **Monorepo** mit pnpm 12 (wie im HQ) und Turborepo, Node 24, TypeScript strict, ESM, React 19 (peer `>=18.3`), Next.js 16 für die Doku, Tailwind v4.
2. **Packages** (Scope `@twentyfirstmedia`, Registry GitHub Packages, privat):
   - `@twentyfirstmedia/ui-core`: alle Komponenten als TSX (eine Datei pro Komponente bzw. Gruppe), Hooks, Icon-Set, Label-/Locale-System, Typen. Kein Kit-spezifisches CSS.
   - `@twentyfirstmedia/halo`: re-exportiert `ui-core`, bringt `styles.css` (Tokens + Komponenten), `tokens.json`, `tailwind.css` (`@theme`-Preset), selbst gehostete Fonts.
   - `@twentyfirstmedia/pro`: dasselbe mit Pro-Tokens und Pro-CSS.
   - `@twentyfirstmedia/ui` (CLI, `npx @twentyfirstmedia/ui …`): `init --kit halo|pro` (Package installieren, CSS-Import, Tailwind-Preset, `UIProvider` mit Locale und deutschen Labels einrichten, `.npmrc`-Hinweis), `add <komponente…>` (Quelltext einer Komponente als eigene Datei in die App kopieren, Imports auf `ui-core` umgeschrieben, zum Anpassen), `list`, `diff <komponente>`.
3. **Klassen-Präfix** neutral `tf-` statt `ha-`. Gleiches Markup in beiden Kits.
3a. **Beide Kits sind immer 1:1 und zur Laufzeit als Themes umschaltbar.** Eine App kann beide gleichzeitig laden und per `data-kit="halo|pro"` am `<html>` (oder an einem Teilbaum) wechseln, ohne Reload und ohne dass sich Layout, Props oder Verhalten ändern:
   - **Einzeln ist der Normalfall:** `@twentyfirstmedia/halo` bzw. `@twentyfirstmedia/pro` allein installieren, `styles.css` importieren, fertig. Das CSS gilt ohne `data-kit`-Attribut, und das andere Kit wird nie mitgeladen.
   - **Beide als Themes ist optional:** `@twentyfirstmedia/ui-core/themes.css` (oder `halo/scoped.css` + `pro/scoped.css`) enthält beide Kits, jeweils unter `[data-kit="…"]` gescoped. Nur Apps, die umschalten wollen, nutzen das.
   - Beide Kits definieren exakt dieselben Token-Namen; `UIProvider` bekommt `kit`, `theme` (light/dark/system) und `density`.
   - **Parität wird per Test erzwungen:** ein Test schlägt fehl, wenn eine Komponente, eine Klasse oder ein Token nur in einem Kit gestylt bzw. definiert ist; der Screenshot-Test läuft für jede Vorschau in beiden Kits; jede neue Komponente braucht Halo- und Pro-CSS im selben PR.
   - Die Doku hat für beide Kits dieselben Seiten; ein Umschalter wechselt live das Kit derselben Seite.
4. **Theming:** Light und Dark per `[data-theme]` und `prefers-color-scheme` wie in der Referenz; Dichte per `[data-density]` (Pro nutzt kompakt als Standard, Halo komfortabel).
5. **Texte:** `L()`/`Lx()`, `setLabels`, `setLocale`, `formatNumber/Money/Date` aus der Referenz übernehmen, zusätzlich `<UIProvider locale labels currency weekStart>`. Mitgeliefert: `labels/en.json` (Schlüssel = englischer Text) und `labels/de.json` (vollständig, Du-Form, kurz und sachlich). Ein Test prüft, dass `de.json` jeden Schlüssel aus dem Quelltext abdeckt.
6. **Client/Server:** interaktive Komponenten mit `"use client"`, rein darstellende server-tauglich. Portale nur clientseitig.
7. **Fonts:** Halo Plus Jakarta Sans + IBM Plex Mono, Pro Geist + Geist Mono, über `@fontsource`/`geist` selbst gehostet (DSGVO, kein Google-CDN).
8. **Doku-Seite** `apps/docs` (Next.js 16): Routen `/halo/...` und `/pro/...` mit identischer Struktur, `/` leitet auf `/halo`. Seiten: Einführung, Installation, CLI, Theming und Tokens (Tabellen aus `tokens.json` mit Farbfeldern), Texte und Locale, Status und Freigaben, eine Seite pro Komponente (Beschreibung aus dem README, Live-Vorschau, Code-Tab, Props-Tabelle automatisch aus den Typen, Varianten), Muster/Screens (aus der Demo), Changelog. Kopfzeile: Kit-Umschalter, hell/dunkel, EN/DE, Suche (⌘K), GitHub-Link. Deployment und Domain `ui.twentyfirst.media` richtet Robin ein; `basePath` und Canonical-URLs so bauen, dass ein Umzug auf `twentyfirst.design` nur eine Variable ist.
9. **Tests:** Vitest + Testing Library für Logik und Tastaturpfade der wichtigen Komponenten (ApprovalCard A–D, Formulare, Combobox, DataTable, DatePicker, RangeSlider, RichTextEditor, Dialoge, Toasts, Labels/Locale). Playwright über die Doku: axe ohne Verstöße und Screenshot jeder Vorschau in beiden Kits × hell/dunkel × 390/1440 px; Snapshots im Repo.
10. **Release:** Changesets, GitHub Action veröffentlicht bei Merge auf `main` nach GitHub Packages. Start bei `0.1.0`, `1.0.0` erst wenn HQ, FollowerPilot und Capitaso es produktiv nutzen.

## Phasen

### Phase 0: Repo-Grundgerüst
- [x] pnpm-Workspace, Turborepo, TS-Basis, ESLint, Prettier, Vitest, Playwright, Changesets
- [x] CI (GitHub Actions): `pnpm check` und `pnpm test:e2e` auf PRs, Release-Workflow (GitHub Packages, `NODE_AUTH_TOKEN` aus Secrets)
- [x] `README.md` für Nutzer: Installation inkl. `.npmrc` für GitHub Packages

Notiz: Lokal läuft Node 22, CI Node 24. TypeScript 6.0 (nicht 7), weil typescript-eslint 7 noch nicht unterstützt. Playwright auf 1.63 gepinnt (passt zum vorinstallierten Chromium). Packages bauen mit `tsc` (eine Datei pro Modul, `"use client"` bleibt erhalten, tree-shakeable).

### Phase 1: Tokens und Fonts
- [x] Token-Generator: `tokens.json` je Kit → CSS-Variablen (hell/dunkel) + Tailwind-`@theme`; Test schlägt fehl, wenn die erzeugten Dateien veraltet sind
- [x] Halo-Tokens 1:1 aus `reference/halo/design-system/tokens.json` und `source/tokens.css` (inkl. Status-, Diff-, Paper-, Frame-, Media-, SERP-Tokens)
- [x] Pro-Tokens aus `reference/pro/tokens.json`, auf **dieselben Token-Namen** wie Halo abgebildet (fehlende sinnvoll ableiten, in einer Tabelle in der Doku festhalten)
- [x] Fonts selbst gehostet

Notiz: `pnpm tokens` erzeugt pro Kit `generated/tokens.css` (`:root`, ohne `data-kit`), `generated/tokens.scoped.css` (`[data-kit="…"]`), `generated/tailwind.css` (`@theme inline reference`) und `docs/tokens.md` (Halo/Pro nebeneinander). Ein Test schlägt fehl, wenn etwas veraltet ist oder die Namen abweichen. Namenskonflikt in der Referenz: Halo `--hairline` ist eine Farbe, Pro `--hairline` eine Breite; die Farbe behält den Namen, die Breite heißt `--line-width`. Pro-`fg-400` liegt unter 4.5:1, daher ist `--ink-subtle` in Pro `fg-300` (axe). Fonts: latin + latin-ext aus `@fontsource(-variable)`, beim Build nach `dist/fonts/` kopiert, mit OFL-Lizenz.

### Phase 2: Core
- [x] Label- und Locale-System, `UIProvider`, Formatter
- [x] Hooks und Helfer aus der Referenz (`useControlled`, `useId`, Outside-Click, Focus-Trap, Portal, Toast-Store)
- [x] Icon-Set (alle Pfade aus `halo.js`, typisiert)

Notiz: `UIProvider` setzt Labels und Locale synchron vor dem ersten Render; ändern sie sich, wird der Teilbaum neu gemountet (alle Texte und Zahlen aktualisiert). Kit, Theme und Dichte setzen nur Attribute (Standard am `<html>`, mit `scope="subtree"` an einem eigenen Wrapper, der auch die Portale aufnimmt). `labels/en.json` enthält vorerst die Schlüssel aus der Referenz; Phase 5 erzeugt sie aus dem Quelltext.

### Phase 3: Komponenten portieren (Halo)
In Batches, jeweils TSX + Halo-CSS + Tests + Doku-Seite:
- [x] Grundlagen und Aktionen (Button … Pagination, Badge mit Status-Formen)
- [x] Formulare (FormField … OtpInput, FileDrop, RangeSlider, StatusSelect, TilePicker, ColorField, MoneyInput, SecretField, LocaleField, RichTextEditor)
- [x] Overlays und Feedback (Popover, Tooltip, Menu, ContextMenu, Modal, Drawer, ConfirmDialog, Toaster, CommandPalette, ShortcutsOverlay, ExportDialog)
- [x] Layout und Navigation (AppShell, TopBar, SideRail, Dock, SubNav, SplitPane, SettingsLayout, MobileTabBar, WorkspaceSwitcher, LocaleSwitcher)
- [x] Daten und Charts (Table, DataTable, FilterBar, KeyValue, TreeView, alle Charts, StatCell, BarList, MapView, UptimeBar, Meter, LogView, CodeViewer)
- [x] KI und Agenten (ChatMessage … ApprovalCard A–D, ApprovalInbox, AgentCard … VoiceMode, ChatLauncher)
- [x] Betrieb und Geld (Connection…, ServerCard, DeployPipeline, DNS/Domain/MailAuth, Ledger, PnL, Receipt, BalanceCard, ServiceMonitor, RunHistory, WebhookEndpoint, BackupList, BlockList)
- [x] Commerce und Inhalte (ProductCard … PlanCard, ReviewCard, CouponCard, EmailPreview, SearchAdPreview, Webmail-Teile)
- [x] Immobilien und Medien (ListingCard, ResultsToolbar, SavedSearch, ValuationCard, EnergyClass, Gallery, BeforeAfter, ImageVariants)
- [x] Seiten-Chrome (CookieConsent, AnnouncementBar, StatusScreen, AuthCard, TwoFactorSetup)

Notiz: Alle ~190 Komponenten sind per Codemod aus `halo.js` portiert (`h()` → JSX, `ha-` → `tf-`) und von Hand auf TypeScript strict gebracht; Props aus `index.d.ts` (`components/types.ts`), wo die Implementierung mehr kann (z. B. `disabled`, `className`, `danger-solid`), sind die Typen ergänzt. Halo-CSS 1:1 aus `halo.css` in fünf geordneten Dateien. Verbesserungen gegenüber der Referenz: Labels in Modul-Konstanten (NAV, Flow-Schritte, Rechte-Stufen) werden zur Laufzeit übersetzt, Status-Schlüssel bleiben englisch und nur die Anzeige geht durch `L()`, `toast({ title })` → `text`, sichere Links in `RichText`, keine festen IDs, kein `navigator` beim Server-Render, Chart-Tönungen über Tokens statt Theme-Selektoren, Select-Pfeil ohne Farb-Literal, keine Demo-Defaults in `AppShell` (Marke/Nutzer). Tests: jede Referenz-Preview läuft gegen die portierten Komponenten (`reference-previews.test.tsx`), dazu Tastaturpfade (ApprovalCard A–D, Inbox J/K, Combobox, DataTable, Toaster/Undo, ConfirmDialog, OTP, DatePicker, RangeSlider). Die Doku-Seiten je Batch entstehen in Phase 7.

### Phase 4: Pro-Kit (1:1 zu Halo)
- [x] Pro-CSS für **jede** Halo-Komponente nach dem Look in `reference/pro/` (Hairline-Grid, eckig, dicht, Geist); gleiches Markup, keine JS-Änderung. Auch Komponenten, die es in `reference/pro/` nicht gibt, bekommen einen Pro-Look, abgeleitet aus dessen Regeln.
- [ ] Laufzeit-Wechsel Halo ↔ Pro in einer App (Beispiel-App + Test: Umschalten ohne Reload, keine Konsole-Fehler, Layout bleibt stabil)
- [x] Paritätstest grün (Komponenten, Klassen, Tokens)
- [x] Wo Pro in der Referenz eine Komponente anders löst, gewinnt die Halo-API; nur die Optik folgt Pro

Notiz: Pro-Struktur wird aus dem Halo-CSS abgeleitet (`scripts/pro-css.ts`, Teil von `pnpm tokens`: eckig, Hairlines statt Schatten, Gewichte ≤ 600, Dichte-Tokens, kein Hover-Lift), der Pro-Look steht handgeschrieben in `packages/pro/css/90-pro-look.css`. Der Paritätstest schlägt fehl, wenn die abgeleiteten Dateien veraltet sind, ein Kit eine Klasse stylt, die das andere nicht hat, oder der Look-Layer eigene Klassen erfindet.

### Phase 5: Deutsche Texte
- [ ] `labels/de.json` vollständig, Abdeckungstest

### Phase 6: CLI
- [ ] `init`, `add`, `list`, `diff` mit Tests gegen eine Beispiel-App in `examples/next-app`

### Phase 7: Doku-Seite
- [ ] Gerüst, Navigation, Suche, Kit-/Theme-/Sprach-Umschalter
- [ ] Seiten aus Phase 3–6, Props-Tabellen automatisch, Live-Vorschauen aus `examples/` (die Previews der Referenz als TSX-Beispiele)
- [ ] Muster-Seiten (Dashboard, Chat, Shop, Admin, Immobilien) aus der Demo

### Phase 8: Qualität und Release 0.1.0
- [ ] axe und Screenshots grün, beide Kits
- [ ] Bundle-Größe pro Komponente geprüft (tree-shakeable, `sideEffects` nur für CSS)
- [ ] Changeset `0.1.0`, Release-Workflow einmal echt durchlaufen

## Offen (Robin)
- GitHub-Packages-Token für den Release-Workflow (Secret `NPM_TOKEN`) und Lesezugriff für die Apps
- Hosting und DNS für `ui.twentyfirst.media` (Vercel oder Hetzner), später `twentyfirst.design`
- Soll die Doku öffentlich sein oder hinter Login (Code-Tabs zeigen Quelltext)?
