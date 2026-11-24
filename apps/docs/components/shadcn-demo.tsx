"use client";
import "@twentyfirstmedia/ui-core/shadcn.css";
import { Icon, Switch, UIProvider, useUI } from "@twentyfirstmedia/ui-core";
import { useState } from "react";

/**
 * shadcn's Switch as it ships (Radix markup, Tailwind's sizes in `@layer utilities`), dressed by
 * the bridge, next to the kit's own Switch: both should look the same.
 */
const SHADCN_UTILITIES = `@layer utilities {
  .sd-switch { display: inline-flex; height: 1.15rem; width: 2rem; flex-shrink: 0; align-items: center; border: 1px solid transparent; border-radius: 9999px; cursor: pointer }
  .sd-thumb { display: block; width: 1rem; height: 1rem; border-radius: 9999px; pointer-events: none; translate: 0 0 }
  .sd-thumb[data-state="checked"] { translate: calc(100% - 2px) 0 }
}`;

function ShadcnSwitch(p: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!p.defaultChecked);
  const state = on ? "checked" : "unchecked";
  return (
    <label className="tf-check">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        data-slot="switch"
        data-state={state}
        className="sd-switch"
        onClick={() => setOn(!on)}
      >
        <span data-slot="switch-thumb" data-state={state} className="sd-thumb" />
      </button>
      {p.label}
    </label>
  );
}

export function ShadcnSwitchDemo() {
  const { kit, theme } = useUI();
  return (
    <div className="docs-preview">
      <style>{SHADCN_UTILITIES}</style>
      <UIProvider scope="subtree" kit={kit} theme={theme} className="docs-preview-inner">
        <div className="docs-demo-compare">
          <div>
            <div className="docs-demo-caption">shadcn Switch with the bridge</div>
            <ShadcnSwitch label="Email notifications" defaultChecked />
            <ShadcnSwitch label="Weekly digest" />
          </div>
          <div>
            <div className="docs-demo-caption">Kit Switch</div>
            <Switch defaultChecked>Email notifications</Switch>
            <Switch>Weekly digest</Switch>
          </div>
        </div>
      </UIProvider>
    </div>
  );
}

/** shadcn's Alert (v4 markup, no data-variant) in the four tones the bridge reads. */
export function ShadcnAlertDemo() {
  const { kit, theme } = useUI();
  const alerts = [
    { attrs: {}, icon: "bell", title: "Sync finished", text: "1,240 orders imported." },
    {
      attrs: { "data-tone": "success" },
      icon: "check",
      title: "Payout sent",
      text: "€3,180 to your account.",
    },
    {
      attrs: { "data-tone": "warning" },
      icon: "clock",
      title: "Payout delayed",
      text: "The bank needs one more day.",
    },
    {
      attrs: { className: "text-destructive" },
      icon: "ban",
      title: "Card declined",
      text: "Ask the customer for another card.",
    },
  ] as const;
  return (
    <div className="docs-preview">
      <UIProvider scope="subtree" kit={kit} theme={theme} className="docs-preview-inner">
        <div className="docs-demo-alerts">
          {alerts.map((a) => (
            <div key={a.title} role="alert" data-slot="alert" {...a.attrs}>
              <Icon name={a.icon} />
              <div data-slot="alert-title">{a.title}</div>
              <div data-slot="alert-description">{a.text}</div>
            </div>
          ))}
        </div>
      </UIProvider>
    </div>
  );
}
