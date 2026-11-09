"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Languages, Volume2, VolumeX } from "lucide-react";
import { ReadingParagraphText } from "@/components/features/reading/ReadingParagraphText";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/toast";
import type {
  ReadingParagraph,
  ReadingSection,
  ReadingWordGlossary,
} from "@/data/readings/types";
import { useReadingSectionStatus } from "@/hooks/useReadingProgress";
import { tryMarkReadingLevelPassed } from "@/lib/readingAccess";
import { getReadingSpeakText } from "@/lib/readingContent";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";
import { mergeReadingGlossaries } from "@/lib/reading/mergeReadingGlossaries";
import {
  isReadingSectionComplete,
  markReadingListened,
} from "@/lib/readingProgressStorage";
import { speakText, stopSpeaking } from "@/lib/speakText";

type ReadingTextViewProps = {
  section: ReadingSection;
};

function ReadingTextBlock({
  paragraphs,
  intro,
  introTr,
  showTranslation,
  readingLevel,
  mergedGlossary,
}: {
  paragraphs: ReadingParagraph[];
  intro?: string;
  introTr?: string;
  showTranslation: boolean;
  readingLevel: ReadingSection["level"];
  mergedGlossary?: ReadingWordGlossary;
}) {
  return (
    <article className="space-y-6">
      {intro ? (
        <div className="space-y-2">
          <p className="text-base leading-7 text-brand-800 dark:text-brand-200">
            {intro}
          </p>
          {showTranslation && introTr ? (
            <p className="border-s-2 border-sky-400/60 ps-3 text-base leading-7 text-brand-600 dark:text-brand-400">
              {introTr}
            </p>
          ) : null}
        </div>
      ) : null}
      {paragraphs.map((paragraph) => (
        <ReadingParagraphText
          key={`${paragraph.number ?? 0}-${paragraph.en.slice(0, 24)}`}
          paragraph={paragraph}
          showTranslation={showTranslation}
          readingLevel={readingLevel}
          mergedGlossary={mergedGlossary}
        />
      ))}
    </article>
  );
}

export function ReadingTextView({ section }: ReadingTextViewProps) {
  const t = useTranslations("Reading");
  const [showTranslation, setShowTranslation] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const aliveRef = useRef(true);
  const { listened } = useReadingSectionStatus(section.id);
  const textTitleTr = getDistinctSecondaryTitle(
    section.textTitle ?? "",
    section.titleEn,
  );
  const speakTextFull = getReadingSpeakText(section);
  const mergedGlossary = mergeReadingGlossaries(
    section.glossary,
    section.body.glossary,
  );

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      stopSpeaking();
    };
  }, []);

  function handleListenClick() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    speakText(speakTextFull, "en-US", undefined, {
      onEnd: () => {
        if (!aliveRef.current) {
          return;
        }
        setSpeaking(false);
        const wasComplete = isReadingSectionComplete(section.id);
        markReadingListened(section.id);
        tryMarkReadingLevelPassed(section.level);
        if (!wasComplete && isReadingSectionComplete(section.id)) {
          toast.add({
            id: `reading-section-complete-${section.id}`,
            type: "success",
            title: t("sectionPassedTitle"),
          });
        }
      },
      onCancel: () => {
        if (aliveRef.current) {
          setSpeaking(false);
        }
      },
    });
  }

  return (
    <div className="dashboard-panel space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={speaking ? "default" : "outline"}
          aria-pressed={speaking}
          onClick={handleListenClick}
        >
          {speaking ? (
            <VolumeX className="size-4" aria-hidden />
          ) : listened ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Volume2 className="size-4" aria-hidden />
          )}
          {speaking
            ? t("listenStop")
            : listened
              ? t("listenDone")
              : t("listenAll")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={showTranslation ? "default" : "outline"}
          aria-pressed={showTranslation}
          onClick={() => setShowTranslation((value) => !value)}
        >
          <Languages className="size-4" aria-hidden />
          {showTranslation ? t("hideTranslation") : t("showTranslation")}
        </Button>
      </div>

      <div className="space-y-1 border-b border-border pb-4">
        <h2 className="section-title">{section.titleEn}</h2>
        {section.textTitle && textTitleTr && textTitleTr !== section.titleEn ? (
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            {section.textTitle}
          </p>
        ) : null}
      </div>

      <ReadingTextBlock
        paragraphs={section.body.paragraphs}
        intro={section.body.intro}
        introTr={section.body.introTr}
        showTranslation={showTranslation}
        readingLevel={section.level}
        mergedGlossary={mergedGlossary}
      />

      {section.subsections?.map((subsection) => {
        const subsectionTitleEn = getDistinctSecondaryTitle(
          subsection.title,
          subsection.titleEn,
        );
        return (
          <section
            key={subsection.title}
            className="space-y-4 border-t border-border pt-4"
          >
            <div className="space-y-0.5">
              <h3 className="font-display text-base font-semibold tracking-wide text-brand-950 uppercase dark:text-brand-100">
                {subsectionTitleEn ?? subsection.title}
              </h3>
              {subsectionTitleEn && subsectionTitleEn !== subsection.title ? (
                <p className="text-xs font-medium text-brand-500">
                  {subsection.title}
                </p>
              ) : null}
            </div>
            <ReadingTextBlock
              paragraphs={subsection.paragraphs}
              showTranslation={showTranslation}
              readingLevel={section.level}
              mergedGlossary={mergedGlossary}
            />
          </section>
        );
      })}
    </div>
  );
}
