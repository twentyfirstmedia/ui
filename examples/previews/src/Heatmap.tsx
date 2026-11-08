import { Heatmap } from "@twentyfirstmedia/ui-core";

const vals = [0, 1, 2, 3, 4, 5, 6].map((d) =>
  Array.from(
    {
      length: 24,
    },
    (_, hr) => {
      const w = d < 5 ? 1 : 0.35;
      return Math.round(
        48 *
          w *
          (Math.exp(-Math.pow((hr - 11) / 3.2, 2)) +
            0.7 * Math.exp(-Math.pow((hr - 16) / 2.6, 2))) +
          ((d * 31 + hr * 17) % 7),
      );
    },
  ),
);
export default function Preview() {
  return (
    <div className="tf-panel">
      <div>
        <h3 className="tf-panel-title">When people sign up</h3>
        <p className="tf-panel-sub">By weekday and hour</p>
      </div>
      <Heatmap
        rows={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        cols={Array.from(
          {
            length: 24,
          },
          (_, i) => (i < 10 ? "0" : "") + i,
        )}
        colEvery={3}
        values={vals}
        caption="Hover a cell for the count"
        format={(v) => v + " sign-ups"}
      />
    </div>
  );
}
