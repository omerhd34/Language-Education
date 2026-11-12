"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Volume2 } from "lucide-react";
import { ExerciseFinishedPanel } from "@/components/features/exercises/ExerciseFinishedPanel";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import { ExerciseStepNav } from "@/components/features/topics/ExerciseStepNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VerbFormSpeakButton } from "@/components/features/vocabulary/VerbFormSpeakButton";
import type { ListeningExercise, VerbListeningRow } from "@/data/grammar/types";
import { useExerciseNavigation } from "@/hooks/useExerciseNavigation";
import { speakText, stopSpeaking } from "@/lib/speakText";
import { cn } from "@/lib/utils";

type ExerciseSessionResult = {
  correct: number;
  total: number;
};

type ListeningExercisesProps = {
  exercises: ListeningExercise[];
  onComplete?: (result: ExerciseSessionResult) => void;
  onRestart?: () => void;
  initialIndex?: number;
  initialSlots?: ListeningSlot[];
  progressShare?: number;
  onSessionChange?: (session: {
    index: number;
    correct: number;
    total: number;
    slots: ListeningSlot[];
  }) => void;
  onBackToTypes?: () => void;
};

type VerbRowSlotSelection = {
  v2Selected: number | null;
  v3Selected: number | null;
};

type ListeningSlot = {
  englishSelected: number | null;
  turkishSelected: number | null;
  v2Selected: number | null;
  verbRows?: VerbRowSlotSelection[];
  checked: boolean;
};

function isVerbBatchListening(exercise: ListeningExercise): boolean {
  return (exercise.verbListeningRows?.length ?? 0) > 0;
}

function isVerbTripleListening(exercise: ListeningExercise): boolean {
  return (
    exercise.verbTripleForm === true &&
    !isVerbBatchListening(exercise) &&
    exercise.v2Options !== undefined &&
    exercise.v2CorrectIndex !== undefined
  );
}

type OptionGroupProps = {
  label: string;
  options: string[];
  selected: number | null;
  correctIndex: number;
  checked: boolean;
  ariaLabel: string;
  onSelect: (index: number) => void;
  speakOnCorrectOption?: boolean;
};

function createListeningSlot(): ListeningSlot {
  return {
    englishSelected: null,
    turkishSelected: null,
    v2Selected: null,
    checked: false,
  };
}

function listeningSlotForExercise(exercise: ListeningExercise): ListeningSlot {
  const slot = createListeningSlot();
  if (exercise.verbListeningRows?.length) {
    return {
      ...slot,
      verbRows: exercise.verbListeningRows.map(() => ({
        v2Selected: null,
        v3Selected: null,
      })),
    };
  }
  if (isVerbTripleListening(exercise)) {
    return { ...slot, turkishSelected: exercise.turkishCorrectIndex };
  }
  return slot;
}

function resolveListeningInitialSlots(
  exercises: ListeningExercise[],
  saved?: ListeningSlot[],
): ListeningSlot[] {
  if (!saved || saved.length !== exercises.length) {
    return exercises.map((exercise) => listeningSlotForExercise(exercise));
  }

  return exercises.map((exercise, slotIndex) => {
    const preset = listeningSlotForExercise(exercise);
    const savedSlot = saved[slotIndex];
    if (!savedSlot) {
      return preset;
    }

    return {
      ...savedSlot,
      turkishSelected: savedSlot.turkishSelected ?? preset.turkishSelected,
    };
  });
}

function isVerbBatchComplete(
  rows: VerbListeningRow[],
  selections: VerbRowSlotSelection[] | undefined,
): boolean {
  if (!selections || selections.length !== rows.length) {
    return false;
  }

  return rows.every((_, rowIndex) => {
    const selection = selections[rowIndex];
    return selection?.v2Selected !== null && selection?.v3Selected !== null;
  });
}

function isListeningCorrect(exercise: ListeningExercise, slot: ListeningSlot) {
  if (exercise.verbListeningRows?.length && slot.verbRows) {
    return exercise.verbListeningRows.every((row, rowIndex) => {
      const selection = slot.verbRows?.[rowIndex];
      if (
        !selection ||
        selection.v2Selected === null ||
        selection.v3Selected === null
      ) {
        return false;
      }
      return (
        selection.v2Selected === row.v2CorrectPoolIndex &&
        selection.v3Selected === row.v3CorrectPoolIndex
      );
    });
  }

  const base =
    slot.englishSelected === exercise.englishCorrectIndex &&
    slot.turkishSelected === exercise.turkishCorrectIndex;

  if (!isVerbTripleListening(exercise)) {
    return base;
  }

  return base && slot.v2Selected === exercise.v2CorrectIndex;
}

function countCorrect(exercises: ListeningExercise[], slots: ListeningSlot[]) {
  return exercises.reduce((count, exercise, exerciseIndex) => {
    const slot = slots[exerciseIndex];
    if (slot?.checked && isListeningCorrect(exercise, slot)) {
      return count + 1;
    }
    return count;
  }, 0);
}

function OptionGroup({
  label,
  options,
  selected,
  correctIndex,
  checked,
  ariaLabel,
  onSelect,
  speakOnCorrectOption = false,
}: OptionGroupProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400">
        {label}
      </p>
      <ul className="space-y-2" role="listbox" aria-label={ariaLabel}>
        {options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const showCorrect = checked && optionIndex === correctIndex;
          const showWrong =
            checked && isSelected && optionIndex !== correctIndex;

          const showSpeak =
            speakOnCorrectOption && optionIndex === correctIndex;

          return (
            <li
              key={`${label}-${option}-${optionIndex}`}
              className={cn("flex items-stretch gap-2", showSpeak && "gap-2")}
            >
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={checked}
                onClick={() => onSelect(optionIndex)}
                className={cn(
                  "min-w-0 flex-1 cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                  "disabled:cursor-default",
                  showCorrect &&
                    "border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
                  showWrong &&
                    "border-red-500/60 bg-red-500/10 text-red-800 dark:text-red-200",
                  !showCorrect &&
                    !showWrong &&
                    isSelected &&
                    "border-sky-500 bg-sky-500/10 text-brand-950 dark:text-brand-100",
                  !showCorrect &&
                    !showWrong &&
                    !isSelected &&
                    "border-border bg-background/50 text-brand-800 hover:border-brand-400 dark:bg-brand-950/40 dark:text-brand-200",
                )}
              >
                {option}
              </button>
              {showSpeak ? (
                <VerbFormSpeakButton
                  form={option}
                  className="size-11 shrink-0 self-center rounded-xl"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type VerbPoolWordButtonProps = {
  word: string;
  poolIndex: number;
  assignedRow: number;
  activeRow: number | null;
  checked: boolean;
  showCorrect: boolean;
  showWrong: boolean;
  disabled: boolean;
  onClick: () => void;
};

function VerbPoolWordButton({
  word,
  assignedRow,
  activeRow,
  checked,
  showCorrect,
  showWrong,
  disabled,
  onClick,
}: VerbPoolWordButtonProps) {
  const isAssigned = assignedRow >= 0;
  const isActiveTarget = assignedRow === activeRow;

  return (
    <div className="flex w-full min-w-0 items-stretch gap-1.5">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex min-h-10 min-w-0 flex-1 items-center rounded-xl border px-2.5 py-2 text-left text-sm transition-colors",
          "disabled:cursor-default",
          showCorrect &&
            "border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
          showWrong &&
            "border-red-500/60 bg-red-500/10 text-red-800 dark:text-red-200",
          !showCorrect &&
            !showWrong &&
            isActiveTarget &&
            "border-sky-500 bg-sky-500/15 text-brand-950 dark:text-brand-100",
          !showCorrect &&
            !showWrong &&
            isAssigned &&
            !isActiveTarget &&
            "border-brand-400/50 bg-brand-50/80 dark:bg-brand-900/40",
          !showCorrect &&
            !showWrong &&
            !isAssigned &&
            "border-border bg-background/50 text-brand-800 hover:border-brand-400 dark:bg-brand-950/40 dark:text-brand-200",
          !disabled && !checked && "cursor-pointer",
        )}
      >
        <span className="min-w-0 flex-1 truncate">{word}</span>
      </button>
      <VerbFormSpeakButton
        form={word}
        className="size-10 shrink-0 rounded-xl"
      />
    </div>
  );
}

const verbListeningWordButtonClass =
  "flex min-h-10 min-w-0 flex-1 items-center rounded-xl border px-2.5 py-2 text-left text-sm transition-colors";

function isVerbRowRevealed(selection: VerbRowSlotSelection): boolean {
  return selection.v2Selected !== null && selection.v3Selected !== null;
}

function isVerbRowCorrect(
  row: VerbListeningRow,
  selection: VerbRowSlotSelection,
): boolean {
  return (
    selection.v2Selected === row.v2CorrectPoolIndex &&
    selection.v3Selected === row.v3CorrectPoolIndex
  );
}

type VerbListeningBatchPanelProps = {
  rows: VerbListeningRow[];
  v2Pool: string[];
  v3Pool: string[];
  selections: VerbRowSlotSelection[];
  checked: boolean;
  v1Label: string;
  v2Label: string;
  v3Label: string;
  pickRowHint: string;
  onSelectV2: (rowIndex: number, poolIndex: number) => void;
  onSelectV3: (rowIndex: number, poolIndex: number) => void;
};

function VerbListeningBatchPanel({
  rows,
  v2Pool,
  v3Pool,
  selections,
  checked,
  v1Label,
  v2Label,
  v3Label,
  pickRowHint,
  onSelectV2,
  onSelectV3,
}: VerbListeningBatchPanelProps) {
  const tVocabulary = useTranslations("Vocabulary");
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const rowCount = Math.max(rows.length, v2Pool.length, v3Pool.length);
  const columnHeaderClass =
    "px-0.5 text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400";

  function poolFeedback(
    poolIndex: number,
    field: "v2" | "v3",
  ): {
    showCorrect: boolean;
    showWrong: boolean;
    assignedRow: number;
    rowLocked: boolean;
  } {
    const slotKey = field === "v2" ? "v2Selected" : "v3Selected";
    const correctKey =
      field === "v2" ? "v2CorrectPoolIndex" : "v3CorrectPoolIndex";
    const assignedRow = selections.findIndex(
      (item) => item[slotKey] === poolIndex,
    );
    const row = assignedRow >= 0 ? rows[assignedRow] : undefined;
    const selection = assignedRow >= 0 ? selections[assignedRow] : undefined;
    const rowRevealed = selection !== undefined && isVerbRowRevealed(selection);
    const rowCorrect =
      rowRevealed && row !== undefined && isVerbRowCorrect(row, selection);
    const rowLocked = rowCorrect;

    const isThisSelection =
      assignedRow >= 0 && selection?.[slotKey] === poolIndex;
    const isCorrectOption = row !== undefined && poolIndex === row[correctKey];

    const showCorrect =
      rowRevealed &&
      assignedRow >= 0 &&
      (rowCorrect ? isThisSelection && isCorrectOption : isCorrectOption);
    const showWrong =
      rowRevealed && assignedRow >= 0 && isThisSelection && !isCorrectOption;

    return { showCorrect, showWrong, assignedRow, rowLocked };
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {pickRowHint}
      </p>
      <div className="grid grid-cols-3 items-stretch gap-x-3 gap-y-1.5">
        <p className={columnHeaderClass}>{v1Label}</p>
        <p className={columnHeaderClass}>{v2Label}</p>
        <p className={columnHeaderClass}>{v3Label}</p>

        {Array.from({ length: rowCount }, (_, rowIndex) => {
          const row = rows[rowIndex];
          const v2Word = v2Pool[rowIndex];
          const v3Word = v3Pool[rowIndex];

          if (!row && !v2Word && !v3Word) {
            return null;
          }

          const selection = selections[rowIndex] ?? {
            v2Selected: null,
            v3Selected: null,
          };
          const rowRevealed = isVerbRowRevealed(selection);
          const rowCorrect =
            row && rowRevealed && isVerbRowCorrect(row, selection);
          const rowWrong = row && rowRevealed && !rowCorrect;
          const rowLocked = Boolean(rowCorrect);

          const v2Index = rowIndex < v2Pool.length ? rowIndex : -1;
          const v3Index = rowIndex < v3Pool.length ? rowIndex : -1;
          const v2Fb = v2Index >= 0 ? poolFeedback(v2Index, "v2") : null;
          const v3Fb = v3Index >= 0 ? poolFeedback(v3Index, "v3") : null;

          return (
            <Fragment key={row?.verbId ?? `verb-row-${rowIndex}`}>
              {row ? (
                <div className="flex w-full min-w-0 items-stretch gap-1.5">
                  <button
                    type="button"
                    disabled={checked || rowLocked}
                    onClick={() => setActiveRow(rowIndex)}
                    className={cn(
                      verbListeningWordButtonClass,
                      "gap-2 font-medium",
                      "disabled:cursor-default",
                      activeRow !== null &&
                        activeRow === rowIndex &&
                        !checked &&
                        !rowLocked &&
                        "border-sky-500 ring-2 ring-sky-500/25",
                      rowCorrect &&
                        "border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
                      rowWrong &&
                        "border-red-500/60 bg-red-500/10 text-red-800 dark:text-red-200",
                      !rowCorrect &&
                        !rowWrong &&
                        "border-border bg-background/50 text-brand-950 dark:bg-brand-950/40 dark:text-brand-100",
                      !checked && "cursor-pointer hover:border-brand-400",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{row.v1}</span>
                    <Badge
                      variant={row.regular ? "secondary" : "outline"}
                      className="shrink-0 px-1.5 py-0 text-[10px] font-normal leading-tight"
                    >
                      {row.regular
                        ? tVocabulary("verbsTypeRegular")
                        : tVocabulary("verbsTypeIrregular")}
                    </Badge>
                  </button>
                  <VerbFormSpeakButton
                    form={row.v1}
                    className="size-10 shrink-0 rounded-xl"
                  />
                </div>
              ) : (
                <div aria-hidden />
              )}

              {v2Word && v2Fb ? (
                <VerbPoolWordButton
                  word={v2Word}
                  poolIndex={v2Index}
                  assignedRow={v2Fb.assignedRow}
                  activeRow={activeRow}
                  checked={checked}
                  showCorrect={v2Fb.showCorrect}
                  showWrong={v2Fb.showWrong}
                  disabled={
                    checked ||
                    v2Fb.rowLocked ||
                    (activeRow === null && v2Fb.assignedRow < 0)
                  }
                  onClick={() => {
                    if (activeRow === null) {
                      return;
                    }
                    onSelectV2(activeRow, v2Index);
                  }}
                />
              ) : (
                <div aria-hidden />
              )}

              {v3Word && v3Fb ? (
                <VerbPoolWordButton
                  word={v3Word}
                  poolIndex={v3Index}
                  assignedRow={v3Fb.assignedRow}
                  activeRow={activeRow}
                  checked={checked}
                  showCorrect={v3Fb.showCorrect}
                  showWrong={v3Fb.showWrong}
                  disabled={
                    checked ||
                    v3Fb.rowLocked ||
                    (activeRow === null && v3Fb.assignedRow < 0)
                  }
                  onClick={() => {
                    if (activeRow === null) {
                      return;
                    }
                    onSelectV3(activeRow, v3Index);
                  }}
                />
              ) : (
                <div aria-hidden />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function ListeningExercises({
  exercises,
  onComplete,
  onRestart,
  initialIndex = 0,
  initialSlots,
  progressShare = 100,
  onSessionChange,
  onBackToTypes,
}: ListeningExercisesProps) {
  const t = useTranslations("Topic");
  const [batchPanelKey, setBatchPanelKey] = useState(0);
  const skipSessionSave = useRef(true);
  const seededSlots = useMemo(
    () => resolveListeningInitialSlots(exercises, initialSlots),
    [exercises, initialSlots],
  );
  const buildAllSlots = useMemo(
    () => () => exercises.map((item) => listeningSlotForExercise(item)),
    [exercises],
  );
  const {
    index,
    slots,
    current,
    finished,
    resultOpen,
    setResultOpen,
    nextLabelKey,
    canGoPrevious,
    canGoNext,
    updateCurrent,
    handlePrevious,
    handleAdvance,
    resetSession,
  } = useExerciseNavigation({
    length: exercises.length,
    createSlot: createListeningSlot,
    buildAllSlots,
    initialIndex,
    initialSlots: seededSlots,
  });

  useEffect(() => {
    if (!onSessionChange) {
      return;
    }
    if (skipSessionSave.current) {
      skipSessionSave.current = false;
      return;
    }

    onSessionChange({
      index,
      correct: countCorrect(exercises, slots),
      total: exercises.length,
      slots: slots.map((slot) => ({
        englishSelected: slot.englishSelected,
        turkishSelected: slot.turkishSelected,
        v2Selected: slot.v2Selected,
        verbRows: slot.verbRows,
        checked: slot.checked,
      })),
    });
  }, [exercises, index, onSessionChange, slots]);

  const exercise = exercises[index];

  useEffect(() => {
    if (
      !exercise ||
      finished ||
      isVerbBatchListening(exercise) ||
      isVerbTripleListening(exercise)
    ) {
      return;
    }
    speakText(exercise.speakText);
    return () => {
      stopSpeaking();
    };
  }, [exercise, finished, index]);

  if (exercises.length === 0 || !current || !exercise) {
    return <p className="page-subtitle mt-0">{t("noExercisesForType")}</p>;
  }

  const isCorrect = current.checked && isListeningCorrect(exercise, current);
  const canRestart = index > 0;
  const continueLabel = t(nextLabelKey);
  const answered = slots.filter((slot) => slot.checked).length;
  const percent =
    exercises.length === 0
      ? 0
      : Math.round((answered / exercises.length) * progressShare);

  function resetAll() {
    stopSpeaking();
    resetSession();
  }

  function resetCurrentVerbBatch() {
    if (!exercise.verbListeningRows) {
      return;
    }
    updateCurrent({
      verbRows: exercise.verbListeningRows.map(() => ({
        v2Selected: null,
        v3Selected: null,
      })),
      checked: false,
    });
    setBatchPanelKey((value) => value + 1);
  }

  if (finished) {
    const correctCount = countCorrect(exercises, slots);
    return (
      <ExerciseFinishedPanel
        correct={correctCount}
        total={exercises.length}
        onRetry={resetAll}
        onBackToTypes={onBackToTypes}
      />
    );
  }

  function applyVerbRowSelection(
    rowIndex: number,
    field: "v2" | "v3",
    optionIndex: number,
  ) {
    if (current.checked || !exercise.verbListeningRows) {
      return;
    }

    const row = exercise.verbListeningRows[rowIndex];
    const existing = current.verbRows?.[rowIndex];
    if (
      row &&
      existing &&
      isVerbRowRevealed(existing) &&
      isVerbRowCorrect(row, existing)
    ) {
      return;
    }

    const nextRows = [...(current.verbRows ?? [])];
    while (nextRows.length < exercise.verbListeningRows.length) {
      nextRows.push({ v2Selected: null, v3Selected: null });
    }

    const slotKey = field === "v2" ? "v2Selected" : "v3Selected";

    for (let i = 0; i < nextRows.length; i += 1) {
      if (i !== rowIndex && nextRows[i]?.[slotKey] === optionIndex) {
        nextRows[i] = { ...nextRows[i], [slotKey]: null };
      }
    }

    nextRows[rowIndex] = {
      ...nextRows[rowIndex],
      [slotKey]: optionIndex,
    };

    const complete = isVerbBatchComplete(exercise.verbListeningRows, nextRows);

    updateCurrent({
      verbRows: nextRows,
      ...(complete ? { checked: true } : {}),
    });
  }

  function applyListeningSelection(patch: Partial<ListeningSlot>) {
    if (current.checked) {
      return;
    }

    const nextEnglish =
      patch.englishSelected !== undefined
        ? patch.englishSelected
        : current.englishSelected;
    const nextTurkish =
      patch.turkishSelected !== undefined
        ? patch.turkishSelected
        : current.turkishSelected;
    const nextV2 =
      patch.v2Selected !== undefined ? patch.v2Selected : current.v2Selected;

    const triple = isVerbTripleListening(exercise);
    const allChosen = triple
      ? nextEnglish !== null && nextTurkish !== null && nextV2 !== null
      : nextEnglish !== null && nextTurkish !== null;

    updateCurrent({
      ...patch,
      ...(allChosen ? { checked: true } : {}),
    });
  }

  function handleNext() {
    handleAdvance((answered) => {
      onComplete?.({
        correct: countCorrect(exercises, answered),
        total: exercises.length,
      });
    });
  }

  const verbBatch = isVerbBatchListening(exercise);
  const verbTriple = isVerbTripleListening(exercise);
  const batchRows = exercise.verbListeningRows ?? [];
  const batchSelections =
    current.verbRows ??
    batchRows.map(() => ({ v2Selected: null, v3Selected: null }));
  const canResetVerbBatch =
    verbBatch &&
    (current.checked ||
      batchSelections.some(
        (row) => row.v2Selected !== null || row.v3Selected !== null,
      ));

  return (
    <div
      className={cn(
        "mx-auto space-y-4",
        verbBatch || verbTriple ? "max-w-4xl" : "max-w-2xl",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-brand-500 dark:text-brand-400">
          {t("progress", { current: index + 1, total: exercises.length })}
        </p>
        <ExercisePercentBadge percent={percent} />
      </div>

      <article className="dashboard-panel space-y-5">
        {verbBatch ? null : (
          <ExerciseQuestionHeader
            title={exercise.prompt}
            hint={exercise.hint}
            fallbackKey="topicListening"
            actions={
              verbTriple ? undefined : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => speakText(exercise.speakText)}
                >
                  <Volume2 className="size-4" aria-hidden />
                  {t("playAudio")}
                </Button>
              )
            }
          />
        )}

        {verbBatch ? (
          <VerbListeningBatchPanel
            key={`verb-batch-${index}-${batchPanelKey}`}
            rows={batchRows}
            v2Pool={exercise.verbListeningV2Pool ?? []}
            v3Pool={exercise.verbListeningV3Pool ?? []}
            selections={batchSelections}
            checked={current.checked}
            v1Label={t("listeningVerbV1Label")}
            v2Label={t("listeningVerbV2Label")}
            v3Label={t("listeningVerbV3Label")}
            pickRowHint={t("listeningVerbPickRowHint")}
            onSelectV2={(rowIndex, optionIndex) =>
              applyVerbRowSelection(rowIndex, "v2", optionIndex)
            }
            onSelectV3={(rowIndex, optionIndex) =>
              applyVerbRowSelection(rowIndex, "v3", optionIndex)
            }
          />
        ) : (
          <div
            className={cn(
              "grid gap-5",
              verbTriple ? "sm:grid-cols-3" : "sm:grid-cols-2",
            )}
          >
            {verbTriple ? (
              <>
                <OptionGroup
                  label={t("listeningVerbV1Label")}
                  options={exercise.turkishOptions}
                  selected={current.turkishSelected}
                  correctIndex={exercise.turkishCorrectIndex}
                  checked={current.checked}
                  ariaLabel={t("listeningVerbV1OptionsAria")}
                  speakOnCorrectOption
                  onSelect={(optionIndex) =>
                    applyListeningSelection({ turkishSelected: optionIndex })
                  }
                />
                {exercise.v2Options ? (
                  <OptionGroup
                    label={t("listeningVerbV2Label")}
                    options={exercise.v2Options}
                    selected={current.v2Selected}
                    correctIndex={exercise.v2CorrectIndex ?? -1}
                    checked={current.checked}
                    ariaLabel={t("listeningVerbV2OptionsAria")}
                    speakOnCorrectOption
                    onSelect={(optionIndex) =>
                      applyListeningSelection({ v2Selected: optionIndex })
                    }
                  />
                ) : null}
                <OptionGroup
                  label={t("listeningVerbV3Label")}
                  options={exercise.englishOptions}
                  selected={current.englishSelected}
                  correctIndex={exercise.englishCorrectIndex}
                  checked={current.checked}
                  ariaLabel={t("listeningVerbV3OptionsAria")}
                  speakOnCorrectOption
                  onSelect={(optionIndex) =>
                    applyListeningSelection({ englishSelected: optionIndex })
                  }
                />
              </>
            ) : (
              <>
                <OptionGroup
                  label={t("listeningEnglishLabel")}
                  options={exercise.englishOptions}
                  selected={current.englishSelected}
                  correctIndex={exercise.englishCorrectIndex}
                  checked={current.checked}
                  ariaLabel={t("listeningEnglishOptionsAria")}
                  onSelect={(optionIndex) =>
                    applyListeningSelection({ englishSelected: optionIndex })
                  }
                />
                <OptionGroup
                  label={t("listeningTurkishLabel")}
                  options={exercise.turkishOptions}
                  selected={current.turkishSelected}
                  correctIndex={exercise.turkishCorrectIndex}
                  checked={current.checked}
                  ariaLabel={t("listeningTurkishOptionsAria")}
                  onSelect={(optionIndex) =>
                    applyListeningSelection({ turkishSelected: optionIndex })
                  }
                />
              </>
            )}
          </div>
        )}

        <ExerciseStepNav
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext && current.checked}
          nextLabel={continueLabel}
          nextVariant={current.checked ? "default" : "outline"}
          onPrevious={handlePrevious}
          onNext={handleNext}
          trailing={
            <>
              {canResetVerbBatch ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetCurrentVerbBatch}
                >
                  {t("listeningVerbReset")}
                </Button>
              ) : null}
              {canRestart ? (
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    onRestart?.();
                    resetAll();
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden />
                  {t("restart")}
                </Button>
              ) : null}
            </>
          }
        />
      </article>

      <ExerciseResultDialog
        open={resultOpen && current.checked && Boolean(exercise.explanation)}
        variant={isCorrect ? "correct" : "incorrect"}
        explanation={exercise.explanation}
        onOpenChange={setResultOpen}
        onContinue={handleNext}
        continueLabel={continueLabel}
      />
    </div>
  );
}
