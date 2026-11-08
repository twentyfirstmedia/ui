import { NotificationList } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        width: 380,
        background: "var(--surface)",
        borderRadius: 24,
        padding: 8,
        boxShadow: "var(--shadow-float)",
      }}
    >
      <NotificationList
        items={[
          {
            id: 1,
            icon: "bot",
            tint: "lilac",
            title: "Atlas needs your approval",
            text: "4 reply drafts are waiting",
            time: "07:55",
            unread: true,
          },
          {
            id: 2,
            icon: "flag",
            tint: "blush",
            title: "Invoice #2041 is overdue",
            text: "Harbor & Co · €860",
            time: "07:30",
            unread: true,
          },
          {
            id: 3,
            icon: "zap",
            tint: "mint",
            title: "halo-web is live",
            text: "Add seat selector to checkout",
            time: "Yesterday",
          },
          {
            id: 4,
            icon: "users",
            tint: "sky",
            title: "Ava Brandt joined",
            text: "Invited as Viewer",
            time: "Mon",
          },
        ]}
      />
    </div>
  );
}
