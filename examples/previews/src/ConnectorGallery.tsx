import { ConnectorGallery } from "@twentyfirstmedia/ui-core";
import { CATEGORIES, CONNECTORS } from "./_connectors";

export default function Preview() {
  return (
    <ConnectorGallery
      connectors={CONNECTORS}
      categories={CATEGORIES}
      onConnect={() => {}}
      onOpen={() => {}}
    />
  );
}
