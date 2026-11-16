import * as React from "react";
import {
  AppShell,
  DealCard,
  Panel,
  PropertyList,
  RecordHeader,
  RecordTimeline,
  Stagger,
  TaskList,
} from "@twentyfirstmedia/ui-core";
import type { PropertyField, RecordEntry } from "@twentyfirstmedia/ui-core";
import { CRM_NAV, ENTRIES, NOW } from "./_crm";

/** A person in the CRM: header with quick actions, the activity timeline, details, deals and tasks. */
export default function Preview() {
  const [entries, setEntries] = React.useState<RecordEntry[]>(ENTRIES);
  const [fields, setFields] = React.useState<PropertyField[]>([
    { id: "email", label: "Email", type: "email", value: "lena@nordhafen.de" },
    { id: "phone", label: "Phone", type: "phone", value: "+49 40 2287 1190" },
    { id: "company", label: "Company", value: "Nordhafen Outdoor" },
    {
      id: "stage",
      label: "Lifecycle",
      type: "select",
      value: "Customer",
      options: ["Lead", "Prospect", "Customer"],
    },
    { id: "owner", label: "Owner", type: "person", value: "Mara Ellis" },
    { id: "birthday", label: "Birthday", type: "date", value: new Date(1986, 4, 12) },
    { id: "tags", label: "Tags", type: "tags", value: ["Decision maker", "Hamburg"] },
  ]);
  return (
    <AppShell
      navigation="sidebar"
      brand="Pilot CRM"
      sidebarGroups={CRM_NAV}
      active="people"
      user={{ name: "Mara Ellis", email: "mara@pilot.app" }}
      dock={false}
    >
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <RecordHeader
          title="Lena Hartmann"
          subtitle="Head of Operations at Nordhafen Outdoor"
          status={{ label: "Customer", tone: "success" }}
          tags={["Decision maker"]}
          owner="Mara Ellis"
          actions={[
            { label: "Email", icon: "mail", primary: true },
            { label: "Call", icon: "phone" },
            { label: "Meeting", icon: "calendar" },
          ]}
          facts={[
            { label: "Open deals", value: "€78,000" },
            { label: "Won", value: "€126,400" },
            { label: "Last contact", value: "Today, 8:42 AM" },
          ]}
        />
        <div
          className="tf-grid"
          style={
            {
              "--cols": "minmax(0, 3fr) minmax(0, 2fr)",
              "--cols-sm": "1fr",
              gap: 16,
              alignItems: "start",
            } as React.CSSProperties
          }
        >
          <Panel title="Activity">
            <RecordTimeline
              entries={entries}
              now={NOW}
              onAdd={(type, text) =>
                setEntries((all) => [
                  { id: "n" + all.length, type, title: text, at: NOW, actor: "Mara Ellis" },
                  ...all,
                ])
              }
            />
          </Panel>
          <div className="tf-col" style={{ gap: 16 }}>
            <Panel title="Details">
              <PropertyList
                fields={fields}
                onChange={(id, v) =>
                  setFields((all) => all.map((f) => (f.id === id ? { ...f, value: v } : f)))
                }
              />
            </Panel>
            <Panel title="Deals" subtitle="2 open">
              <DealCard
                deal={{
                  id: "d6",
                  title: "Nordhafen renewal",
                  value: 36000,
                  probability: 80,
                  closeDate: new Date(2026, 10, 30),
                  daysInStage: 4,
                  next: "Contract to legal",
                }}
                onOpen={() => {}}
              />
              <DealCard
                deal={{
                  id: "d3",
                  title: "Shop migration",
                  value: 42000,
                  probability: 30,
                  closeDate: new Date(2026, 11, 12),
                  daysInStage: 6,
                }}
                onOpen={() => {}}
              />
            </Panel>
            <Panel title="Tasks">
              <TaskList
                grouped={false}
                today={NOW}
                onToggle={() => {}}
                tasks={[
                  {
                    id: "1",
                    title: "Call Lena about the contract",
                    due: NOW,
                    assignee: "Mara Ellis",
                  },
                  {
                    id: "2",
                    title: "Ask for two references",
                    due: new Date(2026, 10, 19),
                    priority: "low",
                  },
                ]}
              />
            </Panel>
          </div>
        </div>
      </Stagger>
    </AppShell>
  );
}
