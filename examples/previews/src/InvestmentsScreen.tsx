import * as React from "react";
import {
  AppShell,
  Donut,
  HoldingsList,
  PageHeader,
  Panel,
  Segmented,
  Stagger,
  StatTile,
} from "@twentyfirstmedia/ui-core";
import { LIFE_NAV } from "./_lifenav";

/** A portfolio: value, change, allocation and holdings with their share. */
export default function Preview() {
  const [period, setPeriod] = React.useState("today");
  return (
    <AppShell
      navigation="sidebar"
      brand="Life"
      sidebarGroups={LIFE_NAV}
      active="investments"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          title="Investments"
          subtitle="Scalable Capital · read only"
          actions={[
            <Segmented
              key="p"
              label="Period"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "today", label: "Today" },
                { value: "year", label: "1 year" },
              ]}
            />,
          ]}
        />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "repeat(3, minmax(0, 1fr))",
              "--cols-sm": "1fr",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <StatTile
            label="Portfolio value"
            value="€38,420"
            delta={period === "today" ? "+0.2%" : "+11.4%"}
            tint="mint"
          />
          <StatTile label="Savings plans" value="€650 a month" tint="sky" />
          <StatTile label="Dividends this year" value="€412" tint="butter" />
        </div>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "minmax(0, 1fr) minmax(0, 2fr)",
              "--cols-sm": "1fr",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <Panel title="Allocation">
            <Donut
              center="€38k"
              caption="5 positions"
              data={[
                { label: "Developed markets", value: 48, tint: "sky" },
                { label: "Bonds", value: 19, tint: "mint" },
                { label: "Emerging markets", value: 16, tint: "butter" },
                { label: "Single stocks", value: 11, tint: "lilac" },
                { label: "Crypto", value: 6, tint: "blush" },
              ]}
            />
          </Panel>
          <Panel
            title="Holdings"
            subtitle={period === "today" ? "Change today" : "Change over 1 year"}
          >
            <HoldingsList
              period={period === "today" ? "today" : "1 year"}
              onSelect={() => {}}
              holdings={[
                {
                  id: "1",
                  name: "MSCI World ETF",
                  symbol: "IE00B4L5Y983",
                  value: 18420,
                  change: period === "today" ? 0.6 : 14.2,
                  weight: 48,
                },
                {
                  id: "2",
                  name: "Global Bonds ETF",
                  symbol: "IE00B3F81409",
                  value: 7150,
                  change: period === "today" ? 0 : 2.1,
                  weight: 19,
                },
                {
                  id: "3",
                  name: "Emerging Markets ETF",
                  symbol: "IE00BKM4GZ66",
                  value: 6240,
                  change: period === "today" ? -1.2 : 6.8,
                  weight: 16,
                },
                {
                  id: "4",
                  name: "Apple",
                  symbol: "AAPL",
                  value: 4310,
                  change: period === "today" ? 1.8 : 22.5,
                  weight: 11,
                },
                {
                  id: "5",
                  name: "Bitcoin ETP",
                  symbol: "BTCE",
                  value: 2300,
                  change: period === "today" ? -3.4 : 38.0,
                  weight: 6,
                },
              ]}
            />
          </Panel>
        </div>
      </Stagger>
    </AppShell>
  );
}
