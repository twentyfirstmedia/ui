import * as React from "react";
import {
  Breadcrumb,
  Button,
  IconButton,
  Price,
  ProductArt,
  Rating,
  StockBadge,
  VariantPicker,
} from "@twentyfirstmedia/ui-core";

function App() {
  return (
    <div
      style={{
        borderRadius: 30,
        background: "var(--canvas)",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 1px var(--line)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <b
          style={{
            font: "700 20px/26px var(--font-sans)",
          }}
        >
          Halo Goods
        </b>
        <div className="tf-row">
          <IconButton icon="heart" label="Saved" />
          <Button icon="cart">Cart</Button>
        </div>
      </div>
      <div
        className="tf-grid"
        style={
          {
            "--cols": "minmax(0, 1.1fr) minmax(0, 1fr)",
            gap: 32,
            padding: 24,
          } as React.CSSProperties
        }
      >
        <div className="tf-col">
          <ProductArt kind="tee" tint="sky" />
          <div
            className="tf-grid"
            style={
              {
                "--cols": "repeat(4, 1fr)",
                "--cols-sm": "repeat(4, minmax(0, 1fr))",
                "--cols-md": "repeat(2, minmax(0, 1fr))",
                gap: 12,
              } as React.CSSProperties
            }
          >
            {(["sky", "mint", "butter", "lilac"] as const).map((t) => (
              <ProductArt key={t} kind="tee" tint={t} />
            ))}
          </div>
        </div>
        <div
          className="tf-col"
          style={{
            gap: 20,
          }}
        >
          <Breadcrumb items={["Shop", "Apparel", "Halo Cotton Tee"]} />
          <h1
            style={{
              margin: 0,
              font: "700 28px/34px var(--font-sans)",
            }}
          >
            Halo Cotton Tee
          </h1>
          <Rating value={4.7} count={128} />
          <Price value={32} compareAt={39} size="lg" />
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
          <StockBadge stock={84} />
          <Button icon="cart">Add to cart · €32</Button>
        </div>
      </div>
    </div>
  );
}
export default App;
