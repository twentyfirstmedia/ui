import * as React from "react";
import { RecipientInput } from "@twentyfirstmedia/ui-core";
import type { MailRecipient } from "@twentyfirstmedia/ui-core";
import { PEOPLE } from "./_mail";

export default function Preview() {
  const [to, setTo] = React.useState<MailRecipient[]>([PEOPLE[0]!, { address: "noah.berg@" }]);
  return (
    <div className="tf-panel" style={{ gap: 16, minHeight: 300 }}>
      <RecipientInput
        label="To"
        value={to}
        onChange={setTo}
        suggestions={PEOPLE}
        placeholder="Name or address"
        hint="Paste several addresses at once, separated by commas."
      />
    </div>
  );
}
