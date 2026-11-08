import { CodeBlock } from "@twentyfirstmedia/ui-core";
import { Code, PageHead } from "@/components/docs";
import { ExampleView } from "@/components/example-view";
import { examples } from "@/lib/site";

export const metadata = { title: "Text and locale" };

export default function TextAndLocale() {
  const ex = examples.find((e) => e.name === "ApprovalCard");
  return (
    <>
      <PageHead
        title="Text and locale"
        lead="The kits ship no fixed copy. Every visible string, aria-label and placeholder goes through L(); numbers, money and dates go through Intl."
      />
      <div className="docs-prose">
        <p>
          Labels are keyed by their built-in English text, with <Code>{"{placeholders}"}</Code>.
          Pass your own map to <Code>UIProvider</Code> (or call <Code>setLabels</Code>); a complete
          German set ships as <Code>@twentyfirstmedia/ui-core/labels/de.json</Code>, the full key
          list as <Code>labels/en.json</Code>. Main texts are also props (<Code>title</Code>,{" "}
          <Code>placeholder</Code>, <Code>approveLabel</Code> …), and props win.
        </p>
        <p>
          The locale drives <Code>formatNumber</Code>, <Code>formatMoney</Code>,{" "}
          <Code>formatDate</Code>, calendar month and weekday names and the parsing in{" "}
          <Code>MoneyInput</Code>. Switch EN/DE in the header to see this page&apos;s example
          change.
        </p>
      </div>
      <CodeBlock
        lang="tsx"
        code={`import de from "@twentyfirstmedia/ui-core/labels/de.json";

<UIProvider locale="de-DE" currency="EUR" weekStart={1} labels={de}>
  <App />
</UIProvider>

L("Remove {name}", { name: "Mara" });   // "Mara entfernen"
formatMoney(1240.5);                    // "1.240,50 €"`}
      />
      {ex && <ExampleView name={ex.name} code={ex.code} />}
    </>
  );
}
