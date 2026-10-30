"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
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
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <Container
        size={user ? "app" : "page"}
        className="flex flex-col gap-2 py-8"
      >
        <p className="font-display text-lg font-semibold text-teal-800 dark:text-teal-300">
          {tNav("brand")}
        </p>
        <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          {t("tagline")}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          {year ? `© ${year} ${tNav("brand")}. ${t("rights")}` : `\u00a0`}
        </p>
      </Container>
    </footer>
  );
}
