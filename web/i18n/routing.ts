import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr"],
  defaultLocale: "tr",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
