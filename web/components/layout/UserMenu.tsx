"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { getUserInitials } from "@/lib/userInitials";
import type { AuthUser } from "@/store/api";

type UserMenuProps = {
  user: AuthUser;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function UserMenu({ user, isLoggingOut, onLogout }: UserMenuProps) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const accountLabel = user.name?.trim() || user.email;
  const initials = getUserInitials(user.name, user.email);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-brand-950"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={accountLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 w-56 rounded-lg border border-border bg-surface p-2 shadow-sm dark:bg-brand-900"
        >
          <div className="border-b border-border px-2 py-2">
            <p className="truncate text-sm font-medium text-brand-950 dark:text-brand-100">
              {accountLabel}
            </p>
            {user.name?.trim() ? (
              <p className="truncate text-xs text-brand-600 dark:text-brand-400">
                {user.email}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            role="menuitem"
            className="mt-1 w-full cursor-pointer justify-start"
            disabled={isLoggingOut}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            {t("logout")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
