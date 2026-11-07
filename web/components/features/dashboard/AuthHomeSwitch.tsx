"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";

type AuthHomeSwitchProps = {
  children: React.ReactNode;
};

export function AuthHomeSwitch({ children }: AuthHomeSwitchProps) {
  const status = useAuthStore((state) => state.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/panel");
    }
  }, [router, status]);

  if (status === "authenticated") {
    return null;
  }

  return children;
}
