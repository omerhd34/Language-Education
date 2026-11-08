"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_OPTIONS: {
  id: AppLocale | "en";
  available: boolean;
}[] = [
  { id: "tr", available: true },
  { id: "en", available: false },
];

export function LocaleSetting() {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function selectLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) {
      return;
    }

    if (!(routing.locales as readonly string[]).includes(nextLocale)) {
      return;
    }

    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-brand-950 dark:text-brand-100">
        {t("localeLabel")}
      </p>
      <ul className="space-y-2" role="group" aria-label={t("localeLabel")}>
        {LOCALE_OPTIONS.map((option) => {
          const selected = option.available && option.id === locale;
          const title =
            option.id === "tr" ? t("localeTurkish") : t("localeEnglish");

          return (
            <li key={option.id}>
              <button
                type="button"
                aria-pressed={selected}
                disabled={!option.available}
                aria-label={
                  option.available
                    ? title
                    : `${title} (${t("localeComingSoon")})`
                }
                onClick={() => {
                  if (option.available) {
                    selectLocale(option.id as AppLocale);
                  }
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 disabled:cursor-not-allowed disabled:opacity-60",
                  selected
                    ? "border-sky-500/45 bg-sky-500/5 dark:border-sky-400/40 dark:bg-sky-400/10"
                    : "border-border bg-background/80 hover:border-sky-500/45 hover:bg-sky-500/5 disabled:hover:border-border disabled:hover:bg-background/80 dark:bg-brand-950/40 dark:disabled:hover:bg-brand-950/40",
                )}
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                  <Languages className="size-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium text-brand-950 dark:text-brand-100">
                  {title}
                </span>
                <span
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                    selected
                      ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950"
                      : "bg-brand-100 text-transparent dark:bg-brand-900",
                  )}
                  aria-hidden
                >
                  <Check className="size-3.5" strokeWidth={2.5} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
