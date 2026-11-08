import { Carousel, ProductArt } from "@twentyfirstmedia/ui-core";

const ITEMS = [
  ["tee", "sky", "Halo Cotton Tee", "€32"],
  ["mug", "butter", "Studio Mug", "€18"],
  ["bottle", "mint", "Field Bottle", "€28"],
  ["tote", "lilac", "Canvas Tote", "€24"],
  ["cap", "blush", "Trail Cap", "€22"],
] as const;

export default function Preview() {
  return (
    <div className="tf-col" style={{ gap: 32 }}>
      <Carousel
        label="Featured products"
        perView={3}
        slides={ITEMS.map(([k, t, name, price]) => (
          <div key={k} className="tf-card" style={{ minHeight: 0, gap: 8 }}>
            <ProductArt kind={k} tint={t} />
            <b>{name}</b>
            <span className="tf-card-desc">{price}</span>
          </div>
        ))}
      />
      <Carousel
        label="Onboarding"
        loop
        slides={["Invite your team", "Connect your mailbox", "Approve your first draft"].map(
          (t, i) => (
            <div
              key={t}
              className="tf-panel"
              style={{
                minHeight: 160,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <span className="tf-card-desc">Step {i + 1} of 3</span>
              <b style={{ fontSize: 20 }}>{t}</b>
            </div>
          ),
        )}
      />
    </div>
  );
}
