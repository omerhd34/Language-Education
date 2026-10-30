"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { navLinks } from "@/components/layout/navLinks";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useLogoutMutation } from "@/store/api";
import { clearCredentials } from "@/store/authSlice";

export function Navbar() {
  const t = useTranslations("Nav");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch {
      // Cookie/sunucu temizliği başarısız olsa da yerel oturumu kapat.
    }
    dispatch(clearCredentials());
    setOpen(false);
    router.push("/");
  }

  const accountLabel = user?.name?.trim() || user?.email || "";

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <Container
        size={user ? "app" : "page"}
        className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]"
      >
        <div className="justify-self-start">
          <Link
            href="/"
            className="inline-block font-display text-3xl font-semibold tracking-tight text-teal-800 transition-transform duration-200 hover:scale-110 dark:text-teal-300"
          >
            {t("brand")}
          </Link>
        </div>

        <nav
          className="hidden items-center justify-center gap-8 md:flex"
          aria-label={t("brand")}
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-teal-800 dark:text-zinc-300 dark:hover:text-teal-300"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <nav className="hidden items-center justify-self-end gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <span className="max-w-48 truncate text-sm text-zinc-600 dark:text-zinc-300">
                {accountLabel}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isLoggingOut}
                onClick={() => void handleLogout()}
              >
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                {t("login")}
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                {t("register")}
              </ButtonLink>
            </>
          )}
        </nav>

        <div className="flex items-center justify-self-end gap-2 md:hidden">
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
      </Container>

      {open ? (
        <div className="border-t border-zinc-200 px-4 py-3 md:hidden dark:border-zinc-800">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                onClick={() => setOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            {user ? (
              <>
                <p className="truncate px-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {accountLabel}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={isLoggingOut}
                  onClick={() => void handleLogout()}
                >
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
