"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, GripVertical, RotateCcw } from "lucide-react";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { ExerciseCheckButton } from "@/components/features/exercises/ExerciseCheckButton";
import { Button } from "@/components/ui/Button";
import type { WritingCategorizeExercise } from "@/data/writings/types";
import { cn } from "@/lib/utils";

type WritingCategorizeBlockProps = {
  exercise: WritingCategorizeExercise;
  onGraded: (correct: number, total: number) => void;
  onReset?: () => void;
  showHint?: boolean;
};

type Assignment = number | null;

type DropTarget = "pool" | { group: number };

const DRAG_MIME = "application/x-writing-phrase-index";

function resolveDropTarget(
  clientX: number,
  clientY: number,
): DropTarget | null {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) {
    return null;
  }
  const dropEl = el.closest("[data-drop-target]");
  if (!dropEl || !(dropEl instanceof HTMLElement)) {
    return null;
  }
  const value = dropEl.dataset.dropTarget;
  if (value === "pool") {
    return "pool";
  }
  if (value?.startsWith("group-")) {
    const groupIndex = Number(value.slice("group-".length));
    if (Number.isFinite(groupIndex)) {
      return { group: groupIndex };
    }
  }
  return null;
}

type PhraseChipProps = {
  phraseIndex: number;
  text: string;
  revealed: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isDragging: boolean;
  onAssign: (phraseIndex: number, target: DropTarget) => void;
  onDragHighlight: (target: DropTarget | null) => void;
  onDragActive: (phraseIndex: number | null) => void;
};

function PhraseChip({
  phraseIndex,
  text,
  revealed,
  isCorrect,
  isWrong,
  isDragging,
  onAssign,
  onDragHighlight,
  onDragActive,
}: PhraseChipProps) {
  const draggingRef = useRef(false);

  function applyDropTarget(clientX: number, clientY: number) {
    const target = resolveDropTarget(clientX, clientY);
    if (target) {
      onAssign(phraseIndex, target);
    }
  }

  return (
    <span
      role="button"
      tabIndex={revealed ? -1 : 0}
      draggable={!revealed}
      data-phrase-index={phraseIndex}
      onDragStart={(event) => {
        if (revealed) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData(DRAG_MIME, String(phraseIndex));
        event.dataTransfer.effectAllowed = "move";
        onDragActive(phraseIndex);
      }}
      onDragEnd={() => {
        onDragActive(null);
        onDragHighlight(null);
      }}
      onPointerDown={(event) => {
        if (revealed || event.button !== 0) {
          return;
        }
        draggingRef.current = true;
        onDragActive(phraseIndex);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current || revealed) {
          return;
        }
        onDragHighlight(resolveDropTarget(event.clientX, event.clientY));
      }}
      onPointerUp={(event) => {
        if (!draggingRef.current) {
          return;
        }
        draggingRef.current = false;
        applyDropTarget(event.clientX, event.clientY);
        onDragActive(null);
        onDragHighlight(null);
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={(event) => {
        draggingRef.current = false;
        onDragActive(null);
        onDragHighlight(null);
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      className={cn(
        "inline-flex max-w-full cursor-grab touch-none items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-colors active:cursor-grabbing",
        isDragging && "opacity-60 ring-2 ring-sky-500/40",
        isCorrect &&
          "border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
        isWrong &&
          "border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-100",
        !isCorrect &&
          !isWrong &&
          "border-border bg-background/70 hover:border-brand-400 dark:bg-brand-950/30",
        revealed && "cursor-default",
      )}
    >
      <GripVertical
        aria-hidden
        className="size-3.5 shrink-0 text-brand-500/70"
      />
      {text}
    </span>
  );
}

export function WritingCategorizeBlock({
  exercise,
  onGraded,
  onReset,
  showHint = true,
}: WritingCategorizeBlockProps) {
  const t = useTranslations("Writing");
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    exercise.phrases.map(() => null),
  );
  const [revealed, setRevealed] = useState(false);
  const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);
  const [hoverDrop, setHoverDrop] = useState<DropTarget | null>(null);

  const { correct, total } = useMemo(() => {
    let correctCount = 0;
    exercise.phrases.forEach((phrase, index) => {
      if (assignments[index] === phrase.groupIndex) {
        correctCount += 1;
      }
    });
    return { correct: correctCount, total: exercise.phrases.length };
  }, [assignments, exercise.phrases]);

  const allAssigned = assignments.every((value) => value !== null);

  function assignPhrase(phraseIndex: number, target: DropTarget) {
    if (revealed) {
      return;
    }
    setAssignments((prev) =>
      prev.map((value, index) => {
        if (index !== phraseIndex) {
          return value;
        }
        if (target === "pool") {
          return null;
        }
        return target.group;
      }),
    );
  }

  function handleDrop(event: React.DragEvent, target: DropTarget) {
    event.preventDefault();
    if (revealed) {
      return;
    }
    const raw = event.dataTransfer.getData(DRAG_MIME);
    const phraseIndex = Number(raw);
    if (!Number.isFinite(phraseIndex)) {
      return;
    }
    assignPhrase(phraseIndex, target);
    setActiveDragIndex(null);
    setHoverDrop(null);
  }

  function handleDragOverZone(event: React.DragEvent, target: DropTarget) {
    event.preventDefault();
    if (revealed) {
      return;
    }
    event.dataTransfer.dropEffect = "move";
    setHoverDrop(target);
  }

  function dropZoneClass(target: DropTarget): string {
    const isHover =
      hoverDrop !== null &&
      (hoverDrop === "pool"
        ? target === "pool"
        : target !== "pool" && hoverDrop.group === target.group);
    return cn(
      "rounded-2xl border-2 border-dashed p-3 transition-colors",
      isHover
        ? "border-sky-400/80 bg-sky-500/10"
        : "border-border bg-(--glass-2)/40",
    );
  }

  function handleCheck() {
    if (!allAssigned) {
      return;
    }
    setRevealed(true);
    onGraded(correct, total);
  }

  function handleReset() {
    setAssignments(exercise.phrases.map(() => null));
    setRevealed(false);
    setActiveDragIndex(null);
    setHoverDrop(null);
    onReset?.();
  }

  const poolPhraseIndices = exercise.phrases
    .map((_, index) => index)
    .filter((index) => assignments[index] === null);

  return (
    <div className="space-y-5">
      {showHint ? (
        <ExerciseQuestionHeader
          hint={exercise.hint}
          fallbackKey="writingCategorize"
        />
      ) : null}
      <div
        data-drop-target="pool"
        onDragOver={(event) => handleDragOverZone(event, "pool")}
        onDragLeave={() => setHoverDrop(null)}
        onDrop={(event) => handleDrop(event, "pool")}
        className={cn(dropZoneClass("pool"), "min-h-20")}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
          {t("categorizePoolLabel")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {poolPhraseIndices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("categorizePoolEmpty")}
            </p>
          ) : (
            poolPhraseIndices.map((index) => {
              const phrase = exercise.phrases[index];
              return (
                <PhraseChip
                  key={phrase.id}
                  phraseIndex={index}
                  text={phrase.text}
                  revealed={revealed}
                  isCorrect={false}
                  isWrong={false}
                  isDragging={activeDragIndex === index}
                  onAssign={assignPhrase}
                  onDragHighlight={setHoverDrop}
                  onDragActive={setActiveDragIndex}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {exercise.groups.map((group, groupIndex) => (
          <div
            key={group.id}
            data-drop-target={`group-${groupIndex}`}
            onDragOver={(event) =>
              handleDragOverZone(event, { group: groupIndex })
            }
            onDragLeave={() => setHoverDrop(null)}
            onDrop={(event) => handleDrop(event, { group: groupIndex })}
            className={cn(dropZoneClass({ group: groupIndex }), "min-h-28")}
          >
            <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">
              {group.titleTr ?? group.title}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {exercise.phrases.map((phrase, phraseIndex) => {
                if (assignments[phraseIndex] !== groupIndex) {
                  return null;
                }
                const isCorrect = revealed && phrase.groupIndex === groupIndex;
                const isWrong = revealed && phrase.groupIndex !== groupIndex;
                return (
                  <li key={phrase.id}>
                    <PhraseChip
                      phraseIndex={phraseIndex}
                      text={phrase.text}
                      revealed={revealed}
                      isCorrect={isCorrect}
                      isWrong={isWrong}
                      isDragging={activeDragIndex === phraseIndex}
                      onAssign={assignPhrase}
                      onDragHighlight={setHoverDrop}
                      onDragActive={setActiveDragIndex}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <ExerciseCheckButton
          type="button"
          disabled={!allAssigned || revealed}
          onClick={handleCheck}
        >
          <Check className="size-4" aria-hidden />
          {t("checkAnswers")}
        </ExerciseCheckButton>
        {revealed ? (
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw aria-hidden />
            {t("categorizeTryAgain")}
          </Button>
        ) : null}
      </div>

      {revealed ? (
        <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
          {t("scoreSummary", {
            correct,
            total,
            percent: Math.round((correct / total) * 100),
          })}
        </p>
      ) : null}
    </div>
  );
}
