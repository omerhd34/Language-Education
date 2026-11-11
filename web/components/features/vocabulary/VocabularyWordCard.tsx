"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  Check,
  ChevronDown,
  MessageCircle,
  Timer,
  Volume2,
} from "lucide-react";
import type { VocabularyWord } from "@/data/vocabulary";
import type { VocabularyWordStatusValue } from "@/store/api";
import { LanguageFlag } from "@/components/features/vocabulary/LanguageFlag";
import { VocabularyWordImage } from "@/components/features/vocabulary/VocabularyWordImage";
import { Button } from "@/components/ui/Button";
import {
  vocabularyListenActivityId,
  type VocabularyStatusActivity,
} from "@/lib/vocabularyActivity";
import { markVocabularyActivity } from "@/lib/vocabularyActivityStorage";
import { speakText } from "@/lib/speakText";
import {
  getSimilarWords,
  getVocabularyWordElementId,
  scrollToVocabularyWord,
} from "@/lib/vocabulary/similarWords";
import { cn } from "@/lib/utils";

type VocabularyWordCardProps = {
  word: VocabularyWord;
  categoryId: string;
  categoryWords: VocabularyWord[];
  index: number;
  status?: VocabularyWordStatusValue;
  timerPending?: boolean;
  learnDisabled: boolean;
  isUpdating: boolean;
  onSetStatus: (
    status: VocabularyWordStatusValue | null,
    activity?: VocabularyStatusActivity,
  ) => void;
};

const lockedButtonClassName =
  "cursor-not-allowed border-brand-200 bg-brand-100/80 text-brand-400 opacity-100 hover:bg-brand-100/80 hover:text-brand-400 dark:border-brand-800 dark:bg-brand-900/70 dark:text-brand-500 dark:hover:bg-brand-900/70";

function highlightWord(sentence: string, target: string) {
  const trimmed = target.trim();
  if (!trimmed) {
    return sentence;
  }

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `(?<![\\p{L}\\p{N}])(${escaped})(?![\\p{L}\\p{N}])`,
    "giu",
  );
  const parts = sentence.split(regex);

  return parts.map((part, partIndex) => {
    if (
      part.toLocaleLowerCase("tr-TR") === trimmed.toLocaleLowerCase("tr-TR")
    ) {
      return (
        <strong
          key={`${part}-${partIndex}`}
          className="font-semibold text-brand-950 dark:text-brand-50"
        >
          {part}
        </strong>
      );
    }
    return <span key={`${part}-${partIndex}`}>{part}</span>;
  });
}

export function VocabularyWordCard({
  word,
  categoryId,
  categoryWords,
  index,
  status,
  timerPending = false,
  learnDisabled,
  isUpdating,
  onSetStatus,
}: VocabularyWordCardProps) {
  const t = useTranslations("Vocabulary");
  const [examplesOpen, setExamplesOpen] = useState(true);
  const isKnown = status === "KNOWN";
  const isLearning = status === "LEARNING";
  const knowDisabled = learnDisabled || isLearning;
  const learnButtonDisabled = isUpdating || learnDisabled;
  const examplesPanelId = `vocab-examples-${word.id}`;
  const similarWords = getSimilarWords(word, categoryWords);
  const similarWordsWithoutLink = similarWords.filter(
    (similar) => !similar.targetWordId,
  );

  function recordListen(target: string) {
    markVocabularyActivity(
      categoryId,
      vocabularyListenActivityId(word.id, target),
    );
  }

  return (
    <article
      id={getVocabularyWordElementId(word.id)}
      className={cn(
        "scroll-mt-24 flex overflow-hidden rounded-[1.75rem] border bg-white shadow-sm transition-[border-color,box-shadow] duration-200 dark:bg-brand-950/40",
        "hover:shadow-md hover:shadow-brand-900/5 dark:hover:shadow-black/25",
        isKnown && "border-emerald-500/30 dark:border-emerald-400/25",
        isLearning && "border-sky-500/35 dark:border-sky-400/30",
        !status && "border-brand-200/80 dark:border-brand-800/70",
      )}
    >
      <div
        className={cn(
          "flex w-11 shrink-0 items-center justify-center border-r",
          isKnown &&
            "border-emerald-500/20 bg-emerald-500/10 dark:border-emerald-400/20 dark:bg-emerald-400/10",
          isLearning &&
            "border-sky-500/20 bg-sky-500/10 dark:border-sky-400/20 dark:bg-sky-400/10",
          !status &&
            "border-brand-200/70 bg-brand-50 dark:border-brand-800/70 dark:bg-brand-900/50",
        )}
      >
        <span className="-rotate-90 font-display text-sm font-semibold tracking-[0.18em] text-brand-600 tabular-nums dark:text-brand-300">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-500/8 py-2 pr-4 pl-3 dark:border-rose-400/20 dark:bg-rose-400/10">
              <LanguageFlag
                code="tr"
                title={t("turkish")}
                className="h-4 w-6"
              />
              <span className="font-display text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl dark:text-brand-50">
                {word.tr}
              </span>
            </h2>
            <p className="inline-flex items-center gap-2 rounded-2xl border border-sky-500/20 bg-sky-500/8 py-2 pr-2 pl-3 dark:border-sky-400/20 dark:bg-sky-400/10">
              <LanguageFlag
                code="en"
                title={t("english")}
                className="h-4 w-6"
              />
              <span className="font-display text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl dark:text-brand-50">
                {word.en}
              </span>
              <button
                type="button"
                onClick={() => {
                  recordListen("word");
                  speakText(word.en);
                }}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl bg-sky-500/15 text-sky-700 transition-colors hover:bg-sky-500/25 dark:bg-sky-400/20 dark:text-sky-200 dark:hover:bg-sky-400/30"
                aria-label={t("speakWord", { word: word.en })}
              >
                <Volume2 className="size-4" aria-hidden />
              </button>
            </p>
            {isKnown ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-800 uppercase dark:text-emerald-200">
                <Check className="size-3" aria-hidden />
                {t("knownBadge")}
              </span>
            ) : null}
            {isLearning ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-sky-800 uppercase dark:text-sky-200">
                {timerPending ? (
                  <Timer className="size-3" aria-hidden />
                ) : (
                  <BookOpen className="size-3" aria-hidden />
                )}
                {timerPending ? t("timerPendingBadge") : t("learningBadge")}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isUpdating || knowDisabled}
              aria-pressed={isKnown}
              className={cn(
                "rounded-full",
                isKnown &&
                  !knowDisabled &&
                  "border-transparent! bg-emerald-700! text-white! hover:bg-emerald-700/90! dark:bg-emerald-600! dark:hover:bg-emerald-600/90!",
                knowDisabled && lockedButtonClassName,
              )}
              onClick={() => {
                if (knowDisabled) {
                  return;
                }
                onSetStatus(
                  isKnown ? null : "KNOWN",
                  isKnown ? undefined : "known",
                );
              }}
            >
              <Check className="size-3.5" aria-hidden />
              {t("knowWord")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={learnButtonDisabled}
              aria-pressed={isLearning}
              title={
                isKnown && !learnDisabled
                  ? t("relearnFromKnownHint")
                  : undefined
              }
              className={cn(
                "rounded-full",
                isLearning &&
                  !learnButtonDisabled &&
                  "border-transparent! bg-sky-700! text-white! hover:bg-sky-700/90! dark:bg-sky-600! dark:hover:bg-sky-600/90!",
                learnButtonDisabled && lockedButtonClassName,
              )}
              onClick={() => {
                if (learnButtonDisabled) {
                  return;
                }
                if (isLearning) {
                  onSetStatus(null);
                  return;
                }
                onSetStatus("LEARNING", isKnown ? "relearn" : "learn");
              }}
            >
              <BookOpen className="size-3.5" aria-hidden />
              {isKnown ? t("relearnWord") : t("learnWord")}
            </Button>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_11rem]">
          <div className="min-w-0 space-y-4">
            {similarWords.length > 0 ? (
              <ul
                className="flex flex-wrap gap-2"
                aria-label={t("similarWordsTitle")}
              >
                {similarWords.map((similar, similarIndex) => {
                  const canNavigate = Boolean(similar.targetWordId);
                  const label = t("similarWordLabel", {
                    word: similar.label,
                  });

                  return (
                    <li
                      key={`${word.id}-similar-${similar.label}`}
                      className="inline-flex items-center gap-2"
                    >
                      {canNavigate ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (similar.targetWordId) {
                              scrollToVocabularyWord(similar.targetWordId);
                            }
                          }}
                          className="inline-flex cursor-pointer items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-500/20 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-200 dark:hover:bg-emerald-400/25"
                          aria-label={t("similarWordGoTo", {
                            word: similar.label,
                          })}
                        >
                          {label}
                        </button>
                      ) : (
                        <span className="inline-flex items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-200">
                          {label}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          recordListen(`similar:${similarIndex}`);
                          speakText(similar.label);
                        }}
                        className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-200 dark:hover:bg-emerald-400/25"
                        aria-label={t("speakSimilarWord", {
                          word: similar.label,
                        })}
                      >
                        <Volume2 className="size-4" aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <div className="rounded-[1.35rem] border border-sky-500/15 bg-sky-500/8 px-4 py-3 dark:border-sky-400/15 dark:bg-sky-400/10">
              <button
                type="button"
                onClick={() => setExamplesOpen((open) => !open)}
                aria-expanded={examplesOpen}
                aria-controls={examplesPanelId}
                className="flex w-full cursor-pointer items-center gap-2 text-left"
              >
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-sky-500/15 text-sky-700 dark:bg-sky-400/20 dark:text-sky-200">
                  <MessageCircle className="size-3.5" aria-hidden />
                </span>
                <span className="flex-1 text-sm font-semibold text-brand-950 dark:text-brand-100">
                  {t("examplesTitle")}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-sky-700 transition-transform dark:text-sky-200",
                    examplesOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>

              {examplesOpen ? (
                <ul id={examplesPanelId} className="mt-3 space-y-3">
                  {word.examples.map((example, exampleIndex) => (
                    <li
                      key={`${word.id}-ex-${exampleIndex}`}
                      className="rounded-2xl bg-white/80 px-3.5 py-3 dark:bg-brand-950/45"
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            recordListen(`example:${exampleIndex}`);
                            speakText(example.en);
                          }}
                          className="mt-0.5 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-sky-500/10 text-sky-700 transition-colors hover:bg-sky-500/15 dark:bg-sky-400/15 dark:text-sky-200"
                          aria-label={t("speakExample", {
                            index: exampleIndex + 1,
                          })}
                        >
                          <Volume2 className="size-3.5" aria-hidden />
                        </button>
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm leading-relaxed text-brand-800 dark:text-brand-200">
                            {highlightWord(example.tr, word.tr)}
                          </p>
                          <p className="text-sm leading-relaxed text-brand-500 dark:text-brand-400">
                            {highlightWord(example.en, word.en)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {similarWordsWithoutLink.length > 0 ? (
              <div
                className="rounded-[1.35rem] border border-emerald-500/15 bg-emerald-500/8 px-4 py-3 dark:border-emerald-400/15 dark:bg-emerald-400/10"
                aria-label={t("similarExamplesTitle")}
              >
                <p className="text-sm font-semibold text-brand-950 dark:text-brand-100">
                  {t("similarExamplesTitle")}
                </p>
                <ul className="mt-3 space-y-3">
                  {similarWordsWithoutLink.map((similar) => {
                    const similarIndex = similarWords.findIndex(
                      (item) => item.label === similar.label,
                    );
                    return (
                      <li
                        key={`${word.id}-similar-ex-${similar.label}`}
                        className="rounded-2xl bg-white/80 px-3.5 py-3 dark:bg-brand-950/45"
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              recordListen(`similar-example:${similarIndex}`);
                              speakText(similar.example.en);
                            }}
                            className="mt-0.5 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:bg-emerald-400/15 dark:text-emerald-200"
                            aria-label={t("speakSimilarExample", {
                              word: similar.label,
                            })}
                          >
                            <Volume2 className="size-3.5" aria-hidden />
                          </button>
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase dark:text-emerald-200">
                              {t("similarWordLabel", { word: similar.label })}
                            </p>
                            <p className="text-sm leading-relaxed text-brand-800 dark:text-brand-200">
                              {highlightWord(
                                similar.example.tr,
                                similar.labelTr,
                              )}
                            </p>
                            <p className="text-sm leading-relaxed text-brand-500 dark:text-brand-400">
                              {highlightWord(similar.example.en, similar.label)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mx-auto w-full max-w-44 lg:mx-0 lg:max-w-none">
            <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-zinc-100 ring-1 ring-brand-900/5 dark:bg-brand-900 dark:ring-white/10">
              <VocabularyWordImage
                wordId={word.id}
                wordEn={word.en}
                image={word.image}
                alt={t("wordImageAlt", { word: word.en })}
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
