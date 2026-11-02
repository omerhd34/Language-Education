"use client";

import { useTranslations } from "next-intl";
import { DashboardStatsBar } from "@/components/features/dashboard/DashboardStatsBar";
import { TopicsSection } from "@/components/features/dashboard/TopicsSection";
import { VocabularySection } from "@/components/features/dashboard/VocabularySection";
import { usePanelHash } from "@/hooks/usePanelHash";

const READY_SECTIONS = new Set(["konular", "kelime"]);

export function DashboardHome() {
  const t = useTranslations("Dashboard");
  const hash = usePanelHash();
  const section = hash.replace(/^#/, "");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <DashboardStatsBar />
      {section === "konular" ? <TopicsSection /> : null}
      {section === "kelime" ? <VocabularySection /> : null}
      {section !== "" && !READY_SECTIONS.has(section) ? (
        <section className="space-y-2" aria-labelledby="section-soon-heading">
          <h1
            id="section-soon-heading"
            className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
          >
            {t("sectionSoonTitle")}
          </h1>
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("sectionSoonBody")}
          </p>
        </section>
      ) : null}
    </div>
  );
}
