import type { MetadataRoute } from "next";
import { appBaseUrl } from "@/lib/env/cloud-ready";

export default function robots(): MetadataRoute.Robots {
  const base = appBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
