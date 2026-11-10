"use client";

import { useEffect } from "react";
import type { ListeningSection } from "@/data/listenings/types";
import { ListeningAudioView } from "@/components/features/listening/ListeningAudioView";
import { ListeningExercisesView } from "@/components/features/listening/ListeningExercisesView";
import {
  LISTENING_SECTION_ANCHORS,
  listeningSectionHeadingId,
  scrollToListeningSection,
  tabFromListeningLocationHash,
} from "@/lib/listeningSectionTab";
import { useTranslations } from "next-intl";

type ListeningSectionViewProps = {
  section: ListeningSection;
};

export function ListeningSectionView({ section }: ListeningSectionViewProps) {
  const t = useTranslations("Listening");

  useEffect(() => {
    const tab = tabFromListeningLocationHash();
    if (!tab) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      scrollToListeningSection(tab);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="space-y-12">
      <section
        id={LISTENING_SECTION_ANCHORS.audio}
        aria-labelledby={listeningSectionHeadingId("audio")}
      >
        <h2 id={listeningSectionHeadingId("audio")} className="sr-only">
          {t("tabAudio")}
        </h2>
        <ListeningAudioView section={section} />
      </section>

      <section
        id={LISTENING_SECTION_ANCHORS.practice}
        aria-labelledby={listeningSectionHeadingId("practice")}
        className="min-h-[calc(100svh-6rem)] border-t border-border pt-10 pb-16"
      >
        <h2
          id={listeningSectionHeadingId("practice")}
          className="section-title mb-2 scroll-mt-6"
        >
          {t("tabPractice")}
        </h2>
        <ListeningExercisesView section={section} />
      </section>
    </div>
  );
}
