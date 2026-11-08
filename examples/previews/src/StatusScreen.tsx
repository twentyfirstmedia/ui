import { Button, StatusScreen, UsageMeter } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}
    >
      <div className="tf-panel">
        <StatusScreen code="404" />
      </div>
      <div className="tf-panel">
        <StatusScreen code="500" reference="req_8f2a91c4" />
      </div>
      <div className="tf-panel">
        <StatusScreen
          code="maintenance"
          extra={
            <div
              style={{
                width: "100%",
                maxWidth: 300,
              }}
            >
              <UsageMeter label="Upgrade progress" used={72} limit={100} format={(v) => v + "%"} />
            </div>
          }
        />
      </div>
      <div className="tf-panel">
        <StatusScreen
          code="offline"
          actions={[
            <Button key="r" icon="refresh">
              Try again
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}
