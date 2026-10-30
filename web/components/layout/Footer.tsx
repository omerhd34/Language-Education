"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/components/layout/navLinks";
import { useAppSelector } from "@/hooks/useAppSelector";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const user = useAppSelector((state) => state.auth.user);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto border-t border-teal-900/10 bg-linear-to-b from-teal-50/80 to-zinc-50 dark:border-teal-400/10 dark:from-zinc-950 dark:to-zinc-950">
      <Container size={user ? "app" : "page"} className="py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <Link
              href="/"
              className="inline-block font-display text-2xl font-semibold tracking-tight text-teal-800 transition-transform duration-200 hover:scale-105 dark:text-teal-300"
            >
              {tNav("brand")}
            </Link>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("tagline")}
            </p>
            {!user ? (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ButtonLink href="/register" size="sm">
                  {t("ctaPrimary")}
                </ButtonLink>
                <Link
                  href="/login"
                  className="text-sm font-medium text-teal-800 transition-colors hover:text-teal-950 dark:text-teal-300 dark:hover:text-teal-200"
                >
                  {t("ctaSecondary")}
                </Link>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-teal-800/70 uppercase dark:text-teal-300/70">
              {t("explore")}
            </p>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-teal-800 dark:text-zinc-400 dark:hover:text-teal-300"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-teal-800/70 uppercase dark:text-teal-300/70">
              {t("support")}
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/iletisim"
                  className="text-sm text-zinc-600 transition-colors hover:text-teal-800 dark:text-zinc-400 dark:hover:text-teal-300"
                >
                  {t("contactLink")}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${t("email")}`}
                  className="text-sm text-zinc-600 transition-colors hover:text-teal-800 dark:text-zinc-400 dark:hover:text-teal-300"
                >
                  {t("email")}
                </a>
              </li>
            </ul>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
              {t("supportNote")}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-teal-900/10 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-teal-400/10">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {year ? `© ${year} ${tNav("brand")}. ${t("rights")}` : "\u00a0"}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {t("madeFor")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
