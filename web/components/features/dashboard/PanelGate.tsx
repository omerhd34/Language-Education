"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { PanelLoading } from "@/components/features/dashboard/PanelLoading";
import { QuizReadyNotificationWatcher } from "@/components/features/dashboard/QuizReadyNotificationWatcher";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useRouter } from "@/i18n/navigation";
import { useAppSelector } from "@/hooks/useAppSelector";

type PanelGateProps = {
  children: React.ReactNode;
};

export function PanelGate({ children }: PanelGateProps) {
  const t = useTranslations("Dashboard");
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const router = useRouter();
  const ready = status === "authenticated" && Boolean(user);

  useEffect(() => {
    if (status === "anonymous") {
      router.replace("/panelLogin");
    }
  }, [router, status]);

  if (status === "unknown") {
    return <PanelLoading />;
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("loginRequired")}
        </p>
        <ButtonLink href="/panelLogin">{t("goLogin")}</ButtonLink>
      </div>
    );
  }

  return (
    <>
      <QuizReadyNotificationWatcher />
      {children}
    </>
  );
}
