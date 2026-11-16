import * as React from "react";
import { CallPanel, Panel } from "@twentyfirstmedia/ui-core";

const NOW = new Date(2026, 10, 16, 9, 30);

export default function Preview() {
  const [muted, setMuted] = React.useState(false);
  const [hold, setHold] = React.useState(false);
  const [recording, setRecording] = React.useState(true);
  const [notes, setNotes] = React.useState(
    "Budget approved. Wants two references from outdoor retail.",
  );
  const [outcome, setOutcome] = React.useState("Connected");
  return (
    <div
      className="tf-grid"
      style={{ "--cols": "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 } as React.CSSProperties}
    >
      <Panel>
        <CallPanel
          name="Lena Hartmann"
          subtitle="Head of Operations · Nordhafen Outdoor"
          number="+49 40 2287 1190"
          state={hold ? "hold" : "active"}
          startedAt={new Date(NOW.getTime() - 754000)}
          now={NOW}
          muted={muted}
          recording={recording}
          onMute={setMuted}
          onHold={setHold}
          onRecord={setRecording}
          onEnd={() => {}}
          notes={notes}
          onNotes={setNotes}
          outcomes={["Connected", "Voicemail", "No answer", "Wrong number"]}
          outcome={outcome}
          onOutcome={setOutcome}
        />
      </Panel>
      <Panel>
        <CallPanel
          name="Tom Becker"
          subtitle="IT lead · Nordhafen Outdoor"
          number="+49 40 2287 1204"
          state="ringing"
          onAnswer={() => {}}
          onEnd={() => {}}
        />
      </Panel>
    </div>
  );
}
