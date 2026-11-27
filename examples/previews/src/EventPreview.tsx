import { ApprovalCard, EventPreview } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <ApprovalCard
      agent="Assistant"
      project="Office"
      family="comms"
      age="4 min"
      title="Invite Lukas and Ida to the quarterly review"
      text="Both said Thursday morning works; invitations go out by mail."
    >
      <EventPreview
        title="Quarterly review"
        start="2026-04-16T10:00:00"
        end="2026-04-16T11:00:00"
        location="Room 2 · or video call"
        calendar="Team calendar"
        guests={[
          { name: "Mara Ellis", email: "mara@example.com", status: "accepted" },
          { name: "Lukas Brandt", email: "lukas@example.com", status: "open" },
          { name: "Ida Nolan", email: "ida@example.com", status: "tentative" },
        ]}
        conflicts={[
          { title: "Hiring sync", start: "2026-04-16T10:30:00", end: "2026-04-16T11:00:00" },
        ]}
        text="Numbers for Q1, the roadmap for Q2 and the hiring plan."
      />
    </ApprovalCard>
  );
}
