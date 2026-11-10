/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, CheckCircle2, RotateCcw, X, XCircle } from "lucide-react";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { WritingCategorizeBlock } from "@/components/features/writing/WritingCategorizeBlock";
import { WritingPracticeCollapsible } from "@/components/features/writing/WritingPracticeCollapsible";
import { WritingWordOrderBlock } from "@/components/features/writing/WritingWordOrderBlock";
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
  WritingExerciseBlock,
  WritingMultipleChoiceQuestion,
} from "@/data/writings/types";
import { Fragment, type ReactNode } from "react";
import { scrollToWritingSection } from "@/lib/writingSectionTab";
import { cn } from "@/lib/utils";

const PRACTICE_PASS_PERCENT = 85;
const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

type McqSlot = { selected: number; revealed: boolean };

type WritingPracticeQuizProps = {
  block: WritingExerciseBlock;
  modelViewed?: boolean;
  onAllTasksComplete?: (passed: boolean, percent: number) => void;
  onPracticeReset?: () => void;
};

function optionLetter(index: number): string {
  return OPTION_LETTERS[index] ?? String(index + 1);
}

function totalGradableItems(block: WritingExerciseBlock): number {
  const categorizeCount = block.categorize?.phrases.length ?? 0;
  const task1 = block.task1?.length ?? 0;
  const task2 = block.task2?.length ?? 0;
  const task3 = block.task3?.length ?? 0;
  return categorizeCount + task1 + task2 + task3;
}

export function WritingPracticeQuiz({
  block,
  modelViewed = false,
  onAllTasksComplete,
  onPracticeReset,
}: WritingPracticeQuizProps) {
  const t = useTranslations("Writing");
  const task1 = block.task1 ?? [];
  const task2 = block.task2 ?? [];
  const task3 = block.task3 ?? [];

  const [categorizeScore, setCategorizeScore] = useState<{
    correct: number;
    total: number;
  } | null>(null);
  const [task1Slots, setTask1Slots] = useState<Array<McqSlot | null>>(() =>
    task1.map(() => null),
  );
  const [task2Slots, setTask2Slots] = useState<Array<McqSlot | null>>(() =>
    task2.map(() => null),
  );
  const [wordOrderScores, setWordOrderScores] = useState<Array<boolean | null>>(
    () => task3.map(() => null),
  );

  const [summaryOpen, setSummaryOpen] = useState(false);
  const completionSentRef = useRef(false);

  const { correct, total, percent, allDone } = useMemo(() => {
    const totalItems = totalGradableItems(block);
    let correctCount = 0;

    if (categorizeScore) {
      correctCount += categorizeScore.correct;
    }

    task1.forEach((question, index) => {
      const slot = task1Slots[index];
      if (slot?.revealed && slot.selected === question.correctIndex) {
        correctCount += 1;
      }
    });

    task2.forEach((question, index) => {
      const slot = task2Slots[index];
      if (slot?.revealed && slot.selected === question.correctIndex) {
        correctCount += 1;
      }
    });

    wordOrderScores.forEach((score) => {
      if (score === true) {
        correctCount += 1;
      }
    });

    const categorizeDone = !block.categorize || categorizeScore !== null;
    const task1Done =
      task1.length === 0 || task1Slots.every((s) => s?.revealed);
    const task2Done =
      task2.length === 0 || task2Slots.every((s) => s?.revealed);
    const task3Done =
      task3.length === 0 || wordOrderScores.every((s) => s !== null);

    const done = categorizeDone && task1Done && task2Done && task3Done;
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
    categorizeScore,
    task1,
    task2,
    task3,
    task1Slots,
    task2Slots,
    wordOrderScores,
  ]);

  const passed = percent >= PRACTICE_PASS_PERCENT;
  const sectionComplete = passed && modelViewed;

  useEffect(() => {
    if (!allDone) {
      return;
    }
    setSummaryOpen(true);
    if (completionSentRef.current) {
      return;
    }
    completionSentRef.current = true;
    onAllTasksComplete?.(passed, percent);
  }, [allDone, onAllTasksComplete, passed, percent]);

  function handleReset() {
    completionSentRef.current = false;
    setSummaryOpen(false);
    setCategorizeScore(null);
    setTask1Slots(task1.map(() => null));
    setTask2Slots(task2.map(() => null));
    setWordOrderScores(task3.map(() => null));
    onPracticeReset?.();
  }

  if (totalGradableItems(block) === 0) {
    return <p className="page-subtitle mt-0">{t("noExercises")}</p>;
  }

  let questionNumber = 0;

  type PracticePartConfig = {
    key: string;
    header: ReactNode;
    body: ReactNode;
  };

  const practicePartConfigs: PracticePartConfig[] = [];

  if (block.categorize) {
    practicePartConfigs.push({
      key: "categorize",
      header: (
        <ExerciseQuestionHeader
          className="rounded-2xl border border-sky-500/20 bg-linear-to-r from-sky-500/10 via-transparent to-transparent px-4 py-3 dark:border-sky-400/25 dark:from-sky-950/50"
          title={
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-800 dark:text-sky-300">
                {t("task1Title")}
              </p>
              <p className="mt-1 text-base font-medium text-brand-800 dark:text-brand-200">
                {block.categorize.instructionTr ?? block.categorize.instruction}
              </p>
            </>
          }
          compactTitle
          hint={block.categorize.hint}
          fallbackKey="writingCategorize"
        />
      ),
      body: (
        <WritingCategorizeBlock
          exercise={block.categorize}
          showHint={false}
          onGraded={(correctPairs, totalPairs) => {
            setCategorizeScore({
              correct: correctPairs,
              total: totalPairs,
            });
          }}
          onReset={() => setCategorizeScore(null)}
        />
      ),
    });
  }

  if (task1.length > 0) {
    practicePartConfigs.push({
      key: "task1",
      header: (
        <WritingPracticePartHeading
          title={t("task2Title")}
          subtitle={t("sectionMcqChoose")}
          className="mb-0"
        />
      ),
      body: (
        <div className="space-y-0">
          {task1.map((question, index) => {
            questionNumber += 1;
            const num = questionNumber;
            return (
              <div key={question.id}>
                {index > 0 ? <Separator className="my-6" /> : null}
                <WritingMcqRow
                  question={question}
                  number={num}
                  slot={task1Slots[index]}
                  fallbackKey="writingMultipleChoice"
                  onSelect={(optionIndex) => {
                    setTask1Slots((prev) =>
                      prev.map((slot, i) =>
                        i === index
                          ? { selected: optionIndex, revealed: true }
                          : slot,
                      ),
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
      ),
    });
  }

  if (task2.length > 0) {
    practicePartConfigs.push({
      key: "task2",
      header: (
        <WritingPracticePartHeading
          title={t("task3Title")}
          subtitle={t("task2Instruction")}
          className="mb-0"
        />
      ),
      body: (
        <div className="space-y-0">
          {task2.map((question, index) => {
            questionNumber += 1;
            const num = questionNumber;
            return (
              <div key={question.id}>
                {index > 0 ? <Separator className="my-6" /> : null}
                <WritingMcqRow
                  question={question}
                  number={num}
                  slot={task2Slots[index]}
                  fallbackKey="writingResponse"
                  onSelect={(optionIndex) => {
                    setTask2Slots((prev) =>
                      prev.map((slot, i) =>
                        i === index
                          ? { selected: optionIndex, revealed: true }
                          : slot,
                      ),
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
      ),
    });
  }

  if (task3.length > 0) {
    practicePartConfigs.push({
      key: "task3",
      header: (
        <WritingPracticePartHeading
          title={t("task4Title")}
          subtitle={t("wordOrderInstruction")}
          className="mb-0"
        />
      ),
      body: (
        <div className="space-y-0">
          {task3.map((question, index) => {
            questionNumber += 1;
            return (
              <div key={question.id}>
                {index > 0 ? <Separator className="my-6" /> : null}
                <WritingWordOrderBlock
                  question={question}
                  number={questionNumber}
                  onGraded={(isCorrect) => {
                    setWordOrderScores((prev) =>
                      prev.map((score, i) => (i === index ? isCorrect : score)),
                    );
                  }}
                  onReset={() => {
                    setWordOrderScores((prev) =>
                      prev.map((score, i) => (i === index ? null : score)),
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
      ),
    });
  }

  return (
    <div className="space-y-6">
      {practicePartConfigs.length > 0 ? (
        <div className="dashboard-panel space-y-6 p-4 sm:p-6">
          {practicePartConfigs.map((part, index) => (
            <Fragment key={part.key}>
              {index > 0 ? <Separator /> : null}
              <WritingPracticeCollapsible
                defaultOpen={index === 0}
                header={part.header}
              >
                {part.body}
              </WritingPracticeCollapsible>
            </Fragment>
          ))}
        </div>
      ) : null}

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
            {passed && !modelViewed ? (
              <p className="text-center text-sm text-brand-700 dark:text-brand-300">
                {t("practiceNeedModel")}
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
            {passed && !modelViewed ? (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => {
                  setSummaryOpen(false);
                  scrollToWritingSection("model");
                }}
              >
                {t("openModel")}
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

function WritingPracticePartHeading({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 rounded-2xl border border-sky-500/20 bg-linear-to-r from-sky-500/10 via-transparent to-transparent px-4 py-3 dark:border-sky-400/25 dark:from-sky-950/50",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-800 dark:text-sky-300">
        {title}
      </p>
      {children ??
        (subtitle ? (
          <p className="mt-1 text-base font-medium text-brand-800 dark:text-brand-200">
            {subtitle}
          </p>
        ) : null)}
    </div>
  );
}

function WritingMcqRow({
  question,
  number,
  slot,
  fallbackKey,
  onSelect,
}: {
  question: WritingMultipleChoiceQuestion;
  number: number;
  slot: McqSlot | null;
  fallbackKey: "writingMultipleChoice" | "writingResponse";
  onSelect: (optionIndex: number) => void;
}) {
  const t = useTranslations("Writing");
  const headingId = `${question.id}-prompt`;

  return (
    <div className="space-y-3">
      <ExerciseQuestionHeader
        number={number}
        title={question.prompt}
        hint={question.hint}
        fallbackKey={fallbackKey}
        headingId={headingId}
      />

      <div
        className="grid grid-cols-3 gap-2"
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
              aria-label={`${optionLetter(optionIndex)}. ${option}`}
              disabled={revealed}
              onClick={() => onSelect(optionIndex)}
              className={cn(
                "flex w-full min-h-12 cursor-pointer items-center gap-3 rounded-full border px-3 py-2.5 text-left text-sm transition-colors duration-200",
                "disabled:cursor-default",
                showCorrect &&
                  "reading-quiz-pop border-emerald-500/50 bg-emerald-500/10 text-emerald-900 motion-safe:animate-[reading-option-pop_0.45s_ease-out] dark:text-emerald-100",
                showWrong &&
                  "reading-quiz-shake border-red-500/40 bg-red-500/10 text-red-900 motion-safe:animate-[reading-option-shake_0.45s_ease-in-out] dark:text-red-100",
                revealed &&
                  showCorrect &&
                  !isSelected &&
                  "motion-safe:animate-[reading-option-pop_0.45s_ease-out_0.12s_both]",
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
                  (showCorrect || showWrong) &&
                    "reading-quiz-icon-pop motion-safe:animate-[reading-icon-pop_0.35s_ease-out]",
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
