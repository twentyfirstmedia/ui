/**
 * The Twentyfirst UI mark: half round (Halo), half square (Pro), one shape. Drawn in the current
 * text colour; app/icon.svg is the same path on the frame colour.
 */
export function Logo({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path d="M16 8h8v16h-8a8 8 0 0 1 0-16z" fill="var(--logo-glyph, var(--surface))" />
    </svg>
  );
}
