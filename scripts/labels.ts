/**
 * Label extractor: collects every key passed to L(), Lx() and LK() in packages/core/src and writes
 * packages/core/labels/en.json (key = built-in English text). Conditional arguments
 * (`L(a ? "x" : "y")`) contribute both branches.
 *
 *   node scripts/labels.ts          write en.json
 *   node scripts/labels.ts --check  exit 1 when en.json is out of date
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { ROOT } from "./tokens.ts";

const SRC = join(ROOT, "packages", "core", "src");
export const EN = join(ROOT, "packages", "core", "labels", "en.json");
export const DE = join(ROOT, "packages", "core", "labels", "de.json");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return files(p);
    return /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f) && !f.endsWith(".d.ts") ? [p] : [];
  });
}

function literals(node: ts.Node, out: Set<string>): void {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) out.add(node.text);
  else if (ts.isConditionalExpression(node)) {
    literals(node.whenTrue, out);
    literals(node.whenFalse, out);
  } else if (ts.isParenthesizedExpression(node)) literals(node.expression, out);
  else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.BarBarToken) {
    literals(node.left, out);
    literals(node.right, out);
  }
}

export function extract(): string[] {
  const keys = new Set<string>();
  for (const f of files(SRC)) {
    const sf = ts.createSourceFile(
      f,
      readFileSync(f, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const visit = (n: ts.Node): void => {
      if (
        ts.isCallExpression(n) &&
        ts.isIdentifier(n.expression) &&
        /^(L|Lx|LK)$/.test(n.expression.text)
      ) {
        const arg = n.arguments[0];
        if (arg) literals(arg, keys);
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return [...keys].sort((a, b) => a.localeCompare(b, "en"));
}

export function enJson(): string {
  const keys = extract();
  return JSON.stringify(Object.fromEntries(keys.map((k) => [k, k])), null, 2) + "\n";
}

export function placeholders(s: string): string[] {
  return [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1] as string).sort();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const next = enJson();
  if (process.argv.includes("--check")) {
    if (!existsSync(EN) || readFileSync(EN, "utf8") !== next) {
      console.error("labels/en.json is out of date (run `pnpm labels`).");
      process.exit(1);
    }
  } else {
    writeFileSync(EN, next);
    console.log(
      `wrote ${Object.keys(JSON.parse(next)).length} keys to packages/core/labels/en.json`,
    );
  }
}
