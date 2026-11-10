"use client";

import { useTranslations } from "next-intl";
import { LevelStatusCard } from "@/components/features/dashboard/LevelStatusCard";
import { MyPointsSection } from "@/components/features/dashboard/MyPointsSection";

export function ProgressSection() {
  const t = useTranslations("Dashboard");

  return (
    <section
      id="progress"
      aria-labelledby="progress-heading"
      className="space-y-8"
    >
      <div>
        <h1 id="progress-heading" className="page-title">
          {t("progressTitle")}
        </h1>
        <p className="page-subtitle">{t("progressSubtitle")}</p>
      </div>

      <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <LevelStatusCard />
        <MyPointsSection />
      </div>
    </section>
  );
}
