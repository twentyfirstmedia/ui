"use client";
import {
  Alert,
  Badge,
  BarChart,
  Button,
  Checkbox,
  Chip,
  CodeBlock,
  ColorField,
  IconButton,
  LineChart,
  Panel,
  Progress,
  Select,
  Switch,
  Tabs,
  TextField,
  Textarea,
  THEME_PRESETS,
  UIProvider,
  parseThemeCss,
  themeCss,
  useUI,
  type ThemeInput,
  type ThemeVar,
} from "@twentyfirstmedia/ui-core";
import { useEffect, useMemo, useState } from "react";
import type { KitName } from "@/lib/site";

/** The variables the builder edits, in the order a designer thinks about them. */
const FIELDS: { name: ThemeVar; label: string }[] = [
  { name: "primary", label: "Primary" },
  { name: "primary-foreground", label: "Primary text" },
  { name: "secondary", label: "Secondary" },
  { name: "accent", label: "Accent (highlight)" },
  { name: "muted", label: "Muted" },
  { name: "muted-foreground", label: "Muted text" },
  { name: "background", label: "Background" },
  { name: "foreground", label: "Foreground" },
  { name: "card", label: "Card" },
  { name: "border", label: "Border" },
  { name: "input", label: "Input border" },
  { name: "ring", label: "Focus ring" },
  { name: "destructive", label: "Destructive" },
  { name: "chart-1", label: "Chart 1" },
  { name: "chart-2", label: "Chart 2" },
  { name: "chart-3", label: "Chart 3" },
];
const RADII = ["default", "0", "0.25rem", "0.5rem", "0.75rem", "1rem"];
const KIT_RADIUS = "Kit default";
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** The value a variable has right now in the preview, as hex (mixes and oklch included). */
function current(name: string): string {
  if (typeof window === "undefined") return "";
  const probe = document.createElement("i");
  probe.style.color = `var(--${name})`;
  const host = document.querySelector(".docs-theme-preview") ?? document.body;
  host.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  // the canvas turns any CSS colour into sRGB bytes
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

/** Live theme builder: presets, fields, radius, shadcn import; preview and CSS to copy. */
export function ThemeBuilder({ kit }: { kit: KitName }) {
  const ui = useUI();
  const mode: "light" | "dark" = ui.theme === "dark" ? "dark" : "light";
  const [theme, setTheme] = useState<ThemeInput>({});
  const [preset, setPreset] = useState("default");
  const [paste, setPaste] = useState("");
  const [applySite, setApplySite] = useState(false);
  const [defaults, setDefaults] = useState<Record<string, string>>({});

  // starting values of the fields: the kit's own theme in the current mode
  useEffect(() => {
    const t = setTimeout(() => {
      const d: Record<string, string> = {};
      for (const f of FIELDS) d[f.name] = current(f.name);
      setDefaults(d);
    }, 50);
    return () => clearTimeout(t);
  }, [kit, mode]);

  const values = theme[mode] ?? {};
  const set = (name: ThemeVar, v: string) => {
    setPreset("custom");
    setTheme((t) => ({ ...t, [mode]: { ...(t[mode] ?? {}), [name]: v } }));
  };
  const css = useMemo(() => themeCss(theme, { kit }), [theme, kit]);
  const empty = !theme.light && !theme.dark && !theme.radius;

  // optionally the whole docs site wears the theme (this tab only)
  useEffect(() => {
    if (!applySite || empty) return;
    const style = document.createElement("style");
    style.dataset.docsTheme = "";
    style.textContent = css;
    document.head.appendChild(style);
    return () => style.remove();
  }, [applySite, css, empty]);

  const choosePreset = (name: string) => {
    setPreset(name);
    setTheme(name === "default" ? {} : (THEME_PRESETS[name]?.theme ?? {}));
  };
  const importShadcn = () => {
    const t = parseThemeCss(paste);
    if (t.light || t.dark || t.radius) {
      setTheme(t);
      setPreset("custom");
    }
  };

  return (
    <div className="docs-builder">
      <div className="docs-builder-controls">
        <div className="docs-builder-presets" role="group" aria-label="Presets">
          <Chip selected={preset === "default"} onClick={() => choosePreset("default")}>
            {kit === "halo" ? "Halo" : "Pro"} default
          </Chip>
          {Object.entries(THEME_PRESETS).map(([name, p]) => (
            <Chip key={name} selected={preset === name} onClick={() => choosePreset(name)}>
              <span
                className="docs-swatch-dot"
                aria-hidden="true"
                style={{ background: p.theme[mode]?.primary }}
              />
              {p.label}
            </Chip>
          ))}
        </div>
        <p className="docs-builder-mode">
          Editing the <b>{mode}</b> theme. Switch light and dark in the header to edit the other.
        </p>
        <div className="docs-builder-fields">
          {FIELDS.map((f) => {
            const v = values[f.name] ?? defaults[f.name] ?? "";
            return HEX.test(v) || !v ? (
              <ColorField
                key={`${mode}-${f.name}-${preset}`}
                label={f.label}
                defaultValue={v}
                against={false}
                onChange={(c) => HEX.test(c) && set(f.name, c)}
              />
            ) : (
              <TextField
                key={`${mode}-${f.name}-${preset}`}
                label={f.label}
                defaultValue={v}
                onBlur={(e) => set(f.name, e.target.value)}
              />
            );
          })}
        </div>
        <div className="docs-builder-radius">
          <Select
            label="Radius"
            options={RADII.map((r) => (r === "default" ? KIT_RADIUS : r))}
            value={theme.radius ?? KIT_RADIUS}
            onChange={(e) => {
              const r = e.target.value;
              setTheme((t) => {
                const { radius: _drop, ...rest } = t;
                return r === KIT_RADIUS ? rest : { ...rest, radius: r };
              });
            }}
          />
        </div>
        <Textarea
          label="Import a shadcn theme"
          hint="Paste the CSS from ui.shadcn.com/themes or tweakcn (:root and .dark)."
          rows={4}
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder=":root { --primary: oklch(…); } .dark { … }"
        />
        <div className="docs-builder-row">
          <Button
            variant="secondary"
            size="sm"
            icon="upload"
            onClick={importShadcn}
            disabled={!paste.trim()}
          >
            Import
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="refresh"
            onClick={() => {
              choosePreset("default");
              setPaste("");
            }}
          >
            Reset
          </Button>
          <Switch checked={applySite} onChange={(e) => setApplySite(e.target.checked)}>
            Apply to the whole site
          </Switch>
        </div>
      </div>

      <UIProvider
        scope="subtree"
        kit={kit}
        theme={mode}
        tokens={theme}
        className="docs-theme-preview"
      >
        <Preview />
      </UIProvider>

      <div className="docs-builder-out">
        <CodeBlock
          lang="css"
          code={
            empty
              ? `/* The ${kit === "halo" ? "Halo" : "Pro"} default theme: nothing to add. Pick a preset or change a colour. */`
              : css
          }
        />
        <p className="docs-builder-mode">
          Save it as <code className="docs-code-inline">theme.css</code> and import it after the kit
          styles, or let the CLI write it:{" "}
          <code className="docs-code-inline">npx @twentyfirstmedia/ui theme ./theme.css</code>
        </p>
      </div>
    </div>
  );
}

function Preview() {
  const [tab, setTab] = useState("Overview");
  return (
    <div className="docs-builder-preview" aria-label="Theme preview">
      <Panel
        title="Workspace"
        subtitle="Live preview"
        action={
          <Badge tone="success" dot>
            Live
          </Badge>
        }
      >
        <div className="docs-builder-stack">
          <Tabs
            label="Sections"
            items={["Overview", "Members", "Billing"]}
            value={tab}
            onChange={setTab}
          />
          <TextField label="Name" defaultValue="Northwind" />
          <div className="docs-builder-row">
            <Switch defaultChecked>Weekly digest</Switch>
            <Checkbox defaultChecked>Notify admins</Checkbox>
          </div>
          <div className="docs-builder-row">
            <Chip selected>Live</Chip>
            <Chip>Draft</Chip>
            <Badge>Neutral</Badge>
            <Badge tone="info">Info</Badge>
          </div>
          <Progress label="Seats used" value={64} />
          <div className="docs-builder-row">
            <Button variant="primary">Save</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="danger-solid">Delete</Button>
            <IconButton icon="settings" label="Settings" />
          </div>
        </div>
      </Panel>
      <Panel title="Revenue">
        <LineChart
          label="Revenue"
          labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          series={[
            { values: [32, 41, 38, 52, 49, 61, 66], tint: "sky" },
            { values: [20, 26, 30, 28, 36, 40, 44], tint: "mint" },
          ]}
          height={120}
        />
        <BarChart
          label="Orders by channel"
          height={110}
          data={[
            { label: "Web", value: 48, tint: "sky" },
            { label: "App", value: 36, tint: "mint" },
            { label: "Shop", value: 22, tint: "butter" },
          ]}
        />
      </Panel>
      <Alert tone="danger" title="Payment failed">
        We couldn&apos;t charge the card ending 4242.
      </Alert>
    </div>
  );
}
