"use client";

import { useRouter } from "@/i18n/navigation";
import { AppSidebar } from "@/components/layout/app/AppSidebar";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useLogoutMutation, type AuthUser } from "@/store/api";
import { clearCredentials } from "@/store/authSlice";

type AppShellProps = {
  user: AuthUser;
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

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
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      <AppSidebar
        user={user}
        isLoggingOut={isLoggingOut}
        onLogout={() => void handleLogout()}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
