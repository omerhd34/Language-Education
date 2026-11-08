"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { HiChatBubbleLeftRight, HiEnvelope } from "react-icons/hi2";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/components/layout/navLinks";
import { useAuthStore } from "@/store/authStore";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const user = useAuthStore((state) => state.user);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto border-t border-(--glass-line) bg-(--glass) backdrop-blur-[20px] backdrop-saturate-200">
      <Container size={user ? "app" : "page"} className="py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <Link
              href="/"
              className="inline-block font-display text-xl font-semibold tracking-tight text-brand-800 transition-transform duration-200 hover:scale-105 dark:text-brand-400"
            >
              {tNav("brand")}
            </Link>
            <p className="text-sm leading-relaxed text-brand-600 dark:text-brand-400">
              {t("tagline")}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-brand-800/70 uppercase dark:text-brand-400/70">
              {t("explore")}
            </p>
            <ul className="space-y-3">
              {navLinks.map((item) => {
                const Icon = item.Icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 text-sm text-brand-600 transition-colors hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-100"
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {tNav(item.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-brand-800/70 uppercase dark:text-brand-400/70">
              {t("support")}
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/iletisim"
                  className="inline-flex items-center gap-2 text-sm text-brand-600 transition-colors hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-100"
                >
                  <HiChatBubbleLeftRight
                    className="size-4 shrink-0"
                    aria-hidden
                  />
                  {t("contactLink")}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${t("email")}`}
                  className="inline-flex items-center gap-2 text-sm text-brand-600 transition-colors hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-100"
                >
                  <HiEnvelope className="size-4 shrink-0" aria-hidden />
                  {t("email")}
                </a>
              </li>
            </ul>
            <p className="max-w-xs text-sm leading-relaxed text-brand-600/80 dark:text-brand-400/80">
              {t("supportNote")}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-600/80 dark:text-brand-400/80">
            {year ? `© ${year} ${tNav("brand")}. ${t("rights")}` : "\u00a0"}
          </p>
          <p className="text-xs text-brand-600/80 dark:text-brand-400/80">
            {t("madeFor")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
