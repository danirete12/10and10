import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://10and10.es";

  const [watches, brands] = await Promise.all([
    prisma.watch.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.brand.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const watchUrls: MetadataRoute.Sitemap = watches.map((w) => ({
    url: `${base}/watches/${w.slug}`,
    lastModified: w.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const brandUrls: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${base}/brands/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/watches`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/brands`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/search`, changeFrequency: "weekly", priority: 0.5 },
    ...watchUrls,
    ...brandUrls,
  ];
}
