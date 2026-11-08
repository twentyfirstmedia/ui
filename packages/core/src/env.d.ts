import "react";

// Inline styles set CSS custom properties (`--base`, `--i` …) for motion and layout.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
