import { Button, Icon, InputGroup } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={{ "--cols": "1fr 1fr", gap: 16, alignItems: "start" } as React.CSSProperties}
    >
      <InputGroup label="Website" start="https://" placeholder="acme.com" hint="Without www" />
      <InputGroup label="Email alias" end="@acme.com" placeholder="sales" />
      <InputGroup
        label="Monthly budget"
        start="€"
        end="per month"
        inputMode="decimal"
        defaultValue="250"
      />
      <InputGroup
        label="Search people"
        start={<Icon name="search" size={15} />}
        placeholder="Name or email"
      />
      <InputGroup
        label="Weight"
        inputMode="decimal"
        defaultValue="12.5"
        end={
          <select className="tf-input" aria-label="Unit" defaultValue="kg">
            <option>kg</option>
            <option>lb</option>
          </select>
        }
      />
      <InputGroup
        label="API key"
        defaultValue="sk_live_51H8…2xQ"
        readOnly
        end={
          <Button size="sm" variant="ghost" icon="copy">
            Copy
          </Button>
        }
      />
    </div>
  );
}
