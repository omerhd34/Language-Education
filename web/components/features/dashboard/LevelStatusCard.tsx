"use client";

import { useTranslations } from "next-intl";
import { ChevronRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLevelStatus } from "@/hooks/useLevelStatus";
import { navigatePanelSection } from "@/hooks/usePanelHash";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getCefrLevelBadgeClass } from "@/lib/topicAccess";
import { DashboardStatProgressBar } from "@/components/features/dashboard/DashboardStatProgressBar";
import { cn } from "@/lib/utils";

const CTA_LABEL: Record<
  ReturnType<typeof useLevelStatus>["ctaSection"],
  "levelStatusCtaGrammar" | "levelStatusCtaVocabulary" | "levelStatusCtaReading"
> = {
  dilbilgisi: "levelStatusCtaGrammar",
  kelimeler: "levelStatusCtaVocabulary",
  okuma: "levelStatusCtaReading",
};

export function LevelStatusCard() {
  const t = useTranslations("Dashboard");
  const { level, percent, complete, ctaSection } = useLevelStatus();
  const pathname = usePathname();
  const router = useRouter();

  function goToSection() {
    const onPanel = pathname === "/panel" || pathname === "/";
    if (onPanel) {
      navigatePanelSection(ctaSection);
      return;
    }
    router.push(`/panel#${ctaSection}`);
  }

  return (
    <article className="dashboard-panel dashboard-panel--stat">
      <p className="dashboard-panel__label text-base">
        <GraduationCap className="size-4" aria-hidden />
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

      <DashboardStatProgressBar
        value={percent}
        max={100}
        ariaLabel={t("levelStatusProgressAria", { level, percent })}
      />

      <p className="mt-2 text-xs text-brand-600 dark:text-brand-400">
        {complete
          ? t("levelStatusComplete", { level })
          : t("levelStatusHint", { level })}
      </p>

      <div className="mt-auto pt-3">
        <Button type="button" size="sm" variant="outline" onClick={goToSection}>
          {t(CTA_LABEL[ctaSection])}
          <ChevronRight className="size-3.5" aria-hidden />
        </Button>
      </div>
    </article>
  );
}
