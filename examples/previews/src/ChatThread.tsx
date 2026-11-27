import {
  ChatMessage,
  ChatThread,
  DaySeparator,
  HandoffLine,
  ReadOnlyBar,
  SystemLine,
  TypingIndicator,
  VoiceLog,
  VoiceNote,
} from "@twentyfirstmedia/ui-core";

const NOW = "2026-04-16T12:00:00";

export default function Preview() {
  return (
    <div className="tf-panel" style={{ gap: 16, height: 640 }}>
      <ChatThread label="Atlas and Ledger">
        <DaySeparator date="2026-04-15T17:00:00" now={NOW} />
        <HandoffLine
          from={{ name: "Atlas", tint: "sky" }}
          to={{ name: "Ledger", tint: "butter" }}
          reason="Check the prorated amount before the quote goes out"
          time="17:02"
          href="#ledger"
        />
        <ChatMessage
          role="assistant"
          name="Ledger"
          tint="butter"
          time="17:03"
          text="Prorated April is **€480** for 40 seats. Billed with the next invoice."
        />
        <SystemLine icon="clock" time="17:05">
          Atlas paused until the quote is approved
        </SystemLine>
        <DaySeparator date="2026-04-16T09:00:00" now={NOW} />
        <VoiceLog
          duration="2:31"
          time="09:12"
          turns={[
            { who: "user", text: "Did Ledger confirm the amount?" },
            {
              who: "agent",
              name: "Atlas",
              text: "Yes, €480 for April, billed with May's invoice.",
            },
            { who: "user", text: "Then send the quote." },
          ]}
        />
        <DaySeparator label="New messages" tone="accent" />
        <div className="tf-row" style={{ justifyContent: "flex-end" }}>
          <VoiceNote
            mine
            duration={14}
            transcript="Before you send it, add the PO number Ida gave us on the call."
          />
        </div>
        <SystemLine tone="warning" icon="lock">
          Sending the quote needs an approval
        </SystemLine>
        <TypingIndicator names={["Atlas", "Lena Hart"]} />
      </ChatThread>
      <ReadOnlyBar text="You are reading along: Atlas and Ledger" onAction={() => {}} />
    </div>
  );
}
