import type { MetadataRoute } from "next";
import { PLATFORMS } from "@/lib/platforms";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://zayacodehub.in";
  const staticRoutes = [
    "",
    "/tools",
    "/platforms",
    "/api-docs",
    "/pricing",
    "/about",
    "/privacy",
    "/terms",
    "/copyright",
    "/acceptable-use",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    })),
    ...PLATFORMS.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}

