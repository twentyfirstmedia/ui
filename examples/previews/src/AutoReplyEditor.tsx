import { AutoReplyEditor } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <AutoReplyEditor
      defaultValue={{
        enabled: true,
        start: new Date(2026, 3, 20),
        end: new Date(2026, 3, 24),
        subject: "Out of office until April 24",
        message:
          "Thanks for your message. I'm away until Friday, April 24, with little access to mail. For anything urgent, write to support@example.com.",
        contactsOnly: false,
      }}
      onSave={() => {}}
    />
  );
}
