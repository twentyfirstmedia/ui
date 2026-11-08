import { ListRow } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-list"
      style={{
        maxWidth: 380,
      }}
    >
      <ListRow
        avatar="Jonah Petit"
        title="Jonah Petit"
        subtitle="Can we move the review to Thursday?"
        meta="09:12"
        unread
        active
      />
      <ListRow
        avatar="Sun Lee"
        title="Sun Lee"
        subtitle="Payout file for March is attached"
        meta="Yesterday"
      />
      <ListRow
        icon="bell"
        tint="butter"
        title="Billing"
        subtitle="Card ending 4417 expires soon"
        meta="Mon"
      />
    </div>
  );
}
