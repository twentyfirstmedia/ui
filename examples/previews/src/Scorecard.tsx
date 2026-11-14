import { Scorecard } from "@twentyfirstmedia/ui-core";

const PAR = [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5];
const STROKES = [5, 4, 3, 6, 4, 5, 2, 4, 5, 6, 3, 4, 4, 5, 4, 4, 5, 6];
const PUTTS = [2, 2, 1, 2, 2, 2, 1, 2, 2, 3, 2, 2, 1, 2, 2, 2, 2, 2];

export default function Preview() {
  return (
    <div style={{ maxWidth: 760 }}>
      <Scorecard
        course="GC Hamburg-Walddörfer"
        date={new Date(2026, 10, 13)}
        tee="Yellow · CR 71.2 / SR 128"
        holes={PAR.map((par, i) => ({ par, strokes: STROKES[i], putts: PUTTS[i] }))}
      />
    </div>
  );
}
