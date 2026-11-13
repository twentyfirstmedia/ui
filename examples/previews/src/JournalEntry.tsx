import { IconButton, JournalEntry } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-col" style={{ gap: 16, maxWidth: 560 }}>
      <JournalEntry
        date={new Date(2026, 10, 12)}
        mood={4}
        title="Slow morning, good walk"
        tags={["Walk", "Family"]}
        actions={<IconButton icon="edit" label="Edit entry" size="sm" variant="ghost" />}
      >
        <p>
          Slept through for once. Walked to the harbour with Lena before work and the day felt
          lighter after that. Need to book the dentist.
        </p>
      </JournalEntry>
      <JournalEntry date={new Date(2026, 10, 10)} mood={2} tags={["Work"]}>
        <p>Long day, too many calls. Skipped lunch again.</p>
      </JournalEntry>
    </div>
  );
}
