"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  AppSidebar,
  AppSidebarMobileBar,
} from "@/components/layout/app/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME,
} from "@/lib/sidebarPreference";
import { useLogoutMutation, type AuthUser } from "@/store/api";
import { clearCredentials } from "@/store/authSlice";

const LEGACY_COLLAPSE_KEY = "pylmor-sidebar-collapsed";

type AppShellProps = {
  user: AuthUser;
  sidebarOpen: boolean;
  children: React.ReactNode;
};

export function AppShell({ user, sidebarOpen, children }: AppShellProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LEGACY_COLLAPSE_KEY);
      if (stored === null) {
        return;
      }

      const hasCookie = document.cookie
        .split("; ")
        .some((part) => part.startsWith(`${SIDEBAR_COOKIE_NAME}=`));

      if (!hasCookie) {
        const open = stored === "1" ? "false" : "true";
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      }

      window.localStorage.removeItem(LEGACY_COLLAPSE_KEY);
    } catch {
      // Depolama kapalıysa tercih bir sonraki oturumda varsayılan kalır.
    }
  }, []);

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch {
      // Yerel oturumu yine kapat.
    }
    dispatch(clearCredentials());
    router.push("/");
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <AppSidebar
          user={user}
          isLoggingOut={isLoggingOut}
          onLogout={() => void handleLogout()}
        />
        <SidebarInset>
          <AppSidebarMobileBar />
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
