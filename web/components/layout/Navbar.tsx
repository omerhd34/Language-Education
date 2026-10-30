"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Navbar() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-teal-800 dark:text-teal-300"
        >
          {t("brand")}
        </Link>

        <nav className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />
          <ButtonLink href="/login" variant="ghost" size="sm">
            {t("login")}
          </ButtonLink>
          <ButtonLink href="/register" size="sm">
            {t("register")}
          </ButtonLink>
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-600"
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">
              {open ? t("closeMenu") : t("openMenu")}
            </span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-zinc-200 px-4 py-3 sm:hidden dark:border-zinc-800">
          <div className="flex flex-col gap-2">
            <ButtonLink
              href="/login"
              variant="secondary"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {t("login")}
            </ButtonLink>
            <ButtonLink
              href="/register"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {t("register")}
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
