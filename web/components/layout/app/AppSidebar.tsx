"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  appNavLinks,
  appNavTooltipKey,
  type AppNavLink,
} from "@/components/layout/app/appNavLinks";
import { BrandMark } from "@/components/brand/BrandMark";
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
  "h-auto rounded-[13px] px-2.5 py-2 text-base font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground data-active:bg-sidebar-accent data-active:text-sidebar-foreground";

const triggerClassName =
  "size-8 shrink-0 rounded-[10px] border-0 bg-[var(--glass-2)] text-sidebar-foreground shadow-[inset_0_0_0_1px_var(--glass-line)] hover:bg-[var(--glass-3)] hover:text-sidebar-foreground";

const railIconButtonClassName =
  "group-data-[collapsible=icon]:h-[42px] group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-[13px] group-data-[collapsible=icon]:px-0";

const brandMarkTileClassName =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-(--glass-2) text-sidebar-foreground shadow-[inset_0_0_0_1px_var(--glass-line)]";

export function AppSidebarMobileBar() {
  const tNav = useTranslations("Nav");
  const { openMobile } = useSidebar();

  return (
    <div className="glass-panel sticky top-0 z-30 mx-3 mt-3 flex h-14 items-center justify-between rounded-2xl px-4 text-sidebar-foreground lg:hidden">
      <Link
        href="/panel"
        className="inline-flex items-center gap-2.5 font-display text-xl font-semibold text-sidebar-foreground"
      >
        <span className={brandMarkTileClassName} aria-hidden>
          <BrandMark className="size-5" />
        </span>
        {tNav("brand")}
      </Link>
      <SidebarTrigger
        aria-label={openMobile ? tNav("closeMenu") : tNav("openMenu")}
        className={triggerClassName}
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
    const tooltip = t(appNavTooltipKey(item.labelKey));

    return (
      <SidebarMenuItem key={item.labelKey}>
        <SidebarMenuButton
          isActive={active}
          tooltip={tooltip}
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
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:pt-4.5 group-data-[collapsible=icon]:pb-2.5">
        <div className="flex items-center justify-between gap-3 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-2">
          <Link
            href="/panel"
            className="inline-flex min-w-0 items-center gap-2.5 text-sidebar-foreground"
            aria-label={tNav("brand")}
          >
            <span
              className={cn(
                brandMarkTileClassName,
                "group-data-[collapsible=icon]:size-10",
              )}
              aria-hidden
            >
              <BrandMark className="size-5 group-data-[collapsible=icon]:size-[1.35rem]" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              {tNav("brand")}
            </span>
          </Link>
          <SidebarTrigger
            aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
            title={collapsed ? t("expandSidebar") : t("collapseSidebar")}
            className={triggerClassName}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-2 py-0 group-data-[collapsible=icon]:px-3.5 group-data-[collapsible=icon]:pt-1">
          <SidebarGroupContent>
            <nav aria-label={t("menu")}>
              <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:gap-px">
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
      <SidebarFooter className="gap-1 p-4 group-data-[collapsible=icon]:items-stretch group-data-[collapsible=icon]:px-3.5 group-data-[collapsible=icon]:pt-2 group-data-[collapsible=icon]:pb-3.5">
        <SidebarSeparator className="mx-0 mb-1 bg-(--glass-line) group-data-[collapsible=icon]:mx-1" />
        <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <NotificationsMenu
            variant="sidebar"
            triggerClassName={cn(
              "group-data-[collapsible=icon]:h-[42px] group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-[13px] group-data-[collapsible=icon]:px-0",
            )}
          />
        </div>
        <SidebarMenu className="group-data-[collapsible=icon]:gap-px">
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={settingsActive}
              tooltip={t("settingsTooltip")}
              className={menuButtonClassName}
              render={<Link href="/panel/ayarlar" />}
              onClick={() => setOpenMobile(false)}
            >
              <Settings className="size-4" strokeWidth={1.75} aria-hidden />
              <span>{t("settings")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mb-1 rounded-[18px] bg-(--glass-2) p-2 shadow-[inset_0_0_0_1px_var(--glass-line)] group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-none">
          <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:h-10.5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:hover:bg-transparent">
              <ProfileAvatar
                name={resolvedUser.name}
                email={resolvedUser.email}
                avatarUrl={resolvedUser.avatarUrl}
                shape="rounded"
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
                className="min-w-0 flex-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40 group-data-[collapsible=icon]:hidden"
                aria-label={t("settings")}
              >
                <p className="truncate text-base font-medium text-sidebar-foreground">
                  {displayName}
                </p>
              </Link>
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-9 w-full text-base text-sidebar-foreground/80",
            railIconButtonClassName,
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
    </Sidebar>
  );
}
