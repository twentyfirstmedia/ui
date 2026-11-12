import { Card, QrCode } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-row" style={{ gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
      <Card style={{ width: 200, minHeight: 0 }}>
        <QrCode
          value="otpauth://totp/Halo:mara%40halo.app?secret=JBSWY3DPEHPK3PXP&issuer=Halo"
          label="Authenticator setup code"
        />
        <small className="tf-muted">Scan with an authenticator app</small>
      </Card>
      <Card style={{ width: 160, minHeight: 0 }}>
        <QrCode value="https://halo.app/invite/7F3K" level="Q" label="Invite link" />
        <small className="tf-muted">Join on your phone</small>
      </Card>
    </div>
  );
}
