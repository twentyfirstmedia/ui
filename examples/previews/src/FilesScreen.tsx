import * as React from "react";
import {
  Chip,
  CommandPalette,
  FileCard,
  PageHeader,
  SearchField,
  Stagger,
  Tabs,
} from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";
import type { FileKind } from "@twentyfirstmedia/ui-core";

const F: [string, FileKind, string, string, boolean?][] = [
  ["Northwind – master agreement.pdf", "pdf", "412 KB", "Today", true],
  ["Kestrel Bank – proposal v3.pdf", "pdf", "1.8 MB", "Yesterday", true],
  ["DPA template (DSGVO).doc", "doc", "96 KB", "Mon"],
  ["pricing-tiers.fig", "fig", "18 MB", "Today", true],
  ["dashboard-shots.png", "img", "2.4 MB", "Yesterday"],
  ["brand-assets.zip", "zip", "36 MB", "Apr 2"],
  ["support-macros.sheet", "sheet", "58 KB", "Yesterday"],
  ["pnl-q1-2026.sheet", "sheet", "92 KB", "Apr 1", true],
];
function App() {
  return (
    <Shell
      area="Files"
      current="files"
      action={{
        label: "Upload",
        icon: "paperclip",
      }}
      pages={[
        {
          id: "files",
          label: "All files",
          icon: "folder",
        },
      ]}
      overlay={
        <CommandPalette
          inline
          onClose={() => {}}
          items={[
            {
              id: 1,
              group: "Pages",
              label: "All files",
              hint: "Files",
              icon: "folder",
            },
            {
              id: 2,
              group: "Actions",
              label: "Upload files",
              icon: "paperclip",
              tint: "butter",
            },
            {
              id: 3,
              group: "Actions",
              label: "New invoice",
              icon: "card",
              tint: "butter",
            },
            {
              id: 4,
              group: "Actions",
              label: "Compose mail",
              icon: "edit",
              tint: "sky",
            },
            {
              id: 5,
              group: "Actions",
              label: "New agent",
              icon: "bot",
              tint: "lilac",
            },
          ]}
        />
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Files"
          subtitle="15 files · drop files anywhere to upload"
          actions={[
            <SearchField key="s" placeholder="Search files" />,
            <Tabs key="t" items={["Grid", "List"]} />,
          ]}
        />
      </div>
      <div
        className="tf-row tf-in"
        style={
          {
            "--d": "80ms",
          } as React.CSSProperties
        }
      >
        {["All", "Contracts", "Receipts", "Design", "Agent knowledge", "Exports"].map((t, i) => (
          <Chip key={t} icon={i ? "folder" : undefined} selected={i === 0}>
            {t}
          </Chip>
        ))}
      </div>
      <Stagger
        className="tf-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        }}
        delay={140}
      >
        {F.map((f) => (
          <FileCard key={f[0]} name={f[0]} kind={f[1]} size={f[2]} meta={f[3]} shared={f[4]} />
        ))}
      </Stagger>
    </Shell>
  );
}
export default function Preview() {
  return <App />;
}
