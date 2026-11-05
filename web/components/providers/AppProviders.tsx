"use client";

import { AuthSessionBootstrap } from "@/components/providers/AuthSessionBootstrap";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toast";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <AuthSessionBootstrap>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </AuthSessionBootstrap>
    </StoreProvider>
  );
}
