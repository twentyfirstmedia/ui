"use client";
import { CodeBlock, Segmented, UIProvider, useUI } from "@twentyfirstmedia/ui-core";
import { useState, type CSSProperties } from "react";
import { registry } from "@/generated/registry";

/** A live example in the current kit, with its source one click away. */
export function ExampleView({ name, code, width }: { name: string; code: string; width: number }) {
  const [tab, setTab] = useState("preview");
  const { kit, theme } = useUI();
  const Example = registry[name];
  return (
    <section className="docs-example" aria-label={`${name} example`}>
      <div className="docs-example-bar">
        <Segmented
          size="sm"
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { value: "preview", label: "Preview" },
            { value: "code", label: "Code" },
          ]}
        />
      </div>
      {tab === "preview" ? (
        <div
          className="docs-preview"
          data-preview={name}
          tabIndex={0}
          role="region"
          aria-label={`${name} preview`}
        >
          {/* a subtree provider keeps overlays (modals, sheets, toasts) inside the preview frame */}
          <UIProvider
            scope="subtree"
            kit={kit}
            theme={theme}
            className="docs-preview-inner"
            style={{ "--docs-w": `${width}px` } as CSSProperties}
          >
            {Example ? <Example /> : null}
          </UIProvider>
        </div>
      ) : (
        <CodeBlock lang="tsx" code={code} />
      )}
    </section>
  );
}
