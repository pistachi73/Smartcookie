import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en-GB", "es-ES"],
  defaultLocale: "en-GB",
  localePrefix: {
    mode: "always",
    prefixes: {
      "en-GB": "/en",
      "es-ES": "/es",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
