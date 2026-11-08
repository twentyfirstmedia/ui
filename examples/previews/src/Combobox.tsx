import * as React from "react";
import { Combobox, TagInput } from "@twentyfirstmedia/ui-core";

const TZ = [
  "Europe/Berlin (UTC+1)",
  "Europe/London (UTC+0)",
  "Asia/Dubai (UTC+4)",
  "Asia/Singapore (UTC+8)",
  "America/New_York (UTC−5)",
  "America/Los_Angeles (UTC−8)",
];
const PEOPLE = [
  {
    value: "ava",
    label: "Ava Vogel",
    hint: "Engineering",
    avatar: true,
  },
  {
    value: "ben",
    label: "Ben Okafor",
    hint: "Sales",
    avatar: true,
  },
  {
    value: "clara",
    label: "Clara Haddad",
    hint: "Design",
    avatar: true,
  },
  {
    value: "elif",
    label: "Elif Sato",
    hint: "Engineering",
    avatar: true,
  },
];
function App() {
  const t = React.useState<string | string[] | null>("Asia/Dubai (UTC+4)"),
    p = React.useState<string | string[] | null>(["ava", "clara"]),
    tags = React.useState(["urgent", "q3"]);
  return (
    <div
      className="tf-panel"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        alignContent: "start",
      }}
    >
      <Combobox
        label="Time zone"
        options={TZ}
        value={t[0]}
        onChange={t[1]}
        placeholder="Search time zones"
      />
      <Combobox
        label="Reviewers"
        multiple
        options={PEOPLE}
        value={p[0]}
        onChange={p[1]}
        placeholder="Add people"
      />
      <Combobox
        label="Label"
        creatable
        options={["Customers", "Agents", "Finance"]}
        placeholder="Pick or create"
        hint="Type a new name to create it"
      />
      <TagInput label="Tags" value={tags[0]} onChange={tags[1]} />
    </div>
  );
}
export default App;
