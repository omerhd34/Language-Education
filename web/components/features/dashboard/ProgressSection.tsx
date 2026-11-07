"use client";

import { useTranslations } from "next-intl";
import { MyPointsSection } from "@/components/features/dashboard/MyPointsSection";

export function ProgressSection() {
  const t = useTranslations("Dashboard");

  return (
    <section
      id="ilerleme"
      aria-labelledby="progress-heading"
      className="space-y-8"
    >
      <div>
        <h1
          id="progress-heading"
          className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
        >
          {t("progressTitle")}
        </h1>
        <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
          {t("progressSubtitle")}
        </p>
      </div>

      <MyPointsSection />
    </section>
  );
}
