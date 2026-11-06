"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AppShell } from "@/components/layout/app/AppShell";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { SessionHint } from "@/lib/sessionHint";
import type { AuthUser } from "@/store/api";

type SiteChromeProps = {
  children: React.ReactNode;
  initialUser: SessionHint | null;
  sidebarOpen: boolean;
};

function toAuthUser(user: AuthUser | SessionHint): AuthUser {
  if ("createdAt" in user) {
    return user;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerifiedAt: null,
    createdAt: "",
  };
}

export function SiteChrome({
  children,
  initialUser,
  sidebarOpen,
}: SiteChromeProps) {
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const shellUser =
    status === "authenticated"
      ? user
      : status === "unknown"
        ? initialUser
        : null;

  if (shellUser) {
    return (
      <AppShell user={toAuthUser(shellUser)} sidebarOpen={sidebarOpen}>
        {children}
      </AppShell>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
