import { CodeViewer, LogView } from "@twentyfirstmedia/ui-core";
import type { LogLine } from "@twentyfirstmedia/ui-core";

const lines: LogLine[] = [
  {
    time: "09:41:02",
    text: "pull  ghcr.io/halo/web:8f2a91c",
    level: "hl",
  },
  {
    time: "09:41:09",
    text: "build  146 modules transformed",
  },
  {
    time: "09:41:22",
    text: "test   146 passed, 0 failed",
    level: "ok",
  },
  {
    time: "09:41:23",
    text: "warn   bundle is 512 kB, above the 500 kB budget",
    level: "warn",
  },
  {
    time: "09:41:30",
    text: "health GET /v1/health → 503",
    level: "err",
  },
];
export default function Preview() {
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <LogView title="deploy #482" lines={lines} />
      <CodeViewer
        value={{
          tool: "cloudflare.dns",
          action: "create",
          record: {
            type: "TXT",
            name: "ops-test",
            ttl: 300,
          },
        }}
      />
    </div>
  );
}
