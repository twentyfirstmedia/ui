import { Funnel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel">
      <div>
        <h3 className="tf-panel-title">Trial to paid</h3>
        <p className="tf-panel-sub">Where people drop off</p>
      </div>
      <Funnel
        steps={[
          {
            label: "Visited pricing",
            value: 7495,
          },
          {
            label: "Started trial",
            value: 3609,
          },
          {
            label: "Invited a teammate",
            value: 2221,
          },
          {
            label: "Became paying",
            value: 1388,
          },
        ]}
      />
    </div>
  );
}
