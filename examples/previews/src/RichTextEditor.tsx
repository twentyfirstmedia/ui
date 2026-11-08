import { RichTextEditor } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel">
      <RichTextEditor
        label="Newsletter text"
        placeholder="Write something…"
        maxLength={2000}
        defaultValue="<h3>Your boost is live</h3><p>Hi {first_name}, your <b>1,000 followers</b> start arriving within the next hour.</p><ul><li>Delivery spreads over 24 h</li><li>Refill guarantee for 30 days</li></ul>"
        variables={[
          {
            key: "first_name",
            label: "First name",
          },
          {
            key: "order_id",
            label: "Order number",
          },
          {
            key: "coupon",
            label: "Coupon code",
          },
        ]}
        hint="Fields in braces are filled per recipient."
      />
    </div>
  );
}
