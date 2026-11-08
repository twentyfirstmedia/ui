import { EventCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-col"
      style={{
        maxWidth: 300,
      }}
    >
      <EventCard kind="meeting" label="Team sync" date="Tue, 14.04" time="10:30">
        Roadmap check-in with design and growth; bring last sprint numbers.
      </EventCard>
      <EventCard kind="deadline" label="Deadline" date="Fri, 17.04" time="17:00">
        Send Q2 invoices to all annual customers.
      </EventCard>
    </div>
  );
}
