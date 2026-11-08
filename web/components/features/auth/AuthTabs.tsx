"use client";

import { LogIn, UserPlus } from "lucide-react";
import type { AuthMode } from "@/components/features/auth/auth-types";
import { cn } from "@/lib/utils";

type AuthTabsProps = {
  mode: AuthMode;
  ariaLabel: string;
  loginLabel: string;
  registerLabel: string;
  onSwitch: (mode: AuthMode) => void;
};

export function AuthTabs({
  mode,
  ariaLabel,
  loginLabel,
  registerLabel,
  onSwitch,
}: AuthTabsProps) {
  return (
    <nav className="auth-tabs" aria-label={ariaLabel}>
      <button
        type="button"
        className={cn("auth-tab", mode === "giris" && "is-active")}
        onClick={() => onSwitch("giris")}
      >
        <LogIn className="size-4" aria-hidden />
        {loginLabel}
      </button>
      <button
        type="button"
        className={cn("auth-tab", mode === "kayit" && "is-active")}
        onClick={() => onSwitch("kayit")}
      >
        <UserPlus className="size-4" aria-hidden />
        {registerLabel}
      </button>
    </nav>
  );
}
