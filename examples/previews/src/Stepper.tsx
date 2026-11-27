import * as React from "react";
import { Button, Stepper } from "@twentyfirstmedia/ui-core";

const STEPS = [
  { label: "Account", description: "Name and email" },
  { label: "Workspace", description: "Name and address" },
  { label: "Invite", description: "Your team" },
  { label: "Billing", description: "Plan and card" },
  { label: "Done" },
];

export default function Preview() {
  const [step, setStep] = React.useState(2);
  return (
    <div className="tf-col" style={{ gap: 24 }}>
      <Stepper steps={STEPS} current={step} onStepClick={setStep} />
      <div className="tf-row" style={{ justifyContent: "flex-end" }}>
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>
          Continue
        </Button>
      </div>
      <Stepper
        variant="compact"
        steps={[
          { label: "Domain" },
          { label: "DNS records", state: "error" },
          { label: "Mailboxes" },
        ]}
        current={1}
      />
    </div>
  );
}
