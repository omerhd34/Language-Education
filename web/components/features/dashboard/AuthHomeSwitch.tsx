"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAppSelector } from "@/hooks/useAppSelector";

type AuthHomeSwitchProps = {
  children: React.ReactNode;
};

export function AuthHomeSwitch({ children }: AuthHomeSwitchProps) {
  const status = useAppSelector((state) => state.auth.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/panelim");
    }
  }, [router, status]);

  if (status === "authenticated") {
    return null;
  }

  return children;
}
