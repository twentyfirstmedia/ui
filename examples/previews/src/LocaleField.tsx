import { LocaleField, LocaleSwitcher, WorkspaceSwitcher } from "@twentyfirstmedia/ui-core";

const langs = [
  {
    code: "de",
    label: "Deutsch",
    short: "de",
    flag: "🇩🇪",
  },
  {
    code: "en",
    label: "English",
    short: "en",
    flag: "🇬🇧",
  },
  {
    code: "fr",
    label: "Français",
    short: "fr",
    flag: "🇫🇷",
  },
];
export default function Preview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.3fr 1fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      <div
        className="tf-panel"
        style={{
          gap: 20,
        }}
      >
        <LocaleField
          label="Product name"
          locales={[
            {
              code: "de",
              label: "DE",
            },
            {
              code: "en",
              label: "EN",
            },
            {
              code: "fr",
              label: "FR",
            },
            {
              code: "es",
              label: "ES",
            },
          ]}
          defaultValue={{
            de: "Instagram Follower kaufen",
            en: "Buy Instagram followers",
          }}
          onTranslate={(t, to) => "[" + to + "] " + t}
        />
        <LocaleField
          label="Short description"
          multiline
          active="en"
          locales={[
            {
              code: "de",
              label: "DE",
            },
            {
              code: "en",
              label: "EN",
            },
          ]}
          defaultValue={{
            de: "Echte Follower, Lieferung in einer Stunde.",
          }}
        />
      </div>
      <div
        className="tf-panel"
        style={{
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <WorkspaceSwitcher
          label="Shops"
          items={[
            {
              id: "fp",
              name: "Northwind",
              sub: "northwind.de",
              tint: "sky",
            },
            {
              id: "fm",
              name: "FollowerMarket",
              sub: "followermarket.com",
              tint: "mint",
            },
            {
              id: "fr",
              name: "FollowerRocket",
              sub: "followerrocket.de",
              tint: "butter",
            },
          ]}
        />
        <LocaleSwitcher languages={langs} currencies={["EUR", "CHF", "USD"]} />
      </div>
    </div>
  );
}
