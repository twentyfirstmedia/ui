import { AuthCard, Button, OtpInput, TextField } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 16,
        alignItems: "start",
      }}
    >
      <AuthCard
        title="Welcome back"
        text="Sign in to the Halo workspace."
        foot="New here? Create a workspace"
      >
        <TextField label="Email" icon="mail" defaultValue="mara@halo.app" />
        <TextField label="Password" type="password" icon="lock" defaultValue="secret-pass" />
        <Button>Sign in</Button>
      </AuthCard>
      <AuthCard
        icon="key"
        tint="butter"
        title="Reset your password"
        text="We’ll email you a link to choose a new one."
        foot="Back to sign in"
      >
        <TextField label="Email" icon="mail" defaultValue="mara@halo.app" />
        <Button icon="send">Send reset link</Button>
      </AuthCard>
      <AuthCard
        icon="shield"
        tint="sky"
        title="Enter your code"
        text="Type the 6-digit code from your authenticator app."
        foot="Use a recovery code instead"
      >
        <OtpInput />
      </AuthCard>
    </div>
  );
}
