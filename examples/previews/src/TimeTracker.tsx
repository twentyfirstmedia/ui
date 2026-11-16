import * as React from "react";
import { Panel, TimeTracker } from "@twentyfirstmedia/ui-core";

const NOW = new Date(2026, 10, 16, 11, 12);

export default function Preview() {
  const [running, setRunning] = React.useState(true);
  const [task, setTask] = React.useState("Checkout flow: address step");
  const [project, setProject] = React.useState("Nordhafen · Website relaunch");
  const [billable, setBillable] = React.useState(true);
  return (
    <Panel title="Time">
      <TimeTracker
        running={running}
        startedAt={new Date(NOW.getTime() - 2537000)}
        now={NOW}
        task={task}
        onTask={setTask}
        project={project}
        projects={["Nordhafen · Website relaunch", "Velo Werk · App redesign", "Internal"]}
        onProject={setProject}
        billable={billable}
        onBillable={setBillable}
        onStart={() => setRunning(true)}
        onStop={() => setRunning(false)}
        entries={[
          {
            id: "1",
            project: "Nordhafen · Website relaunch",
            task: "Stand-up and planning",
            minutes: 30,
            billable: true,
          },
          {
            id: "2",
            project: "Velo Werk · App redesign",
            task: "Onboarding screens",
            minutes: 95,
            billable: true,
          },
          { id: "3", project: "Internal", task: "Hiring: portfolio reviews", minutes: 45 },
        ]}
      />
    </Panel>
  );
}
