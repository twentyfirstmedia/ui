import { Button, SecretField, Segmented, SettingsLayout, Switch } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel">
      <SettingsLayout
        sections={[
          {
            title: "Appearance",
            text: "Theme and density for this browser.",
            children: <Segmented defaultValue="System" options={["System", "Light", "Dark"]} />,
          },
          {
            title: "Notifications",
            text: "What reaches your phone.",
            children: [
              <Switch key={1} spread defaultChecked>
                Approvals waiting on me
              </Switch>,
              <Switch key={2} spread>
                Weekly digest
              </Switch>,
            ],
          },
          {
            title: "API key",
            text: "Used by the CLI.",
            children: <SecretField prefix="hq_" last4="9c1e" onCopy={() => {}} />,
          },
        ]}
        footer={<Button icon="check">Save changes</Button>}
      />
    </div>
  );
}
