import { EmailPreview } from "@twentyfirstmedia/ui-core";

const html =
  '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#141414"><div style="font-weight:800;font-size:20px;margin-bottom:24px">Northwind</div><h1 style="font-size:24px;margin:0 0 12px">Your order is on its way</h1><p style="font-size:15px;line-height:24px;color:#444">Hi Ida, your 1,000 Instagram followers start arriving within the next hour. Delivery spreads over 24 hours so it looks natural.</p><a style="display:inline-block;margin-top:16px;padding:12px 20px;border-radius:999px;background:#141414;color:#fff;text-decoration:none;font-weight:700">Track order</a></div>';
export default function Preview() {
  return (
    <div className="tf-panel">
      <EmailPreview
        from="hello@northwind.de"
        fromName="Northwind"
        subject="Your order is on its way"
        preheader="Delivery starts within the hour"
        html={html}
        checks={[
          {
            status: "ok",
            label: "Links work",
          },
          {
            status: "ok",
            label: "Unsubscribe link",
          },
          {
            status: "warn",
            label: "Subject is 46 characters, may cut on phones",
          },
        ]}
      />
    </div>
  );
}
