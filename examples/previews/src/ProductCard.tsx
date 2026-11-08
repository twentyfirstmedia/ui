import * as React from "react";
import { Price, ProductArt, ProductCard, Rating, StockBadge } from "@twentyfirstmedia/ui-core";
import type { ProductCardProps } from "@twentyfirstmedia/ui-core";

function App() {
  const w = React.useState<string[]>(["p2"]),
    a = React.useState<string[]>([]);
  const P: (ProductCardProps & { id: string })[] = [
    {
      id: "p1",
      name: "Halo Cotton Tee",
      meta: "Apparel",
      art: "tee",
      tint: "sky",
      price: 32,
      compareAt: 39,
      rating: 4.7,
      reviews: 128,
      badge: "Bestseller",
    },
    {
      id: "p2",
      name: "Studio Mug",
      meta: "Home",
      art: "mug",
      tint: "butter",
      price: 18,
      rating: 4.9,
      reviews: 96,
    },
    {
      id: "p3",
      name: "Field Bottle",
      meta: "Outdoor",
      art: "bottle",
      tint: "mint",
      price: 28,
      rating: 4.6,
      reviews: 61,
      badge: "New",
    },
    {
      id: "p4",
      name: "Canvas Tote",
      meta: "Bags",
      art: "tote",
      tint: "lilac",
      price: 24,
      rating: 4.8,
      reviews: 143,
      stock: 0,
      badge: "Sold out",
      badgeTone: "neutral",
    },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 16,
      }}
    >
      {P.map((x) => (
        <ProductCard
          key={x.id}
          {...x}
          wished={w[0].indexOf(x.id) > -1}
          added={a[0].indexOf(x.id) > -1}
          onWish={() => {
            w[1](w[0].indexOf(x.id) > -1 ? w[0].filter((i) => i !== x.id) : w[0].concat([x.id]));
          }}
          onAdd={() => {
            a[1](a[0].concat([x.id]));
          }}
        />
      ))}
      <div
        className="tf-panel"
        style={{
          gridColumn: "1 / -1",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "center",
        }}
      >
        <Price value={32} compareAt={39} size="lg" />
        <Rating value={4.6} count={61} />
        <StockBadge stock={84} />
        <StockBadge stock={6} />
        <StockBadge stock={0} />
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          {ProductArt.kinds.map((k, i) => (
            <ProductArt
              key={k}
              kind={k}
              tint={(["sky", "mint", "butter", "lilac", "blush"] as const)[i % 5]}
              size={40}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;
