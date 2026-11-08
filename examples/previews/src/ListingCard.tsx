import * as React from "react";
import { ListingCard, ResultsToolbar } from "@twentyfirstmedia/ui-core";
import type { Listing, StatusSelectProps } from "@twentyfirstmedia/ui-core";

const st: StatusSelectProps["options"] = [
  {
    value: "unread",
    label: "New",
    status: "running",
  },
  {
    value: "read",
    label: "Seen",
    status: "idle",
  },
  {
    value: "contacted",
    label: "Contacted",
    status: "ok",
  },
];
const L0: Listing[] = [
  {
    id: 1,
    title: "Bright 3-room flat with balcony near Isebek canal",
    price: 649000,
    pricePerSqm: 7726,
    area: 84,
    rooms: 3,
    place: "Eppendorf, Hamburg",
    source: "ImmoScout",
    seller: "private",
    phone: true,
    photos: 14,
    isNew: true,
    age: "2 h",
    status: "unread",
    tint: "sky",
  },
  {
    id: 2,
    title: "Loft in HafenCity with water view",
    price: 1190000,
    pricePerSqm: 10625,
    area: 112,
    rooms: 2.5,
    place: "HafenCity, Hamburg",
    source: "Kleinanzeigen",
    seller: "agent",
    photos: 22,
    age: "1 d",
    status: "contacted",
    tint: "lilac",
    wished: true,
  },
  {
    id: 3,
    title: "2-room flat, renovated old building",
    price: 1480,
    rent: true,
    area: 58,
    rooms: 2,
    place: "Altona, Hamburg",
    source: "Immowelt",
    seller: "agent",
    photos: 9,
    age: "3 d",
    status: "read",
    tint: "mint",
  },
];
function App() {
  const sel = React.useState<(string | number)[]>([1]),
    list = React.useState(L0),
    view = React.useState("grid"),
    sort = React.useState("new");
  function tog(x: Listing) {
    sel[1](sel[0].indexOf(x.id) > -1 ? sel[0].filter((i) => i !== x.id) : sel[0].concat([x.id]));
  }
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <ResultsToolbar
        title="Hamburg · flats to buy"
        total={128}
        meta="updated 06:00"
        selected={sel[0].length}
        onSelectAll={(all) => {
          sel[1](all ? list[0].map((x) => x.id) : []);
        }}
        bulkActions={[
          {
            label: "Send to CRM",
            icon: "send",
            variant: "primary",
          },
          {
            label: "Mark as seen",
            icon: "eye",
          },
        ]}
        sortOptions={[
          {
            value: "new",
            label: "Newest",
          },
          {
            value: "price",
            label: "Price",
          },
          {
            value: "sqm",
            label: "Price per m²",
          },
        ]}
        sort={sort[0]}
        onSort={sort[1]}
        views={["grid", "list", "map"]}
        view={view[0]}
        onView={view[1]}
      />
      <div
        style={
          view[0] === "list"
            ? {
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }
            : {
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
              }
        }
      >
        {list[0].map((x) => (
          <ListingCard
            key={x.id}
            listing={x}
            layout={view[0] === "list" ? "row" : "card"}
            selected={sel[0].indexOf(x.id) > -1}
            onSelect={tog}
            onWish={() => {}}
            statusOptions={st}
            onStatus={(l, s) => {
              list[1](
                list[0].map((y) =>
                  y.id === l.id
                    ? Object.assign({}, y, {
                        status: s,
                      })
                    : y,
                ),
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
export default App;
