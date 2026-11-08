import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge,
  Button,
  Card,
  DataTable,
  IconButton,
  Segmented,
  StatTile,
  TextField,
  UIProvider,
  type Kit,
  type Theme,
} from "@twentyfirstmedia/ui-core";

const rows = [
  { id: 1, name: "Ava Vogel", role: "Editor", status: "Active" },
  { id: 2, name: "Ben Okafor", role: "Viewer", status: "Invited" },
];

function App() {
  const [kit, setKit] = useState<Kit>("halo");
  const [theme, setTheme] = useState<Theme>("light");
  const [count, setCount] = useState(0);
  return (
    <UIProvider kit={kit} theme={theme}>
      <main className="tf-pad tf-col" style={{ gap: 16, maxWidth: 960 }}>
        <div className="tf-row">
          <Segmented
            label="Kit"
            options={["halo", "pro"]}
            value={kit}
            onChange={(v) => setKit(v as Kit)}
          />
          <Segmented
            label="Theme"
            options={["light", "dark"]}
            value={theme}
            onChange={(v) => setTheme(v as Theme)}
          />
          <Button variant="primary" onClick={() => setCount(count + 1)}>
            {`Clicked ${count}`}
          </Button>
        </div>
        <div className="tf-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <StatTile value="18" label="All projects" tint="sky" />
          <StatTile value="$48,210" label="Revenue" tint="butter" />
          <StatTile value="4" label="Drafts" tint="placeholder" />
        </div>
        <Card
          title="Quarterly onboarding"
          description="Welcome flow for new workspace admins."
          status={<Badge tone="success">Live</Badge>}
          actions={[<IconButton key="m" icon="more" label="More" size="sm" />]}
        />
        <TextField label="Search" placeholder="Type to filter" />
        <div className="tf-panel tf-panel-flush">
          <DataTable
            rows={rows}
            columns={[
              { key: "name", label: "Name" },
              { key: "role", label: "Role" },
              { key: "status", label: "Status" },
            ]}
          />
        </div>
      </main>
    </UIProvider>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
