import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kknailsandspa.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/book`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];
}
