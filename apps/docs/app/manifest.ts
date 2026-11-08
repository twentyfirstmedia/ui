import type { MetadataRoute } from "next";
import { BASE_PATH } from "@/lib/site";
import { tokenColor } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Twentyfirst UI",
    short_name: "Twentyfirst UI",
    description: "Two React UI kits, Halo and Pro, with one component API.",
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "standalone",
    background_color: tokenColor("halo", "canvas", "light"),
    theme_color: tokenColor("halo", "frame", "light"),
    icons: [
      { src: `${BASE_PATH}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE_PATH}/icon-512.png`, sizes: "512x512", type: "image/png" },
      {
        src: `${BASE_PATH}/icon-maskable.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
