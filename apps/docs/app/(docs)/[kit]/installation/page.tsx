import { CodeBlock } from "@twentyfirstmedia/ui-core";
import { Code, PageHead } from "@/components/docs";
import type { KitName } from "@/lib/site";

export const metadata = { title: "Installation" };

export default async function Installation({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  return (
    <>
      <PageHead
        title="Installation"
        lead="The packages are private and live in GitHub Packages. One kit is the normal case."
      />
      <div className="docs-prose">
        <h2>1. Registry and token</h2>
        <p>
          Point the <Code>@twentyfirstmedia</Code> scope at GitHub Packages in your app&apos;s{" "}
          <Code>.npmrc</Code> and keep a token with <Code>read:packages</Code> in the environment as{" "}
          <Code>NPM_TOKEN</Code>.
        </p>
      </div>
      <CodeBlock
        lang="ini"
        code={`@twentyfirstmedia:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=\${NPM_TOKEN}`}
      />
      <div className="docs-prose">
        <h2>2. The kit</h2>
        <p>Install it with the CLI (it also sets up styles and the provider) or by hand:</p>
      </div>
      <CodeBlock
        lang="sh"
        code={`pnpm dlx @twentyfirstmedia/ui init --kit ${kit} --locale de-DE\n# or\npnpm add @twentyfirstmedia/${kit}`}
      />
      <div className="docs-prose">
        <h2>3. Styles and provider</h2>
        <p>
          Import <Code>styles.css</Code> once. It brings the self-hosted fonts, the tokens (light,
          dark, density) and every component style; no <Code>data-kit</Code> attribute is needed.
        </p>
      </div>
      <CodeBlock
        lang="tsx"
        code={`import "@twentyfirstmedia/${kit}/styles.css";
import de from "@twentyfirstmedia/ui-core/labels/de.json";
import { UIProvider, Button } from "@twentyfirstmedia/${kit}";

export function App() {
  return (
    <UIProvider locale="de-DE" labels={de} theme="system">
      <Button variant="primary">Speichern</Button>
    </UIProvider>
  );
}`}
      />
      <div className="docs-prose">
        <h2>Tailwind v4</h2>
        <p>
          The kit ships a preset that maps every token to Tailwind and clears the default palette,
          so utilities can only use kit values.
        </p>
      </div>
      <CodeBlock
        lang="css"
        code={`@import "tailwindcss";\n@import "@twentyfirstmedia/${kit}/tailwind.css";`}
      />
      <div className="docs-prose">
        <h2>Both kits in one app</h2>
        <p>
          Import <Code>@twentyfirstmedia/ui-core/themes.css</Code> instead (both kits, scoped under{" "}
          <Code>[data-kit=&quot;…&quot;]</Code>) and switch with{" "}
          <Code>&lt;UIProvider kit=&quot;pro&quot;&gt;</Code> or the attribute on{" "}
          <Code>&lt;html&gt;</Code>. Markup, props and state stay as they are.
        </p>
      </div>
    </>
  );
}
