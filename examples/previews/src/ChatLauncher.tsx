import * as React from "react";
import {
  AnnouncementBar,
  ChatLauncher,
  ChatMessage,
  Composer,
  CookieConsent,
  PromptStarters,
} from "@twentyfirstmedia/ui-core";

function App() {
  const o = React.useState(true);
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <AnnouncementBar tint="butter" action={<a href="#">See plans</a>}>
        Free plan: 3 stagings left this month.
      </AnnouncementBar>
      <div
        className="tf-grid"
        style={
          {
            "--cols": "1fr 1fr",
            gap: 16,
            alignItems: "end",
          } as React.CSSProperties
        }
      >
        <CookieConsent
          inline
          policy={<a href="#">Privacy policy</a>}
          categories={[
            {
              id: "necessary",
              label: "Necessary",
              text: "Sign-in, security, cart",
              required: true,
            },
            {
              id: "stats",
              label: "Statistics",
              text: "Anonymous usage numbers",
            },
            {
              id: "marketing",
              label: "Marketing",
              text: "Ads and remarketing",
            },
          ]}
          onSave={() => {}}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <ChatLauncher
            inline
            open={o[0]}
            onOpenChange={o[1]}
            title="Homefield assistant"
            context="Looking at: Loft in HafenCity"
            composer={<Composer placeholder="Ask about this listing…" />}
          >
            <ChatMessage
              role="assistant"
              name="Assistant"
              text="This loft is about **4% above** the estimated value. Want me to draft a first message to the agent?"
            />
            <PromptStarters
              items={[
                {
                  title: "Draft a message",
                  icon: "mail",
                },
                {
                  title: "Compare with similar",
                  icon: "chart",
                },
              ]}
            />
          </ChatLauncher>
        </div>
      </div>
    </div>
  );
}
export default App;
