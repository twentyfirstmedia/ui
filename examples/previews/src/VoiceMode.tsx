import * as React from "react";
import { Segmented, VoiceMode } from "@twentyfirstmedia/ui-core";
import type { VoiceModeProps } from "@twentyfirstmedia/ui-core";

function App() {
  const s = React.useState<VoiceModeProps["state"]>("listening");
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <Segmented
        value={s[0]}
        onChange={(v) => s[1](v as VoiceModeProps["state"])}
        options={["listening", "thinking", "speaking", "idle"]}
      />
      <VoiceMode
        name="Atlas"
        tint="sky"
        state={s[0]}
        transcript={s[0] === "speaking" ? "“I drafted the reply. Should I send it?”" : null}
        onMute={() => {}}
        onEnd={() => {}}
      />
    </div>
  );
}
export default App;
