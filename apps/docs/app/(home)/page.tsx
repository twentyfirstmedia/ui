const base = process.env.DOCS_BASE_PATH ?? "";

/** The site root forwards to the Halo docs (static export: no server redirects). */
export default function Home() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${base}/halo/`} />
      <p>
        <a href={`${base}/halo/`}>Twentyfirst UI docs</a>
      </p>
    </>
  );
}
