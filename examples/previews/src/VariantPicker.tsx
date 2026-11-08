import { VariantPicker } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-panel"
      style={{
        gap: 24,
      }}
    >
      <VariantPicker
        label="Colour"
        type="color"
        defaultValue="Sky"
        options={[
          {
            value: "Sky",
            label: "Sky",
            color: "#9fc3f0",
          },
          {
            value: "Ink",
            label: "Ink",
            color: "#1d1d1f",
          },
          {
            value: "Bone",
            label: "Bone",
            color: "#ece6d9",
          },
          {
            value: "Moss",
            label: "Moss",
            color: "#7d9a5e",
            disabled: true,
          },
        ]}
      />
      <VariantPicker
        label="Size"
        defaultValue="M"
        options={[
          {
            value: "XS",
            label: "XS",
            disabled: true,
          },
          "S",
          "M",
          "L",
          "XL",
        ]}
      />
    </div>
  );
}
