"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  AppSidebar,
  AppSidebarMobileBar,
} from "@/components/layout/app/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useLogoutMutation, type AuthUser } from "@/store/api";
import { clearCredentials } from "@/store/authSlice";

const COLLAPSE_KEY = "pylmor-sidebar-collapsed";

type AppShellProps = {
  user: AuthUser;
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(COLLAPSE_KEY) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- kayıtlı daraltma tercihini ilk yüklemede uygula
        setOpen(false);
      }
    } catch {
      // ignore
    }
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    try {
      window.localStorage.setItem(COLLAPSE_KEY, next ? "0" : "1");
    } catch {
      // ignore
    }
  }

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
      <SidebarProvider open={open} onOpenChange={handleOpenChange}>
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
