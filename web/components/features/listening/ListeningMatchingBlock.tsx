"use client";

import {
  Fragment,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { Check, CheckCircle2, RotateCcw, TriangleAlert, X } from "lucide-react";
import type { ListeningMatchingQuestion } from "@/data/listenings/types";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/Button";
import { shuffleIndices } from "@/lib/shuffleIndices";
import { cn } from "@/lib/utils";

type ListeningMatchingBlockProps = {
  question: ListeningMatchingQuestion;
  number: number;
  onGraded: (correctPairs: number, totalPairs: number) => void;
  headerActions?: ReactNode;
};

type ConnectorSegment = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export function ListeningMatchingBlock({
  question,
  number,
  onGraded,
  headerActions,
}: ListeningMatchingBlockProps) {
  const t = useTranslations("Listening");
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState(false);
  const [connectors, setConnectors] = useState<ConnectorSegment[]>([]);

  const boardRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rightRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const rightOrder = useMemo(
    () => shuffleIndices(question.pairs.length),
    [question.id, question.pairs.length],
  );

  const shuffledRights = rightOrder.map(
    (index) => question.pairs[index]!.right,
  );

  const allAssigned = Object.keys(assignments).length === question.pairs.length;

  function isPairCorrect(leftIndex: number): boolean {
    const rightSlot = assignments[leftIndex];
    if (rightSlot === undefined) {
      return false;
    }
    return shuffledRights[rightSlot] === question.pairs[leftIndex]!.right;
  }

  const allCorrect =
    revealed &&
    question.pairs.every((_, leftIndex) => isPairCorrect(leftIndex));

  function leftForRightSlot(rightSlot: number): number | null {
    const entry = Object.entries(assignments).find(
      ([, slot]) => slot === rightSlot,
    );
    return entry ? Number(entry[0]) : null;
  }

  function pairBadgeForLeft(leftIndex: number): number | null {
    if (assignments[leftIndex] === undefined) {
      return null;
    }
    return leftIndex + 1;
  }

  function pairBadgeForRight(rightSlot: number): number | null {
    const left = leftForRightSlot(rightSlot);
    return left === null ? null : left + 1;
  }

  const updateConnectors = useCallback(() => {
    const board = boardRef.current;
    if (!board) {
      return;
    }
    const boardRect = board.getBoundingClientRect();
    const next: ConnectorSegment[] = [];

    for (const [leftKey, rightSlot] of Object.entries(assignments)) {
      const leftIndex = Number(leftKey);
      const leftEl = leftRefs.current[leftIndex];
      const rightEl = rightRefs.current[rightSlot];
      if (!leftEl || !rightEl) {
        continue;
      }
      const l = leftEl.getBoundingClientRect();
      const r = rightEl.getBoundingClientRect();
      const x1 = l.right - boardRect.left;
      const y1 = l.top + l.height / 2 - boardRect.top;
      const x2 = r.left - boardRect.left;
      const y2 = r.top + r.height / 2 - boardRect.top;

      next.push({
        id: `${leftIndex}-${rightSlot}`,
        x1,
        y1,
        x2,
        y2,
      });
    }
    setConnectors(next);
  }, [assignments]);

  useLayoutEffect(() => {
    updateConnectors();
    const board = boardRef.current;
    if (!board) {
      return;
    }
    const observer = new ResizeObserver(() => updateConnectors());
    observer.observe(board);
    window.addEventListener("resize", updateConnectors);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateConnectors);
    };
  }, [updateConnectors, question.pairs.length, selectedLeft, revealed]);

  function handleLeftClick(index: number) {
    if (revealed) {
      return;
    }
    setSelectedLeft((current) => (current === index ? null : index));
  }

  function handleRightClick(rightSlot: number) {
    if (revealed) {
      return;
    }
    if (selectedLeft === null) {
      const linkedLeft = leftForRightSlot(rightSlot);
      if (linkedLeft !== null) {
        setAssignments((prev) => {
          const next = { ...prev };
          delete next[linkedLeft];
          return next;
        });
      }
      return;
    }

    const takenBy = leftForRightSlot(rightSlot);
    if (takenBy !== null && takenBy !== selectedLeft) {
      return;
    }

    setAssignments((prev) => {
      const next = { ...prev };
      for (const [left, slot] of Object.entries(next)) {
        if (Number(left) !== selectedLeft && slot === rightSlot) {
          delete next[Number(left)];
        }
      }
      if (next[selectedLeft] === rightSlot) {
        delete next[selectedLeft];
      } else {
        next[selectedLeft] = rightSlot;
      }
      return next;
    });
    setSelectedLeft(null);
  }

  function handleCheck() {
    if (!allAssigned || revealed) {
      return;
    }
    setRevealed(true);
    const correctPairs = question.pairs.filter((_, i) =>
      isPairCorrect(i),
    ).length;
    if (!graded) {
      setGraded(true);
      onGraded(correctPairs, question.pairs.length);
    }
  }

  function handleRetry() {
    setRevealed(false);
    setSelectedLeft(null);
    setAssignments({});
    setConnectors([]);
    setGraded(false);
  }

  const rowCount = question.pairs.length;
  const pairingActive = selectedLeft !== null && !revealed;

  function isRightSlotInteractive(rightSlot: number): boolean {
    if (revealed) {
      return false;
    }
    const linkedLeft = leftForRightSlot(rightSlot);
    if (selectedLeft === null) {
      return linkedLeft !== null;
    }
    if (linkedLeft !== null && linkedLeft !== selectedLeft) {
      return false;
    }
    return true;
  }

  return (
    <div className="space-y-4">
      <ExerciseQuestionHeader
        number={number}
        title={question.prompt}
        hint={question.hint}
        actions={headerActions}
      />

      <p className="text-sm leading-relaxed text-brand-600 dark:text-brand-400">
        {t("matchHowTo")}
      </p>

      <div ref={boardRef} className="relative">
        {!revealed && connectors.length > 0 ? (
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
            aria-hidden
          >
            {connectors.map((line) => {
              const midX = (line.x1 + line.x2) / 2;
              return (
                <path
                  key={line.id}
                  d={`M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`}
                  className="listening-match-connector"
                />
              );
            })}
          </svg>
        ) : null}

        <div
          className="relative z-10 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-5 sm:gap-y-4"
          role="group"
          aria-label={t("matchGroupAria")}
        >
          {Array.from({ length: rowCount }, (_, rowIndex) => {
            const leftIndex = rowIndex;
            const pair = question.pairs[leftIndex]!;
            const rightSlot = rowIndex;
            const rightLabel = shuffledRights[rightSlot]!;

            const leftSelected = selectedLeft === leftIndex;
            const leftBadge = pairBadgeForLeft(leftIndex);
            const rightBadge = pairBadgeForRight(rightSlot);
            const linkedLeft = leftForRightSlot(rightSlot);

            const leftPaired = leftBadge !== null;
            const rightPaired = rightBadge !== null;

            const leftCorrect = revealed && isPairCorrect(leftIndex);
            const leftWrong =
              revealed && assignments[leftIndex] !== undefined && !leftCorrect;
            const rightCorrect =
              revealed && linkedLeft !== null && isPairCorrect(linkedLeft);
            const rightWrong =
              revealed && linkedLeft !== null && !isPairCorrect(linkedLeft);

            const rightTarget =
              pairingActive &&
              (linkedLeft === null || linkedLeft === selectedLeft);

            return (
              <Fragment key={`${question.id}-row-${rowIndex}`}>
                <MatchPill
                  ref={(node) => {
                    leftRefs.current[leftIndex] = node;
                  }}
                  side="left"
                  label={pair.left}
                  badge={revealed ? undefined : (leftBadge ?? undefined)}
                  disabled={revealed}
                  selected={leftSelected}
                  paired={leftPaired && !revealed}
                  correct={leftCorrect}
                  wrong={leftWrong}
                  dimmed={pairingActive && !leftSelected && !leftPaired}
                  clickable={!revealed}
                  onClick={() => handleLeftClick(leftIndex)}
                />
                <MatchPill
                  ref={(node) => {
                    rightRefs.current[rightSlot] = node;
                  }}
                  side="right"
                  label={rightLabel}
                  badge={revealed ? undefined : (rightBadge ?? undefined)}
                  disabled={revealed}
                  selected={rightTarget && !rightPaired}
                  paired={rightPaired && !revealed}
                  targetable={rightTarget && !rightPaired}
                  correct={rightCorrect}
                  wrong={rightWrong}
                  dimmed={pairingActive && !rightTarget && !rightPaired}
                  clickable={isRightSlotInteractive(rightSlot)}
                  onClick={() => handleRightClick(rightSlot)}
                />
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pt-1">
        {!revealed ? (
          <Button
            type="button"
            variant="outline"
            disabled={!allAssigned}
            className="w-full sm:w-auto"
            onClick={handleCheck}
          >
            {t("checkMatches")}
          </Button>
        ) : allCorrect ? (
          <Alert
            role="status"
            className="w-full border-emerald-500/35 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
          >
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />
            <AlertTitle>{t("matchAllCorrect")}</AlertTitle>
            <AlertDescription className="text-emerald-800/90 dark:text-emerald-200/90">
              {t("matchAllCorrectHint")}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert variant="destructive" role="status" className="w-full">
              <TriangleAlert />
              <AlertTitle>{t("matchSomeWrong")}</AlertTitle>
              <AlertDescription>{t("matchSomeWrongHint")}</AlertDescription>
            </Alert>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 sm:w-auto"
              onClick={handleRetry}
            >
              <RotateCcw className="size-4" aria-hidden />
              {t("matchTryAgain")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

type MatchPillProps = {
  side: "left" | "right";
  label: string;
  badge?: number;
  disabled: boolean;
  selected?: boolean;
  paired?: boolean;
  targetable?: boolean;
  correct: boolean;
  wrong: boolean;
  dimmed: boolean;
  clickable: boolean;
  onClick: () => void;
};

const MatchPill = forwardRef<HTMLButtonElement, MatchPillProps>(
  function MatchPill(
    {
      side,
      label,
      badge,
      disabled,
      selected,
      paired,
      targetable,
      correct,
      wrong,
      dimmed,
      clickable,
      onClick,
    },
    ref,
  ) {
    return (
      <button
        type="button"
        ref={ref}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "relative flex min-h-16 w-full items-center justify-center rounded-full border px-5 py-3.5 text-center text-sm font-medium leading-snug shadow-sm backdrop-blur-sm transition-[transform,opacity,box-shadow,border-color] duration-300 ease-out",
          clickable && !disabled ? "cursor-pointer" : "cursor-default",
          side === "left"
            ? "border-violet-200/90 bg-violet-100/80 text-violet-950 dark:border-violet-600/40 dark:bg-violet-950/50 dark:text-violet-50"
            : "border-orange-200/90 bg-orange-50/85 text-orange-950 dark:border-orange-600/40 dark:bg-orange-950/45 dark:text-orange-50",
          selected &&
            side === "left" &&
            "listening-match-select-left z-20 border-violet-400/80",
          (targetable || (selected && side === "right")) &&
            "listening-match-select-right z-20 border-orange-400/80",
          paired &&
            !correct &&
            !wrong &&
            "listening-match-paired z-10 border-sky-400/70",
          correct &&
            "reading-quiz-pop z-20 border-emerald-500/60 bg-emerald-500/15 text-emerald-900 shadow-[0_4px_20px_rgba(16,185,129,0.15)] motion-safe:animate-[reading-option-pop_0.45s_ease-out] dark:text-emerald-100",
          wrong &&
            "reading-quiz-shake z-20 border-red-500/50 bg-red-500/12 text-red-900 shadow-[0_4px_16px_rgba(239,68,68,0.12)] motion-safe:animate-[reading-option-shake_0.45s_ease-in-out] dark:text-red-100",
          dimmed && !disabled && "opacity-[0.42] saturate-[0.85]",
          !disabled &&
            !correct &&
            !wrong &&
            !dimmed &&
            "motion-safe:hover:scale-[1.015] hover:shadow-md active:scale-[0.99]",
        )}
      >
        {badge !== undefined && !correct && !wrong ? (
          <span
            className="listening-match-badge-pop absolute -top-1.5 -right-1.5 inline-flex size-7 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white shadow-[0_2px_8px_rgba(14,165,233,0.45)] ring-2 ring-background"
            aria-hidden
          >
            {badge}
          </span>
        ) : null}
        {correct ? (
          <span
            className="listening-match-badge-pop absolute -top-1.5 -right-1.5 inline-flex size-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md"
            aria-hidden
          >
            <Check className="size-4" strokeWidth={3} />
          </span>
        ) : null}
        {wrong ? (
          <span
            className="listening-match-badge-pop absolute -top-1.5 -right-1.5 inline-flex size-7 items-center justify-center rounded-full bg-red-700 text-white shadow-md"
            aria-hidden
          >
            <X className="size-4" strokeWidth={3} />
          </span>
        ) : null}
        <span className="max-w-full px-1 text-pretty">{label}</span>
      </button>
    );
  },
);
