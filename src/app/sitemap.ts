import type { MetadataRoute } from "next";

import { localePrefixesMap, routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://smartcookieapp.com";

  const publicRoutes = [
    "",
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
    "/refund-policy",
    "/accessibility-statement",
    "/login",
    "/forgot-password",
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate sitemap for each locale
  routing.locales.forEach((locale) => {
    const localePrefix = localePrefixesMap[locale]!;
    publicRoutes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}${localePrefix}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    });
  });

  return sitemap;
}
