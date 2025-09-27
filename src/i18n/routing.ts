import { defineRouting } from "next-intl/routing";

export const localePrefixesMap: Record<string, string> = {
  "en-GB": "/en",
  "es-ES": "/es",
};

export const routing = defineRouting({
  locales: ["en-GB", "es-ES"],
  defaultLocale: "en-GB",
  localePrefix: {
    mode: "always",
    prefixes: localePrefixesMap,
  },
});

export type Locale = (typeof routing.locales)[number];
