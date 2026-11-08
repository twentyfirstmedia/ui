import type { NextConfig } from "next";

/**
 * Static export. The base path and the canonical site URL are the only things that change when
 * the docs move (ui.twentyfirst.media → twentyfirst.design): set DOCS_BASE_PATH and DOCS_SITE_URL.
 */
const config: NextConfig = {
  output: "export",
  basePath: process.env.DOCS_BASE_PATH || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ["example-previews"],
  env: {
    DOCS_SITE_URL: process.env.DOCS_SITE_URL ?? "https://ui.twentyfirst.media",
    DOCS_BASE_PATH: process.env.DOCS_BASE_PATH ?? "",
  },
};

export default config;
