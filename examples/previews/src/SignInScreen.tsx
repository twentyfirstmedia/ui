import * as React from "react";
import {
  AvatarStack,
  Badge,
  Button,
  Checkbox,
  EventCard,
  Input,
  Progress,
  Stagger,
  StatTile,
} from "@twentyfirstmedia/ui-core";

function App() {
  return (
    <div
      className="tf-shell"
      style={{
        padding: 8,
      }}
    >
      <div
        className="tf-grid"
        style={
          {
            "--cols": "1fr 1.1fr",
            gap: 8,
            minHeight: 760,
          } as React.CSSProperties
        }
      >
        <div
          className="tf-sheet"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(20px, 6vw, 48px)",
            gridTemplateColumns: "none",
          }}
        >
          <span
            className="tf-brand tf-in"
            style={{
              color: "var(--ink)",
              fontSize: 20,
            }}
          >
            Halo
            <span className="tf-brand-dot" />
          </span>
          <div
            className="tf-col"
            style={{
              gap: 18,
              maxWidth: 380,
              alignSelf: "center",
              width: "100%",
            }}
          >
            <div
              className="tf-in"
              style={
                {
                  "--d": "80ms",
                } as React.CSSProperties
              }
            >
              <h1
                className="tf-header-title"
                style={{
                  fontSize: 34,
                  lineHeight: "40px",
                }}
              >
                Welcome back
              </h1>
              <p
                className="tf-header-sub"
                style={{
                  fontSize: 14,
                }}
              >
                Sign in to pick up where your team left off.
              </p>
            </div>
            <Stagger
              className="tf-col"
              style={{
                gap: 16,
              }}
              delay={160}
            >
              <Button variant="secondary" icon="globe">
                Continue with Google
              </Button>
              <div
                className="tf-row"
                style={{
                  gap: 12,
                  color: "var(--ink-muted)",
                  fontSize: 12,
                  fontWeight: "var(--type-label-weight)",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    height: 1,
                    background: "var(--line)",
                  }}
                />
                or with email
                <span
                  style={{
                    flex: 1,
                    height: 1,
                    background: "var(--line)",
                  }}
                />
              </div>
              <Input label="Work email" placeholder="you@company.com" />
              <Input label="Password" type="password" placeholder="••••••••••" />
              <div
                className="tf-row"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <Checkbox defaultChecked>Keep me signed in</Checkbox>
                <a
                  href="#"
                  style={{
                    font: "var(--type-label-weight) 12px var(--font-sans)",
                    color: "var(--ink)",
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <Button iconRight="arrowUpRight">Sign in</Button>
            </Stagger>
          </div>
          <span
            className="tf-card-desc tf-in"
            style={
              {
                "--d": "500ms",
              } as React.CSSProperties
            }
          >
            {"New to Halo? "}
            <a
              href="#"
              style={{
                color: "var(--ink)",
                fontWeight: "var(--type-title-weight)",
              }}
            >
              Create a workspace
            </a>
          </span>
        </div>
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            padding: "clamp(20px, 5vw, 40px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          <Stagger
            className="tf-grid"
            style={
              {
                "--cols": "1fr 1fr",
                "--cols-sm": "1fr 1fr",
                gap: 16,
                marginBottom: "auto",
              } as React.CSSProperties
            }
            delay={200}
          >
            <StatTile tint="sky" value="1,284" label="Members this month" />
            <StatTile tint="butter" value="$48,210" label="Collected" />
            <div
              className="tf-card tf-bg-lilac"
              style={{
                gridColumn: "span 2",
                minHeight: 0,
              }}
            >
              <span
                className="tf-card-title"
                style={{
                  padding: 0,
                }}
              >
                Pricing page refresh
              </span>
              <Progress value={64} label="Progress" />
              <div
                className="tf-row"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <Badge tone="success" live>
                  On track
                </Badge>
                <AvatarStack names={["Mara Ellis", "Jonah Petit", "Sun Lee"]} size={26} />
              </div>
            </div>
            <EventCard kind="meeting" label="Team sync" date="Tue" time="10:30" actions={false}>
              Roadmap check-in.
            </EventCard>
            <EventCard kind="launch" label="Launch" date="Fri" time="17:00" actions={false}>
              Annual plans go live.
            </EventCard>
          </Stagger>
          <div
            className="tf-in"
            style={
              {
                "--d": "700ms",
                color: "var(--on-frame)",
              } as React.CSSProperties
            }
          >
            <div
              style={{
                font: "var(--type-title-weight) 26px/32px var(--font-sans)",
                letterSpacing: "-0.015em",
              }}
            >
              Every decision your team is waiting on, in one calm place.
            </div>
            <div
              style={{
                color: "var(--on-frame-muted)",
                marginTop: 8,
                fontSize: 13,
              }}
            >
              Projects, people, billing and schedule — side by side.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function Preview() {
  return <App />;
}
