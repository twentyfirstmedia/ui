import { CodeBlock } from "@twentyfirstmedia/ui-core";
import { Code, PageHead } from "@/components/docs";

export const metadata = { title: "CLI" };

export default function Cli() {
  return (
    <>
      <PageHead
        title="CLI"
        lead="npx @twentyfirstmedia/ui sets up a kit and copies components into your app when you want to change them."
      />
      <div className="docs-prose">
        <h2>init</h2>
        <p>
          Adds the registry to <Code>.npmrc</Code>, installs the kit, imports its styles (and the
          Tailwind preset when the app uses Tailwind), creates <Code>components/ui-root.tsx</Code>{" "}
          with the <Code>UIProvider</Code>, wraps the Next.js layout and sets <Code>data-kit</Code>{" "}
          on <Code>&lt;html&gt;</Code>. Running it again changes nothing.
        </p>
      </div>
      <CodeBlock
        lang="sh"
        code={`npx @twentyfirstmedia/ui init --kit halo --locale de-DE\nnpx @twentyfirstmedia/ui init --kit pro --both   # load both kits and switch at runtime`}
      />
      <div className="docs-prose">
        <h2>add</h2>
        <p>
          Copies a component, with the private helpers it needs, into <Code>components/ui</Code>.
          Everything public stays an import from <Code>@twentyfirstmedia/ui-core</Code>, so the copy
          keeps working in both kits.
        </p>
      </div>
      <CodeBlock lang="sh" code={`npx @twentyfirstmedia/ui add ApprovalCard DataTable`} />
      <div className="docs-prose">
        <h2>list and diff</h2>
        <p>
          <Code>list</Code> shows every component by group and marks the ones you copied.{" "}
          <Code>diff</Code> compares your copy with the current package source, so updates are easy
          to merge by hand.
        </p>
      </div>
      <CodeBlock
        lang="sh"
        code={`npx @twentyfirstmedia/ui list\nnpx @twentyfirstmedia/ui diff ApprovalCard`}
      />
    </>
  );
}
