import type { CSSProperties } from "react";
import { cx } from "./cx.js";
import { ICON_NAMES, ICON_PATHS, type IconName } from "./icons.js";

export interface IconProps {
  name: IconName;
  /** Pixel size (default 16; 14 in chips and badges, 20 in navigation). */
  size?: number;
  /** Accessible name. Without it the icon is decorative and hidden from assistive tech. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** A line icon from the kit's set, drawn in `currentColor`. */
export function Icon({ name, size = 16, label, className, style }: IconProps) {
  return (
    <svg
      className={cx("tf-ico", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={name === "play" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={name === "more" ? 3.2 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      style={{ width: size, height: size, ...style }}
    >
      <path d={ICON_PATHS[name] ?? ICON_PATHS.sparkle} />
    </svg>
  );
}
Icon.names = ICON_NAMES;
