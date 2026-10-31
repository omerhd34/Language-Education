"use client";

import { useTranslations } from "next-intl";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { appNavLinks } from "@/components/layout/app/appNavLinks";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { getUserInitials } from "@/lib/userInitials";
import type { AuthUser } from "@/store/api";

const COLLAPSE_KEY = "pylmor-sidebar-collapsed";

type AppSidebarProps = {
  user: AuthUser;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function AppSidebar({ user, isLoggingOut, onLogout }: AppSidebarProps) {
  const t = useTranslations("AppNav");
  const tNav = useTranslations("Nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const initials = getUserInitials(user.name, user.email);
  const displayName = user.name?.trim() || user.email;

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage tercihini ilk yüklemede oku
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // ignore
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }

  function renderNav(compact: boolean) {
    return (
      <nav className="mt-6 flex flex-col gap-1" aria-label={t("menu")}>
        {appNavLinks.map((item) => {
          const Icon = item.Icon;
          const active =
            item.href === "/panelim"
              ? pathname === "/panelim" || pathname === "/"
              : pathname === item.href;

          return (
            <Link
              key={item.labelKey}
              href={item.href}
              title={t(item.labelKey)}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                compact && "justify-center px-2",
                active
                  ? "bg-brand-800 text-brand-100"
                  : "text-brand-400 hover:bg-brand-900 hover:text-brand-100",
              )}
            >
              <Icon
                className="size-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
              {!compact ? <span>{t(item.labelKey)}</span> : null}
              {compact ? (
                <span className="sr-only">{t(item.labelKey)}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    );
  }

  function renderFooter(compact: boolean) {
    return (
      <div className="space-y-3 border-t border-white/8 pt-4">
        <div
          className={cn(
            "flex items-center gap-3 px-1",
            compact && "flex-col gap-2",
          )}
        >
          <Avatar className="size-9 rounded-full">
            <AvatarFallback className="rounded-full text-[0.65rem]">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!compact ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-brand-100">
                {displayName}
              </p>
              {user.name?.trim() ? (
                <p className="truncate text-xs text-brand-400">{user.email}</p>
              ) : null}
            </div>
          ) : null}
          <ThemeToggle className="shrink-0 border-white/10 bg-transparent text-brand-300 hover:bg-brand-900 hover:text-brand-100" />
        </div>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full border-white/10 bg-transparent text-brand-300 hover:bg-brand-900 hover:text-brand-100",
            compact ? "justify-center px-0" : "justify-start",
          )}
          disabled={isLoggingOut}
          aria-label={tNav("logout")}
          title={tNav("logout")}
          onClick={onLogout}
        >
          <LogOut className="size-4" aria-hidden />
          {!compact ? tNav("logout") : null}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-brand-950 px-4 lg:hidden">
        <Link
          href="/panelim"
          className="font-display text-lg font-semibold text-brand-100"
        >
          {tNav("brand")}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="border-white/10 bg-transparent text-brand-100 hover:bg-brand-900" />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-brand-100"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? tNav("closeMenu") : tNav("openMenu")}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? (
              <X className="size-4" aria-hidden />
            ) : (
              <Menu className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-brand-950/95 p-4 lg:hidden">
          <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center justify-between gap-3 px-1">
              <Link
                href="/panelim"
                className="font-display text-xl font-semibold tracking-tight text-brand-100"
                onClick={() => setMobileOpen(false)}
              >
                {tNav("brand")}
              </Link>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {renderNav(false)}
            </div>
            <div className="shrink-0">{renderFooter(false)}</div>
          </div>
        </div>
      ) : null}

      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-white/8 bg-brand-950 p-4 text-brand-100 transition-[width] duration-200 lg:flex",
          collapsed ? "w-19" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center gap-3 px-1",
            collapsed ? "flex-col" : "justify-between",
          )}
        >
          {!collapsed ? (
            <Link
              href="/panelim"
              className="font-display text-xl font-semibold tracking-tight text-brand-100"
            >
              {tNav("brand")}
            </Link>
          ) : null}
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-brand-100 transition-colors hover:bg-brand-900"
            aria-expanded={!collapsed}
            aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
            title={collapsed ? t("expandSidebar") : t("collapseSidebar")}
            onClick={toggleCollapsed}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" aria-hidden />
            ) : (
              <PanelLeftClose className="size-4" aria-hidden />
            )}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {renderNav(collapsed)}
        </div>
        <div className="shrink-0">{renderFooter(collapsed)}</div>
      </aside>
    </>
  );
}
