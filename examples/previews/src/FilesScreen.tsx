import * as React from "react";
import { CommandPalette, FileBrowser, PageHeader } from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";
import type { FileKind } from "@twentyfirstmedia/ui-core";

const F: [string, FileKind | "folder", string, string, boolean?][] = [
  ["Contracts", "folder", "", "Today", true],
  ["Receipts", "folder", "", "Yesterday"],
  ["Agent knowledge", "folder", "", "Apr 2"],
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
        <PageHeader title="Files" subtitle="Drop files anywhere to upload" />
      </div>
      <div
        className="tf-in"
        style={
          {
            "--d": "80ms",
          } as React.CSSProperties
        }
      >
        <FileBrowser
          items={F.map((f) => ({
            id: f[0],
            name: f[0],
            kind: f[1],
            size: f[2],
            modified: f[3],
            shared: f[4],
          }))}
          path={[{ id: "root", name: "All files" }]}
          folders={[{ id: "root", name: "All files" }]}
          onUpload={() => {}}
          onCreateFolder={() => {}}
          onRename={() => {}}
          onMove={() => {}}
          onTrash={() => {}}
          onDownload={() => {}}
        />
      </div>
    </Shell>
  );
}
export default function Preview() {
  return <App />;
}
