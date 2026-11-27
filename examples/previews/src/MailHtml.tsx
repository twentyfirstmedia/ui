import { MailHtml } from "@twentyfirstmedia/ui-core";
import { NEWSLETTER_HTML } from "./_mail";

export default function Preview() {
  return (
    <div className="tf-panel" style={{ gap: 12 }}>
      <MailHtml html={NEWSLETTER_HTML} title="The weekly digest" />
    </div>
  );
}
