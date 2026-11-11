"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { BookA } from "lucide-react";
import {
  appNavTooltipKey,
  vocabularySubNav,
} from "@/components/layout/app/appNavLinks";
import { Link, usePathname } from "@/i18n/navigation";
import { usePanelHash } from "@/hooks/usePanelHash";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const PARENT_HREF = "/panel#vocabulary";

const menuButtonClassName =
  "h-auto rounded-[13px] px-2.5 py-2 text-base font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground data-active:bg-sidebar-accent data-active:text-sidebar-foreground";

type VocabularyNavItemProps = {
  onNavigate: (event: MouseEvent<HTMLElement>, href: string) => void;
};

function isSubNavActive(pathname: string, hash: string, href: string): boolean {
  const hashIndex = href.indexOf("#");
  const path = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const itemHash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const onPanel = pathname === "/panel" || pathname === "/";

  if (itemHash) {
    return onPanel && hash === itemHash;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function VocabularyNavItem({ onNavigate }: VocabularyNavItemProps) {
  const t = useTranslations("AppNav");
  const pathname = usePathname();
  const panelHash = usePanelHash();
  const sectionActive =
    pathname.startsWith("/panel/vocabulary/") ||
    vocabularySubNav.some((item) =>
      isSubNavActive(pathname, panelHash, item.href),
    );
  const parentLabel = t("vocabulary");
  const parentTooltip = t(appNavTooltipKey("vocabulary"));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={sectionActive}
        tooltip={parentTooltip}
        className={menuButtonClassName}
        render={<Link href={PARENT_HREF} />}
        onClick={(event) => onNavigate(event, PARENT_HREF)}
      >
        <BookA className="size-4" strokeWidth={1.75} aria-hidden />
        <span>{parentLabel}</span>
      </SidebarMenuButton>

      {sectionActive ? (
        <SidebarMenuSub className="mx-3.5 mt-1 mb-1 border-l-0 px-2.5 translate-x-0 gap-0.5">
          {vocabularySubNav.map((item) => {
            const itemActive = isSubNavActive(pathname, panelHash, item.href);

            return (
              <SidebarMenuSubItem key={item.href}>
                <SidebarMenuSubButton
                  isActive={itemActive}
                  size="sm"
                  tooltip={t(appNavTooltipKey(item.labelKey))}
                  className={cn(
                    "group/sub-link h-7 gap-2 rounded-md px-2 text-sm font-medium text-sidebar-foreground/55",
                    "hover:bg-transparent hover:text-sky-600 dark:hover:text-sky-300",
                    "data-active:bg-transparent data-active:font-semibold data-active:text-sky-600 dark:data-active:text-sky-300",
                    "data-active:hover:bg-transparent",
                  )}
                  render={<Link href={item.href} />}
                  aria-current={itemActive ? "page" : undefined}
                  onClick={(event) => onNavigate(event, item.href)}
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full bg-sidebar-foreground/30 transition-colors",
                      itemActive && "bg-sky-500 dark:bg-sky-300",
                      !itemActive &&
                        "group-hover/sub-link:bg-sky-500 dark:group-hover/sub-link:bg-sky-300",
                    )}
                    aria-hidden
                  />
                  <span className="truncate">{t(item.labelKey)}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  );
}
