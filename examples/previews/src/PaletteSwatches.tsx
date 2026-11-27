import { PaletteSwatches } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <PaletteSwatches
      label="Harbour Coffee palette"
      colors={[
        { name: "Harbour", value: "#1d4e5f", role: "Primary" },
        { name: "Crema", value: "#c8955a", role: "Accent" },
        { name: "Foam", value: "#f4efe6", role: "Background" },
        { name: "Roast", value: "#2b211c", role: "Text" },
        { name: "Mint leaf", value: "#5fa38a", role: "Success" },
      ]}
    />
  );
}
