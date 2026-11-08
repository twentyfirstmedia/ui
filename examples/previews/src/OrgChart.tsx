import { OrgChart } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel">
      <OrgChart
        root={{
          name: "Main Brain",
          role: "Orchestrator",
          tint: "lilac",
          status: "ok",
          children: [
            {
              name: "Atlas",
              role: "Support lead",
              tint: "sky",
              status: "running",
              children: [
                {
                  name: "Triage",
                  role: "Tags mail",
                  tint: "sky",
                  status: "idle",
                },
                {
                  name: "Drafts",
                  role: "Writes replies",
                  tint: "sky",
                  status: "signal",
                },
              ],
            },
            {
              name: "Ledger",
              role: "Finance lead",
              tint: "butter",
              status: "ok",
            },
            {
              name: "Robin",
              role: "Owner",
              avatar: true,
            },
          ],
        }}
      />
    </div>
  );
}
