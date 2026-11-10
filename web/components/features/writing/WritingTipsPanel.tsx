"use client";

import { useTranslations } from "next-intl";
import type { WritingTip } from "@/data/writings/types";

type WritingTipsPanelProps = {
  tips: WritingTip[];
};

export function WritingTipsPanel({ tips }: WritingTipsPanelProps) {
  const t = useTranslations("Writing");

  if (tips.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="writing-ipuclari-heading"
      className="border-t border-border pt-10"
    >
      <div className="dashboard-panel space-y-3 p-4 sm:p-6">
        <h2 id="writing-ipuclari-heading" className="section-title scroll-mt-6">
          {t("tipsTitle")}
        </h2>
        <ol className="list-decimal space-y-3 ps-5 leading-relaxed text-brand-800 dark:text-brand-200">
          {tips.map((tip, index) => (
            <li key={`tip-${index}`}>
              <span className="text-base font-medium">{tip.tr}</span>
              <span className="mt-1 block text-sm text-brand-500 italic dark:text-brand-400">
                {tip.en}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
