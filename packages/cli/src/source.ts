/**
 * Reads component sources from the installed @twentyfirstmedia/ui-core package and builds a
 * standalone copy of one component: the component itself plus the private helpers it needs,
 * with every import pointing at the public package.
 */
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { SCOPE } from "./util.js";

export interface Block {
  names: string[];
  text: string;
}

export interface SourceFile {
  name: string;
  client: boolean;
  blocks: Block[];
  /** imported name → module specifier */
  imports: Map<string, { from: string; type: boolean }>;
}

export interface CoreSource {
  dir: string;
  version: string;
  files: Map<string, SourceFile>;
  /** names exported by the package entry */
  publicNames: Set<string>;
  /** component name → file name (without extension) */
  components: Map<string, string>;
}

const DECL =
  /^(?:export\s+)?(?:declare\s+)?(?:async\s+)?(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)|interface\s+(\w+)|type\s+(\w+))/;

export function parseFile(name: string, text: string): SourceFile {
  const lines = text.split("\n");
  const imports = new Map<string, { from: string; type: boolean }>();
  const blocks: Block[] = [];
  let client = false;
  let pendingComment: string[] = [];
  let cur: Block | null = null;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] as string;
    if (/^"use client";/.test(line)) {
      client = true;
      i++;
      continue;
    }
    if (/^import /.test(line)) {
      let stmt = line;
      while (!/;\s*$/.test(stmt) && i + 1 < lines.length) stmt += "\n" + lines[++i];
      const from = /from\s+"([^"]+)"/.exec(stmt)?.[1] ?? "";
      const type = /^import\s+type\b/.test(stmt);
      const ns = /^import \* as (\w+)/.exec(stmt);
      if (ns) imports.set(ns[1] as string, { from, type: false });
      const named = /\{([^}]*)\}/.exec(stmt);
      if (named)
        for (const raw of (named[1] as string).split(",")) {
          const n = raw.trim().replace(/^type\s+/, "");
          if (n)
            imports.set(n.split(/\s+as\s+/).pop() as string, {
              from,
              type: type || /^\s*type\s/.test(raw),
            });
        }
      i++;
      continue;
    }
    if (/^(\/\*|\/\/| \*)/.test(line) && (!cur || /^(\/\*|\/\/)/.test(line))) {
      // a comment at column 0 belongs to the next declaration
      pendingComment.push(line);
      i++;
      while (
        pendingComment[pendingComment.length - 1]?.startsWith("/*") &&
        !/\*\/\s*$/.test(pendingComment[pendingComment.length - 1] as string) &&
        i < lines.length
      ) {
        const last = pendingComment.pop() as string;
        pendingComment.push(last + "\n" + lines[i++]);
      }
      continue;
    }
    const m = DECL.exec(line);
    if (m) {
      cur = {
        names: [m[1] || m[2] || m[3] || m[4]].filter(Boolean) as string[],
        text: [...pendingComment, line].join("\n"),
      };
      pendingComment = [];
      blocks.push(cur);
    } else if (cur && line.trim() !== "") {
      // continuation of the current declaration, or a statement such as `X.kinds = …` after it
      if (/^\w+\.\w+\s*=/.test(line) && pendingComment.length === 0) cur.text += "\n\n" + line;
      else cur.text += "\n" + line;
    } else if (cur && line.trim() === "") {
      cur.text += "\n";
    }
    i++;
  }
  for (const b of blocks) b.text = b.text.replace(/\n+$/, "");
  return { name, client, blocks, imports };
}

export function loadCore(cwd: string): CoreSource {
  const req = createRequire(join(cwd, "package.json"));
  let pkgJson: string;
  try {
    pkgJson = req.resolve(`${SCOPE}/ui-core/package.json`);
  } catch {
    throw new Error(
      `${SCOPE}/ui-core is not installed here. Run \`twentyfirst-ui init\` first (it installs the kit, which brings ui-core).`,
    );
  }
  const dir = dirname(pkgJson);
  const version = (JSON.parse(readFileSync(pkgJson, "utf8")) as { version: string }).version;
  const compDir = join(dir, "src", "components");
  const files = new Map<string, SourceFile>();
  for (const f of readdirSync(compDir).filter((x) => x.endsWith(".tsx") && !x.includes(".test."))) {
    files.set(f.replace(/\.tsx$/, ""), parseFile(f, readFileSync(join(compDir, f), "utf8")));
  }
  const index = readFileSync(join(compDir, "index.ts"), "utf8");
  const components = new Map<string, string>();
  for (const m of index.matchAll(/export \{([^}]*)\} from "\.\/([\w-]+)\.js";/g)) {
    for (const n of (m[1] as string)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean))
      components.set(n, m[2] as string);
  }
  const rootIndex = readFileSync(join(dir, "src", "index.ts"), "utf8");
  const publicNames = new Set<string>(components.keys());
  for (const m of rootIndex.matchAll(/export \{([^}]*)\}/g))
    for (const raw of (m[1] as string).split(",")) {
      const n = raw.trim().replace(/^type\s+/, "");
      if (n) publicNames.add(n);
    }
  const types = readFileSync(join(compDir, "types.ts"), "utf8");
  for (const m of types.matchAll(/export (?:interface|type) (\w+)/g))
    publicNames.add(m[1] as string);
  publicNames.add("IconName");
  publicNames.add("ToastOptions");
  return { dir, version, files, publicNames, components };
}

/** Identifiers a piece of code refers to (strings and comments stripped). */
export function identifiers(code: string): Set<string> {
  const stripped = code
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/.*$/gm, " ")
    .replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, '""');
  return new Set(stripped.match(/[A-Za-z_$][\w$]*/g) ?? []);
}

export interface Copy {
  name: string;
  file: string;
  content: string;
}

/** Builds the standalone source of one component. */
export function buildCopy(core: CoreSource, component: string): Copy {
  const file = core.components.get(component);
  if (!file)
    throw new Error(`Unknown component "${component}". Run \`twentyfirst-ui list\` to see all.`);
  const included: { file: string; block: Block }[] = [];
  const seen = new Set<string>();
  const valueImports = new Set<string>();
  const typeImports = new Set<string>();
  let client = false;
  let react = false;

  const findBlock = (f: string, name: string) =>
    core.files.get(f)?.blocks.find((b) => b.names.includes(name));

  function include(f: string, name: string): void {
    const key = `${f}:${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    const src = core.files.get(f);
    const block = findBlock(f, name);
    if (!src || !block) return;
    if (src.client) client = true;
    included.push({ file: f, block });
    for (const id of identifiers(block.text)) {
      if (block.names.includes(id)) continue;
      if (id === "React" && src.imports.get("React")) {
        react = true;
        continue;
      }
      const local = findBlock(f, id);
      if (local) {
        // another declaration of the same file: copy private helpers, import public ones
        if (core.publicNames.has(id) && id !== component) valueImports.add(id);
        else include(f, id);
        continue;
      }
      const imp = src.imports.get(id);
      if (!imp) continue;
      if (imp.from.startsWith("./") && !imp.from.startsWith("./types")) {
        const other = imp.from.replace(/^\.\//, "").replace(/\.js$/, "");
        if (core.publicNames.has(id)) (imp.type ? typeImports : valueImports).add(id);
        else include(other, id);
      } else if (imp.from.startsWith(".")) {
        (imp.type ? typeImports : valueImports).add(id);
      }
    }
  }
  include(file, component);
  // keep the original order of the source files, the component last
  const order = [...core.files.keys()];
  included.sort((a, b) => {
    if (a.block.names.includes(component)) return 1;
    if (b.block.names.includes(component)) return -1;
    if (a.file !== b.file) return order.indexOf(a.file) - order.indexOf(b.file);
    const blocks = core.files.get(a.file)?.blocks ?? [];
    return blocks.indexOf(a.block) - blocks.indexOf(b.block);
  });
  for (const n of included.flatMap((x) => x.block.names)) {
    valueImports.delete(n);
    typeImports.delete(n);
  }
  for (const n of valueImports) typeImports.delete(n);
  const lines: string[] = [];
  if (client) lines.push('"use client";');
  lines.push(
    `/* ${component}: copied from ${SCOPE}/ui-core ${core.version} by \`twentyfirst-ui add\`. Edit freely; */`,
    `/* \`twentyfirst-ui diff ${component}\` shows what changed upstream since. */`,
  );
  if (react) lines.push('import * as React from "react";');
  if (valueImports.size)
    lines.push(`import { ${[...valueImports].sort().join(", ")} } from "${SCOPE}/ui-core";`);
  if (typeImports.size)
    lines.push(`import type { ${[...typeImports].sort().join(", ")} } from "${SCOPE}/ui-core";`);
  lines.push("", "");
  const body = included
    .map(({ block }) => {
      // private helpers stay module-private in the copy; the component stays exported
      const isComponent = block.names.includes(component);
      return isComponent || /^export /m.test(block.text) === false
        ? block.text
        : block.text.replace(/^export /m, "");
    })
    .join("\n\n");
  return { name: component, file: file, content: lines.join("\n") + body + "\n" };
}
