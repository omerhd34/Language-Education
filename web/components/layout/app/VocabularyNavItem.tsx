"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { BookA, ChevronRight } from "lucide-react";
import { vocabularySubNav } from "@/components/layout/app/appNavLinks";
import { Link, usePathname } from "@/i18n/navigation";
import { usePanelHash } from "@/hooks/usePanelHash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuButtonClassName =
  "h-auto rounded-xl px-3 py-2.5 font-medium text-brand-400";

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

  return pathname === path;
}

export function VocabularyNavItem({ onNavigate }: VocabularyNavItemProps) {
  const t = useTranslations("AppNav");
  const pathname = usePathname();
  const panelHash = usePanelHash();
  const active =
    pathname.startsWith("/panel/kelime/") ||
    vocabularySubNav.some((item) =>
      isSubNavActive(pathname, panelHash, item.href),
    );

  return (
    <SidebarMenuItem>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          openOnHover
          delay={80}
          closeDelay={180}
          render={
            <SidebarMenuButton
              isActive={active}
              className={menuButtonClassName}
            />
          }
        >
          <BookA className="size-4" strokeWidth={1.75} aria-hidden />
          <span className="min-w-0 flex-1 truncate">{t("vocabulary")}</span>
          <ChevronRight
            className="ml-auto size-4 text-brand-500 transition-transform duration-200 in-data-popup-open:translate-x-0.5 in-data-popup-open:text-brand-100 group-data-[collapsible=icon]:hidden"
            aria-hidden
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={12}
          className="flex w-72! flex-col gap-1 rounded-2xl bg-sidebar p-2 text-sidebar-foreground shadow-2xl ring-1 ring-white/10"
        >
          {vocabularySubNav.map((item) => {
            const itemActive = isSubNavActive(pathname, panelHash, item.href);
            const Icon = item.Icon;

            return (
              <DropdownMenuItem
                key={item.href}
                closeOnClick
                nativeButton={false}
                className={cn(
                  "cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-100",
                  "focus:bg-sidebar-accent! focus:text-sidebar-accent-foreground!",
                  "focus:**:text-sidebar-accent-foreground!",
                  "data-highlighted:bg-sidebar-accent! data-highlighted:text-sidebar-accent-foreground!",
                  "data-highlighted:**:text-sidebar-accent-foreground!",
                  itemActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
                render={<Link href={item.href} />}
                aria-current={itemActive ? "page" : undefined}
                onClick={(event) => onNavigate(event, item.href)}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0 text-brand-400",
                    itemActive && "text-sky-300",
                  )}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="truncate text-inherit">
                  {t(item.labelKey)}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
