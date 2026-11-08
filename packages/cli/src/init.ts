import { execSync } from "node:child_process";
import { join, relative } from "node:path";
import { detect, installCommand } from "./project.js";
import { CONFIG_FILE, type Config, type Kit, type Logger, SCOPE, read, write } from "./util.js";

export interface InitOptions {
  cwd: string;
  kit: Kit;
  /** Load both kits and switch at runtime. */
  both?: boolean;
  install?: boolean;
  components?: string;
  log: Logger;
}

const PROVIDER = (kit: Kit, both: boolean) => `"use client";
import type { ReactNode } from "react";
import { UIProvider } from "${SCOPE}/${kit}";

/** Kit settings for the whole app. Created by \`twentyfirst-ui init\`. */
export function UIRoot({ children }: { children: ReactNode }) {
  return <UIProvider${both ? ` kit="${kit}"` : ""}>{children}</UIProvider>;
}
`;

export function init(o: InitOptions): Config {
  const p = detect(o.cwd);
  const pkgs = o.both ? [`${SCOPE}/halo`, `${SCOPE}/pro`] : [`${SCOPE}/${o.kit}`];
  const done: string[] = [];

  if (o.install !== false) {
    const cmd = installCommand(p.pm, pkgs);
    o.log.log(`$ ${cmd}`);
    execSync(cmd, { cwd: o.cwd, stdio: "inherit" });
    done.push(`installed ${pkgs.join(", ")}`);
  }

  // stylesheet
  const css = p.css ?? join(o.cwd, p.srcDir ? "src/app/globals.css" : "app/globals.css");
  let sheet = read(css) ?? "";
  const styles = o.both ? `${SCOPE}/ui-core/themes.css` : `${SCOPE}/${o.kit}/styles.css`;
  if (!sheet.includes(`${SCOPE}/`)) {
    const imports = [`@import "${styles}";`];
    if (p.usesTailwind) imports.push(`@import "${SCOPE}/${o.kit}/tailwind.css";`);
    if (p.usesTailwind) {
      sheet = sheet.replace(
        /(@import\s+["']tailwindcss["'];?\s*\n?)/,
        (m) => `${m.endsWith("\n") ? m : m + "\n"}${imports.join("\n")}\n`,
      );
    } else sheet = imports.join("\n") + "\n" + sheet;
    write(css, sheet);
    done.push(
      `${relative(o.cwd, css)}: ${imports.length > 1 ? "kit styles and Tailwind preset" : "kit styles"}`,
    );
  }

  // provider
  const componentsDir = o.components ?? (p.srcDir ? "src/components/ui" : "components/ui");
  const rootDir = join(o.cwd, componentsDir, "..");
  const providerPath = join(rootDir, "ui-root.tsx");
  if (!read(providerPath)) {
    write(providerPath, PROVIDER(o.kit, !!o.both));
    done.push(`${relative(o.cwd, providerPath)}: UIRoot with UIProvider`);
  }

  // layout: wrap children, set data-kit on <html> so the first paint is right
  if (p.layout) {
    let layout = read(p.layout) as string;
    if (!layout.includes("UIRoot")) {
      const importPath =
        "./" +
        relative(join(p.layout, ".."), providerPath)
          .replace(/\\/g, "/")
          .replace(/\.tsx$/, "");
      const spec = importPath.startsWith("./..") ? importPath.slice(2) : importPath;
      layout = layout.replace(
        /(\n?)((?:import[^\n]*\n)+)/,
        (_m, nl: string, imps: string) => `${nl}${imps}import { UIRoot } from "${spec}";\n`,
      );
      layout = layout.replace(/\{children\}/, "<UIRoot>{children}</UIRoot>");
      layout = layout.replace(/<html(\s|>)/, (_m, c: string) => `<html data-kit="${o.kit}"${c}`);
      write(p.layout, layout);
      done.push(`${relative(o.cwd, p.layout)}: UIRoot around the app, data-kit on <html>`);
    }
  }

  const config: Config = {
    kit: o.kit,
    components: componentsDir,
    css: relative(o.cwd, css),
  };
  if (o.both) config.both = true;
  write(join(o.cwd, CONFIG_FILE), JSON.stringify(config, null, 2) + "\n");
  done.push(`${CONFIG_FILE}: settings for \`add\` and \`diff\``);

  for (const d of done) o.log.log(`  ✓ ${d}`);
  if (o.install === false) o.log.log(`  · then install: ${installCommand(p.pm, pkgs)}`);
  return config;
}
