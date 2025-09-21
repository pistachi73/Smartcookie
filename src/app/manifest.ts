import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = "en-GB";

  const t = await getTranslations({
    namespace: "Manifest",
    locale,
  });

  return {
    name: t("name"),
    short_name: t("shortName"),
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#090b0f",
    background_color: "#090b0f",
    display: "standalone",
  };
}
