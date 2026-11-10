/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Check,
  CheckCircle2,
  RotateCcw,
  Volume2,
  X,
  XCircle,
} from "lucide-react";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { TrueFalseChoiceButtons } from "@/components/features/exercises/TrueFalseChoiceButtons";
import { ListeningMatchingBlock } from "@/components/features/listening/ListeningMatchingBlock";
import { ListeningPlayButton } from "@/components/features/listening/ListeningPlayButton";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type {
  ListeningExerciseBlock,
  ListeningClipQuestion,
} from "@/data/listenings/types";
import { scrollToListeningSection } from "@/lib/listeningSectionTab";
import { speakText, stopSpeaking } from "@/lib/speakText";
import { SECTION_PRACTICE_PASS_PERCENT } from "@/lib/sectionPracticePassPercent";
import { cn } from "@/lib/utils";

const PRACTICE_PASS_PERCENT = SECTION_PRACTICE_PASS_PERCENT;
const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

type ClipSlot = { selected: number; revealed: boolean };
type TrueFalseSlot = { answer: boolean | null; revealed: boolean };

type ListeningPracticeQuizProps = {
  block: ListeningExerciseBlock;
  recordingText: string;
  listened?: boolean;
  onComplete?: (passed: boolean, percent: number) => void;
};

function optionLetter(index: number): string {
  return OPTION_LETTERS[index] ?? String(index + 1);
}

function countMatchingPairs(block: ListeningExerciseBlock): number {
  return (block.matching ?? []).reduce(
    (sum, item) => sum + item.pairs.length,
    0,
  );
}

function totalGradableItems(block: ListeningExerciseBlock): number {
  return (
    (block.listenChoice ?? []).length +
    (block.trueFalse ?? []).length +
    countMatchingPairs(block)
  );
}

export function ListeningPracticeQuiz({
  block,
  recordingText,
  listened = false,
  onComplete,
}: ListeningPracticeQuizProps) {
  const t = useTranslations("Listening");
  const listenChoice = block.listenChoice ?? [];
  const trueFalse = block.trueFalse ?? [];
  const matching = block.matching ?? [];

  const [clipSlots, setClipSlots] = useState<Array<ClipSlot | null>>(() =>
    listenChoice.map(() => null),
  );
  const [tfSlots, setTfSlots] = useState<Array<TrueFalseSlot | null>>(() =>
    trueFalse.map(() => null),
  );
  const [matchScores, setMatchScores] = useState<
    Array<{ correct: number; total: number } | null>
  >(() => matching.map(() => null));

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [activePlayId, setActivePlayId] = useState<string | null>(null);
  const completionSentRef = useRef(false);
  const aliveRef = useRef(true);

  function handlePlayToggle(playId: string) {
    if (activePlayId === playId) {
      stopSpeaking();
      setActivePlayId(null);
      return;
    }
    stopSpeaking();
    setActivePlayId(playId);
    speakText(recordingText, "en-US", undefined, {
      onEnd: () => {
        if (aliveRef.current) {
          setActivePlayId(null);
        }
      },
      onCancel: () => {
        if (aliveRef.current) {
          setActivePlayId(null);
        }
      },
    });
  }

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      stopSpeaking();
    };
  }, []);

  const { correct, total, percent, allDone } = useMemo(() => {
    const totalItems = totalGradableItems(block);
    let correctCount = 0;

    listenChoice.forEach((q, i) => {
      const slot = clipSlots[i];
      if (slot?.revealed && slot.selected === q.correctIndex) {
        correctCount += 1;
      }
    });

    trueFalse.forEach((q, i) => {
      const slot = tfSlots[i];
      if (slot?.revealed && slot.answer === q.answer) {
        correctCount += 1;
      }
    });

    matchScores.forEach((score) => {
      if (score) {
        correctCount += score.correct;
      }
    });

    const clipDone = clipSlots.every((s) => s?.revealed);
    const tfDone = tfSlots.every((s) => s?.revealed);
    const matchDone = matchScores.every((score) => score !== null);
    const done =
      (listenChoice.length === 0 || clipDone) &&
      (trueFalse.length === 0 || tfDone) &&
      (matching.length === 0 || matchDone);

    const pct =
      totalItems === 0 ? 0 : Math.round((correctCount / totalItems) * 100);

    return {
      correct: correctCount,
      total: totalItems,
      percent: pct,
      allDone: done,
    };
  }, [
    block,
    clipSlots,
    tfSlots,
    matchScores,
    listenChoice,
    trueFalse,
    matching,
  ]);

  const passed = percent >= PRACTICE_PASS_PERCENT;
  const sectionComplete = passed && listened;

  useEffect(() => {
    if (!allDone) {
      return;
    }
    setSummaryOpen(true);
    if (completionSentRef.current) {
      return;
    }
    completionSentRef.current = true;
    onComplete?.(passed, percent);
  }, [allDone, onComplete, passed, percent]);

  function handleReset() {
    completionSentRef.current = false;
    setSummaryOpen(false);
    setClipSlots(listenChoice.map(() => null));
    setTfSlots(trueFalse.map(() => null));
    setMatchScores(matching.map(() => null));
    stopSpeaking();
    setActivePlayId(null);
  }

  if (totalGradableItems(block) === 0) {
    return <p className="page-subtitle mt-0">{t("noExercises")}</p>;
  }

  let questionNumber = 0;

  return (
    <div className="space-y-6">
      <p className="page-subtitle mt-0">{t("practiceIntro")}</p>

      <div className="dashboard-panel space-y-8 p-4 sm:p-6">
        {listenChoice.length > 0 ? (
          <section className="space-y-4">
            {listenChoice.map((question, index) => {
              questionNumber += 1;
              const num = questionNumber;
              const slot = clipSlots[index];
              return (
                <div key={question.id}>
                  {index > 0 ? <Separator className="my-6" /> : null}
                  <ListeningClipQuestion
                    question={question}
                    number={num}
                    slot={slot}
                    activePlayId={activePlayId}
                    onPlay={handlePlayToggle}
                    onSelect={(optionIndex) => {
                      setClipSlots((prev) =>
                        prev.map((s, i) =>
                          i === index
                            ? { selected: optionIndex, revealed: true }
                            : s,
                        ),
                      );
                    }}
                  />
                </div>
              );
            })}
          </section>
        ) : null}

        {trueFalse.length > 0 ? (
          <section className="space-y-4">
            {listenChoice.length > 0 ? <Separator className="my-2" /> : null}
            {trueFalse.map((question, index) => {
              questionNumber += 1;
              const num = questionNumber;
              const slot = tfSlots[index];
              return (
                <div key={question.id}>
                  {index > 0 ? <Separator className="my-6" /> : null}
                  <ListeningTrueFalseRow
                    question={question}
                    number={num}
                    slot={slot}
                    activePlayId={activePlayId}
                    onPlay={handlePlayToggle}
                    onSelect={(answer) => {
                      setTfSlots((prev) =>
                        prev.map((s, i) =>
                          i === index ? { answer, revealed: true } : s,
                        ),
                      );
                    }}
                  />
                </div>
              );
            })}
          </section>
        ) : null}

        {matching.length > 0 ? (
          <section className="space-y-6">
            {listenChoice.length > 0 || trueFalse.length > 0 ? (
              <Separator className="my-2" />
            ) : null}
            {matching.map((question, index) => {
              questionNumber += 1;
              const num = questionNumber;
              return (
                <div key={question.id}>
                  {index > 0 ? <Separator className="my-6" /> : null}
                  <ListeningMatchingBlock
                    question={question}
                    number={num}
                    headerActions={
                      <ListeningPlayButton
                        playId={question.id}
                        activePlayId={activePlayId}
                        onPlay={handlePlayToggle}
                      />
                    }
                    onGraded={(correctPairs, totalPairs) => {
                      setMatchScores((prev) =>
                        prev.map((v, i) =>
                          i === index
                            ? { correct: correctPairs, total: totalPairs }
                            : v,
                        ),
                      );
                    }}
                  />
                </div>
              );
            })}
          </section>
        ) : null}
      </div>

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="items-center text-center sm:items-center sm:text-center">
            <span
              className={cn(
                "mx-auto mb-1 flex size-14 items-center justify-center rounded-full",
                passed
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                  : "bg-red-500/15 text-red-600 dark:text-red-300",
              )}
            >
              {passed ? (
                <CheckCircle2 className="size-7" aria-hidden />
              ) : (
                <XCircle className="size-7" aria-hidden />
              )}
            </span>
            <DialogTitle
              className={cn(
                "font-display text-2xl",
                passed
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-700 dark:text-red-300",
              )}
            >
              {sectionComplete
                ? t("sectionPassedTitle")
                : passed
                  ? t("practicePassedTitle")
                  : t("practiceMissedTitle")}
            </DialogTitle>
            <DialogDescription className="text-base text-brand-700 dark:text-brand-300">
              {t("scoreSummary", { correct, total, percent })}
            </DialogDescription>
            {passed && !listened ? (
              <p className="text-center text-sm text-brand-700 dark:text-brand-300">
                {t("practiceNeedListen")}
              </p>
            ) : null}
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleReset}
            >
              <RotateCcw aria-hidden />
              {t("resetAnswers")}
            </Button>
            {passed && !listened ? (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => {
                  setSummaryOpen(false);
                  scrollToListeningSection("audio");
                }}
              >
                <Volume2 aria-hidden />
                {t("listenAll")}
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => setSummaryOpen(false)}
              >
                <Check aria-hidden />
                {t("continue")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {allDone && !summaryOpen ? (
        <Button type="button" variant="outline" onClick={handleReset}>
          <RotateCcw aria-hidden />
          {t("resetAnswers")}
        </Button>
      ) : null}
    </div>
  );
}

function ListeningClipQuestion({
  question,
  number,
  slot,
  activePlayId,
  onPlay,
  onSelect,
}: {
  question: ListeningClipQuestion;
  number: number;
  slot: ClipSlot | null;
  activePlayId: string | null;
  onPlay: (playId: string) => void;
  onSelect: (optionIndex: number) => void;
}) {
  const t = useTranslations("Listening");
  const headingId = `${question.id}-prompt`;

  return (
    <div className="space-y-3">
      <ExerciseQuestionHeader
        number={number}
        title={question.prompt}
        hint={question.hint}
        headingId={headingId}
        actions={
          <ListeningPlayButton
            playId={question.id}
            activePlayId={activePlayId}
            onPlay={onPlay}
          />
        }
      />

      <div
        className="grid gap-2 sm:grid-cols-2"
        role="radiogroup"
        aria-labelledby={headingId}
        aria-label={t("optionsAria")}
      >
        {question.options.map((option, optionIndex) => {
          const isSelected = slot?.selected === optionIndex;
          const isCorrect = optionIndex === question.correctIndex;
          const revealed = slot?.revealed === true;
          const showCorrect = revealed && isCorrect;
          const showWrong = revealed && isSelected && !isCorrect;

          return (
            <button
              key={`${question.id}-${optionIndex}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={revealed}
              onClick={() => onSelect(optionIndex)}
              className={cn(
                "flex w-full min-h-12 cursor-pointer items-center gap-3 rounded-full border px-3 py-2.5 text-left text-sm transition-colors duration-200",
                "disabled:cursor-default",
                showCorrect &&
                  "reading-quiz-pop border-emerald-500/50 bg-emerald-500/10 text-emerald-900 motion-safe:animate-[reading-option-pop_0.45s_ease-out] dark:text-emerald-100",
                showWrong &&
                  "reading-quiz-shake border-red-500/40 bg-red-500/10 text-red-900 motion-safe:animate-[reading-option-shake_0.45s_ease-in-out] dark:text-red-100",
                !revealed &&
                  !isSelected &&
                  "border-border bg-background/60 text-brand-800 hover:border-brand-400 dark:bg-brand-950/30 dark:text-brand-200",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  showCorrect && "bg-emerald-600 text-white",
                  showWrong && "bg-red-800 text-white",
                  !revealed &&
                    "bg-(--glass-2) text-brand-600 dark:text-brand-300",
                )}
              >
                {showCorrect ? (
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                ) : showWrong ? (
                  <X className="size-3.5" strokeWidth={3} aria-hidden />
                ) : (
                  optionLetter(optionIndex)
                )}
              </span>
              <span className="min-w-0 flex-1 leading-snug">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ListeningTrueFalseRow({
  question,
  number,
  slot,
  activePlayId,
  onPlay,
  onSelect,
}: {
  question: { id: string; statement: string; answer: boolean; hint: string };
  number: number;
  slot: TrueFalseSlot | null;
  activePlayId: string | null;
  onPlay: (playId: string) => void;
  onSelect: (answer: boolean) => void;
}) {
  const t = useTranslations("Listening");
  const revealed = slot?.revealed === true;

  return (
    <div className="space-y-3">
      <ExerciseQuestionHeader
        number={number}
        title={question.statement}
        hint={question.hint}
        actions={
          <ListeningPlayButton
            playId={question.id}
            activePlayId={activePlayId}
            onPlay={onPlay}
          />
        }
      />
      <TrueFalseChoiceButtons
        trueLabel={t("trueLabel")}
        falseLabel={t("falseLabel")}
        trueCaption={t("trueCaption")}
        falseCaption={t("falseCaption")}
        selected={slot?.answer ?? null}
        correctAnswer={question.answer}
        revealed={revealed}
        onSelect={onSelect}
        ariaLabel={t("trueFalseAria")}
      />
    </div>
  );
}
