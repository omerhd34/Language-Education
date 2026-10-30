"use client";

import { AuthSessionBootstrap } from "@/components/providers/AuthSessionBootstrap";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <AuthSessionBootstrap>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthSessionBootstrap>
    </StoreProvider>
  );
}
