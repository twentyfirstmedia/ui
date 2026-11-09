"use client";
import {
  BarChart,
  Button,
  ConfirmDialog,
  Drawer,
  LineChart,
  Panel,
  Progress,
  Segmented,
  Stagger,
  StatTile,
  Toaster,
  UIProvider,
  toast,
  useUI,
  type Motion,
} from "@twentyfirstmedia/ui-core";
import { useState, type CSSProperties } from "react";

const LEVELS: { value: Motion; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "standard", label: "Standard" },
  { value: "expressive", label: "Expressive" },
];

/** A small dashboard to replay in each motion level, plus layers to open and close. */
export function MotionDemo() {
  const { kit, theme } = useUI();
  const [level, setLevel] = useState<Motion>("expressive");
  const [run, setRun] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [orders, setOrders] = useState(1284);
  return (
    <section className="docs-example" aria-label="Motion demo">
      <div className="docs-example-bar" style={{ flexWrap: "wrap" }}>
        <Segmented
          size="sm"
          label="Motion level"
          value={level}
          onChange={(v) => {
            setLevel(v as Motion);
            setRun((r) => r + 1);
          }}
          options={LEVELS}
        />
        <div className="tf-row" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" icon="refresh" onClick={() => setRun((r) => r + 1)}>
            Replay
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setOrders((o) => o + 137)}>
            New data
          </Button>
        </div>
      </div>
      <div className="docs-preview">
        <UIProvider
          key={run}
          scope="subtree"
          kit={kit}
          theme={theme}
          motion={level}
          className="docs-preview-inner"
        >
          <Stagger
            className="tf-grid"
            style={
              {
                "--cols": "repeat(3, minmax(0, 1fr))",
                "--cols-md": "repeat(2, minmax(0, 1fr))",
                gap: 16,
              } as CSSProperties
            }
          >
            <StatTile value={orders.toLocaleString("en-US")} label="Orders" tint="sky" />
            <StatTile value="€48,210" label="Revenue" tint="mint" />
            <StatTile value="98.2%" label="On time" tint="butter" />
            <Panel title="Revenue" subtitle="Last 7 days">
              <LineChart
                label="Revenue"
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                series={[
                  { values: [32, 41, 38, 52, 49, 61, 66], tint: "sky" },
                  { values: [20, 26, 30, 28, 36, 40, 44], tint: "mint" },
                ]}
                height={140}
              />
            </Panel>
            <Panel title="Orders by channel">
              <BarChart
                label="Orders by channel"
                height={140}
                data={[
                  { label: "Web", value: 48, tint: "sky" },
                  { label: "App", value: 36, tint: "mint" },
                  { label: "Shop", value: 22, tint: "butter" },
                  { label: "Phone", value: 12, tint: "lilac" },
                ]}
              />
            </Panel>
            <Panel title="Layers" subtitle="They animate out as well as in">
              <Progress label="Seats used" value={64} />
              <div className="tf-row" style={{ gap: 8, flexWrap: "wrap" }}>
                <Button size="sm" variant="secondary" onClick={() => setDialog(true)}>
                  Dialog
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setDrawer(true)}>
                  Drawer
                </Button>
                <Button size="sm" variant="secondary" onClick={() => toast("Changes saved")}>
                  Toast
                </Button>
              </div>
            </Panel>
          </Stagger>
          <ConfirmDialog
            open={dialog}
            title="Archive the project?"
            text="It leaves the dashboard; you can restore it from the archive."
            confirmLabel="Archive"
            onConfirm={() => setDialog(false)}
            onCancel={() => setDialog(false)}
          />
          <Toaster />
          <Drawer open={drawer} title="Order 1042" subtitle="Paid" onClose={() => setDrawer(false)}>
            <p style={{ margin: 0 }}>Shipped on Tuesday, arriving Thursday.</p>
          </Drawer>
        </UIProvider>
      </div>
    </section>
  );
}
