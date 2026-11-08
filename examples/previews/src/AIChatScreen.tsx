import {
  AgentMark,
  AgentStatus,
  ApprovalCard,
  ChatMessage,
  Composer,
  Reasoning,
  ToolCall,
  UsageMeter,
} from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";

const md = "I drafted a reply to **Ida Nolan**. It quotes **40 seats at €24** prorated to May 1.";
function App() {
  return (
    <Shell
      area="Agents"
      current="Chat"
      action={{
        label: "New agent",
        icon: "plus",
      }}
      pages={[
        {
          id: "Fleet",
          label: "Fleet",
          icon: "bot",
        },
        {
          id: "Chat",
          label: "Chat",
          icon: "mail",
        },
        {
          id: "Builder",
          label: "Builder",
          icon: "settings",
        },
        {
          id: "Runs",
          label: "Runs",
          icon: "refresh",
          count: 2,
        },
        {
          id: "Knowledge",
          label: "Knowledge",
          icon: "book",
        },
      ]}
    >
      <div
        className="tf-panel"
        style={{
          gap: 16,
        }}
      >
        <div
          className="tf-row"
          style={{
            flexWrap: "nowrap",
            paddingBottom: 16,
            borderBottom: "1px solid var(--line)",
          }}
        >
          <AgentMark tint="sky" live size={40} />
          <div
            style={{
              flex: 1,
            }}
          >
            <div
              className="tf-card-title"
              style={{
                padding: 0,
              }}
            >
              Atlas
            </div>
            <AgentStatus status="Waiting for approval" step="Drafts only" />
          </div>
          <div
            style={{
              width: 160,
            }}
          >
            <UsageMeter label="Context" used={19} limit={200} format={(v) => v + "k"} />
          </div>
        </div>
        <ChatMessage role="user" text="Draft a reply to Northwind about the seat upgrade" />
        <ChatMessage
          role="assistant"
          name="Atlas"
          tint="sky"
          time="09:41"
          model="Claude Sonnet 5.5"
          text={md}
          sources={[
            {
              title: "Seat upgrades · pricing v4",
            },
            {
              title: "Thread: Seat upgrade",
              icon: "mail",
            },
          ]}
          usage="1,527 tokens · €0.06"
          before={
            <div
              className="tf-col"
              style={{
                gap: 8,
              }}
            >
              <Reasoning
                duration="1.4 s"
                steps={["Find the thread", "Check pricing", "Draft, then ask"]}
              />
              <ToolCall name="Mailbox" icon="mail" summary="Read 3 messages" duration="0.8 s" />
              <ToolCall
                name="Knowledge base"
                icon="book"
                summary="Found “Seat upgrades”"
                duration="0.6 s"
              />
            </div>
          }
          after={
            <ApprovalCard
              title="Send this email to ida@northwind.io?"
              text="Atlas is set to “Drafts only”."
              approveLabel="Send email"
              onEdit={() => {}}
            >
              {
                "Hi Ida,\n\nhappy to add 40 seats before your renewal on May 1. The quote is attached.\n\nBest, Mara"
              }
            </ApprovalCard>
          }
        />
        <Composer
          placeholder="Ask Atlas something, or type / for commands"
          models={[
            {
              id: "s",
              label: "Claude Sonnet 5.5",
            },
          ]}
          model="s"
          onAttach={() => {}}
          commands={[
            {
              name: "clear",
            },
          ]}
        />
      </div>
    </Shell>
  );
}
export default App;
