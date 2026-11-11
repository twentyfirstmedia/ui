import type { CSSProperties } from "react";
import { cx } from "./cx.js";
import { ICON_NAMES, ICON_PATHS, iconData, type IconName } from "./icons.js";

export interface IconProps {
  name: IconName;
  /** Pixel size (default 16; 14 in chips and badges, 20 in navigation). */
  size?: number;
  /** Accessible name. Without it the icon is decorative and hidden from assistive tech. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

const warned = new Set<string>();

/**
 * A line icon from the kit's set, drawn in `currentColor`. Icons from the library (or your own)
 * show once registered with `registerIcons`; an unknown name draws a placeholder and warns once.
 */
export function Icon({ name, size = 16, label, className, style }: IconProps) {
  let data = iconData(name);
  if (data === undefined) {
    if (!warned.has(name)) {
      warned.add(name);
      console.warn(
        `Twentyfirst UI: no icon "${name}". Register it first: registerIcons({ ${name} }) with ${name} from "@twentyfirstmedia/halo/icons" (or /pro/icons).`,
      );
    }
    data = ICON_PATHS.sparkle;
  }
  const filled = typeof data !== "string" || name === "play";
  return (
    <svg
      className={cx("tf-ico", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={typeof data === "string" ? "currentColor" : "none"}
      strokeWidth={name === "more" ? 3.2 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      style={{ width: size, height: size, ...style }}
    >
      <path d={typeof data === "string" ? data : data.d} />
    </svg>
  );
}
Icon.names = ICON_NAMES;
