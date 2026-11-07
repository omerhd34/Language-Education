"use client";

import { useTranslations } from "next-intl";
import { ChevronRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLevelStatus } from "@/hooks/useLevelStatus";
import { navigatePanelSection } from "@/hooks/usePanelHash";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getCefrLevelBadgeClass } from "@/lib/topicAccess";
import { cn } from "@/lib/utils";

export function LevelStatusCard() {
  const t = useTranslations("Dashboard");
  const { level, percent, complete } = useLevelStatus();
  const pathname = usePathname();
  const router = useRouter();

  function goToTopics() {
    const onPanel = pathname === "/panel" || pathname === "/";
    if (onPanel) {
      navigatePanelSection("dilbilgisi");
      return;
    }
    router.push("/panel#dilbilgisi");
  }

  return (
    <article className="dashboard-panel dashboard-panel--stat">
      <p className="dashboard-panel__label">
        <GraduationCap className="size-3.5" aria-hidden />
        {t("levelStatus")}
      </p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-semibold",
            getCefrLevelBadgeClass(level),
          )}
        >
          {level}
        </span>
        <p className="font-display text-2xl font-semibold tracking-tight text-brand-950 tabular-nums dark:text-brand-100">
          %{percent}
        </p>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted dark:bg-white/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("levelStatusProgressAria", { level, percent })}
      >
        <div
          className="h-full rounded-full bg-sky-500 transition-[width] duration-300 dark:bg-sky-400"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-brand-600 dark:text-brand-400">
        {complete
          ? t("levelStatusComplete", { level })
          : t("levelStatusHint", { level })}
      </p>

      <div className="mt-auto pt-3">
        <Button type="button" size="sm" variant="outline" onClick={goToTopics}>
          {t("levelStatusCta")}
          <ChevronRight className="size-3.5" aria-hidden />
        </Button>
      </div>
    </article>
  );
}
