import { TwoFactorSetup } from "@twentyfirstmedia/ui-core";
function qr() {
  const cells = [],
    n = 25;
  let seed = 7;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      seed = (seed * 9301 + 49297) % 233280;
      const f = (x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17);
      const on = f
        ? (x % 6 === 0 || y % 6 === 0 || (x % 6 > 1 && x % 6 < 5 && y % 6 > 1 && y % 6 < 5)) &&
          !(x === 7 || y === 7)
        : seed / 233280 > 0.5;
      if (on) cells.push(<rect key={x + "-" + y} x={x} y={y} width={1} height={1} />);
    }
  return (
    <svg
      viewBox="0 0 25 25"
      width={144}
      height={144}
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {cells}
    </svg>
  );
}
export default function Preview() {
  return (
    <div className="tf-panel">
      <TwoFactorSetup
        qr={qr()}
        secret="JBSWY3DPEHPK3PXP"
        codes={[
          "8f2a-91c4",
          "3b7e-0d55",
          "a1c9-6f20",
          "7d44-e8b1",
          "c0f3-2a97",
          "5e18-b3d6",
          "9b62-4c0e",
          "e7a5-1f83",
        ]}
        onVerify={(c) => c === "123456"}
        onDownload={() => {}}
        onDone={() => {}}
      />
    </div>
  );
}
