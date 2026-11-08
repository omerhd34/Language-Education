"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export function PanelLoading() {
  const t = useTranslations("Dashboard");

  return (
    <div
      className="page-shell"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="sr-only">{t("loading")}</p>

      <div
        className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.15fr_1.35fr_11rem]"
        aria-hidden
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="dashboard-panel space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="space-y-2" aria-hidden>
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <div className="flex flex-wrap gap-2" aria-hidden>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="glass-panel space-y-4 rounded-2xl p-6">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
