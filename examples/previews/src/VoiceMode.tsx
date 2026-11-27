import * as React from "react";
import { Segmented, VoiceMode } from "@twentyfirstmedia/ui-core";
import type { VoiceModeProps, VoiceTurn } from "@twentyfirstmedia/ui-core";

const TURNS: VoiceTurn[] = [
  { who: "user", text: "What still needs me today?" },
  { who: "agent", name: "Atlas", text: "Two approvals: the Northwind reply and a refund of €10." },
];

function App() {
  const [state, setState] = React.useState<VoiceModeProps["state"]>("speaking");
  const live: VoiceTurn[] =
    state === "speaking"
      ? [
          ...TURNS,
          { who: "user", text: "Show me the reply first." },
          { who: "agent", name: "Atlas", text: "Here it is. I quote forty seats at", live: true },
        ]
      : state === "interrupted"
        ? [...TURNS, { who: "user", text: "Wait, use the new price list", live: true }]
        : TURNS;
  return (
    <div className="tf-col" style={{ gap: 16 }}>
      <Segmented
        value={state}
        onChange={(v) => setState(v as VoiceModeProps["state"])}
        options={[
          { value: "listening", label: "Listening" },
          { value: "thinking", label: "Thinking" },
          { value: "speaking", label: "Speaking" },
          { value: "interrupted", label: "Barge-in" },
        ]}
      />
      <VoiceMode
        name="Atlas"
        tint="sky"
        state={state}
        turns={live}
        fullscreen="never"
        onMute={() => {}}
        onInterrupt={() => setState("interrupted")}
        onEnd={() => {}}
      />
    </div>
  );
}
export default App;
