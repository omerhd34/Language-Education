"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { SpeakingAnagramBlock } from "@/components/features/speaking/SpeakingAnagramBlock";
import {
  SpeakingExerciseTypePicker,
  type SpeakingExercisePart,
} from "@/components/features/speaking/SpeakingExerciseTypePicker";
import { SpeakingOpenBoxBlock } from "@/components/features/speaking/SpeakingOpenBoxBlock";
import { SpeakingRandomCardsBlock } from "@/components/features/speaking/SpeakingRandomCardsBlock";
import { SpeakingWheelBlock } from "@/components/features/speaking/SpeakingWheelBlock";
import { Button } from "@/components/ui/Button";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { SpeakingExerciseBlock } from "@/data/speakings/types";
import { cn } from "@/lib/utils";

import { SECTION_PRACTICE_PASS_PERCENT } from "@/lib/sectionPracticePassPercent";

const PRACTICE_PASS_PERCENT = SECTION_PRACTICE_PASS_PERCENT;

type SpeakingPracticeQuizProps = {
  block: SpeakingExerciseBlock;
  modelViewed?: boolean;
  onAllTasksComplete?: (passed: boolean, percent: number) => void;
  onPracticeReset?: () => void;
};

function totalGradableItems(block: SpeakingExerciseBlock): number {
  const wheel = block.wheel?.items.length ?? 0;
  const box = block.openBox?.items.length ?? 0;
  const cards = block.randomCards?.items.length ?? 0;
  const anagram = block.anagram?.length ?? 0;
  return wheel + box + cards + anagram;
}

export function SpeakingPracticeQuiz({
  block,
  modelViewed = false,
  onAllTasksComplete,
  onPracticeReset,
}: SpeakingPracticeQuizProps) {
  const t = useTranslations("Speaking");
  const router = useRouter();
  const pathname = usePathname();
  const anagram = block.anagram ?? [];

  const [selectedPart, setSelectedPart] = useState<SpeakingExercisePart | null>(
    null,
  );
  const [wheelDone, setWheelDone] = useState<Set<string>>(() => new Set());
  const [boxOpened, setBoxOpened] = useState<Set<string>>(() => new Set());
  const [boxDone, setBoxDone] = useState<Set<string>>(() => new Set());
  const [cardsDone, setCardsDone] = useState<Set<string>>(() => new Set());
  const [anagramScores, setAnagramScores] = useState<Array<boolean | null>>(
    () => anagram.map(() => null),
  );

  const [summaryOpen, setSummaryOpen] = useState(false);
  const completionSentRef = useRef(false);

  const { correct, total, percent, allDone } = useMemo(() => {
    const totalItems = totalGradableItems(block);
    let correctCount = wheelDone.size + boxDone.size + cardsDone.size;

    anagramScores.forEach((score) => {
      if (score === true) {
        correctCount += 1;
      }
    });

    const wheelCount = block.wheel?.items.length ?? 0;
    const boxCount = block.openBox?.items.length ?? 0;
    const cardsCount = block.randomCards?.items.length ?? 0;

    const wheelComplete = !block.wheel || wheelDone.size >= wheelCount;
    const boxComplete = !block.openBox || boxDone.size >= boxCount;
    const cardsComplete = !block.randomCards || cardsDone.size >= cardsCount;
    const anagramComplete =
      anagram.length === 0 || anagramScores.every((s) => s !== null);

    const done =
      wheelComplete && boxComplete && cardsComplete && anagramComplete;
    const pct =
      totalItems === 0 ? 0 : Math.round((correctCount / totalItems) * 100);

    return {
      correct: correctCount,
      total: totalItems,
      percent: pct,
      allDone: done,
    };
  }, [
    anagram.length,
    anagramScores,
    block,
    boxDone.size,
    cardsDone.size,
    wheelDone.size,
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

  const availableParts = useMemo(() => {
    const parts: SpeakingExercisePart[] = [];
    if (block.wheel) {
      parts.push("wheel");
    }
    if (block.openBox) {
      parts.push("openBox");
    }
    if (block.randomCards) {
      parts.push("randomCards");
    }
    if (anagram.length > 0) {
      parts.push("anagram");
    }
    return parts;
  }, [anagram.length, block]);

  const exerciseCounts = useMemo(
    () => ({
      wheel: block.wheel?.items.length ?? 0,
      openBox: block.openBox?.items.length ?? 0,
      randomCards: block.randomCards?.items.length ?? 0,
      anagram: anagram.length,
    }),
    [anagram.length, block],
  );

  const unlockedAnagramCount = useMemo(() => {
    let count = 1;
    for (let i = 0; i < anagramScores.length; i += 1) {
      if (anagramScores[i] === true) {
        count = i + 2;
      } else {
        break;
      }
    }
    return Math.min(count, anagram.length);
  }, [anagram.length, anagramScores]);

  const progressPercents = useMemo(() => {
    const ratio = (done: number, total: number) =>
      total === 0 ? 0 : Math.round((done / total) * 100);
    return {
      wheel: ratio(wheelDone.size, exerciseCounts.wheel),
      openBox: ratio(boxDone.size, exerciseCounts.openBox),
      randomCards: ratio(cardsDone.size, exerciseCounts.randomCards),
      anagram: ratio(
        anagramScores.filter((score) => score !== null).length,
        exerciseCounts.anagram,
      ),
    };
  }, [
    anagramScores,
    boxDone.size,
    cardsDone.size,
    exerciseCounts,
    wheelDone.size,
  ]);

  function handleReset() {
    completionSentRef.current = false;
    setSummaryOpen(false);
    setSelectedPart(null);
    setWheelDone(new Set());
    setBoxOpened(new Set());
    setBoxDone(new Set());
    setCardsDone(new Set());
    setAnagramScores(anagram.map(() => null));
    onPracticeReset?.();
  }

  function openModelTab() {
    setSummaryOpen(false);
    router.replace(pathname, { scroll: false });
  }

  if (totalGradableItems(block) === 0) {
    return <p className="page-subtitle mt-0">{t("noExercises")}</p>;
  }

  type PracticePartConfig = {
    key: string;
    header: ReactNode;
    body: ReactNode;
  };

  const practicePartConfigs: PracticePartConfig[] = [];

  if (block.wheel) {
    practicePartConfigs.push({
      key: "wheel",
      header: (
        <ExerciseQuestionHeader
          className="rounded-2xl border border-sky-500/20 bg-linear-to-r from-sky-500/10 via-transparent to-transparent px-4 py-3 dark:border-sky-400/25 dark:from-sky-950/50"
          title={
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-800 dark:text-sky-300">
                {t("task1Title")}
              </p>
              <p className="mt-1 text-base font-medium text-brand-800 dark:text-brand-200">
                {block.wheel.instructionTr ?? block.wheel.instruction}
              </p>
            </>
          }
          compactTitle
          showHint={false}
          hint={block.wheel.hint}
          fallbackKey="speakingWheel"
        />
      ),
      body: (
        <SpeakingWheelBlock
          exercise={block.wheel}
          completedIds={wheelDone}
          onMarkComplete={(id) => {
            setWheelDone((prev) => new Set([...prev, id]));
          }}
        />
      ),
    });
  }

  if (block.openBox) {
    practicePartConfigs.push({
      key: "openBox",
      header: (
        <SpeakingPracticePartHeading
          title={t("task2Title")}
          subtitle={block.openBox.instructionTr ?? block.openBox.instruction}
        />
      ),
      body: (
        <SpeakingOpenBoxBlock
          exercise={block.openBox}
          openedIds={boxOpened}
          completedIds={boxDone}
          onOpen={(id) => {
            setBoxOpened((prev) => new Set([...prev, id]));
          }}
          onMarkComplete={(id) => {
            setBoxDone((prev) => new Set([...prev, id]));
          }}
        />
      ),
    });
  }

  if (block.randomCards) {
    practicePartConfigs.push({
      key: "randomCards",
      header: (
        <SpeakingPracticePartHeading
          title={t("task3Title")}
          subtitle={
            block.randomCards.instructionTr ?? block.randomCards.instruction
          }
        />
      ),
      body: (
        <SpeakingRandomCardsBlock
          exercise={block.randomCards}
          completedIds={cardsDone}
          onMarkComplete={(id) => {
            setCardsDone((prev) => new Set([...prev, id]));
          }}
        />
      ),
    });
  }

  if (anagram.length > 0) {
    practicePartConfigs.push({
      key: "anagram",
      header: (
        <SpeakingPracticePartHeading
          title={t("task4Title")}
          subtitle={t("anagramInstruction", { total: anagram.length })}
        />
      ),
      body: (
        <div className="space-y-0">
          {anagram.slice(0, unlockedAnagramCount).map((question, index) => (
            <div key={question.id}>
              {index > 0 ? <Separator className="my-6" /> : null}
              <SpeakingAnagramBlock
                question={question}
                number={index + 1}
                onGraded={(isCorrect) => {
                  setAnagramScores((prev) =>
                    prev.map((score, i) => (i === index ? isCorrect : score)),
                  );
                }}
                onReset={() => {
                  setAnagramScores((prev) =>
                    prev.map((score, i) => (i >= index ? null : score)),
                  );
                }}
              />
            </div>
          ))}
        </div>
      ),
    });
  }

  const activePart = selectedPart
    ? practicePartConfigs.find((part) => part.key === selectedPart)
    : null;

  return (
    <div className="space-y-6">
      {selectedPart === null ? (
        <SpeakingExerciseTypePicker
          available={availableParts}
          counts={exerciseCounts}
          progressPercents={progressPercents}
          onSelect={setSelectedPart}
        />
      ) : activePart ? (
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSelectedPart(null)}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("backToExerciseTypes")}
          </Button>
          <div className="dashboard-panel space-y-6 p-4 sm:p-6">
            {activePart.header}
            {activePart.body}
          </div>
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
                onClick={openModelTab}
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

function SpeakingPracticePartHeading({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
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
      {subtitle ? (
        <p className="mt-1 text-base font-medium text-brand-800 dark:text-brand-200">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
