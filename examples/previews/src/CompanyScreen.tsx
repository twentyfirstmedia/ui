import * as React from "react";
import {
  AppShell,
  Badge,
  DealCard,
  LeadScore,
  ListRow,
  OrgChart,
  Panel,
  RecordHeader,
  RecordTimeline,
  Stagger,
} from "@twentyfirstmedia/ui-core";
import { CRM_NAV, ENTRIES, NOW } from "./_crm";

const two = {
  "--cols": "minmax(0, 1fr) minmax(0, 1fr)",
  "--cols-sm": "1fr",
  gap: 16,
  alignItems: "start",
} as React.CSSProperties;

/** A company in the CRM: people with their role, the buying committee, deals and the shared timeline. */
export default function Preview() {
  return (
    <AppShell
      navigation="sidebar"
      brand="Pilot CRM"
      sidebarGroups={CRM_NAV}
      active="companies"
      user={{ name: "Mara Ellis", email: "mara@pilot.app" }}
      dock={false}
    >
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <RecordHeader
          kind="company"
          title="Nordhafen Outdoor"
          subtitle="Outdoor retail · 120 people · Hamburg"
          status={{ label: "Customer", tone: "success" }}
          tags={["Retail", "Key account"]}
          owner="Mara Ellis"
          menu={
            <LeadScore
              score={82}
              reasons={[
                { text: "Renewal in negotiation", points: 30 },
                { text: "4 people engaged this month", points: 20 },
              ]}
            />
          }
          actions={[
            { label: "New deal", icon: "plus", primary: true },
            { label: "Email all", icon: "mail" },
          ]}
          facts={[
            { label: "Open pipeline", value: "€78,000" },
            { label: "Won to date", value: "€126,400" },
            { label: "Website", value: "nordhafen.de" },
            { label: "Customer since", value: "Mar 2023" },
          ]}
        />
        <div className="tf-grid" style={two}>
          <Panel title="People" subtitle="4 contacts">
            <ListRow
              avatar="Lena Hartmann"
              title="Lena Hartmann"
              subtitle="Head of Operations"
              trailing={<Badge tone="success">Champion</Badge>}
            />
            <ListRow
              avatar="Henrik Sørensen"
              title="Henrik Sørensen"
              subtitle="Managing Director"
              trailing={<Badge tone="highlight">Decision maker</Badge>}
            />
            <ListRow
              avatar="Pia Krüger"
              title="Pia Krüger"
              subtitle="Purchasing"
              trailing={<Badge tone="neutral">Influencer</Badge>}
            />
            <ListRow
              avatar="Tom Becker"
              title="Tom Becker"
              subtitle="IT lead"
              trailing={<Badge tone="warning">Blocker</Badge>}
            />
          </Panel>
          <Panel title="Deals">
            <DealCard
              deal={{
                id: "d6",
                title: "Nordhafen renewal",
                value: 36000,
                probability: 80,
                closeDate: new Date(2026, 10, 30),
                daysInStage: 4,
                owner: "Mara Ellis",
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
                owner: "Mara Ellis",
              }}
              onOpen={() => {}}
            />
          </Panel>
        </div>
        <Panel title="Buying committee">
          <OrgChart
            root={{
              name: "Henrik Sørensen",
              role: "Managing Director",
              avatar: true,
              children: [
                { name: "Lena Hartmann", role: "Operations", avatar: true },
                { name: "Pia Krüger", role: "Purchasing", avatar: true },
                { name: "Tom Becker", role: "IT", avatar: true },
              ],
            }}
          />
        </Panel>
        <Panel title="Activity" subtitle="Across all contacts">
          <RecordTimeline entries={ENTRIES.slice(1)} now={NOW} filters={false} />
        </Panel>
      </Stagger>
    </AppShell>
  );
}
