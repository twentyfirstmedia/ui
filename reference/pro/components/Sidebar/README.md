# Sidebar
Primary navigation: the city first, then the core modules, then optional modules from the module registry.

**Order:** Stadt · Freigaben (signal count) · Webmail (unread) · Domains & DNS · Mail-Konten · Apps & Server · Finanzen, then an eyebrow "Module" with optional modules (Brand-Generator). Projects are listed under an eyebrow "Projekte" with their CI dot.

- Item height = `--hq-row`; active item `bg-300` + `fg-100` (`aria-current="page"`).
- Counts right-aligned (`.hq-count`; approvals `.hq-count--signal`).
- Collapses to `sidebar-w-collapsed` (icons only, tooltips on hover) below 1100px.
- Modules register their own nav entries through their manifest; never hard-code module links here.
