import * as React from "react";
import {
  Button,
  Checkbox,
  Form,
  SelectMenu,
  TextField,
  Textarea,
  toast,
} from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel" style={{ maxWidth: 520 }}>
      <Form
        rules={{
          name: { required: "Tell us your name" },
          email: { required: true, email: true },
          team: { required: "Pick a team" },
          message: { minLength: 20, message: "Write at least 20 characters" },
          terms: { required: "Accept the terms to continue" },
        }}
        onSubmit={(v) => toast({ text: `Thanks, ${v.name}` })}
      >
        <TextField name="name" label="Name" placeholder="Mara Ellis" required />
        <TextField
          name="email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          required
        />
        <SelectMenu
          name="team"
          label="Team"
          placeholder="Choose a team"
          required
          options={["Design", "Engineering", "Growth", "Finance"]}
        />
        <Textarea name="message" label="Message" placeholder="What do you need?" rows={3} />
        <Checkbox name="terms" value="yes">
          I accept the terms
        </Checkbox>
        <div className="tf-row" style={{ justifyContent: "flex-end" }}>
          <Button type="submit">Send</Button>
        </div>
      </Form>
    </div>
  );
}
