import * as React from "react";
import { Panel, TaskList } from "@twentyfirstmedia/ui-core";
import type { CrmTask } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  const [tasks, setTasks] = React.useState<CrmTask[]>([
    {
      id: "1",
      title: "Send revised proposal",
      due: new Date(2026, 10, 14),
      priority: "high",
      assignee: "Mara Ellis",
      related: "Deal · Retainer 2027",
    },
    {
      id: "2",
      title: "Call Lena about the contract",
      due: new Date(2026, 10, 16),
      assignee: "Mara Ellis",
      related: "Person · Lena Hartmann",
    },
    {
      id: "3",
      title: "Prepare workshop agenda",
      due: new Date(2026, 10, 16),
      assignee: "Jonas Pick",
      related: "Deal · Shop migration",
    },
    {
      id: "4",
      title: "Ask for two references",
      due: new Date(2026, 10, 19),
      priority: "low",
      assignee: "Lea Brandt",
      related: "Company · Nordhafen Outdoor",
    },
    { id: "5", title: "Clean up duplicate contacts" },
    {
      id: "6",
      title: "Book the kick-off room",
      due: new Date(2026, 10, 12),
      done: true,
      assignee: "Jonas Pick",
    },
  ]);
  return (
    <Panel title="Tasks" style={{ maxWidth: 680 }}>
      <TaskList
        tasks={tasks}
        today={new Date(2026, 10, 16)}
        onOpen={() => {}}
        onToggle={(id, done) =>
          setTasks((all) => all.map((x) => (x.id === id ? { ...x, done } : x)))
        }
      />
    </Panel>
  );
}
