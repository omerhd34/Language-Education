"use client";

import { useEffect } from "react";
import type { WritingSection } from "@/data/writings/types";
import { WritingExercisesView } from "@/components/features/writing/WritingExercisesView";
import { WritingModelView } from "@/components/features/writing/WritingModelView";
import { WritingTipsPanel } from "@/components/features/writing/WritingTipsPanel";
import {
  WRITING_SECTION_ANCHORS,
  scrollToWritingSection,
  tabFromWritingLocationHash,
  writingSectionHeadingId,
} from "@/lib/writingSectionTab";
import { useTranslations } from "next-intl";

type WritingSectionViewProps = {
  section: WritingSection;
};

export function WritingSectionView({ section }: WritingSectionViewProps) {
  const t = useTranslations("Writing");

  useEffect(() => {
    const tab = tabFromWritingLocationHash();
    if (!tab) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      scrollToWritingSection(tab);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="space-y-12">
      <section
        id={WRITING_SECTION_ANCHORS.model}
        aria-labelledby={writingSectionHeadingId("model")}
        className="pt-2 sm:pt-4"
      >
        <h2 id={writingSectionHeadingId("model")} className="sr-only">
          {t("tabModel")}
        </h2>
        <WritingModelView section={section} />
      </section>

      {section.practice.tips && section.practice.tips.length > 0 ? (
        <WritingTipsPanel tips={section.practice.tips} />
      ) : null}

      <section
        id={WRITING_SECTION_ANCHORS.practice}
        aria-labelledby={writingSectionHeadingId("practice")}
        className="min-h-[calc(100svh-6rem)] border-t border-border pt-10 pb-16"
      >
        <h2
          id={writingSectionHeadingId("practice")}
          className="section-title mb-2 scroll-mt-6"
        >
          {t("tabPractice")}
        </h2>
        <WritingExercisesView section={section} />
      </section>
    </div>
  );
}
