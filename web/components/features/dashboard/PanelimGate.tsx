"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useRouter } from "@/i18n/navigation";
import { useAppSelector } from "@/hooks/useAppSelector";

type PanelimGateProps = {
  children: React.ReactNode;
};

export function PanelimGate({ children }: PanelimGateProps) {
  const t = useTranslations("Dashboard");
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "anonymous") {
      router.replace("/panel");
    }
  }, [router, status]);

  if (status === "unknown") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("loading")}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("loginRequired")}
        </p>
        <ButtonLink href="/panel">{t("goLogin")}</ButtonLink>
      </div>
    );
  }

  return children;
}
