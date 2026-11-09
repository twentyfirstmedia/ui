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
- [x] Laufzeit-Wechsel Halo ↔ Pro in einer App (Beispiel-App + Test: Umschalten ohne Reload, keine Konsole-Fehler, Layout bleibt stabil)
- [x] Paritätstest grün (Komponenten, Klassen, Tokens)
- [x] Wo Pro in der Referenz eine Komponente anders löst, gewinnt die Halo-API; nur die Optik folgt Pro

Notiz: Pro-Struktur wird aus dem Halo-CSS abgeleitet (`scripts/pro-css.ts`, Teil von `pnpm tokens`: eckig, Hairlines statt Schatten, Gewichte ≤ 600, Dichte-Tokens, kein Hover-Lift), der Pro-Look steht handgeschrieben in `packages/pro/css/90-pro-look.css`. Der Paritätstest schlägt fehl, wenn die abgeleiteten Dateien veraltet sind, ein Kit eine Klasse stylt, die das andere nicht hat, oder der Look-Layer eigene Klassen erfindet.

### Phase 5: Deutsche Texte
- [x] `labels/de.json` vollständig, Abdeckungstest

Notiz: `pnpm labels` sammelt alle Schlüssel aus `L()`, `Lx()` und `LK()` (Marker für Schlüssel, die später per Variable übersetzt werden, z. B. Risikofamilien und Agent-Status) per TypeScript-AST in `labels/en.json`; der Test prüft Aktualität, Vollständigkeit von `de.json` und gleiche Platzhalter. Laufzeit-Wechsel: `examples/kit-switch` (esbuild, `themes.css`) und `e2e/kit-switch.spec.ts` (kein Reload, Zustand bleibt, identisches Markup, keine Konsolenfehler, kein horizontaler Überlauf). Die Default-Marke „Halo" ist aus TopBar, AuthCard und Rechnung entfernt (wäre in Pro falsch).

### Phase 6: CLI
- [x] `init`, `add`, `list`, `diff` mit Tests gegen eine Beispiel-App in `examples/next-app`

Notiz: `init` setzt `.npmrc` (Scope auf GitHub Packages, Token aus `NPM_TOKEN`), installiert das Kit (abschaltbar mit `--no-install`), trägt `styles.css` bzw. mit `--both` `themes.css` und bei Tailwind v4 das Preset nach `@import "tailwindcss"` ein, legt `components/ui-root.tsx` (UIProvider, bei `de-*` mit `de.json`) an, umschließt `{children}` im Next-Layout und setzt `data-kit` am `<html>`; idempotent. `add` liest die Quellen aus dem installierten `ui-core` (Package liefert `src/` mit), kopiert die Komponente samt privater Helfer und importiert alles Öffentliche aus `@twentyfirstmedia/ui-core`. `diff` vergleicht die Kopie zeilenweise mit der aktuellen Quelle. Der Test kompiliert die Next-App mit Kopien, Provider und Layout. Inline-Styles mit CSS-Variablen sind jetzt explizit als `CSSProperties` getypt, damit Kopien ohne interne Typerweiterung kompilieren. pnpm 12 braucht `allowBuilds` (esbuild) in `pnpm-workspace.yaml`.

### Phase 7: Doku-Seite
- [x] Gerüst, Navigation, Suche, Kit-/Theme-/Sprach-Umschalter
- [x] Seiten aus Phase 3–6, Props-Tabellen automatisch, Live-Vorschauen aus `examples/` (die Previews der Referenz als TSX-Beispiele)
- [x] Muster-Seiten (Dashboard, Chat, Shop, Admin, Immobilien) aus der Demo

Notiz: `apps/docs` (Next 16, statischer Export, `DOCS_BASE_PATH`/`DOCS_SITE_URL` für Umzug und Canonicals). `[kit]` ist das Root-Segment, `/` leitet auf `/halo/` weiter. Kopfzeile: Kit-Umschalter (gleiche Seite im anderen Kit), EN/DE (deutsche Labels für alle Komponenten), hell/dunkel (gespeichert, ohne Flackern), Suche mit ⌘K (die Kit-eigene CommandPalette), GitHub. Die Doku nutzt die Kit-Komponenten selbst. Seiten: Einführung, Installation, CLI, Theming und Tokens (Halo/Pro nebeneinander, Farbfelder im aktuellen Theme), Texte und Locale, Status und Freigaben, Changelog, „Alle Komponenten", 82 Komponenten-Seiten (README aus der Referenz, Live-Vorschau, Code-Tab, Props-Tabellen automatisch aus `types.ts`) und 26 Muster-Seiten (die 25 Screens der Referenz + Immobilien). Die Vorschauen sind die 108 Referenz-Previews als typisierte TSX-Beispiele in `examples/previews` (Demo-Daten neutral, ohne App-Namen). Die Demo-App (`halo-workspace.html`) selbst ist nicht portiert; die Muster decken Dashboard, Chat, Shop, Admin und Immobilien ab.

### Phase 8: Qualität und Release 0.1.0
- [x] axe und Screenshots grün, beide Kits
- [x] Bundle-Größe pro Komponente geprüft (tree-shakeable, `sideEffects` nur für CSS)
- [ ] Changeset `0.1.0`, Release-Workflow einmal echt durchlaufen

Notiz: `e2e/a11y.spec.ts` prüft jede Doku-Seite (Anleitungen, 82 Komponenten, 26 Muster) mit axe (WCAG 2.1 A/AA) in beiden Kits × hell/dunkel: 464 Seiten grün. Dafür u. a. behoben: Opacity auf Text (Coupon, Energieklasse, Chat-Aktionen), Paper-Text folgt den Paper-Tokens (`--paper-muted` auf 4,5:1 angehoben), zugängliche Namen enthalten den sichtbaren Text (Kalendertage, Status-Auswahl, Karten-Pins, Rail-Zähler), fehlende Labels (Switch `label`, ColorField, Composer-Anhang als Button), Rollen (`img`, Listbox-Name), scrollbare Bereiche fokussierbar, TopBar-Navigation scrollt statt das Profil aus dem Rahmen zu schieben, und Pro `fg-300` minimal angepasst (hell #5e5e68, dunkel #90909b), damit es auch auf `line-200` 4,5:1 erreicht. `UIProvider` lässt Attribute unangetastet, deren Prop fehlt (kein Theme-Flackern beim Hydrieren). `e2e/screenshots.spec.ts`: jede Vorschau in beiden Kits × hell/dunkel × 390/1440 px, 888 Baselines (36 MB) im Repo. Vorschauen haben einen eigenen `UIProvider scope="subtree"`, damit Overlays im Rahmen bleiben. Bundle: `scripts/bundle.ts` (Tabelle) und ein Test: Button allein 3,2 KB gzip, alle Komponenten 60 KB; Budgets für DataTable, RichTextEditor, ApprovalCard, MapView. Changeset `first-release` (alle vier Packages minor → 0.1.0) liegt bereit; `npm pack` geprüft. Der Release-Workflow konnte nicht laufen: GitHub Actions startet in diesem Repo keine Läufe, und `NPM_TOKEN` fehlt.

Notiz (Treue zur Referenz): Bildvergleich aller 108 Referenz-Previews (Referenz-`halo.js`/`halo.css` gegen den Port, Halo hell, gleiche Fonts): 99 pixelgleich. Bewusste Abweichungen: (1) acht Screens, deren TopBar breiter als der Rahmen ist: die Navigation scrollt im Balken, statt Profil und Nutzer aus dem Rahmen zu schieben (axe-Kontrast); (2) abgelaufener Coupon, Energieklassen und Chat-Aktionen ohne Opacity auf Text (axe-Kontrast). Demo-Werte der Referenz-Defaults („Halo", „Admin", „Mara Ellis") stehen jetzt in den Beispielen statt in den Komponenten; ohne Marke rendern TopBar, AuthCard, Wizard und Rechnung keinen Markenblock. Der Select-Pfeil entspricht wieder dem Chevron der Referenz (aus Token-Farben gezeichnet statt Data-URI mit Farb-Literal).

### Phase 9: Mobile first (Kits und Doku)
- [x] Responsive Schicht für beide Kits: jede Komponente ab 320 px Breite, ab 1181 px unverändert wie die Referenz
- [x] Touch: 16-px-Eingabefelder (kein Zoom), Pro auf Touch-Geräten mit komfortablen Trefferflächen
- [x] Beispiele ohne feste Mehrspalten-Raster, Vorschauen ohne erzwungene Mindestbreite
- [x] Doku-Seite mobile first neu: Kopfzeile, Navigations-Drawer, Startseite, Props als gestapelte Zeilen, Vor/Zurück
- [x] Überlauf-Test in beiden Kits bei 320 und 390 px, Screenshots neu

Notiz: `packages/halo/css/06-responsive.css` (wird wie alle Halo-Dateien nach Pro abgeleitet). Breakpoints: Telefon ≤ 760 px, Tablet 761–1180 px, Desktop ≥ 1181 px (dort greift nichts davon). Telefon: Shell einspaltig, Rail und SubNav als scrollende Zeilen (SubNav mit Beschriftung), TopBar nur Icons, Dock klebt unten (sticky), Tabellen scrollen in `tf-table-scroll` (neuer Wrapper in `Table`; per `useScrollFocus` nur dann per Tastatur fokussierbar, wenn sie wirklich scrollen), Dialoge als Bottom-Sheet, Cookie-Banner, Chat-Launcher, Toaster und Benachrichtigungen über die volle Breite, Popover unter Vollbreiten-Feldern in Feldbreite, Zeilen umbrechen statt Aktionen hinauszuschieben, Tabs/Segmented scrollen. Tablet: Asides unter die Hauptspalte. `tf-grid` liest `--cols`/`--cols-md`/`--cols-sm` (Telefon standardmäßig einspaltig); neue Layout-Klassen `tf-sheet-nav`/`tf-sheet-aside` ersetzen die Inline-Raster des Workspace-Beispiels. `Popover` und `Tooltip` bleiben per `useKeepInView` im Bildschirm bzw. im scrollenden Rahmen (Breite gedeckelt, seitlich verschoben über `translate`); Popover-Breite kommt als `--pop-w`, `Tooltip` hat `defaultOpen`. Tokens: bei Kits mit kompakter Standarddichte (Pro) setzt `@media (pointer: coarse)` die komfortablen Dichte-Tokens, solange kein `data-density` gesetzt ist. Kontrolle Desktop: alle 108 Referenz-Previews bei 1320 px gegen `main` gerendert, 0 Pixel Unterschied. Doku: `docs.css` mobile first (640/960 px), Menü als Drawer mit Sprache, Theme und GitHub, Esc schließt, Scroll-Sperre; neue Startseite (Hero, Installationsbefehl, Live-Komponenten, Eigenschaften, Einstiege); Props-Tabellen auf dem Telefon als gestapelte Zeilen; Vor/Zurück-Navigation; Abschnitt „Layout and breakpoints" unter Theming. `e2e/mobile.spec.ts`: 2 Breiten × 2 Kits × alle Seiten, weder Seite noch Vorschau-Inhalt ragt hinaus.

Notiz (Icons zentriert): 36 der 93 Icon-Pfade der Referenz waren im 24-px-Raster nicht mittig gezeichnet (z. B. `bell` 1,75, `undo`/`redo` 1,5, `webhook` 1,67 Einheiten daneben); in runden Icon-Buttons und Tint-Icons sah man das. Die Zeichnungen sind jetzt auf ihre Bounding-Box zentriert (nur verschoben, Form und Länge unverändert); `play` bleibt optisch auf den Schwerpunkt zentriert. Das ist eine bewusste Abweichung von der Referenz. `e2e/icons.spec.ts` prüft jede Zeichnung (±0,05 Einheiten) und jede Icon-Box auf allen Seiten beider Kits (±0,5 px).

### Phase 10: Konsistenz-Audit (beide Kits, beide Themes)
- [x] Automatischer Audit aller Vorschauen (Typografie, Abstände, Radien, Control-Höhen, Icon-Ausrichtung, Dark-Kanten, Markup-Parität) in Halo/Pro × hell/dunkel
- [x] Visuelle Durchsicht aller Screenshots je Kit und Theme, Befunde behoben
- [x] Regressionstests für die gefundenen Regeln

Notiz: Größte Ursache war die Doku selbst: `.docs-main h1/h2/h3` und `* { box-sizing: border-box }` griffen in die Vorschauen (leere Bänder über Panel-Titeln, Überschriften in Doku-Größe); jetzt nur noch für die Doku-Chrome. Das Kit setzt `box-sizing` selbst (content-box wie die Referenz, Formular-Controls border-box), damit es in jeder App gleich aussieht, auch mit Tailwind-Preflight. Die App-Shell reagiert per Container-Query auf die eigene Breite statt auf den Viewport (Navigation, Asides, SubNav, Raster in der Shell); Desktop ≥ 1181 px bleibt referenzgleich. Weitere Korrekturen: Formular-Controls erben die Kit-Schrift (kein Arial), `code`/`kbd` nutzen die Mono-Schrift, `b`/`strong` bleiben auf der Skala (Halo 700, Pro 600 statt 900), Icon-Buttons ohne Browser-Padding und durchgehend 16-px-Icons, Tabs und Segmente brechen nicht mehr mitten im Wort und strecken ihre Spur nicht, Status-Formen gleich breit (Zeilen bündig), ListRow-Icons so groß wie Avatare, Stat-Werte einer Reihe auf gleicher Höhe, Pipeline-Schritte umbrechen statt abgeschnitten, Paginierung „…" mittig, Rechnungsnummer bündig, Avatar-Stapel überdecken keine Initialen, Links in Komponenten in Ink statt Browser-Blau, Textareas ohne Ziehgriff, Upload-Icon statt Download, Kartenblasen und Farbfelder auch im Dunkeln sichtbar. Fehler: Gauge, Funnel und Ring blieben bei „reduzierter Bewegung" leer (Hydration-Mismatch durch `reduced()` im Render) – behoben. Pro nach reference/pro: dekorative Tints (Icon-Kacheln, getönte Karten, Platzhalter, Avatare, Dock) monochrom, Diagramm-Reihen als monochrome Rampe, flache Balken, keine weichen Schatten auf Karten im Fluss, Badges sitzen auf der Ecke statt über der Glocke, lesbarer Tastenchip auf der primären Freigabe-Option, `font-size: 16px` für Touch-Eingaben wird nicht mehr auf 14 px abgeleitet. Prozente über `formatPercent` (Intl) statt „ %" im Code; Beispiele einheitlich in € und englischem Datumsformat, Radien und Gewichte aus Tokens. Screenshot-Test vergrößert das Fenster auf die Seitenhöhe, sonst fehlte bei hohen Vorschauen der untere Teil. Tests: `scripts/consistency.test.ts`, `e2e/icons.spec.ts`. Bewusst offen: Die „Most popular"-Karte bleibt in Halo dunkel auch im Dark Mode (wie die Referenz), in Pro trägt sie die stärkere Haarlinie; der Text in runden Avataren kann wegen ganzzahlig gerundeter Font-Metriken bis ~0,7 px abweichen.

### Phase 11: Nur Englisch, shadcn-Parität
- [x] Mehrsprachigkeit entfernt (Robin: „nur UI-Kit")
- [x] Fehlende Bausteine im Vergleich zu shadcn/ui ergänzt, beide Kits
- [x] Bestehende Komponenten erweitert (Menü, Tabs, Sheet, Popover, Command, Button)
- [x] Beispiele, Doku-Texte, Verhaltens-Tests, axe, Mobile, Screenshots

Notiz (Englisch): Das Label-System (`L`/`Lx`/`LK`, `setLabels`, `labels/en.json` und `de.json`), die Locale-Props am `UIProvider`, `init --locale`, der EN/DE-Umschalter und die Seite „Text and locale" sind entfernt; eingebauter Text ist englisch, Zahlen, Beträge, Prozente und Daten laufen über `format.ts` (Intl, en-US, Euro). CLAUDE.md entsprechend angepasst.

Notiz (neue Komponenten): Accordion, Separator, AspectRatio, Label, Toggle, ToggleGroup, ButtonGroup, ScrollArea, HoverCard, Carousel, Menubar, NavigationMenu, Sidebar, SelectMenu (gestaltetes Select mit Gruppen, Icons, Hinweisen, Typeahead), Form (Regeln je Feldname, Meldungen unter dem Feld, `aria-invalid`, Fokus aufs erste Fehlerfeld, Server-Fehler) und ResizablePanels (beliebig viele Bereiche, horizontal/vertikal, Tastatur). Erweitert: `Menu` mit Tastaturnavigation, Typeahead, Untermenüs, Checkbox-/Radio-Einträgen und deaktivierten Einträgen; `Tabs` mit Panels und Pfeiltasten; `Drawer` mit `side` (links, oben, unten); `Popover` klappt nach oben, wenn unten kein Platz ist; `CommandPalette` mit `loading`, `empty`, `onQueryChange`; `Button`/`IconButton` mit `asChild`; Eingabefelder mit `id`, `name`, `required`. Gemeinsame Tastaturlogik in `moveFocus`. Höhen-Skala der Controls (Halo sm 32 / md 40 / lg 48, Pro 24 / 28 / 34) jetzt per `e2e/controls.spec.ts` auf jeder Doku-Seite geprüft, auch in der Doku-Kopfzeile; Toggle, NavigationMenu, Sidebar und Menubar darauf angepasst, der Kit-Umschalter der Doku nutzt die Standardgröße. Neue Doku-Gruppe „Navigation"; Beschreibungen eigener Komponenten in `examples/previews/readme/`. Nicht umgesetzt: RTL.

### Phase 12: Landingpage, SEO, LLMs und MCP
- [x] Landingpage unter `/` aus Kit-Komponenten, ganze Seite live zwischen Halo und Pro umschaltbar
- [x] SEO: Titel, Beschreibung, Canonical, Open Graph, Twitter, JSON-LD, Sitemap, robots, Manifest, Favicons
- [x] Doku für Agents: `llms.txt`, `llms-full.txt`, Markdown-Zwilling jeder Seite, „Copy Markdown"
- [x] MCP-Server in der CLI (`twentyfirst-ui mcp`, `mcp init` für Claude Code, Cursor, VS Code)

Notiz: Eine Wissensquelle für alles: `scripts/knowledge.ts` sammelt Anleitungen (jetzt Markdown in `apps/docs/content/`), Komponenten- und Musterseiten mit Beschreibung, Beispielcode und Props, Exporte, Icons und die Tokens beider Kits; `packages/cli/src/knowledge.ts` rendert daraus Markdown, `llms.txt`, Suche und `check_usage` (ohne Imports, damit Doku-Build und CLI dieselbe Datei nutzen). Die Doku erzeugt beim Build für jede Seite `/<kit>/<pfad>.md` sowie `llms.txt`/`llms-full.txt` (git-ignoriert); die CLI bündelt `dist/knowledge.json`. MCP-Server ohne Laufzeit-Abhängigkeiten (stdio, JSON-RPC, Protokoll 2024-11-05 bis 2025-11-25): 8 Werkzeuge, Ressourcen je Seite, Prompts `build_screen` und `review_ui`; Test mit dem offiziellen SDK-Client (nur devDependency). Komponenten ohne eigene Seite (z. B. Button) liefert `get_component` mit Import, Props und dem besten Beispiel. `mcp init` schreibt `.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json` (zusammengeführt, idempotent) und einen markierten Regelblock in `AGENTS.md` (und `CLAUDE.md`, falls vorhanden). Landingpage: Hero mit lauffähiger Mini-App (Freigabe beantwortbar), Paritäts-Demo (gleiches JSX gleichzeitig in Halo und Pro), Agent-Abschnitt mit Einrichtung je Client, Komponentengruppen, Muster, Footer; Kit-Wahl wird gespeichert und vor dem ersten Paint gesetzt. Logo: die „21"-Marke von Twentyfirst Media (aus `twentyfirstmedia/twentyfirst`, `.design/assets/logos/21-mark-*.svg`) in Kopfzeilen, Favicons und Social Cards; Social Cards (1200 × 630) werden aus echten Kit-Komponenten unter `/og/<name>/` gerendert und mit `apps/docs/scripts/brand.ts` (Playwright) samt Icons eingecheckt. Neue Seiten: „AI agents and MCP", „Patterns" (Übersicht). Tests: `e2e/seo.spec.ts` (jede Sitemap-Seite: eindeutiger Titel, Beschreibung 50–160 Zeichen, Canonical, OG-Bild, ein h1, gültiges JSON-LD, Markdown-Zwilling; alle Links in `llms.txt` erreichbar; robots, Manifest, Icons), `e2e/landing.spec.ts` (axe beide Kits hell/dunkel, 320/390 px, Kit-Wechsel ohne Reload mit Zustand), Höhen-Skala auch auf der Landingpage (Skala je nächstem `data-kit`). Behoben nebenbei: CLI-Seite zeigte noch `--locale`, ApprovalCard-Beschreibung verwies noch auf das Label-System.

### Phase 13: Open Source
- [x] Lizenz MIT (Robin), Repo öffentlich, Packages öffentlich auf npmjs.com statt GitHub Packages
- [x] README, Package-READMEs, CONTRIBUTING, SECURITY, Verhaltenskodex, Issue- und PR-Vorlagen
- [x] npm-Org `@twentyfirstmedia` und Secret `NPM_TOKEN` (Robin), dann erster Release 0.1.0

Notiz: `publishConfig` jetzt `access: public` mit `provenance` (Release-Workflow mit `id-token: write`, Registry npmjs.org, Token aus `NPM_TOKEN`); Changesets `access: public`. Die Root-`.npmrc` und der `.npmrc`-Schritt von `init` entfallen, Installation ist ein normales `npm i`. Texte, die von privaten Packages sprachen (Installation, AI-Seite, Landingpage, `llms.txt`, MCP-Anweisungen), angepasst. README mit Screenshots (Halo hell, Pro dunkel per `<picture>`), Badges, Schnellstart, MCP, Paketübersicht; jede Package-Seite auf npm hat ein eigenes README. Schriften bleiben unter ihrer OFL (Lizenzdateien liegen bei den Schriften in `dist/fonts`). Erster echter CI-Lauf: 90 Screenshot-Vergleiche wichen ab, weil der Runner Text bei gleichem Chromium (153.0.8010.12) und gleichen Schriften minimal breiter rastert; die Baselines stammen jetzt vom CI-Runner (`ubuntu-26.04`, gepinnt), neue Baselines erzeugt der Workflow „Update screenshots“.

Notiz (Release 0.1.0): Alle fünf Packages sind auf npmjs.com, aber ohne Provenance: `changeset publish` ruft `pnpm publish` auf, das weder `publishConfig.provenance` noch `NPM_CONFIG_PROVENANCE` beachtet. Jetzt packt `scripts/publish.ts` jedes noch nicht veröffentlichte Package mit pnpm (löst `workspace:*` auf) und veröffentlicht den Tarball mit der npm-CLI (gepinnt 11.21.1) mit `--provenance`; Tags und „New tag:"-Zeilen wie bei Changesets, damit changesets/action Tags pusht und GitHub-Releases anlegt. Die npm-CLI kann Trusted Publishing (OIDC): ist auf npmjs.com je Package ein Trusted Publisher (`twentyfirstmedia/ui`, `release.yml`) eingetragen, braucht der Release kein Token mehr; bis dahin dient `NPM_TOKEN` als Rückfall. Der MCP-Server beendet sich jetzt still, wenn der Client die Ausgabe schließt (vorher unbehandeltes `EPIPE`); Test dazu. Release 0.1.1 mit Provenance.

### Phase 14: Theming wie shadcn/ui, Plain HTML
- [x] shadcn-Theme-Variablen in beiden Kits, jede Komponente nutzt sie, hell und dunkel
- [x] Presets, `themeCss`/`parseThemeCss`/`brandTheme`, `UIProvider tokens`, `twentyfirst-ui theme`, Theme-Builder
- [x] Test: ein eingefügtes shadcn-Theme erreicht jede Vorschau (beide Kits, hell und dunkel)
- [x] `@twentyfirstmedia/elements`: jede Komponente als Custom Element für HTML, Vue, Svelte, Angular, Astro

Notiz (Theming, Robin: „volles shadcn-Theming in beiden Kits"): Die Kits benennen ihre Farben jetzt wie shadcn/ui (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `radius`, `chart-1…5`, `sidebar-*`); die bisherigen Namen (`canvas`, `surface`, `ink`, `line`, `focus`, Pros `bg-000…fg-400`) verweisen darauf, Zwischentöne (`ink-subtle`, Pros `bg-300`, `fg-300/400`, `line-100`, Pros Serie 2) werden per `color-mix` aus den Theme-Farben gemischt (Abweichung zu vorher unter ΔE 1,3; Pros `fg-300` bewusst minimal dunkler für den Kontrast). Bruch vor 0.1.0: das alte `--accent` (Hauptfarbe) heißt `--primary`, `--accent` ist wie bei shadcn die Hervorhebung unter Zeiger/Tastatur. Token-Blöcke mit `:where()` (Spezifität 0), damit jedes eingefügte Theme gewinnt; Dark Mode folgt auch `.dark` (next-themes). Verdrahtung: 29 Hover-/Auswahlzustände auf `accent`, weiche Buttons auf `secondary`, Overlays auf `popover`, Danger auf `destructive`, Sidebar auf `sidebar-*`, Diagrammreihen auf `chart-N` (in beiden Kits die bisherigen Reihenfarben; Pros monochrome Balkenrampe bleibt in `chart-sky` …) – alle Standardwerte unverändert; der erste CI-Lauf fand zwölf Pro-Screenshots, in denen die Reihen versehentlich monochrom geworden waren, behoben. Halos weiche Balkenfarben bleiben (aus `chart-N` ließen sie sich nicht ohne sichtbare Abweichung mischen); `themeCss` leitet sie ab, wenn ein Theme die Reihen ändert. Radius aus einem `--radius` (Halo exakt wie bisher, Pro eckig bei 2 px und rund bei größeren Werten). Werkzeuge: `themeCss` (Selektoren je Kit für hell, dunkel, System), `parseThemeCss` (shadcn v4 und v3), `brandTheme` (lesbare Schrift per WCAG), sechs Presets als CSS je Kit und für beide Kits, `UIProvider tokens` (Laufzeit, je Modus), `twentyfirst-ui theme` (Preset, Farbe oder shadcn-Datei, importiert nach den Kit-Styles), Theme-Builder-Seite mit Live-Vorschau, Import und „auf ganze Seite anwenden". Tailwind-Preset liefert shadcns Utility-Namen. `e2e/theming.spec.ts`: setzt alle Theme-Variablen auf Testfarben und prüft je Element jeder Vorschau, dass keine Standardfarbe stehen bleibt (bewusst außerhalb: Tints/Status, Halos dunkler Rahmen, Papier, Medien); mit Gegenprobe geprüft, 496 Läufe grün.

Notiz (Plain HTML): `@twentyfirstmedia/elements` erzeugt aus den ui-core-Metadaten 213 Custom Elements (`<tf-button>`, `<tf-data-table>` …): Attribute und Properties werden zu Props, Callbacks zu DOM-Events, Kinder und `slot="…"` zu ReactNode-Props, verschachtelte Elemente teilen einen React-Baum (Kontext wie Form und UIProvider funktioniert). ESM und IIFE mit gebündeltem React (~150 kB gzip), Custom Elements Manifest und VS-Code-Daten. Doku „Plain HTML and frameworks", Demo `examples/html`, `e2e/elements.spec.ts` (Rendern, Events, Slots, Tastatur, axe beide Kits).

## Offen (Robin)
- Trusted Publisher auf npmjs.com für alle fünf Packages eintragen (Repo `twentyfirstmedia/ui`, Workflow `release.yml`), danach Secret `NPM_TOKEN` löschen
- Hosting: die Doku läuft auf `ui.twentyfirst.media`; später evtl. `twentyfirst.design`
- `.md`-Dateien sollten mit `Content-Type: text/markdown; charset=utf-8` ausgeliefert werden (Hosting-Einstellung)
