"use client";

import { useTranslations } from "next-intl";
import type { SpeakingSectionTab } from "@/lib/speakingSectionTab";
import { cn } from "@/lib/utils";

type SpeakingSectionTabsProps = {
  activeTab: SpeakingSectionTab;
  onChange: (tab: SpeakingSectionTab) => void;
};

export function SpeakingSectionTabs({
  activeTab,
  onChange,
}: SpeakingSectionTabsProps) {
  const t = useTranslations("Speaking");

  return (
    <nav
      aria-label={t("tabsAria")}
      className="flex gap-1 border-b border-border"
    >
      {(
        [
          { id: "model" as const, label: t("tabModel") },
          { id: "practice" as const, label: t("tabPractice") },
        ] as const
      ).map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "border-sky-500 text-brand-950 dark:text-brand-100"
              : "border-transparent text-brand-500 hover:text-brand-950 dark:text-brand-400 dark:hover:text-brand-100",
          )}
          aria-current={activeTab === tab.id ? "page" : undefined}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
