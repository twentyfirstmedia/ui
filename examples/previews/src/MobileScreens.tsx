import * as React from "react";
import {
  Avatar,
  Badge,
  Card,
  Chip,
  Dock,
  EventCard,
  IconButton,
  ListRow,
  SearchField,
  Stagger,
  StatTile,
} from "@twentyfirstmedia/ui-core";
import { cardActs } from "./_workspace";

function Phone(p: { d: number; tab: number; children?: React.ReactNode }) {
  return (
    <div
      className="tf-in"
      style={
        {
          "--d": p.d + "ms",
          width: 360,
          maxWidth: "100%",
          height: 760,
          borderRadius: 44,
          background: "var(--frame)",
          padding: 10,
          boxSizing: "border-box",
          boxShadow: "var(--shadow-float)",
          flex: "none",
          scrollSnapAlign: "center",
        } as React.CSSProperties
      }
    >
      <div
        style={{
          height: "100%",
          borderRadius: 36,
          background: "var(--canvas)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px 8px",
            font: "700 13px var(--font-sans)",
          }}
        >
          <span>9:41</span>
          <span
            style={{
              width: 90,
              height: 24,
              borderRadius: 999,
              background: "var(--frame)",
            }}
          />
          <span>•••</span>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            padding: "8px 16px 90px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {p.children}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 16,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Dock
            items={[
              {
                label: "Home",
                icon: "home",
                tint: p.tab === 0 ? "sky" : "plain",
              },
              {
                label: "Projects",
                icon: "grid",
                tint: p.tab === 1 ? "mint" : "plain",
              },
              {
                label: "Inbox",
                icon: "mail",
                tint: p.tab === 2 ? "lilac" : "plain",
              },
              {
                label: "New",
                icon: "plus",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
function App() {
  return (
    <div
      style={{
        display: "flex",
        gap: 28,
        justifyContent: "safe center",
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        padding: "20px 0",
        background: "var(--canvas)",
        borderRadius: 30,
      }}
    >
      <Phone d={0} tab={0}>
        <div
          className="tf-row"
          style={{
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="tf-card-desc">Good morning</div>
            <div
              className="tf-header-title"
              style={{
                fontSize: 24,
              }}
            >
              Mara
            </div>
          </div>
          <Avatar name="Mara Ellis" size={40} />
        </div>
        <Stagger
          className="tf-grid"
          style={
            {
              "--cols": "1fr 1fr",
              "--cols-sm": "1fr 1fr",
              gap: 12,
            } as React.CSSProperties
          }
          delay={150}
        >
          <StatTile tint="sky" value="18" label="Projects" />
          <StatTile tint="butter" value="$48k" label="Revenue" />
          <StatTile tint="mint" value="11" label="Live" />
          <StatTile tint="placeholder" value="4" label="Review" />
        </Stagger>
        <div
          className="tf-in"
          style={
            {
              "--d": "400ms",
            } as React.CSSProperties
          }
        >
          <EventCard kind="meeting" label="Team sync" date="Today" time="10:30" actions={false}>
            Roadmap check-in with design and growth.
          </EventCard>
        </div>
      </Phone>
      <Phone d={120} tab={1}>
        <div
          className="tf-header-title"
          style={{
            fontSize: 24,
          }}
        >
          Projects
        </div>
        <div
          className="tf-row"
          style={{
            flexWrap: "nowrap",
          }}
        >
          <Chip selected>All</Chip>
          <Chip>Live</Chip>
          <Chip>Draft</Chip>
        </div>
        <Stagger className="tf-col" delay={250}>
          <Card
            tint="lilac"
            title="Pricing page refresh"
            description="New tiers and a comparison table."
            status={<Badge>86 viewing</Badge>}
            actions={[<IconButton key={1} icon="edit" label="Edit" size="sm" variant="solid" />]}
            style={{
              minHeight: 0,
            }}
          />
          <Card
            title="Quarterly onboarding"
            description="Welcome flow for new admins."
            status={<Badge tone="success">Live</Badge>}
            actions={cardActs()}
            style={{
              minHeight: 0,
            }}
          />
          <Card
            title="Partner referrals"
            description="Invites, payouts, tiers."
            status={<Badge tone="success">Live</Badge>}
            style={{
              minHeight: 0,
            }}
          />
        </Stagger>
      </Phone>
      <Phone d={240} tab={2}>
        <div
          className="tf-header-title"
          style={{
            fontSize: 24,
          }}
        >
          Inbox
        </div>
        <SearchField
          placeholder="Search messages"
          style={{
            minWidth: 0,
          }}
        />
        <Stagger className="tf-list" delay={350}>
          <ListRow
            avatar="Jonah Petit"
            title="Jonah Petit"
            subtitle="Move the review to Thursday?"
            meta="09:12"
            unread
          />
          <ListRow
            avatar="Northwind"
            title="Northwind"
            subtitle="Seat upgrade before renewal"
            meta="08:40"
            unread
          />
          <ListRow
            icon="bell"
            tint="butter"
            title="Billing"
            subtitle="Card ending 4417 expires"
            meta="Yest."
          />
          <ListRow avatar="Sun Lee" title="Sun Lee" subtitle="Payout file attached" meta="Yest." />
          <ListRow
            icon="flag"
            tint="blush"
            title="Incident #88"
            subtitle="Webhooks delayed in EU"
            meta="Sun"
          />
        </Stagger>
      </Phone>
    </div>
  );
}
export default function Preview() {
  return <App />;
}
