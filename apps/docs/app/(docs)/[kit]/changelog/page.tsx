import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Markdown, PageHead } from "@/components/docs";

export const metadata = { title: "Changelog" };

export default function Changelog() {
  const file = join(process.cwd(), "../../packages/core/CHANGELOG.md");
  const text = existsSync(file)
    ? readFileSync(file, "utf8").replace(/^# .*\n+/, "")
    : "No release yet. The first release is 0.1.0; every later change is described with a changeset and listed here.";
  return (
    <>
      <PageHead title="Changelog" lead="All four packages are versioned together." />
      <Markdown text={text} />
    </>
  );
}
