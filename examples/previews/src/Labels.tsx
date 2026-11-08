import * as React from "react";
import {
  ApprovalCard,
  Segmented,
  formatDate,
  formatMoney,
  setLabels,
  setLocale,
} from "@twentyfirstmedia/ui-core";

const de = {
  "Yes, run it as shown": "Ja, so ausführen",
  "Yes, with a change": "Ja, mit Änderung",
  "No, discard": "Nein, verwerfen",
  "Different instruction": "Andere Anweisung",
  "Approval needed": "Freigabe nötig",
  Communication: "Kommunikation",
  Send: "Senden",
  Cancel: "Abbrechen",
  "What should change?": "Was soll anders sein?",
  "What should happen instead?": "Was soll stattdessen passieren?",
};
function App() {
  const lang = React.useState("en");
  if (lang[0] === "de") {
    setLabels(de, true);
    setLocale("de-DE");
  } else {
    setLabels({}, true);
    setLocale("en-US");
  }
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <Segmented
        value={lang[0]}
        onChange={lang[1]}
        options={[
          {
            value: "en",
            label: "Built-in (English)",
          },
          {
            value: "de",
            label: "App labels (German)",
          },
        ]}
      />
      <div key={lang[0]}>
        <ApprovalCard
          agent="Atlas"
          project="Support"
          family="comms"
          title="Send this email to ida@northwind.io"
          age={formatDate(new Date(2026, 3, 16)) + " · " + formatMoney(1234.5)}
        >
          <div className="tf-approval-mail">Hi Ida, …</div>
        </ApprovalCard>
      </div>
    </div>
  );
}
export default App;
