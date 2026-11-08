import { expect, test, type APIRequestContext } from "@playwright/test";

/**
 * Search engines and agents: every page in the sitemap has a unique title, a description that
 * fits a result snippet, a canonical URL to itself, a social card, one h1, valid structured data
 * and a Markdown twin; llms.txt only links to files that exist; robots, manifest and icons resolve.
 */
const BASE = "http://localhost:4174";
const SITE = "https://ui.twentyfirst.media";
const local = (url: string) => url.replace(SITE, BASE);

const decode = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
const attr = (html: string, re: RegExp) => {
  const v = re.exec(html)?.[1];
  return v == null ? undefined : decode(v);
};
async function ok(request: APIRequestContext, url: string) {
  const r = await request.get(local(url));
  expect(r.status(), url).toBe(200);
  return r;
}

test("every sitemap page is complete for search and agents", async ({ request }) => {
  test.setTimeout(180_000);
  const sitemap = await (await ok(request, `${SITE}/sitemap.xml`)).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] as string);
  expect(urls.length).toBeGreaterThan(250);
  const titles = new Map<string, string>();
  const problems: string[] = [];
  const images = new Set<string>();
  for (const url of urls) {
    const html = await (await ok(request, url)).text();
    const head = html.slice(0, html.indexOf("</head>"));
    const title = attr(head, /<title>([^<]*)<\/title>/) ?? "";
    const desc = attr(head, /<meta name="description" content="([^"]*)"/) ?? "";
    const canonical = attr(head, /<link rel="canonical" href="([^"]*)"/);
    const og = attr(head, /<meta property="og:image" content="([^"]*)"/);
    const md = attr(head, /<link rel="alternate" type="text\/markdown" href="([^"]*)"/);
    // live previews of whole screens bring their own page titles; count the page's own
    const own = html.includes('class="docs-preview"')
      ? html.slice(0, html.indexOf('class="docs-preview"'))
      : html;
    const h1 = (own.match(/<h1[\s>]/g) ?? []).length;
    if (!title) problems.push(`${url}: no title`);
    else if (titles.has(title))
      problems.push(`${url}: title "${title}" also on ${titles.get(title)}`);
    else titles.set(title, url);
    if (desc.length < 50 || desc.length > 160)
      problems.push(`${url}: description ${desc.length} chars`);
    if (canonical !== url) problems.push(`${url}: canonical ${canonical}`);
    if (!og) problems.push(`${url}: no og:image`);
    else images.add(og);
    if (h1 !== 1) problems.push(`${url}: ${h1} h1`);
    for (const m of html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g))
      try {
        JSON.parse(m[1] as string);
      } catch {
        problems.push(`${url}: invalid JSON-LD`);
      }
    if (!html.includes("application/ld+json")) problems.push(`${url}: no JSON-LD`);
    if (url !== `${SITE}/`) {
      if (!md) problems.push(`${url}: no Markdown twin`);
      else {
        const text = await (await ok(request, md)).text();
        if (!text.startsWith("# ")) problems.push(`${md}: not Markdown`);
      }
    }
  }
  for (const img of images) await ok(request, img);
  expect(problems).toEqual([]);
});

test("llms.txt and llms-full.txt link only to files that exist", async ({ request }) => {
  const txt = await (await ok(request, `${SITE}/llms.txt`)).text();
  expect(txt).toMatch(/^# Twentyfirst UI\n\n> /);
  const links = [...txt.matchAll(/\]\((https:\/\/ui\.twentyfirst\.media[^)]+)\)/g)].map(
    (m) => m[1] as string,
  );
  expect(links.length).toBeGreaterThan(100);
  for (const l of links) await ok(request, l);
  const full = await (await ok(request, `${SITE}/llms-full.txt`)).text();
  expect(full).toContain("## Installation");
  expect(full).toContain("## Tabs");
});

test("robots, manifest and icons resolve", async ({ request }) => {
  const robots = await (await ok(request, `${SITE}/robots.txt`)).text();
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  const manifest = (await (await ok(request, `${SITE}/manifest.webmanifest`)).json()) as {
    icons: { src: string }[];
  };
  for (const i of manifest.icons) await ok(request, `${SITE}${i.src}`);
  for (const f of ["/favicon.ico", "/icon.svg", "/apple-icon.png"])
    await ok(request, `${SITE}${f}`);
  const html = await (await ok(request, `${SITE}/halo/`)).text();
  expect(html).toMatch(/<link rel="icon" href="\/favicon\.ico/);
  expect(html).toMatch(/<link rel="apple-touch-icon" href="\/apple-icon\.png/);
});
