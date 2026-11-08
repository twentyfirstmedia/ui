import { RunTrace } from "@twentyfirstmedia/ui-core";
import type { TraceStep } from "@twentyfirstmedia/ui-core";

const steps: TraceStep[] = [
  {
    kind: "message",
    label: "Task received",
    meta: "Triage 12 new support emails",
    start: 0,
    ms: 30,
    detail: "Trigger: schedule · every hour",
  },
  {
    kind: "model",
    label: "Planned the work",
    meta: "Claude Sonnet 5.5 · 2,140 tokens",
    start: 70,
    ms: 1300,
    detail: "1. Read new mail\n2. Tag each thread\n3. Draft replies for billing questions",
  },
  {
    kind: "tool",
    label: "Mailbox",
    meta: "Fetched 12 messages",
    start: 1410,
    ms: 620,
  },
  {
    kind: "search",
    label: "Knowledge base",
    meta: "Looked up 4 articles",
    start: 2070,
    ms: 480,
  },
  {
    kind: "model",
    label: "Wrote 4 drafts",
    meta: "9,820 tokens",
    start: 2590,
    ms: 3100,
  },
  {
    kind: "approval",
    label: "Waiting for approval",
    meta: "Autonomy: Drafts only",
    start: 5730,
    ms: 0,
    status: "running",
  },
];
export default function Preview() {
  return (
    <div
      className="tf-panel tf-panel-flush"
      style={{
        padding: 16,
      }}
    >
      <RunTrace
        steps={steps}
        defaultOpen={1}
        footer={
          <>
            <span>
              {"Model "}
              <b>Claude Sonnet 5.5</b>
            </span>
            <span>
              {"Tokens "}
              <b>11,960</b>
            </span>
            <span>
              {"Cost "}
              <b>€0.036</b>
            </span>
          </>
        }
      />
    </div>
  );
}
