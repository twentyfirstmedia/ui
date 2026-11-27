import * as React from "react";
import { FileBrowser } from "@twentyfirstmedia/ui-core";
import type { FileBrowserItem, FileBrowserUpload } from "@twentyfirstmedia/ui-core";
import { landscape } from "./_art";

type Node = FileBrowserItem & { parent: string };

const START: Node[] = [
  { id: "contracts", parent: "root", name: "Contracts", kind: "folder", count: 3 },
  { id: "receipts", parent: "root", name: "Receipts", kind: "folder", count: 12, shared: true },
  { id: "brand", parent: "root", name: "Brand assets", kind: "folder", count: 8 },
  {
    id: "msa",
    parent: "root",
    name: "Northwind – master agreement.pdf",
    size: 412000,
    modified: "2026-04-16",
    shared: true,
  },
  {
    id: "offsite",
    parent: "root",
    name: "offsite-lake-house.png",
    size: 2400000,
    modified: "2026-04-15",
    thumbnail: landscape("#bcd3e6", "#f5d48a", "#7d9b76", "#56734f"),
    preview: landscape("#bcd3e6", "#f5d48a", "#7d9b76", "#56734f"),
  },
  { id: "pnl", parent: "root", name: "pnl-q1-2026.xlsx", size: 92000, modified: "2026-04-01" },
  { id: "dpa", parent: "root", name: "DPA template.docx", size: 96000, modified: "2026-03-30" },
  { id: "kit", parent: "root", name: "press-kit.zip", size: 36000000, modified: "2026-04-02" },
  {
    id: "c1",
    parent: "contracts",
    name: "Kestrel Bank – proposal v3.pdf",
    size: 1800000,
    modified: "2026-04-15",
  },
  {
    id: "c2",
    parent: "contracts",
    name: "NDA – Sunline.pdf",
    size: 210000,
    modified: "2026-02-11",
  },
];
const NAMES: Record<string, string> = {
  root: "All files",
  contracts: "Contracts",
  receipts: "Receipts",
  brand: "Brand assets",
};

export default function Preview() {
  const [nodes, setNodes] = React.useState(START);
  const [folder, setFolder] = React.useState("root");
  const [uploads, setUploads] = React.useState<FileBrowserUpload[]>([
    { id: "u1", name: "launch-video.mp4", size: 184000000, progress: 38, part: 7, parts: 18 },
  ]);
  const items = nodes
    .filter((n) => n.parent === folder)
    .map((n) =>
      n.kind === "folder"
        ? { ...n, count: nodes.filter((x) => x.parent === n.id).length || n.count }
        : n,
    );
  return (
    <FileBrowser
      items={items}
      path={[
        { id: "root", name: NAMES.root ?? "" },
        ...(folder === "root" ? [] : [{ id: folder, name: NAMES[folder] ?? folder }]),
      ]}
      onNavigate={setFolder}
      folders={[
        {
          id: "root",
          name: "All files",
          children: [
            { id: "contracts", name: "Contracts" },
            { id: "receipts", name: "Receipts" },
            { id: "brand", name: "Brand assets" },
          ],
        },
      ]}
      uploads={uploads}
      onCancelUpload={(id) => setUploads((u) => u.filter((x) => x.id !== id))}
      onUpload={(files) =>
        setUploads((u) => [
          ...u,
          ...files.map((f, i) => ({
            id: `${f.name}-${i}`,
            name: f.name,
            size: f.size,
            progress: 0,
          })),
        ])
      }
      onCreateFolder={(name) => {
        const id = name.toLowerCase().replace(/\W+/g, "-");
        NAMES[id] = name;
        setNodes((n) => [...n, { id, parent: folder, name, kind: "folder" }]);
      }}
      onRename={(id, name) => setNodes((n) => n.map((x) => (x.id === id ? { ...x, name } : x)))}
      onMove={(ids, to) =>
        setNodes((n) => n.map((x) => (ids.includes(x.id) ? { ...x, parent: to } : x)))
      }
      onTrash={(ids) => setNodes((n) => n.filter((x) => !ids.includes(x.id)))}
      onDownload={() => {}}
    />
  );
}
