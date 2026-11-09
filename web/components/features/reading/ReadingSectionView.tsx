"use client";

import { useEffect } from "react";
import type { ReadingSection } from "@/data/readings/types";
import { ReadingExercisesView } from "@/components/features/reading/ReadingExercisesView";
import { ReadingTextView } from "@/components/features/reading/ReadingTextView";
import {
  READING_SECTION_ANCHORS,
  readingSectionHeadingId,
  scrollToReadingSection,
  tabFromLocationHash,
} from "@/lib/readingSectionTab";
import { useTranslations } from "next-intl";

export type { ReadingSectionTab } from "@/lib/readingSectionTab";

type ReadingSectionViewProps = {
  section: ReadingSection;
};

export function ReadingSectionView({ section }: ReadingSectionViewProps) {
  const t = useTranslations("Reading");

  useEffect(() => {
    const tab = tabFromLocationHash();
    if (!tab) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      scrollToReadingSection(tab);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="space-y-12">
      <section
        id={READING_SECTION_ANCHORS.text}
        aria-labelledby={readingSectionHeadingId("text")}
      >
        <h2 id={readingSectionHeadingId("text")} className="sr-only">
          {t("tabText")}
        </h2>
        <ReadingTextView section={section} />
      </section>

      <section
        id={READING_SECTION_ANCHORS.practice}
        aria-labelledby={readingSectionHeadingId("practice")}
        className="min-h-[calc(100svh-6rem)] border-t border-border pt-10 pb-16"
      >
        <h2
          id={readingSectionHeadingId("practice")}
          className="section-title mb-2 scroll-mt-6"
        >
          {t("tabPractice")}
        </h2>
        <ReadingExercisesView section={section} />
      </section>
    </div>
  );
}
