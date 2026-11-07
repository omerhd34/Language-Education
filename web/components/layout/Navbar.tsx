"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { HiRectangleStack } from "react-icons/hi2";
import { Link, useRouter } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { UserMenu } from "@/components/layout/UserMenu";
import { navLinks } from "@/components/layout/navLinks";
import { getUserInitials } from "@/lib/userInitials";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const t = useTranslations("Nav");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Cookie/sunucu temizliği başarısız olsa da yerel oturumu kapat.
    }
    setOpen(false);
    router.push("/");
  }

  const accountLabel = user?.name?.trim() || user?.email || "";
  const initials = user ? getUserInitials(user.name, user.email) : "";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-brand-100/80 backdrop-blur-md dark:bg-brand-950/80">
      <Container
        size={user ? "app" : "page"}
        className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]"
      >
        <div className="justify-self-start">
          <Link
            href="/"
            className="inline-block font-display text-3xl font-semibold tracking-tight text-brand-800 transition-transform duration-200 hover:scale-110 dark:text-brand-400"
          >
            {t("brand")}
          </Link>
        </div>

        <nav
          className="hidden items-center justify-center gap-8 md:flex"
          aria-label={t("brand")}
        >
          {navLinks.map((item) => {
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-100"
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <nav className="hidden items-center justify-self-end gap-3 md:flex">
          {user ? (
            <UserMenu
              user={user}
              isLoggingOut={isLoggingOut}
              onLogout={() => void handleLogout()}
            />
          ) : (
            <ButtonLink href="/panelLogin" size="lg">
              <HiRectangleStack aria-hidden />
              {t("myPanel")}
            </ButtonLink>
          )}
        </nav>

        <div className="flex items-center justify-self-end gap-2 md:hidden">
          {user ? (
            <UserMenu
              user={user}
              isLoggingOut={isLoggingOut}
              onLogout={() => void handleLogout()}
            />
          ) : null}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-400/70 dark:border-brand-600"
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
        <div className="border-t border-border px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-surface-muted dark:text-brand-100 dark:hover:bg-brand-900"
                onClick={() => setOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-3 px-1 py-2">
                <Avatar className="size-9 rounded-full">
                  <AvatarFallback className="rounded-full">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brand-950 dark:text-brand-100">
                    {accountLabel}
                  </p>
                  {user.name?.trim() ? (
                    <p className="truncate text-xs text-brand-600 dark:text-brand-400">
                      {user.email}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <ButtonLink
                href="/panelLogin"
                size="lg"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <HiRectangleStack aria-hidden />
                {t("myPanel")}
              </ButtonLink>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
