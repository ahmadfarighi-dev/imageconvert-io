import type { MetadataRoute } from "next";
import { TOOL_SLUGS } from "@/tools/tools.config";

const BASE = "https://imageconvert.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = TOOL_SLUGS.map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/what-is-heic`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/what-is-avif`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...toolPages,
  ];
}
