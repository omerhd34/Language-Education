"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Check,
  FileText,
  Headphones,
  Languages,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ReadingParagraphText } from "@/components/features/reading/ReadingParagraphText";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/toast";
import type { ListeningSection } from "@/data/listenings/types";
import { useListeningSectionStatus } from "@/hooks/useListeningProgress";
import { tryMarkListeningLevelPassed } from "@/lib/listeningAccess";
import { getListeningSpeakText } from "@/lib/listeningContent";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";
import { mergeReadingGlossaries } from "@/lib/reading/mergeReadingGlossaries";
import {
  isListeningSectionComplete,
  markListeningListened,
} from "@/lib/listeningProgressStorage";
import { speakText, stopSpeaking } from "@/lib/speakText";
import { cn } from "@/lib/utils";

type ListeningAudioViewProps = {
  section: ListeningSection;
};

export function ListeningAudioView({ section }: ListeningAudioViewProps) {
  const t = useTranslations("Listening");
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const aliveRef = useRef(true);
  const { listened } = useListeningSectionStatus(section.id);
  const speakTextFull = getListeningSpeakText(section);
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
        const wasComplete = isListeningSectionComplete(section.id);
        markListeningListened(section.id);
        tryMarkListeningLevelPassed(section.level);
        if (!wasComplete && isListeningSectionComplete(section.id)) {
          toast.add({
            id: `listening-section-complete-${section.id}`,
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

  const titleEn = getDistinctSecondaryTitle(section.title, section.titleEn);

  return (
    <div className="dashboard-panel space-y-6">
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl border border-border bg-background/40 px-6 py-10 text-center",
          speaking && "ring-2 ring-sky-400/50",
        )}
      >
        <span
          className={cn(
            "inline-flex size-16 items-center justify-center rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-300",
            speaking && "motion-safe:animate-pulse",
          )}
        >
          <Headphones className="size-8" aria-hidden />
        </span>
        <div className="space-y-1">
          <h2 className="section-title">{titleEn ?? section.titleEn}</h2>
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("audioHint")}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            size="lg"
            variant={speaking ? "default" : "outline"}
            className="min-w-40"
            onClick={handleListenClick}
          >
            {speaking ? (
              <VolumeX className="size-5" aria-hidden />
            ) : listened ? (
              <Check className="size-5" aria-hidden />
            ) : (
              <Volume2 className="size-5" aria-hidden />
            )}
            {speaking
              ? t("listenStop")
              : listened
                ? t("listenDone")
                : t("listenPlay")}
          </Button>
          <Button
            type="button"
            size="lg"
            variant={showTranscript ? "default" : "outline"}
            aria-pressed={showTranscript}
            onClick={() => setShowTranscript((value) => !value)}
          >
            <FileText className="size-5" aria-hidden />
            {showTranscript ? t("hideTranscript") : t("showTranscript")}
          </Button>
          {showTranscript ? (
            <Button
              type="button"
              size="lg"
              variant={showTranslation ? "default" : "outline"}
              aria-pressed={showTranslation}
              onClick={() => setShowTranslation((value) => !value)}
            >
              <Languages className="size-5" aria-hidden />
              {showTranslation ? t("hideTranslation") : t("showTranslation")}
            </Button>
          ) : null}
        </div>
      </div>

      {showTranscript ? (
        <article className="space-y-6 border-t border-border pt-6">
          {section.body.paragraphs.map((paragraph) => (
            <ReadingParagraphText
              key={`${paragraph.number ?? 0}-${paragraph.en.slice(0, 24)}`}
              paragraph={paragraph}
              showTranslation={showTranslation}
              readingLevel={section.level}
              mergedGlossary={mergedGlossary}
            />
          ))}
        </article>
      ) : null}
    </div>
  );
}
