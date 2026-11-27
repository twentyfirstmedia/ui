import { AssetCard } from "@twentyfirstmedia/ui-core";
import { mug, tote } from "./_art";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16,
        alignItems: "start",
      }}
    >
      <AssetCard
        title="Mug mockup"
        watermark
        current={1}
        meta="1024 × 1024 · €0.04"
        versions={[
          {
            id: "v1",
            src: mug("#e9e2d6", "#b9ad9c", "#1d4e5f", "#c8955a"),
            prompt: "A mug on an oak desk",
          },
          {
            id: "v2",
            src: mug("#dfe9ec", "#8fa6ad", "#1d4e5f", "#c8955a"),
            prompt: "A mug on a light shelf, morning light",
            downloadHref: "#download",
          },
          {
            id: "v3",
            src: mug("#f4efe6", "#c8955a", "#2b211c", "#f4efe6"),
            prompt: "A dark mug on a warm table",
          },
        ]}
        onMakeCurrent={() => {}}
        onRegenerate={() => {}}
      />
      <AssetCard
        title="Tote bag"
        state="generating"
        versions={[{ id: "t1", prompt: "A canvas tote with the logo" }]}
        meta="Started 12 s ago"
        onRegenerate={() => {}}
      />
      <AssetCard
        title="Shop window"
        versions={[
          { id: "s1", state: "failed", error: "The check found a person in the picture." },
        ]}
        onRegenerate={() => {}}
      />
      <AssetCard
        title="Tote bag (bought)"
        current={0}
        versions={[
          { id: "b1", src: tote("#f4efe6", "#c8955a", "#1d4e5f"), downloadHref: "#download" },
        ]}
      />
    </div>
  );
}
