import * as React from "react";
import {
  Badge,
  Button,
  Card,
  Chip,
  PageHeader,
  RangeSlider,
  SearchField,
  Sidebar,
  Stagger,
  useFormat,
} from "@twentyfirstmedia/ui-core";
import type { SidebarGroup } from "@twentyfirstmedia/ui-core";

const TYPES = [
  ["Apartment", 128],
  ["House", 46],
  ["Office", 19],
  ["Plot", 7],
] as const;
const ROOMS = ["Any", "1+", "2+", "3+", "4+"];
const FEATURES = ["Balcony", "Lift", "Parking", "Garden", "New build"];

const homes = [
  { title: "Bright loft by the canal", type: "Apartment", rooms: 3, price: 640000, tag: "New" },
  { title: "Townhouse with garden", type: "House", rooms: 5, price: 1180000, tag: "Garden" },
  { title: "Corner flat, top floor", type: "Apartment", rooms: 2, price: 420000, tag: "Lift" },
  { title: "Studio near the park", type: "Apartment", rooms: 1, price: 289000, tag: "Balcony" },
];

/** A results list with filters in the sidebar: options with counts, a range and one-choice groups. */
export default function Preview() {
  const f = useFormat();
  const [types, setTypes] = React.useState<string[]>(["Apartment"]);
  const [rooms, setRooms] = React.useState("2+");
  const [features, setFeatures] = React.useState<string[]>([]);
  const [price, setPrice] = React.useState<[number, number]>([250000, 900000]);
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => (on: boolean) =>
    set(on ? [...list, v] : list.filter((x) => x !== v));
  const reset = () => {
    setTypes([]);
    setRooms("Any");
    setFeatures([]);
    setPrice([0, 1500000]);
  };

  const groups: SidebarGroup[] = [
    {
      label: "Type",
      items: TYPES.map(([t, n]) => ({
        id: t,
        label: t,
        count: n,
        checked: types.includes(t),
        onCheckedChange: toggle(types, setTypes, t),
      })),
    },
    {
      label: "Price",
      content: (
        <RangeSlider
          label="Price range"
          min={0}
          max={1500000}
          step={10000}
          value={price}
          onChange={setPrice}
          unit="€"
        />
      ),
    },
    {
      label: "Rooms",
      select: "single",
      items: ROOMS.map((r) => ({
        id: `rooms-${r}`,
        label: r,
        checked: rooms === r,
        onCheckedChange: () => setRooms(r),
      })),
    },
    {
      label: "Features",
      collapsible: true,
      items: FEATURES.map((x) => ({
        id: x,
        label: x,
        checked: features.includes(x),
        onCheckedChange: toggle(features, setFeatures, x),
      })),
    },
  ];
  const active = types.length + features.length + (rooms === "Any" ? 0 : 1);

  return (
    <div
      style={{
        display: "flex",
        minHeight: 720,
        overflow: "hidden",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--line)",
        background: "var(--canvas)",
      }}
    >
      <Sidebar
        as="aside"
        variant="attached"
        label="Filters"
        groups={groups}
        header={
          <div className="tf-row" style={{ justifyContent: "space-between", width: "100%" }}>
            <b>Filters</b>
            {active > 0 && <Badge>{active}</Badge>}
          </div>
        }
        footer={
          <Button variant="secondary" icon="refresh" onClick={reset}>
            Reset filters
          </Button>
        }
      />
      <main className="tf-col" style={{ flex: 1, minWidth: 0, gap: 20, padding: 24 }}>
        <PageHeader
          title="Homes for sale"
          subtitle={`${f.formatNumber(200)} results`}
          actions={[<SearchField key="s" placeholder="Search area or street" />]}
        />
        <div className="tf-row" style={{ gap: 8, flexWrap: "wrap" }}>
          {[...types, ...features].map((x) => (
            <Chip
              key={x}
              selected
              icon="x"
              onClick={() => {
                setTypes(types.filter((t) => t !== x));
                setFeatures(features.filter((t) => t !== x));
              }}
            >
              {x}
            </Chip>
          ))}
          {rooms !== "Any" && (
            <Chip selected icon="x" onClick={() => setRooms("Any")}>
              {`${rooms} rooms`}
            </Chip>
          )}
        </div>
        <Stagger className="tf-col" style={{ gap: 12, alignContent: "start" }}>
          {homes.map((h) => (
            <Card key={h.title} style={{ minHeight: 0 }}>
              <div className="tf-row" style={{ justifyContent: "space-between", gap: 12 }}>
                <div className="tf-col" style={{ gap: 4, minWidth: 0 }}>
                  <b>{h.title}</b>
                  <small className="tf-muted">{`${h.type} · ${h.rooms} rooms`}</small>
                </div>
                <div className="tf-col" style={{ gap: 4, alignItems: "flex-end" }}>
                  <b>{f.formatMoney(h.price, null, { maximumFractionDigits: 0 })}</b>
                  <Badge>{h.tag}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </Stagger>
      </main>
    </div>
  );
}
