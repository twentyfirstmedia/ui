import {
  Alert,
  Button,
  Funnel,
  PageHeader,
  Panel,
  StackedBarChart,
  StatTile,
} from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";
import type { SubNavItem } from "@twentyfirstmedia/ui-core";

function App() {
  const pages: SubNavItem[] = [
    {
      id: "Overview",
      label: "Overview",
      icon: "chart",
    },
    {
      id: "Products",
      label: "Products",
      icon: "package",
    },
    {
      id: "Orders",
      label: "Orders",
      icon: "truck",
      count: 8,
    },
    {
      id: "Storefront",
      label: "Storefront",
      icon: "cart",
    },
  ];
  return (
    <Shell
      area="Shop"
      current="Overview"
      action={{
        label: "Add product",
        icon: "plus",
      }}
      pages={pages}
    >
      <PageHeader
        title="Shop"
        subtitle="Halo Goods · last 7 days"
        actions={[
          <Button key="v" variant="secondary" icon="arrowUpRight">
            View store
          </Button>,
        ]}
      />
      <Alert
        tone="warning"
        title="3 products are running low"
        action={
          <Button size="sm" variant="secondary">
            Review stock
          </Button>
        }
      >
        Studio Mug (6 left), Canvas Tote (sold out), Court Sneaker (9 left).
      </Alert>
      <div
        className="tf-grid"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        }}
      >
        <StatTile tint="butter" value="€5,592" label="Revenue" />
        <StatTile tint="sky" value="36" label="Orders" />
        <StatTile tint="mint" value="€155" label="Average order" />
        <StatTile tint="placeholder" value="11" label="To fulfil" />
      </div>
      <div
        className="tf-grid"
        style={{
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
        }}
      >
        <Panel title="Sales by channel">
          <StackedBarChart
            height={160}
            labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            format={(v) => "€" + Math.round(v)}
            series={[
              {
                name: "Online store",
                tint: "sky",
                values: [420, 380, 510, 460, 620, 840, 760],
              },
              {
                name: "Instagram",
                tint: "lilac",
                values: [120, 160, 140, 210, 260, 380, 300],
              },
              {
                name: "Marketplace",
                tint: "butter",
                values: [90, 110, 80, 130, 150, 170, 160],
              },
            ]}
          />
        </Panel>
        <Panel title="Conversion">
          <Funnel
            steps={[
              {
                label: "Visited",
                value: 8420,
              },
              {
                label: "Viewed product",
                value: 3910,
              },
              {
                label: "Added to cart",
                value: 812,
              },
              {
                label: "Ordered",
                value: 214,
              },
            ]}
          />
        </Panel>
      </div>
    </Shell>
  );
}
export default App;
