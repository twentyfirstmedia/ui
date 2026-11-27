import { MailRulesEditor } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <MailRulesEditor
      folders={[
        { value: "receipts", label: "Receipts" },
        { value: "clients", label: "Clients" },
        { value: "archive", label: "Archive" },
      ]}
      agents={[
        { value: "bookkeeper", label: "Bookkeeper" },
        { value: "support", label: "Support agent" },
      ]}
      defaultValue={[
        {
          id: "r1",
          name: "Invoices to Receipts",
          enabled: true,
          match: "any",
          conditions: [
            { field: "subject", op: "contains", value: "invoice" },
            { field: "from", op: "endsWith", value: "@billing.example.com" },
          ],
          actions: [
            { type: "move", value: "receipts" },
            { type: "handoff", value: "bookkeeper" },
          ],
        },
        {
          id: "r2",
          name: "Quiet newsletters",
          enabled: false,
          match: "all",
          conditions: [{ field: "body", op: "contains", value: "unsubscribe" }],
          actions: [{ type: "markRead" }, { type: "archive" }],
        },
      ]}
      onSave={() => {}}
    />
  );
}
