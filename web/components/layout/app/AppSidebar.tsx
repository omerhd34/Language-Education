"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  appNavLinks,
  type AppNavLink,
} from "@/components/layout/app/appNavLinks";
import { VocabularyNavItem } from "@/components/layout/app/VocabularyNavItem";
import { NotificationsMenu } from "@/components/features/dashboard/NotificationsMenu";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { Link, usePathname } from "@/i18n/navigation";
import { navigatePanelSection, usePanelHash } from "@/hooks/usePanelHash";
import { useProfileAvatarUpload } from "@/hooks/useProfileAvatarUpload";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/store/api";
import { useAuthStore } from "@/store/authStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

function hrefHash(href: string): string {
  const index = href.indexOf("#");
  return index >= 0 ? href.slice(index) : "";
}

function hrefPath(href: string): string {
  const index = href.indexOf("#");
  return index >= 0 ? href.slice(0, index) : href;
}

type AppSidebarProps = {
  user: AuthUser;
  isLoggingOut: boolean;
  onLogout: () => void;
};

const menuButtonClassName =
  "h-auto rounded-xl px-3 py-2.5 font-medium text-brand-400";

export function AppSidebarMobileBar() {
  const tNav = useTranslations("Nav");
  const { openMobile } = useSidebar();

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground lg:hidden">
      <Link
        href="/panel"
        className="font-display text-lg font-semibold text-brand-100"
      >
        {tNav("brand")}
      </Link>
      <SidebarTrigger
        aria-label={openMobile ? tNav("closeMenu") : tNav("openMenu")}
        className="border border-white/10 text-brand-100"
      />
    </div>
  );
}

export function AppSidebar({ user, isLoggingOut, onLogout }: AppSidebarProps) {
  const t = useTranslations("AppNav");
  const tNav = useTranslations("Nav");
  const tSettings = useTranslations("Settings");
  const pathname = usePathname();
  const panelHash = usePanelHash();
  const { setOpenMobile, state } = useSidebar();
  const collapsed = state === "collapsed";
  const storeUser = useAuthStore((state) => state.user);
  const resolvedUser = storeUser ?? user;
  const displayName = resolvedUser.name?.trim() || resolvedUser.email;
  const { pickFile, isUpdatingAvatar } = useProfileAvatarUpload();

  function isActive(href: string): boolean {
    const path = hrefPath(href);
    const hash = hrefHash(href);
    const onPanel = pathname === "/panel" || pathname === "/";

    if (hash) {
      return onPanel && panelHash === hash;
    }

    if (path === "/panel") {
      return onPanel && panelHash === "";
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  }

  function handleNavClick(event: MouseEvent<HTMLElement>, href: string) {
    const path = hrefPath(href);
    const hash = hrefHash(href);
    const onPanel = pathname === "/panel" || pathname === "/";

    setOpenMobile(false);

    if (path === "/panel" && onPanel) {
      event.preventDefault();
      navigatePanelSection(hash.replace(/^#/, ""));
    }
  }

  function renderLink(item: AppNavLink) {
    const Icon = item.Icon;
    const active = isActive(item.href);
    const label = t(item.labelKey);

    return (
      <SidebarMenuItem key={item.labelKey}>
        <SidebarMenuButton
          isActive={active}
          tooltip={label}
          className={menuButtonClassName}
          render={<Link href={item.href} />}
          onClick={(event) => handleNavClick(event, item.href)}
        >
          <Icon className="size-4" strokeWidth={1.75} aria-hidden />
          <span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  const settingsActive =
    pathname === "/panel/ayarlar" || pathname.startsWith("/panel/ayarlar/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        <div className="flex items-center justify-between gap-3 group-data-[collapsible=icon]:justify-center">
          <Link
            href="/panel"
            className="font-display text-xl font-semibold tracking-tight text-brand-100 group-data-[collapsible=icon]:hidden"
          >
            {tNav("brand")}
          </Link>
          <SidebarTrigger
            aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
            title={collapsed ? t("expandSidebar") : t("collapseSidebar")}
            className="border border-white/10 text-brand-100 hover:bg-brand-900"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-2 py-0">
          <SidebarGroupContent>
            <nav aria-label={t("menu")}>
              <SidebarMenu className="gap-1">
                {appNavLinks.map((item) =>
                  item.labelKey === "vocabulary" ? (
                    <VocabularyNavItem
                      key={item.labelKey}
                      onNavigate={handleNavClick}
                    />
                  ) : (
                    renderLink(item)
                  ),
                )}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        <SidebarSeparator className="mx-0 bg-white/8" />
        <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <NotificationsMenu
            variant="sidebar"
            triggerClassName="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={settingsActive}
              tooltip={t("settings")}
              className={menuButtonClassName}
              render={<Link href="/panel/ayarlar" />}
              onClick={() => setOpenMobile(false)}
            >
              <Settings className="size-4" strokeWidth={1.75} aria-hidden />
              <span>{t("settings")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mb-2 flex items-center gap-3 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <ProfileAvatar
            name={resolvedUser.name}
            email={resolvedUser.email}
            avatarUrl={resolvedUser.avatarUrl}
            className="size-9 group-data-[collapsible=icon]:size-8"
            fallbackClassName="text-[0.65rem]"
            editable
            uploading={isUpdatingAvatar}
            onPickFile={pickFile}
            label={tSettings("profilePhotoChange")}
          />
          <Link
            href="/panel/ayarlar"
            onClick={() => setOpenMobile(false)}
            className="min-w-0 flex-1 rounded-lg outline-none transition-colors hover:bg-brand-900/60 focus-visible:ring-2 focus-visible:ring-brand-400/40 group-data-[collapsible=icon]:hidden"
            aria-label={t("settings")}
          >
            <p className="truncate text-sm font-medium text-brand-100">
              {displayName}
            </p>
            {resolvedUser.name?.trim() ? (
              <p className="truncate text-xs text-brand-400">
                {resolvedUser.email}
              </p>
            ) : null}
          </Link>
        </div>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full border-white/10 bg-transparent text-brand-300 hover:bg-brand-900 hover:text-brand-100",
            "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:px-0",
          )}
          disabled={isLoggingOut}
          aria-label={tNav("logout")}
          title={tNav("logout")}
          onClick={onLogout}
        >
          <LogOut className="size-4" aria-hidden />
          <span className="group-data-[collapsible=icon]:hidden">
            {tNav("logout")}
          </span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
