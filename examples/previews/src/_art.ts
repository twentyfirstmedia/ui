/**
 * Small illustrations as SVG data URLs, so the examples show images without loading anything.
 * The colours are the pictures' own (data), not theme colours.
 */
function svg(w: number, h: number, body: string): string {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`,
    )
  );
}

/** A mug mockup: background, table, mug, logo mark. */
export function mug(bg: string, table: string, cup: string, mark: string): string {
  return svg(
    400,
    400,
    `<rect width="400" height="400" fill="${bg}"/>` +
      `<rect y="270" width="400" height="130" fill="${table}"/>` +
      `<ellipse cx="200" cy="300" rx="96" ry="16" fill="#000" opacity=".12"/>` +
      `<path d="M120 140h160v130a30 30 0 0 1-30 30H150a30 30 0 0 1-30-30z" fill="${cup}"/>` +
      `<path d="M280 170h20a28 28 0 0 1 0 56h-20" fill="none" stroke="${cup}" stroke-width="16"/>` +
      `<circle cx="200" cy="210" r="30" fill="${mark}"/>` +
      `<path d="M188 210l9 9 16-18" fill="none" stroke="${cup}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  );
}

/** A tote bag mockup. */
export function tote(bg: string, bag: string, mark: string): string {
  return svg(
    400,
    400,
    `<rect width="400" height="400" fill="${bg}"/>` +
      `<path d="M150 150a50 50 0 0 1 100 0" fill="none" stroke="${bag}" stroke-width="12"/>` +
      `<rect x="110" y="150" width="180" height="200" rx="10" fill="${bag}"/>` +
      `<rect x="160" y="220" width="80" height="80" rx="40" fill="${mark}"/>`,
  );
}

/** A landscape photo: sky, sun, hills. */
export function landscape(sky: string, sun: string, hill: string, front: string): string {
  return svg(
    640,
    420,
    `<rect width="640" height="420" fill="${sky}"/>` +
      `<circle cx="470" cy="130" r="54" fill="${sun}"/>` +
      `<path d="M0 300C120 220 260 230 360 290S560 260 640 230V420H0z" fill="${hill}"/>` +
      `<path d="M0 350C140 300 300 320 420 360S580 340 640 330V420H0z" fill="${front}"/>`,
  );
}
