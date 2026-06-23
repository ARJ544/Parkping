import type { MetadataRoute } from "next";
import { COMPANY_NAME } from "@/config/company";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY_NAME,
    short_name: COMPANY_NAME,
    description: "Privacy-First Vehicle Protection Platform",
    start_url: "/",
    display: "standalone",
    background_color: "#fcf7e6",
    theme_color: "#f3ebcd",
    icons: [
      {
        src: "/web-app-manifest-192x192.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "maskable",
      },
    ],
  };
}
