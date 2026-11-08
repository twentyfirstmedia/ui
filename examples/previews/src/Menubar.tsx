import { Menubar } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div style={{ minHeight: 260 }}>
      <Menubar
        label="Editor"
        menus={[
          {
            label: "File",
            items: [
              { label: "New page", icon: "file", shortcut: "⌘N" },
              { label: "Open…", icon: "folder", shortcut: "⌘O" },
              {
                label: "Export",
                icon: "download",
                items: [{ label: "PDF" }, { label: "Markdown" }, { label: "HTML" }],
              },
              "-",
              { label: "Close", shortcut: "⌘W" },
            ],
          },
          {
            label: "Edit",
            items: [
              { label: "Undo", icon: "undo", shortcut: "⌘Z" },
              { label: "Redo", icon: "redo", shortcut: "⇧⌘Z" },
              "-",
              { label: "Find…", icon: "search", shortcut: "⌘F" },
            ],
          },
          {
            label: "View",
            items: [
              { label: "Show sidebar", type: "checkbox", checked: true },
              { label: "Show comments", type: "checkbox" },
              "-",
              { label: "Zoom in", shortcut: "⌘+" },
              { label: "Zoom out", shortcut: "⌘−" },
            ],
          },
          {
            label: "Help",
            items: [{ label: "Keyboard shortcuts", shortcut: "?" }, { label: "What's new" }],
          },
        ]}
      />
    </div>
  );
}
