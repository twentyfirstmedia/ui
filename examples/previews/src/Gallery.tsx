import { BeforeAfter, Gallery, ImageVariants } from "@twentyfirstmedia/ui-core";
import type { Tint } from "@twentyfirstmedia/ui-core";

const art = (t: Tint, s: string) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(160deg, var(--" + t + ") 0%, var(--surface) 120%)",
      display: "grid",
      placeItems: "center",
      color: "var(--" + t + "-ink)",
      font: "700 14px/1 var(--font-sans)",
    }}
  >
    {s}
  </div>
);
const before = {
  art: (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #ddd8cf 0 62%, #b9ad9c 62%)",
      }}
    />
  ),
};
const after = {
  art: (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #e9e2d6 0 62%, #a68b6a 62%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "18%",
          bottom: "22%",
          width: "38%",
          height: "22%",
          borderRadius: 18,
          background: "#5b6b5a",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "16%",
          bottom: "38%",
          width: "14%",
          height: "30%",
          borderRadius: 8,
          background: "#3d3a36",
        }}
      />
    </div>
  ),
};
export default function Preview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      <div
        className="tf-panel"
        style={{
          gap: 12,
        }}
      >
        <Gallery
          badge="Virtual staging"
          items={[
            {
              art: art("sky", "Living room"),
              caption: "Living room",
            },
            {
              art: art("mint", "Kitchen"),
            },
            {
              art: art("butter", "Bedroom"),
            },
            {
              art: art("lilac", "Balcony"),
            },
            {
              art: art("blush", "Bathroom"),
            },
          ]}
        />
      </div>
      <div
        className="tf-col"
        style={{
          gap: 16,
        }}
      >
        <div
          className="tf-panel"
          style={{
            gap: 12,
          }}
        >
          <b>Virtual staging</b>
          <BeforeAfter before={before} after={after} afterLabel="Staged · Scandinavian" />
        </div>
        <div className="tf-panel">
          <ImageVariants
            tint="sky"
            variants={[
              {
                id: 1,
                label: "Original",
                size: "4032 × 3024",
                format: "JPEG",
                weight: "3.8 MB",
                ratio: "4 / 3",
              },
              {
                id: 2,
                label: "Listing",
                size: "1600 × 1200",
                format: "WebP",
                weight: "214 KB",
                ratio: "4 / 3",
                status: "ok",
              },
              {
                id: 3,
                label: "Square",
                size: "1080 × 1080",
                format: "WebP",
                weight: "168 KB",
                ratio: "1 / 1",
                status: "ok",
              },
              {
                id: 4,
                label: "Upscaled 2×",
                size: "8064 × 6048",
                format: "PNG",
                status: "running",
                ratio: "4 / 3",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
