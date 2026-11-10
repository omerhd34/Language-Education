"use client";

import { useState } from "react";

type CheckedAnswer = {
  checked: boolean;
};

type UseExerciseNavigationOptions<T extends CheckedAnswer> = {
  length: number;
  createSlot: () => T;
  buildAllSlots?: () => T[];
  initialIndex?: number;
  initialSlots?: T[];
};

export type ExerciseAdvanceLabel = "next" | "seeResult" | "goToUnanswered";

function defaultSlots<T extends CheckedAnswer>(
  length: number,
  createSlot: () => T,
  buildAllSlots?: () => T[],
): T[] {
  if (buildAllSlots) {
    return buildAllSlots();
  }
  return Array.from({ length }, () => createSlot());
}

export function useExerciseNavigation<T extends CheckedAnswer>({
  length,
  createSlot,
  buildAllSlots,
  initialIndex = 0,
  initialSlots,
}: UseExerciseNavigationOptions<T>) {
  const [index, setIndex] = useState(() =>
    initialIndex >= 0 && initialIndex < length ? initialIndex : 0,
  );
  const [slots, setSlots] = useState<T[]>(() =>
    initialSlots && initialSlots.length === length
      ? initialSlots
      : defaultSlots(length, createSlot, buildAllSlots),
  );
  const [finished, setFinished] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  const current = slots[index];
  const missingIndex = slots.findIndex((slot) => !slot.checked);
  const allChecked = length > 0 && missingIndex === -1;
  const isLast = length === 0 || index >= length - 1;

  const nextLabelKey: ExerciseAdvanceLabel = !isLast
    ? "next"
    : allChecked
      ? "seeResult"
      : current?.checked
        ? "goToUnanswered"
        : "seeResult";

  const canGoNext =
    !resultOpen &&
    (!isLast ||
      allChecked ||
      (Boolean(current?.checked) &&
        missingIndex >= 0 &&
        missingIndex !== index));

  function updateCurrent(patch: Partial<T>) {
    setSlots((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function handlePrevious() {
    setResultOpen(false);
    setIndex((value) => (value > 0 ? value - 1 : value));
  }

  function handleAdvance(onFinish: (answered: T[]) => void) {
    setResultOpen(false);

    if (index < length - 1) {
      setIndex((value) => value + 1);
      return;
    }

    if (!slots.every((slot) => slot.checked)) {
      const nextMissing = slots.findIndex((slot) => !slot.checked);
      if (nextMissing >= 0 && nextMissing !== index) {
        setIndex(nextMissing);
      }
      return;
    }

    setFinished(true);
    onFinish(slots);
  }

  function resetSession() {
    setIndex(0);
    setSlots(defaultSlots(length, createSlot, buildAllSlots));
    setFinished(false);
    setResultOpen(false);
  }

  return {
    index,
    slots,
    current,
    finished,
    resultOpen,
    setResultOpen,
    isLast,
    allChecked,
    nextLabelKey,
    canGoPrevious: index > 0,
    canGoNext,
    updateCurrent,
    handlePrevious,
    handleAdvance,
    resetSession,
  };
}
