import { Menu } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        maxWidth: 360,
      }}
    >
      <Menu
        items={[
          {
            label: "Open",
            icon: "eye",
            shortcut: "↵",
          },
          {
            label: "Rename",
            icon: "edit",
            shortcut: "R",
          },
          {
            label: "Duplicate",
            icon: "file",
          },
          {
            label: "Share link",
            icon: "link",
          },
          "-",
          {
            label: "Delete",
            icon: "trash",
            danger: true,
          },
        ]}
      />
    </div>
  );
}
