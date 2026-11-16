import { Panel, ViewingList } from "@twentyfirstmedia/ui-core";
import { VIEWINGS } from "./_industry";

export default function Preview() {
  return (
    <Panel title="Viewings" subtitle="Isestraße 61, 2nd floor">
      <ViewingList viewings={VIEWINGS} onConfirm={() => {}} onFeedback={() => {}} />
    </Panel>
  );
}
