import * as React from "react";
import {
  AppShell,
  BookingSlots,
  Button,
  CallPanel,
  PageHeader,
  Panel,
  SequenceSteps,
  Stagger,
} from "@twentyfirstmedia/ui-core";
import { CRM_NAV, NOW } from "./_crm";
import { DAYS, STEPS } from "./_sales";

/** Working a sequence: the steps with their results, today's call, and booking the next meeting. */
export default function Preview() {
  const [step, setStep] = React.useState("3");
  const [muted, setMuted] = React.useState(false);
  const [hold, setHold] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [slot, setSlot] = React.useState<{ date: Date | string | number; time: string } | null>(
    null,
  );
  return (
    <AppShell
      navigation="sidebar"
      brand="Pilot CRM"
      sidebarGroups={CRM_NAV}
      active="sequences"
      user={{ name: "Mara Ellis", email: "mara@pilot.app" }}
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          title="Outdoor retail Q4"
          subtitle="Sequence · 240 enrolled · 19 replied"
          actions={[
            <Button key="pause" variant="secondary" icon="pause">
              Pause
            </Button>,
            <Button key="add" icon="plus">
              Enroll people
            </Button>,
          ]}
        />
      </div>
      <Stagger
        className="tf-grid"
        style={
          {
            "--cols": "minmax(0, 1fr) minmax(0, 1fr)",
            "--cols-sm": "1fr",
            gap: 16,
            alignItems: "start",
          } as React.CSSProperties
        }
      >
        <Panel title="Steps">
          <SequenceSteps steps={STEPS} selected={step} onSelect={setStep} />
        </Panel>
        <div className="tf-col" style={{ gap: 16 }}>
          <Panel title="Call · step 3">
            <CallPanel
              name="Lena Hartmann"
              subtitle="Head of Operations · Nordhafen Outdoor"
              number="+49 40 2287 1190"
              state={hold ? "hold" : "active"}
              startedAt={new Date(NOW.getTime() - 196000)}
              now={NOW}
              muted={muted}
              onMute={setMuted}
              onHold={setHold}
              onEnd={() => {}}
              notes={notes}
              onNotes={setNotes}
            />
          </Panel>
          <Panel title="Book the demo">
            <BookingSlots
              days={DAYS}
              duration={45}
              timeZone="Europe/Berlin"
              value={slot}
              onChange={setSlot}
              onConfirm={() => {}}
            />
          </Panel>
        </div>
      </Stagger>
    </AppShell>
  );
}
