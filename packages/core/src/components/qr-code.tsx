import { cx } from "../cx.js";
import { useStrings } from "../context.js";
import { qrMatrix, qrPath } from "../qr.js";
import { ADMIN_STRINGS } from "../strings.js";
import type { QrCodeProps } from "./types.js";

/**
 * A QR code drawn as SVG, encoded on the device (no service is called): for otpauth:// links in
 * two-factor setup, sign-in on another device, sharing a link. Dark modules on the paper colour,
 * so it scans in dark mode too.
 */
export function QrCode(p: QrCodeProps) {
  const t = useStrings(ADMIN_STRINGS);
  const quiet = p.quiet ?? 4;
  const m = qrMatrix(p.value, p.level || "M");
  const n = m.length + quiet * 2;
  return (
    <svg
      className={cx("tf-qr", p.className)}
      style={{ ...(p.size ? { width: p.size, height: p.size } : null), ...p.style }}
      viewBox={`0 0 ${n} ${n}`}
      role="img"
      aria-label={p.label || t.qrCode}
      shapeRendering="crispEdges"
    >
      <rect className="tf-qr-bg" width={n} height={n} />
      <path d={qrPath(m, quiet)} fill="currentColor" />
    </svg>
  );
}
