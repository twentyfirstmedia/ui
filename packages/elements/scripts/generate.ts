/**
 * Generates the element registry from ui-core's own sources, so every new component gets a custom
 * element without anyone writing one:
 *
 *   node scripts/generate.ts
 *
 * - src/generated/registry.ts             tag, component and compact prop/event metadata per element
 * - src/generated/elements.d.ts           types for dist/elements.js (HTMLElementTagNameMap)
 * - src/generated/custom-elements.json    Custom Elements Manifest (IDE autocompletion)
 * - src/generated/vscode.html-custom-data.json   VS Code HTML custom data
 *
 * Components are the exports of packages/core/src/components/index.ts (plus UIProvider and Icon);
 * props come from the `<Name>Props` interfaces in types.ts (heritage resolved), and the component
 * bodies tell which callbacks change what is rendered (`p.onDismiss && <button …>`): those are only
 * passed to the component while someone listens for the event.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { ROOT, readExports, readReadmes } from "../../../scripts/knowledge.ts";
import { summaryOf } from "../../cli/src/knowledge.ts";

const HERE = join(dirname(fileURLToPath(import.meta.url)), "..");
const CORE = join(ROOT, "packages/core/src");
const OUT = join(HERE, "src/generated");

/** Components that are not in components/index.ts but are part of the public API. */
const EXTRA: { name: string; file: string }[] = [
  { name: "UIProvider", file: "provider.tsx" },
  { name: "Icon", file: "Icon.tsx" },
];
/** Tag names that do not follow from the component name. */
const TAG_OVERRIDES: Record<string, string> = {
  UIProvider: "tf-provider",
  PnLStatement: "tf-pnl-statement",
};
/** Shown as a dialog: fixed over the page, focus trapped, Escape and the backdrop close it. */
const DIALOGS = new Set(["Modal"]);
/** Overlays that can always be closed (close button, Escape), with or without a listener. */
const OVERLAYS = new Set(["Modal", "Drawer", "CommandPalette", "AttachmentPreview"]);
/** `onClose` asks the owner to close something else (a popover), it does not dismiss the element. */
const NO_DISMISS = new Set(["Menu"]);
/** Attributes the element keeps for itself: never mapped to a prop of the same name. */
const RESERVED = new Set(["id", "slot", "hidden", "children", "className", "style"]);

export function kebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}
export const tagOf = (name: string): string => TAG_OVERRIDES[name] ?? `tf-${kebab(name)}`;

// ── sources ──
const parse = (file: string) =>
  ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

const typesFile = parse(join(CORE, "components/types.ts"));
const decls = new Map<string, ts.InterfaceDeclaration | ts.TypeAliasDeclaration>();
function collect(sf: ts.SourceFile, override: boolean) {
  sf.forEachChild((n) => {
    if (
      (ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) &&
      (override || !decls.has(n.name.text))
    )
      decls.set(n.name.text, n);
  });
}
collect(typesFile, true);
collect(parse(join(CORE, "toast-store.ts")), false);
collect(parse(join(CORE, "provider.tsx")), false);
// Icon.tsx declares the IconProps the Icon component takes
collect(parse(join(CORE, "Icon.tsx")), true);

const docOf = (n: ts.Node) =>
  ts
    .getJSDocCommentsAndTags(n)
    .map((d) => (typeof d.comment === "string" ? d.comment : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

interface RawProp {
  name: string;
  type: ts.TypeNode | undefined;
  text: string;
  optional: boolean;
  doc: string;
}

/** Members of an interface, with `extends A, Omit<B, "x">` resolved. */
function members(name: string, seen = new Set<string>()): RawProp[] {
  const d = decls.get(name);
  if (!d || seen.has(name)) return [];
  seen.add(name);
  const sf = d.getSourceFile();
  const out: RawProp[] = [];
  const add = (list: ts.NodeArray<ts.TypeElement>) => {
    for (const m of list)
      if (ts.isPropertySignature(m) && m.name)
        out.push({
          name: m.name.getText(sf).replace(/^"|"$/g, ""),
          type: m.type,
          text: m.type ? m.type.getText(sf).replace(/\s+/g, " ") : "unknown",
          optional: !!m.questionToken,
          doc: docOf(m),
        });
  };
  if (ts.isInterfaceDeclaration(d)) {
    add(d.members);
    for (const h of d.heritageClauses ?? [])
      for (const t of h.types) {
        const base = t.expression.getText(sf);
        if (base === "Omit" && t.typeArguments?.[0]) {
          const inner = t.typeArguments[0].getText(sf);
          const drop = new Set(
            (t.typeArguments[1]?.getText(sf) ?? "").match(/"[^"]+"/g)?.map((s) => s.slice(1, -1)),
          );
          out.push(...members(inner, seen).filter((m) => !drop.has(m.name)));
        } else out.push(...members(base, seen));
      }
  } else if (ts.isTypeLiteralNode(d.type)) add(d.type.members);
  const unique = new Map<string, RawProp>();
  for (const m of out) if (!unique.has(m.name)) unique.set(m.name, m);
  return [...unique.values()];
}

// ── classifying prop types ──
type Tag =
  | "S" // string or string literal
  | "N" // number
  | "B" // boolean
  | "F" // the literal false
  | "NUL" // null / undefined
  | "R" // ReactNode
  | "RA" // ReactNode[]
  | "RR" // Record<string, ReactNode>
  | "FN" // function
  | "D" // Date
  | "A" // array
  | "AS" // array with string items
  | "O"; // object

function classify(t: ts.TypeNode | undefined, seen = new Set<string>()): Set<Tag> {
  const out = new Set<Tag>();
  const add = (...xs: Tag[]) => xs.forEach((x) => out.add(x));
  const merge = (s: Set<Tag>) => s.forEach((x) => out.add(x));
  if (!t) return new Set<Tag>(["O"]);
  if (ts.isUnionTypeNode(t)) t.types.forEach((x) => merge(classify(x, seen)));
  else if (ts.isParenthesizedTypeNode(t)) merge(classify(t.type, seen));
  else if (ts.isLiteralTypeNode(t)) {
    const l = t.literal;
    if (ts.isStringLiteral(l)) add("S");
    else if (ts.isNumericLiteral(l)) add("N");
    else if (l.kind === ts.SyntaxKind.FalseKeyword) add("B", "F");
    else if (l.kind === ts.SyntaxKind.TrueKeyword) add("B");
    else if (l.kind === ts.SyntaxKind.NullKeyword) add("NUL");
    else add("O");
  } else if (t.kind === ts.SyntaxKind.StringKeyword) add("S");
  else if (t.kind === ts.SyntaxKind.NumberKeyword) add("N");
  else if (t.kind === ts.SyntaxKind.BooleanKeyword) add("B");
  else if (t.kind === ts.SyntaxKind.UndefinedKeyword || t.kind === ts.SyntaxKind.NullKeyword)
    add("NUL");
  else if (ts.isFunctionTypeNode(t)) add("FN");
  else if (ts.isArrayTypeNode(t)) {
    const el = classify(t.elementType, seen);
    if (el.has("R") && el.size === 1) add("RA");
    else add(el.has("S") ? "AS" : "A");
  } else if (ts.isTupleTypeNode(t)) add("A");
  else if (ts.isTypeLiteralNode(t)) add("O");
  else if (ts.isIndexedAccessTypeNode(t)) {
    // MenuProps["items"], MapPoint["id"]
    const obj = t.objectType.getText();
    const key = t.indexType.getText().replace(/^"|"$/g, "");
    const m = members(obj).find((x) => x.name === key);
    merge(m ? classify(m.type, seen) : new Set<Tag>(["O"]));
  } else if (ts.isTypeReferenceNode(t)) {
    const name = t.typeName.getText();
    const args = t.typeArguments ?? [];
    if (name === "ReactNode") add("R");
    else if (name === "Date") add("D");
    else if (name === "IconName") add("S");
    else if (name === "Record") add(args[1] && args[1].getText() === "ReactNode" ? "RR" : "O");
    else if (name === "Exclude" || name === "NonNullable" || name === "Extract")
      merge(args[0] ? classify(args[0], seen) : new Set<Tag>(["O"]));
    else if (name === "Array") add("A");
    else {
      const d = decls.get(name);
      if (d && ts.isTypeAliasDeclaration(d) && !seen.has(name)) {
        seen.add(name);
        merge(classify(d.type, seen));
      } else add("O");
    }
  } else add("O");
  return out;
}

/**
 * Prop kinds, as one letter in the registry:
 * b boolean · n number · s string · x number or string · r node (slot) · R node list (slot) ·
 * K record of nodes (`slot="prop:key"`) · d date · j JSON · f function (property only)
 * Flags: `?` "null" means null · `!` "false" means false · `l` JSON or a comma-separated list ·
 * `t` ISO dates become Date objects (added where the type mentions Date)
 */
function kindOf(tags: Set<Tag>): string {
  const has = (t: Tag) => tags.has(t);
  const only = (...allowed: Tag[]) => [...tags].every((t) => allowed.includes(t));
  if (has("R") || (has("FN") && has("RA"))) return "r";
  if (has("RA") && only("RA", "NUL")) return "R";
  if (has("RR") && only("RR", "NUL")) return "K";
  if (has("FN") && only("FN", "NUL", "F", "B")) return "f";
  if (has("D") && only("D", "NUL")) return "d";
  if (only("B", "F", "NUL") && has("B")) return "b";
  if (has("N") && only("N", "NUL")) return "n" + (has("NUL") ? "?" : "");
  if (has("S") && only("S", "F", "NUL", "B") && !(has("B") && !has("F")))
    return "s" + (has("F") ? "!" : "") + (has("NUL") ? "?" : "");
  if (has("S") && has("N") && only("S", "N", "NUL")) return "x" + (has("NUL") ? "?" : "");
  if (has("AS") && only("AS", "NUL")) return "jl";
  return "j";
}

// ── which callbacks decide what is rendered ──
/** Callback props the component reads as a condition (`p.onX && …`, `p.onX ? …`, `!p.onX`). */
function conditionalCallbacks(fn: Found["fn"]): Set<string> {
  const out = new Set<string>();
  const param = fn.parameters[0];
  if (!param || !fn.body) return out;
  const names = new Set<string>();
  let obj: string | undefined;
  if (ts.isIdentifier(param.name)) obj = param.name.text;
  else if (ts.isObjectBindingPattern(param.name))
    for (const el of param.name.elements)
      if (ts.isIdentifier(el.name)) names.add((el.propertyName ?? el.name).getText());
  const propName = (n: ts.Node): string | undefined => {
    if (
      obj &&
      ts.isPropertyAccessExpression(n) &&
      ts.isIdentifier(n.expression) &&
      n.expression.text === obj
    )
      return n.name.text;
    if (!obj && ts.isIdentifier(n) && names.has(n.text)) return n.text;
    return undefined;
  };
  const visit = (n: ts.Node) => {
    const name = propName(n);
    if (name && /^on[A-Z]/.test(name)) {
      const parent = n.parent;
      const text = n.getText();
      let cond = false;
      if (ts.isBinaryExpression(parent)) {
        const op = parent.operatorToken.kind;
        if (op === ts.SyntaxKind.AmpersandAmpersandToken) {
          const guardedCall =
            parent.left === n &&
            ts.isCallExpression(parent.right) &&
            parent.right.expression.getText() === text;
          cond = !guardedCall;
        } else if (
          op === ts.SyntaxKind.BarBarToken ||
          op === ts.SyntaxKind.EqualsEqualsEqualsToken ||
          op === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
          op === ts.SyntaxKind.EqualsEqualsToken ||
          op === ts.SyntaxKind.ExclamationEqualsToken
        )
          cond = true;
      } else if (ts.isConditionalExpression(parent) && parent.condition === n) cond = true;
      else if (
        ts.isPrefixUnaryExpression(parent) &&
        parent.operator === ts.SyntaxKind.ExclamationToken
      )
        cond = true;
      else if (ts.isIfStatement(parent) && parent.expression === n) cond = true;
      if (cond) out.add(name);
    }
    n.forEachChild(visit);
  };
  fn.body.forEachChild(visit);
  return out;
}

interface Found {
  name: string;
  fn: ts.FunctionDeclaration | ts.ArrowFunction | ts.FunctionExpression;
  sf: ts.SourceFile;
}
function findComponents(): Map<string, Found> {
  const found = new Map<string, Found>();
  const files = [
    ...readdirSync(join(CORE, "components"))
      .filter((f) => f.endsWith(".tsx") && !f.includes(".test."))
      .map((f) => join(CORE, "components", f)),
    ...EXTRA.map((e) => join(CORE, e.file)),
  ];
  for (const file of files) {
    const sf = parse(file);
    sf.forEachChild((n) => {
      if (ts.isFunctionDeclaration(n) && n.name)
        found.set(n.name.text, { name: n.name.text, fn: n, sf });
      if (ts.isVariableStatement(n))
        for (const d of n.declarationList.declarations)
          if (
            ts.isIdentifier(d.name) &&
            d.initializer &&
            (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))
          )
            found.set(d.name.text, { name: d.name.text, fn: d.initializer, sf });
    });
  }
  return found;
}

// ── elements ──
export interface GenProp {
  name: string;
  attr: string;
  kind: string;
  type: string;
  doc: string;
  optional: boolean;
}
export interface GenEvent {
  prop: string;
  event: string;
  arity: number;
  conditional: boolean;
  type: string;
  doc: string;
}
export interface GenElement {
  tag: string;
  name: string;
  propsType: string;
  summary: string;
  props: GenProp[];
  events: GenEvent[];
  sync: [string, string, "detail" | "false"][];
  dismiss: string[];
  dialog: boolean;
  closeChildren: boolean;
  slots: { name: string; prop: string; doc: string }[];
}

/** Every component name the kits export, in index order. */
export function componentNames(): string[] {
  const names = Object.values(readExports())
    .flat()
    .filter((n) => /^[A-Z]/.test(n) && /[a-z]/.test(n));
  return [...EXTRA.map((e) => e.name), ...names];
}

export function buildElements(): GenElement[] {
  const comps = findComponents();
  let readmes: Record<string, string> = {};
  try {
    readmes = readReadmes();
  } catch {
    /* the reference folder is optional */
  }
  return componentNames().map((name) => {
    const c = comps.get(name);
    if (!c) throw new Error(`generate: no source for component ${name}`);
    const param = c.fn.parameters[0];
    let propsType = "{}";
    let raw: RawProp[] = [];
    if (param?.type && ts.isTypeReferenceNode(param.type)) {
      propsType = param.type.getText(c.sf);
      raw = members(param.type.typeName.getText(c.sf));
    } else if (param?.type && ts.isTypeLiteralNode(param.type)) {
      propsType = param.type.getText(c.sf).replace(/\s+/g, " ");
      raw = param.type.members.filter(ts.isPropertySignature).map((m) => ({
        name: m.name.getText(c.sf),
        type: m.type,
        text: m.type ? m.type.getText(c.sf).replace(/\s+/g, " ") : "unknown",
        optional: !!m.questionToken,
        doc: docOf(m),
      }));
    }
    const conditional = conditionalCallbacks(c.fn);
    const props: GenProp[] = [];
    const events: GenEvent[] = [];
    const slots: GenElement["slots"] = [];
    let closeChildren = false;
    for (const m of raw) {
      if (m.name === "style" || m.name === "className") continue;
      const tags = classify(m.type);
      const kind = kindOf(tags);
      if (/^on[A-Z]/.test(m.name) && kind === "f") {
        const fnType =
          m.type && ts.isUnionTypeNode(m.type)
            ? m.type.types
                .map((x) => (ts.isParenthesizedTypeNode(x) ? x.type : x))
                .find(ts.isFunctionTypeNode)
            : m.type && ts.isFunctionTypeNode(m.type)
              ? m.type
              : undefined;
        events.push({
          prop: m.name,
          event: m.name.slice(2).toLowerCase(),
          arity: fnType?.parameters.length ?? 0,
          conditional:
            conditional.has(m.name) &&
            !(OVERLAYS.has(name) && (m.name === "onClose" || m.name === "onDismiss")),
          type: m.text,
          doc: m.doc,
        });
        continue;
      }
      if (m.name === "children") {
        if (/close: \(\) => void/.test(m.text)) closeChildren = true;
        slots.push({
          name: "",
          prop: "children",
          doc: m.doc || "Content (any HTML or tf-* elements).",
        });
        continue;
      }
      if (RESERVED.has(m.name)) continue;
      props.push({
        name: m.name,
        attr: kebab(m.name),
        // `t`: ISO date strings in the attribute become Date objects
        kind: kind !== "d" && /\bDate\b/.test(m.text) ? kind + "t" : kind,
        type: m.text,
        doc: m.doc,
        optional: m.optional,
      });
      if (kind === "r" || kind === "R")
        slots.push({ name: kebab(m.name), prop: m.name, doc: m.doc });
      if (kind === "K") slots.push({ name: `${kebab(m.name)}:<key>`, prop: m.name, doc: m.doc });
    }
    const has = (n: string) => props.some((p) => p.name === n);
    const hasEv = (n: string) => events.some((e) => e.prop === n);
    const sync: GenElement["sync"] = [];
    if (hasEv("onChange")) {
      if (has("checked")) sync.push(["onChange", "checked", "detail"]);
      else if (has("value")) sync.push(["onChange", "value", "detail"]);
      else {
        // onChange(pressed) → pressed
        const first = /^\((\w+)\??:/.exec(
          events.find((e) => e.prop === "onChange")?.type ?? "",
        )?.[1];
        if (first && has(first)) sync.push(["onChange", first, "detail"]);
      }
    }
    for (const e of events) {
      const m = /^on(\w+)Change$/.exec(e.prop);
      const target = m?.[1] && m[1][0]!.toLowerCase() + m[1].slice(1);
      if (target && has(target)) sync.push([e.prop, target, "detail"]);
    }
    if (has("open"))
      for (const e of ["onClose", "onCancel", "onConfirm", "onDismiss"])
        if (hasEv(e)) sync.push([e, "open", "false"]);
    // with an `open` property the close events set it to false (the layer animates out); an
    // element used without `open` hides itself instead
    const dismiss = NO_DISMISS.has(name)
      ? []
      : events.filter((e) => e.prop === "onClose" || e.prop === "onDismiss").map((e) => e.prop);
    return {
      tag: tagOf(name),
      name,
      propsType,
      summary: summaryOf(readmes[name] ?? "") || `The ${name} component as a custom element.`,
      props,
      events,
      sync,
      dismiss,
      dialog: DIALOGS.has(name),
      closeChildren,
      slots,
    };
  });
}

// ── output ──
function registry(els: GenElement[]): string {
  const rows = els.map((e) => {
    const def: Record<string, unknown> = {
      t: e.tag,
      c: e.name,
      p: e.props.map((p) => `${p.name}:${p.kind}`).join(" "),
    };
    if (e.events.length)
      def.e = e.events.map((x) => `${x.prop}:${x.arity}${x.conditional ? "?" : ""}`).join(" ");
    if (e.sync.length) def.s = e.sync.map((s) => s.join(":")).join(" ");
    if (e.dismiss.length) def.x = e.dismiss.join(" ");
    if (e.dialog) def.dialog = 1;
    if (e.closeChildren) def.close = 1;
    return `  ${JSON.stringify(def)},`;
  });
  return `// Generated by scripts/generate.ts from @twentyfirstmedia/ui-core. Do not edit.
import type { RawDef } from "../registry-types.js";

export const DEFS: RawDef[] = [
${rows.join("\n")}
];
`;
}

function iconNames(): string[] {
  const src = readFileSync(join(CORE, "icons.ts"), "utf8");
  return [...src.matchAll(/^ {2}(\w+):/gm)].map((m) => m[1] as string);
}

/** The prop types of ui-core, copied without React: nodes are strings or DOM nodes here. */
function typesDts(els: GenElement[]): string {
  const strip = (src: string) =>
    src
      .replace(/^import [^;]+;\n/gm, "")
      .replace(/^export type \{[^}]*\};\n/gm, "")
      .replace(/^"use client";\n/gm, "");
  const types = strip(readFileSync(join(CORE, "components/types.ts"), "utf8"));
  const toast =
    /export type ToastTone[\s\S]*?\n}\n/.exec(
      readFileSync(join(CORE, "toast-store.ts"), "utf8"),
    )?.[0] ?? "";
  const provider = readFileSync(join(CORE, "provider.tsx"), "utf8");
  const providerTypes = [
    ...provider.matchAll(/^export type (Kit|Theme|Density) = [^;]+;$/gm),
    ...provider.matchAll(/^export interface UIProviderProps \{[\s\S]*?\n\}$/gm),
  ]
    .map((m) => m[0])
    .join("\n");
  const iconProps =
    /export interface IconProps \{[\s\S]*?\n\}/.exec(
      readFileSync(join(CORE, "Icon.tsx"), "utf8"),
    )?.[0] ?? "";
  const tagMap = els.map((e) => `    "${e.tag}": ${elementType(e)};`).join("\n");
  return `// Generated by scripts/generate.ts from @twentyfirstmedia/ui-core. Do not edit.
/* eslint-disable */

/** Content of a slot-like prop: text, a DOM node, or a list of them. */
export type ReactNode = string | number | boolean | null | undefined | Node | readonly ReactNode[];
export type CSSProperties = { [property: string]: string | number | undefined };
export type ChangeEvent<T = Element> = Event & { target: T; currentTarget: T };
export type MouseEvent<T = Element> = globalThis.MouseEvent & { currentTarget: T };
export type IconName =
${iconNames()
  .map((n) => `  | "${n}"`)
  .join("\n")};

${toast}
${providerTypes}

${types.replace(/^export interface IconProps extends BaseProps \{[\s\S]*?\n\}\n/m, "")}
${iconProps}

/** The props of a component as properties of its element (children are the element's content). */
export type ElementProps<P> = {
  [K in keyof P as K extends "children" | "className" | "style" ? never : K]: P[K];
};
/** A Twentyfirst UI custom element: an HTMLElement with the component's props as properties. */
export type TfElement<P> = HTMLElement & ElementProps<P>;

${els.map((e) => `/** \`<${e.tag}>\`: ${e.summary.replace(/\*\//g, "*\\/")} */\nexport type ${elementType(e)} = TfElement<${e.propsType}>;`).join("\n")}

declare global {
  interface HTMLElementTagNameMap {
${tagMap}
  }
}

/** The detail of every event a tf-* element dispatches. */
export type TfEvent<D = unknown> = CustomEvent<D>;

/** Shows a toast in \`<tf-toaster>\`; at most three are visible. Returns its id. */
export declare const toast: {
  (o: ToastOptions | string): string;
  dismiss(id: string): void;
  clear(): void;
};
/** Defines every tf-* element (runs on import; safe to call again). */
export declare function defineElements(): void;
/** Tag name → component name, for every element. */
export declare const ELEMENTS: Readonly<Record<string, string>>;
export declare const VERSION: string;
export declare function formatNumber(n: number, opts?: Intl.NumberFormatOptions): string;
export declare function formatMoney(n: number, currency?: string | null, opts?: Intl.NumberFormatOptions): string;
export declare function formatPercent(n: number, opts?: Intl.NumberFormatOptions): string;
export declare function formatDate(d: Date | string | number, opts?: Intl.DateTimeFormatOptions): string;
`;
}

const elementType = (e: GenElement) => `Tf${e.name.replace(/^UI/, "")}Element`;

function manifest(els: GenElement[]): unknown {
  return {
    schemaVersion: "1.0.0",
    readme: "README.md",
    modules: [
      {
        kind: "javascript-module",
        path: "dist/elements.js",
        declarations: els.map((e) => ({
          kind: "class",
          customElement: true,
          name: elementType(e),
          tagName: e.tag,
          description: e.summary,
          superclass: { name: "HTMLElement" },
          attributes: e.props
            .filter((p) => p.kind !== "f")
            .map((p) => ({
              name: p.attr,
              fieldName: p.name,
              type: { text: p.type },
              ...(p.doc ? { description: p.doc } : {}),
            })),
          members: e.props.map((p) => ({
            kind: "field",
            name: p.name,
            type: { text: p.type },
            ...(p.doc ? { description: p.doc } : {}),
            ...(p.kind !== "f" ? { attribute: p.attr } : {}),
          })),
          events: e.events.map((x) => ({
            name: x.event,
            type: { text: "CustomEvent" },
            description:
              (x.doc ? `${x.doc} ` : "") +
              `From \`${x.prop}: ${x.type}\`; \`event.detail\` holds ${x.arity > 1 ? "the arguments as an array" : x.arity === 1 ? "the argument" : "null"}.`,
          })),
          slots: e.slots.map((s) => ({
            name: s.name,
            description: s.doc || (s.name ? `Content of the \`${s.prop}\` prop.` : "Content."),
          })),
        })),
        exports: els.map((e) => ({
          kind: "custom-element-definition",
          name: e.tag,
          declaration: { name: elementType(e), module: "dist/elements.js" },
        })),
      },
    ],
  };
}

function vscodeData(els: GenElement[]): unknown {
  const values = (type: string) => {
    const lits = [...type.matchAll(/"([^"]+)"/g)].map((m) => m[1] as string);
    return /^("[^"]*"\s*\|?\s*)+$/.test(type) && lits.length
      ? lits.map((name) => ({ name }))
      : undefined;
  };
  return {
    version: 1.1,
    tags: els.map((e) => ({
      name: e.tag,
      description: e.summary,
      attributes: e.props
        .filter((p) => p.kind !== "f")
        .map((p) => {
          const v = p.kind === "b" ? undefined : values(p.type);
          return {
            name: p.attr,
            description: `${p.doc ? p.doc + " " : ""}(${p.type})`,
            ...(p.kind === "b" ? { valueSet: "v" } : {}),
            ...(v ? { values: v } : {}),
          };
        }),
      references: [
        { name: "Docs", url: `https://ui.twentyfirst.media/halo/components/${e.name}/` },
      ],
    })),
  };
}

export function generate(): GenElement[] {
  const els = buildElements();
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, "registry.ts"), registry(els));
  writeFileSync(join(OUT, "elements.d.ts"), typesDts(els));
  writeFileSync(join(OUT, "custom-elements.json"), JSON.stringify(manifest(els), null, 2) + "\n");
  writeFileSync(
    join(OUT, "vscode.html-custom-data.json"),
    JSON.stringify(vscodeData(els), null, 2) + "\n",
  );
  return els;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const els = generate();
  console.log(`elements: ${els.length} custom elements → src/generated`);
}
