import * as React from "react";
import {
  Ambient,
  AppShell,
  AreaChart,
  BarChart,
  Button,
  Checkbox,
  PageHeader,
  Panel,
  ProgressRing,
  Segmented,
  Stagger,
  StatTile,
  Textarea,
  UIProvider,
} from "@twentyfirstmedia/ui-core";

/** A wellbeing dashboard in glass over the kit's ambient colours. */
function App() {
  return (
    <UIProvider scope="subtree" surface="glass">
      <Ambient />
      <AppShell
        brand="Bloom"
        tag="Daily"
        active="Today"
        user={{ name: "Mara Ellis", email: "mara@bloom.app" }}
        nav={[
          { label: "Today", icon: "sun" },
          { label: "Sleep", icon: "moon" },
          { label: "Habits", icon: "check" },
          { label: "Journal", icon: "book" },
        ]}
        railTop={[
          { label: "Today", icon: "home", active: true },
          { label: "Trends", icon: "trend" },
          { label: "Reminders", icon: "bell", count: 2 },
        ]}
        railBottom={[{ label: "Settings", icon: "settings" }]}
        dockItems={[
          { icon: "heart", label: "Log mood", tint: "blush" },
          { icon: "moon", label: "Log sleep", tint: "sky" },
          { icon: "zap", label: "Start a workout", tint: "butter" },
          { icon: "sparkle", label: "Breathe", tint: "lilac" },
        ]}
        side={
          <Panel side title="Journal" subtitle="One line is enough">
            <Textarea
              label="What are you grateful for today?"
              rows={4}
              defaultValue="Coffee on the balcony before everyone woke up."
            />
            <Button variant="primary" icon="check">
              Save entry
            </Button>
          </Panel>
        }
      >
        <div className="tf-in">
          <PageHeader
            title="Good morning, Mara"
            subtitle="Thursday · You slept 7 h 42 min"
            actions={[
              <Button key="log" variant="secondary" icon="plus">
                Log activity
              </Button>,
            ]}
          />
        </div>
        <Stagger
          className="tf-grid"
          style={
            {
              "--cols": "repeat(3, minmax(0, 1fr))",
              "--cols-sm": "1fr",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <StatTile value="7h 42m" label="Sleep" tint="sky" delta="+18 min" />
          <StatTile value="12 days" label="Streak" tint="butter" delta="Best 21" />
          <StatTile value="8,240" label="Steps" tint="mint" delta="82% of goal" />
        </Stagger>
        <Stagger
          className="tf-grid"
          delay={200}
          style={
            {
              "--cols": "minmax(0, 3fr) minmax(0, 2fr)",
              "--cols-sm": "1fr",
              gap: 16,
              marginTop: 16,
            } as React.CSSProperties
          }
        >
          <Panel title="Sleep" subtitle="Last 7 nights, in hours">
            <BarChart
              label="Hours of sleep"
              height={150}
              data={[
                { label: "Fri", value: 6.8, tint: "sky" },
                { label: "Sat", value: 8.1, tint: "sky" },
                { label: "Sun", value: 7.9, tint: "sky" },
                { label: "Mon", value: 6.4, tint: "lilac" },
                { label: "Tue", value: 7.2, tint: "sky" },
                { label: "Wed", value: 7.5, tint: "sky" },
                { label: "Thu", value: 7.7, tint: "mint" },
              ]}
            />
          </Panel>
          <Panel title="Today's goal" subtitle="Move, breathe, reflect">
            <div style={{ display: "grid", placeItems: "center", padding: "8px 0" }}>
              <ProgressRing
                value={72}
                tint="mint"
                caption="of today"
                label="Daily goal"
                size={132}
              />
            </div>
          </Panel>
          <Panel title="Mindful minutes" subtitle="This week">
            <AreaChart
              label="Mindful minutes"
              labels={["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"]}
              series={[{ name: "Minutes", values: [6, 12, 15, 4, 10, 14, 18], tint: "lilac" }]}
              height={130}
            />
          </Panel>
          <Panel title="How do you feel?" subtitle="3 of 4 habits done">
            <Segmented
              label="Mood"
              block
              defaultValue="Calm"
              options={["Tired", "Calm", "Great"]}
            />
            <Checkbox defaultChecked>Drink 2 l of water</Checkbox>
            <Checkbox defaultChecked>10 minutes outside</Checkbox>
            <Checkbox defaultChecked>Stretch after lunch</Checkbox>
            <Checkbox>Phone away at 22:00</Checkbox>
          </Panel>
        </Stagger>
      </AppShell>
    </UIProvider>
  );
}

export default function Preview() {
  return <App />;
}
