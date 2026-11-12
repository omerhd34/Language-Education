"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CrosswordExerciseView } from "@/components/features/topics/CrosswordExerciseView";
import { ExerciseTypePicker } from "@/components/features/topics/ExerciseTypePicker";
import { FillBlankExercises } from "@/components/features/topics/FillBlankExercises";
import { ListeningExercises } from "@/components/features/topics/ListeningExercises";
import { MatchingExercises } from "@/components/features/topics/MatchingExercises";
import { MultipleChoiceExercises } from "@/components/features/topics/MultipleChoiceExercises";
import { TopicMixedQuizExercises } from "@/components/features/topics/TopicMixedQuizExercises";
import { getTopicContent } from "@/data/topics";
import type { CefrLevel } from "@/data/dashboardTopics";
import type {
  CrosswordExercise,
  ExerciseType,
  FillBlankExercise,
  ListeningExercise,
  MatchingExercise,
  MultipleChoiceExercise,
  TrueFalseExercise,
  TopicExercise,
  TopicQuizExercise,
} from "@/data/topics/types";
import { didPassExamScore, markLevelExamPassed } from "@/lib/levelExamStorage";
import {
  LEVEL_EXAM_PROGRESS_EVENT,
  readLevelExamProgress,
  writeLevelExamPartProgress,
} from "@/lib/levelExamProgressStorage";
import {
  getLevelExamParts,
  resolveLevelExamCrosswords,
  resolveLevelExamFillBlanks,
  type LevelExamPart,
} from "@/lib/topicExam";
import {
  TOPIC_PROGRESS_CHANGED_EVENT,
  getCompletedTopicExerciseTypes,
  markTopicExerciseTypeCompleted,
  unmarkTopicExerciseTypeCompleted,
} from "@/lib/topicProgressStorage";
import {
  EXERCISE_DRAFT_EVENT,
  clearCrosswordDraft,
  clearLinearSession,
  readLinearSession,
  readLinearSessionOrder,
  readSelectedExerciseType,
  writeLinearSession,
  writeLinearSessionOrder,
  writeSelectedExerciseType,
  type LinearSessionDraft,
  type LinearSlot,
} from "@/lib/exerciseDraftStorage";
import {
  PRACTICE_MIXED_SESSION_SUFFIX,
  computeExerciseTypeProgress,
  countCrosswordCluesInExercises,
  crosswordDraftKey,
  totalCrosswordClueCount,
} from "@/lib/exerciseTypeProgress";
import { toTopicQuizExercises } from "@/lib/topicExam";
import { shuffleSeeded } from "@/lib/seededRandom";
import { getNextLevel } from "@/lib/topicAccess";

type TopicExercisesViewProps = {
  topicId?: string;
  progressKey?: string;
  exercises: TopicExercise[];
  isExam?: boolean;
  level?: CefrLevel;
  showHints?: boolean;
  onExerciseSessionStart?: (type?: ExerciseType) => void;
};

type LinearSessionInput = {
  index: number;
  correct: number;
  total: number;
  slots: Array<{
    selected?: number | null;
    answer?: string;
    englishSelected?: number | null;
    turkishSelected?: number | null;
    v2Selected?: number | null;
    verbRows?: Array<{
      v2Selected: number | null;
      v3Selected: number | null;
    }>;
    checked: boolean;
    correct?: boolean;
    assignments?: Record<number, number>;
    revealed?: boolean;
    graded?: boolean;
  }>;
};

function parseMatchingAssignments(
  value: Record<string, number> | undefined,
): Record<number, number> {
  if (!value) {
    return {};
  }
  const result: Record<number, number> = {};
  for (const [key, rightSlot] of Object.entries(value)) {
    const leftIndex = Number(key);
    if (Number.isInteger(leftIndex) && Number.isInteger(rightSlot)) {
      result[leftIndex] = rightSlot;
    }
  }
  return result;
}

type ExamPartScore = { correct: number; total: number };
type LevelExamPartOutcome = "passed" | "failed";

function linearSessionProgressPercent(saved: LinearSessionDraft): number {
  const checked = saved.slots.filter((slot) => slot.checked).length;
  if (saved.total <= 0) {
    return 0;
  }
  return Math.round((checked / saved.total) * 100);
}

const PRACTICE_TYPES_WITH_RANDOM_SET: ExerciseType[] = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "listening",
  "matching",
  "mixed",
];

function trueFalseAsMultipleChoice(
  items: TrueFalseExercise[],
): MultipleChoiceExercise[] {
  return items.map((item) => ({ ...item, type: "multiple_choice" }));
}

function orderExercisesByIds<T extends TopicExercise>(
  items: T[],
  ids: string[],
): T[] {
  if (ids.length !== items.length) {
    return items;
  }
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered: T[] = [];
  for (const id of ids) {
    const exercise = byId.get(id);
    if (!exercise) {
      return items;
    }
    ordered.push(exercise);
  }
  return ordered;
}

function createShuffledExerciseOrder(
  items: TopicExercise[],
  seed: string,
): string[] {
  return shuffleSeeded(items, seed).map((item) => item.id);
}

function toLinearSlots(session: LinearSessionInput): LinearSlot[] {
  return session.slots.map((slot) => ({
    selected: slot.selected ?? null,
    answer: slot.answer ?? "",
    englishSelected: slot.englishSelected ?? null,
    turkishSelected: slot.turkishSelected ?? null,
    v2Selected: slot.v2Selected ?? null,
    verbRows: slot.verbRows,
    checked: slot.checked,
    matchingAssignments: slot.assignments
      ? Object.fromEntries(
          Object.entries(slot.assignments).map(([left, right]) => [
            String(left),
            right,
          ]),
        )
      : undefined,
    matchingRevealed: slot.revealed,
    matchingCorrect: slot.correct,
  }));
}

function matchingSlotsFromSaved(saved: LinearSessionDraft) {
  return saved.slots.map((slot) => ({
    checked: slot.checked,
    correct: slot.matchingCorrect ?? false,
    assignments: parseMatchingAssignments(slot.matchingAssignments),
    revealed: slot.matchingRevealed ?? false,
    graded: Boolean(slot.matchingRevealed) && slot.checked,
  }));
}

export function TopicExercisesView({
  topicId,
  progressKey,
  exercises,
  isExam = false,
  level,
  showHints = true,
  onExerciseSessionStart,
}: TopicExercisesViewProps) {
  const t = useTranslations("Topic");
  const selectionKey = progressKey ?? topicId ?? null;
  const practiceMixed = Boolean(
    topicId && getTopicContent(topicId)?.practiceMixed,
  );
  const mixedPracticeExercises = useMemo(
    () => toTopicQuizExercises(exercises),
    [exercises],
  );
  const matchingPracticeExercises = useMemo(
    () =>
      exercises.filter(
        (item): item is MatchingExercise => item.type === "matching",
      ),
    [exercises],
  );
  const mixedSessionKey =
    selectionKey && practiceMixed
      ? `${selectionKey}:${PRACTICE_MIXED_SESSION_SUFFIX}`
      : null;
  const [selectedType, setSelectedType] = useState<ExerciseType | null>(null);
  const [sessionReady, setSessionReady] = useState(isExam);
  const [sessionNonce, setSessionNonce] = useState(0);
  const [progressReady, setProgressReady] = useState(false);
  const [draftVersion, setDraftVersion] = useState(0);
  const restoredTopicRef = useRef<string | null>(null);
  const [completedTypes, setCompletedTypes] = useState<ExerciseType[]>([]);
  const nextLevel = level ? getNextLevel(level) : null;

  const [levelExamSelected, setLevelExamSelected] =
    useState<LevelExamPart | null>(null);
  const [passedLevelParts, setPassedLevelParts] = useState<LevelExamPart[]>([]);
  const [levelPartOutcome, setLevelPartOutcome] =
    useState<LevelExamPartOutcome | null>(null);
  const [levelExamPassed, setLevelExamPassed] = useState(false);
  const [levelExamCrosswords, setLevelExamCrosswords] = useState<
    CrosswordExercise[] | null
  >(null);
  const [levelExamFillBlanks, setLevelExamFillBlanks] = useState<
    FillBlankExercise[] | null
  >(null);
  const [crosswordSessionKey, setCrosswordSessionKey] = useState(0);
  const [fillBlankSessionKey, setFillBlankSessionKey] = useState(0);

  useEffect(() => {
    if (!isExam || !level) {
      setLevelExamCrosswords([]);
      setLevelExamFillBlanks([]);
      setLevelExamSelected(null);
      setPassedLevelParts([]);
      setLevelPartOutcome(null);
      setLevelExamPassed(false);
      return;
    }
    const saved = readLevelExamProgress(level);
    const restored = getLevelExamParts(level).filter(
      (part) => saved.parts[part]?.passed,
    );
    setLevelExamCrosswords(resolveLevelExamCrosswords(level));
    setLevelExamFillBlanks(resolveLevelExamFillBlanks(level));
    setLevelExamSelected(null);
    setPassedLevelParts(restored);
    setLevelPartOutcome(null);
    setLevelExamPassed(false);
  }, [isExam, level]);

  useEffect(() => {
    if (!topicId) {
      setCompletedTypes([]);
      return;
    }

    function refresh() {
      setCompletedTypes(getCompletedTopicExerciseTypes(topicId!));
    }

    refresh();
    window.addEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [topicId]);

  useEffect(() => {
    setProgressReady(true);
  }, []);

  useEffect(() => {
    function refresh() {
      setDraftVersion((value) => value + 1);
    }

    window.addEventListener(EXERCISE_DRAFT_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EXERCISE_DRAFT_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (isExam || !selectionKey) {
      setSessionReady(true);
      return;
    }

    if (restoredTopicRef.current === selectionKey) {
      return;
    }
    restoredTopicRef.current = selectionKey;

    const saved = readSelectedExerciseType(selectionKey);
    if (practiceMixed) {
      const allowed = new Set<ExerciseType>(["mixed", "matching"]);
      setSelectedType(saved && allowed.has(saved) ? saved : null);
      setSessionReady(true);
      return;
    }

    const available = new Set<ExerciseType>(exercises.map((item) => item.type));
    setSelectedType(saved && available.has(saved) ? saved : null);
    setSessionReady(true);
  }, [exercises, isExam, practiceMixed, selectionKey]);

  useEffect(() => {
    if (!sessionReady || isExam || !selectionKey) {
      return;
    }
    writeSelectedExerciseType(selectionKey, selectedType);
  }, [isExam, selectedType, selectionKey, sessionReady]);

  useEffect(() => {
    if (
      isExam ||
      !practiceMixed ||
      !mixedSessionKey ||
      !sessionReady ||
      mixedPracticeExercises.length === 0
    ) {
      return;
    }

    const storedOrder = readLinearSessionOrder(mixedSessionKey);
    if (storedOrder && storedOrder.length === mixedPracticeExercises.length) {
      return;
    }

    const saved = readLinearSession(mixedSessionKey);
    const progress = saved ? linearSessionProgressPercent(saved) : 0;
    if (progress > 0) {
      return;
    }

    writeLinearSessionOrder(
      mixedSessionKey,
      createShuffledExerciseOrder(mixedPracticeExercises, crypto.randomUUID()),
    );
    setSessionNonce((value) => value + 1);
    setDraftVersion((value) => value + 1);
  }, [
    isExam,
    mixedPracticeExercises,
    mixedSessionKey,
    practiceMixed,
    sessionReady,
  ]);

  useEffect(() => {
    if (
      isExam ||
      !sessionReady ||
      !selectionKey ||
      !selectedType ||
      onExerciseSessionStart
    ) {
      return;
    }
    if (!PRACTICE_TYPES_WITH_RANDOM_SET.includes(selectedType)) {
      return;
    }

    const ofType = exercises.filter((item) => item.type === selectedType);
    if (ofType.length === 0) {
      return;
    }

    const sessionKey = `${selectionKey}:${selectedType}`;
    const storedOrder = readLinearSessionOrder(sessionKey);
    if (storedOrder && storedOrder.length === ofType.length) {
      return;
    }

    const saved = readLinearSession(sessionKey);
    const compatibleSave = saved && saved.slots.length === ofType.length;
    const progress = compatibleSave ? linearSessionProgressPercent(saved) : 0;
    if (progress > 0) {
      return;
    }

    writeLinearSessionOrder(
      sessionKey,
      createShuffledExerciseOrder(ofType, crypto.randomUUID()),
    );
    setSessionNonce((value) => value + 1);
    setDraftVersion((value) => value + 1);
  }, [
    exercises,
    isExam,
    onExerciseSessionStart,
    selectedType,
    selectionKey,
    sessionReady,
  ]);

  const typeProgress = useMemo(() => {
    if (!progressReady) {
      return undefined;
    }

    return computeExerciseTypeProgress({
      topicId,
      progressKey: selectionKey ?? undefined,
      exercises,
      completedTypes,
    });
  }, [
    completedTypes,
    draftVersion,
    exercises,
    progressReady,
    selectionKey,
    topicId,
  ]);

  const persistPracticeSession = useCallback(
    (type: ExerciseType, session: LinearSessionInput) => {
      if (!selectionKey || isExam) {
        return;
      }
      writeLinearSession(`${selectionKey}:${type}`, {
        index: session.index,
        correct: session.correct,
        total: session.total,
        slots: toLinearSlots(session),
      });
    },
    [isExam, selectionKey],
  );

  function savedPracticeSession(type: ExerciseType, total: number) {
    if (!selectionKey || isExam) {
      return null;
    }
    const saved = readLinearSession(`${selectionKey}:${type}`);
    if (!saved || saved.slots.length !== total) {
      return null;
    }
    return saved;
  }

  const counts = useMemo(() => {
    if (practiceMixed) {
      return {
        multiple_choice: 0,
        true_false: 0,
        fill_blank: 0,
        crossword: 0,
        listening: 0,
        mixed: mixedPracticeExercises.length,
        matching: matchingPracticeExercises.length,
      } satisfies Record<ExerciseType, number>;
    }
    return {
      multiple_choice: exercises.filter(
        (item) => item.type === "multiple_choice",
      ).length,
      true_false: exercises.filter((item) => item.type === "true_false").length,
      fill_blank: exercises.filter((item) => item.type === "fill_blank").length,
      crossword: countCrosswordCluesInExercises(exercises),
      listening: exercises.filter((item) => item.type === "listening").length,
      matching: exercises.filter((item) => item.type === "matching").length,
      mixed: 0,
    } satisfies Record<ExerciseType, number>;
  }, [
    exercises,
    matchingPracticeExercises.length,
    mixedPracticeExercises.length,
    practiceMixed,
  ]);

  const filteredExercises = useMemo(() => {
    if (!selectedType) {
      return [];
    }
    const ofType = exercises.filter((item) => item.type === selectedType);
    if (
      onExerciseSessionStart ||
      !selectionKey ||
      !PRACTICE_TYPES_WITH_RANDOM_SET.includes(selectedType)
    ) {
      return ofType;
    }
    const order = readLinearSessionOrder(`${selectionKey}:${selectedType}`);
    if (order) {
      return orderExercisesByIds(ofType, order);
    }
    return ofType;
  }, [
    exercises,
    onExerciseSessionStart,
    selectedType,
    selectionKey,
    sessionNonce,
    draftVersion,
  ]);

  const [levelPartPercents, setLevelPartPercents] = useState<
    Partial<Record<LevelExamPart, number>>
  >({});

  useEffect(() => {
    if (!isExam || !level) {
      return;
    }

    function refresh() {
      const saved = readLevelExamProgress(level!);
      const next: Partial<Record<LevelExamPart, number>> = {};
      for (const part of getLevelExamParts(level!)) {
        const item = saved.parts[part];
        next[part] = item ? (item.passed ? 100 : item.percent) : 0;
      }
      setLevelPartPercents(next);
    }

    refresh();
    window.addEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [isExam, level]);

  const reportLevelPart = useCallback(
    (part: LevelExamPart, percent: number, passed: boolean) => {
      if (!level) {
        return;
      }
      const current = readLevelExamProgress(level).parts[part];
      if (current?.passed && !passed) {
        return;
      }
      writeLevelExamPartProgress(level, part, {
        percent: passed ? 100 : percent,
        passed,
      });
    },
    [level],
  );

  const handleCrosswordProgress = useCallback(
    (percent: number) => {
      reportLevelPart("crossword", percent, false);
    },
    [reportLevelPart],
  );

  const handleFillBlankSession = useCallback(
    (session: {
      index: number;
      correct: number;
      total: number;
      slots: { answer: string; checked: boolean }[];
    }) => {
      const checked = session.slots.filter((slot) => slot.checked).length;
      const percent =
        session.total <= 0 ? 0 : Math.round((checked / session.total) * 100);
      reportLevelPart("fill_blank", percent, false);
      if (level) {
        writeLinearSession(`level:${level}:fill_blank`, {
          index: session.index,
          correct: session.correct,
          total: session.total,
          slots: toLinearSlots(session),
        });
      }
    },
    [level, reportLevelPart],
  );

  const restartLevelPart = useCallback(
    (part: LevelExamPart) => {
      if (!level) {
        return;
      }
      writeLevelExamPartProgress(level, part, { percent: 0, passed: false });
      setPassedLevelParts((current) => current.filter((item) => item !== part));
    },
    [level],
  );

  const levelExamCounts = useMemo(
    () =>
      ({
        multiple_choice: 0,
        true_false: 0,
        fill_blank: levelExamFillBlanks?.length ?? 0,
        crossword: levelExamCrosswords
          ? totalCrosswordClueCount(levelExamCrosswords)
          : 0,
        listening: 0,
        matching: 0,
        mixed: 0,
      }) satisfies Record<ExerciseType, number>,
    [levelExamCrosswords, levelExamFillBlanks],
  );

  function tryFinalizeLevelExam(nextPassed: LevelExamPart[]) {
    if (!level) {
      return;
    }
    const required = getLevelExamParts(level);
    if (
      required.length > 0 &&
      required.every((part) => nextPassed.includes(part))
    ) {
      markLevelExamPassed(level);
      setLevelExamPassed(true);
      setLevelExamSelected(null);
      setLevelPartOutcome(null);
    }
  }

  function handleLevelExamPartComplete(
    part: LevelExamPart,
    result: ExamPartScore,
  ) {
    const percent =
      result.total <= 0 ? 0 : Math.round((result.correct / result.total) * 100);
    if (didPassExamScore(result.correct, result.total)) {
      const nextPassed = passedLevelParts.includes(part)
        ? passedLevelParts
        : [...passedLevelParts, part];
      setPassedLevelParts(nextPassed);
      reportLevelPart(part, percent, true);
      setLevelPartOutcome("passed");
      tryFinalizeLevelExam(nextPassed);
      return;
    }

    reportLevelPart(part, percent, false);
    setLevelPartOutcome("failed");
  }

  function retryCurrentLevelPart() {
    if (!level || !levelExamSelected) {
      return;
    }
    setLevelPartOutcome(null);
    writeLevelExamPartProgress(level, levelExamSelected, {
      percent: 0,
      passed: false,
    });
    setPassedLevelParts((current) =>
      current.filter((part) => part !== levelExamSelected),
    );
    if (levelExamSelected === "crossword") {
      clearCrosswordDraft(`level:${level}:crossword`);
      setLevelExamCrosswords(resolveLevelExamCrosswords(level));
      setCrosswordSessionKey((value) => value + 1);
      return;
    }
    clearLinearSession(`level:${level}:fill_blank`);
    setLevelExamFillBlanks(resolveLevelExamFillBlanks(level));
    setFillBlankSessionKey((value) => value + 1);
  }

  function backToLevelExamPicker() {
    setLevelExamSelected(null);
    setLevelPartOutcome(null);
  }

  function handleSessionComplete() {
    if (topicId && selectedType) {
      markTopicExerciseTypeCompleted(topicId, selectedType);
    }
  }

  const orderedMixedPractice = useMemo(() => {
    if (!practiceMixed || mixedPracticeExercises.length === 0) {
      return mixedPracticeExercises;
    }
    if (!mixedSessionKey) {
      return mixedPracticeExercises;
    }
    const order = readLinearSessionOrder(mixedSessionKey);
    if (order) {
      return orderExercisesByIds(
        mixedPracticeExercises,
        order,
      ) as TopicQuizExercise[];
    }
    return mixedPracticeExercises;
  }, [
    mixedPracticeExercises,
    mixedSessionKey,
    practiceMixed,
    sessionNonce,
    draftVersion,
  ]);

  const orderedMatchingPractice = useMemo(() => {
    if (matchingPracticeExercises.length === 0 || !selectionKey) {
      return matchingPracticeExercises;
    }
    const order = readLinearSessionOrder(`${selectionKey}:matching`);
    if (order) {
      return orderExercisesByIds(matchingPracticeExercises, order);
    }
    return matchingPracticeExercises;
  }, [draftVersion, matchingPracticeExercises, selectionKey, sessionNonce]);

  function handleMixedPracticeComplete() {
    if (!topicId) {
      return;
    }
    markTopicExerciseTypeCompleted(topicId, "mixed");
  }

  function handleMixedPracticeRestart() {
    if (!topicId) {
      return;
    }
    unmarkTopicExerciseTypeCompleted(topicId, "mixed");
    if (mixedSessionKey) {
      clearLinearSession(mixedSessionKey);
      writeLinearSessionOrder(
        mixedSessionKey,
        createShuffledExerciseOrder(
          mixedPracticeExercises,
          crypto.randomUUID(),
        ),
      );
    }
    setSessionNonce((value) => value + 1);
  }

  const persistMixedPracticeSession = useCallback(
    (session: LinearSessionInput) => {
      if (!mixedSessionKey) {
        return;
      }
      writeLinearSession(mixedSessionKey, {
        index: session.index,
        correct: session.correct,
        total: session.total,
        slots: toLinearSlots(session),
      });
    },
    [mixedSessionKey],
  );

  const assignFreshExerciseOrder = useCallback(
    (type: ExerciseType) => {
      if (!selectionKey || onExerciseSessionStart) {
        return;
      }
      if (practiceMixed && type === "mixed" && mixedSessionKey) {
        if (mixedPracticeExercises.length === 0) {
          return;
        }
        writeLinearSessionOrder(
          mixedSessionKey,
          createShuffledExerciseOrder(
            mixedPracticeExercises,
            crypto.randomUUID(),
          ),
        );
        return;
      }
      const ofType = exercises.filter((item) => item.type === type);
      if (ofType.length === 0) {
        return;
      }
      writeLinearSessionOrder(
        `${selectionKey}:${type}`,
        createShuffledExerciseOrder(ofType, crypto.randomUUID()),
      );
    },
    [
      exercises,
      mixedPracticeExercises,
      mixedSessionKey,
      onExerciseSessionStart,
      practiceMixed,
      selectionKey,
    ],
  );

  function beginExerciseSession(type: ExerciseType) {
    if (PRACTICE_TYPES_WITH_RANDOM_SET.includes(type) && selectionKey) {
      const isMixedPractice =
        practiceMixed && type === "mixed" && mixedSessionKey;
      const total = isMixedPractice
        ? mixedPracticeExercises.length
        : exercises.filter((item) => item.type === type).length;
      const sessionKey = isMixedPractice
        ? mixedSessionKey
        : `${selectionKey}:${type}`;
      const saved = readLinearSession(sessionKey);
      const compatibleSave = saved && saved.slots.length === total;
      const progress = compatibleSave ? linearSessionProgressPercent(saved) : 0;
      const shouldPickNewSet = !compatibleSave || progress === 0;
      if (shouldPickNewSet) {
        onExerciseSessionStart?.(type);
        clearLinearSession(sessionKey);
        assignFreshExerciseOrder(type);
        setSessionNonce((value) => value + 1);
      }
    }
    setSelectedType(type);
  }

  function isMixedPracticeSessionComplete(): boolean {
    return (
      completedTypes.includes("mixed") ||
      (completedTypes.includes("multiple_choice") &&
        completedTypes.includes("fill_blank"))
    );
  }

  function backToExerciseTypePicker() {
    setSelectedType(null);
  }

  function handleSessionRestart() {
    if (topicId && selectedType) {
      unmarkTopicExerciseTypeCompleted(topicId, selectedType);
    }
    onExerciseSessionStart?.(selectedType ?? undefined);
    if (selectedType === "mixed" && practiceMixed) {
      handleMixedPracticeRestart();
      return;
    }
    if (selectionKey && selectedType) {
      clearLinearSession(`${selectionKey}:${selectedType}`);
      assignFreshExerciseOrder(selectedType);
      if (selectedType === "crossword") {
        clearCrosswordDraft(
          crosswordDraftKey(
            topicId,
            exercises.filter(
              (item): item is CrosswordExercise => item.type === "crossword",
            ),
          ),
        );
      }
    }
    setSessionNonce((value) => value + 1);
  }

  if (isExam && level) {
    if (levelExamCrosswords === null || levelExamFillBlanks === null) {
      return <p className="page-subtitle mt-0">{t("levelExamIntro")}</p>;
    }

    if (levelExamCrosswords.length === 0 || levelExamFillBlanks.length === 0) {
      return <p className="page-subtitle mt-0">{t("noExamQuestions")}</p>;
    }

    if (levelExamPassed) {
      return (
        <div
          className="dashboard-panel mx-auto max-w-lg space-y-3 border-emerald-500/40 bg-emerald-500/10 text-center"
          role="status"
        >
          <h2 className="section-title">{t("examPassedTitle")}</h2>
          <p className="page-subtitle mt-0">
            {nextLevel
              ? t("examPassedBody", { nextLevel })
              : t("examPassedBodyFinal")}
          </p>
          <ButtonLink href="/panel#grammer" size="sm">
            {t("examBackToTopics")}
          </ButtonLink>
        </div>
      );
    }

    if (!levelExamSelected) {
      return (
        <div className="space-y-4">
          <p className="page-subtitle mt-0">{t("levelExamIntro")}</p>
          <ExerciseTypePicker
            counts={levelExamCounts}
            completedTypes={passedLevelParts}
            progressPercents={{
              multiple_choice: 0,
              fill_blank: levelPartPercents.fill_blank ?? 0,
              crossword: levelPartPercents.crossword ?? 0,
              listening: 0,
            }}
            title={t("levelExamChooseTitle")}
            subtitle={t("levelExamChooseSubtitle")}
            onSelect={(type) => {
              if (type !== "crossword" && type !== "fill_blank") {
                return;
              }
              setLevelPartOutcome(null);
              setLevelExamSelected(type);
            }}
          />
        </div>
      );
    }

    const levelFillDraft = level
      ? readLinearSession(`level:${level}:fill_blank`)
      : null;

    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={backToLevelExamPicker}
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("backToTypes")}
        </Button>

        {levelPartOutcome === "failed" ? (
          <div
            className="dashboard-panel space-y-3 border-amber-500/40 bg-amber-500/10 text-center"
            role="status"
          >
            <h2 className="section-title">{t("levelExamPartFailedTitle")}</h2>
            <p className="page-subtitle mt-0">{t("levelExamPartFailedBody")}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" size="sm" onClick={retryCurrentLevelPart}>
                <RotateCcw className="size-4" aria-hidden />
                {t("retry")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={backToLevelExamPicker}
              >
                {t("backToTypes")}
              </Button>
            </div>
          </div>
        ) : null}

        {levelPartOutcome === "passed" ? (
          <div
            className="dashboard-panel space-y-3 border-emerald-500/40 bg-emerald-500/10 text-center"
            role="status"
          >
            <h2 className="section-title">{t("levelExamPartPassedTitle")}</h2>
            <p className="page-subtitle mt-0">{t("levelExamPartPassedBody")}</p>
            <Button type="button" size="sm" onClick={backToLevelExamPicker}>
              {t("backToTypes")}
            </Button>
          </div>
        ) : null}

        {levelPartOutcome === null ? (
          levelExamSelected === "crossword" ? (
            <CrosswordExerciseView
              key={`cw-${crosswordSessionKey}-${levelExamCrosswords[0]?.id ?? "cw"}`}
              exercises={levelExamCrosswords}
              draftKey={level ? `level:${level}:crossword` : null}
              onProgress={handleCrosswordProgress}
              onRestart={() => restartLevelPart("crossword")}
              onComplete={(result) =>
                handleLevelExamPartComplete("crossword", result)
              }
            />
          ) : (
            <FillBlankExercises
              key={`fb-${fillBlankSessionKey}-${levelExamFillBlanks[0]?.id ?? "fb"}`}
              exercises={levelExamFillBlanks}
              initialIndex={
                levelFillDraft &&
                levelFillDraft.slots.length === levelExamFillBlanks.length
                  ? levelFillDraft.index
                  : 0
              }
              initialSlots={
                levelFillDraft &&
                levelFillDraft.slots.length === levelExamFillBlanks.length
                  ? levelFillDraft.slots.map((slot) => ({
                      answer: slot.answer,
                      checked: slot.checked,
                    }))
                  : undefined
              }
              onSessionChange={handleFillBlankSession}
              onRestart={() => restartLevelPart("fill_blank")}
              onComplete={(result) =>
                handleLevelExamPartComplete("fill_blank", result)
              }
            />
          )
        ) : null}
      </div>
    );
  }

  if (exercises.length === 0) {
    return <p className="page-subtitle mt-0">{t("noExercises")}</p>;
  }

  if (!isExam && selectionKey && !sessionReady) {
    return null;
  }

  if (
    practiceMixed &&
    (mixedPracticeExercises.length > 0 || matchingPracticeExercises.length > 0)
  ) {
    if (!selectedType) {
      return (
        <ExerciseTypePicker
          counts={counts}
          completedTypes={completedTypes}
          progressPercents={typeProgress}
          onSelect={beginExerciseSession}
        />
      );
    }

    const mixedSaved = mixedSessionKey
      ? readLinearSession(mixedSessionKey)
      : null;
    const mixedCompatible =
      mixedSaved && mixedSaved.slots.length === orderedMixedPractice.length;
    const matchingSaved = savedPracticeSession(
      "matching",
      matchingPracticeExercises.length,
    );

    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={backToExerciseTypePicker}
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("backToTypes")}
        </Button>

        {selectedType === "mixed" && mixedPracticeExercises.length > 0 ? (
          <>
            {isMixedPracticeSessionComplete() ? (
              <Alert className="border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 aria-hidden />
                <AlertTitle>{t("typeAlreadyCompletedTitle")}</AlertTitle>
                <AlertDescription>
                  {t("typeAlreadyCompletedBody")}
                </AlertDescription>
              </Alert>
            ) : null}

            <TopicMixedQuizExercises
              key={`mixed-practice-${sessionNonce}-${orderedMixedPractice.map((item) => item.id).join("|")}`}
              exercises={orderedMixedPractice}
              showHint={showHints}
              initialIndex={mixedCompatible ? mixedSaved!.index : 0}
              initialSlots={
                mixedCompatible
                  ? mixedSaved!.slots.map((slot) => ({
                      selected: slot.selected,
                      answer: slot.answer,
                      checked: slot.checked,
                    }))
                  : undefined
              }
              onSessionChange={persistMixedPracticeSession}
              onComplete={handleMixedPracticeComplete}
              onRestart={handleMixedPracticeRestart}
            />
          </>
        ) : null}

        {selectedType === "matching" && matchingPracticeExercises.length > 0 ? (
          <>
            {completedTypes.includes("matching") ? (
              <Alert className="border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 aria-hidden />
                <AlertTitle>{t("typeAlreadyCompletedTitle")}</AlertTitle>
                <AlertDescription>
                  {t("typeAlreadyCompletedBody")}
                </AlertDescription>
              </Alert>
            ) : null}

            <MatchingExercises
              key={`match-practice-${sessionNonce}`}
              exercises={orderedMatchingPractice}
              showHint={showHints}
              initialIndex={matchingSaved?.index ?? 0}
              initialSlots={
                matchingSaved &&
                matchingSaved.slots.length === matchingPracticeExercises.length
                  ? matchingSlotsFromSaved(matchingSaved)
                  : undefined
              }
              onSessionChange={(session) =>
                persistPracticeSession("matching", session)
              }
              onComplete={() => {
                if (topicId) {
                  markTopicExerciseTypeCompleted(topicId, "matching");
                }
              }}
              onRestart={() => {
                if (topicId) {
                  unmarkTopicExerciseTypeCompleted(topicId, "matching");
                }
                if (selectionKey) {
                  clearLinearSession(`${selectionKey}:matching`);
                  assignFreshExerciseOrder("matching");
                }
                setSessionNonce((value) => value + 1);
              }}
              onBackToTypes={backToExerciseTypePicker}
            />
          </>
        ) : null}
      </div>
    );
  }

  if (!selectedType) {
    return (
      <ExerciseTypePicker
        counts={counts}
        completedTypes={completedTypes}
        progressPercents={typeProgress}
        onSelect={beginExerciseSession}
      />
    );
  }

  const filtered = filteredExercises;
  const alreadyCompleted = completedTypes.includes(selectedType);
  const savedMultipleChoice = savedPracticeSession(
    "multiple_choice",
    filtered.length,
  );
  const savedTrueFalse = savedPracticeSession("true_false", filtered.length);
  const savedFillBlank = savedPracticeSession("fill_blank", filtered.length);
  const savedListening = savedPracticeSession("listening", filtered.length);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setSelectedType(null)}
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("backToTypes")}
      </Button>

      {alreadyCompleted ? (
        <Alert className="border-emerald-500/30 bg-emerald-500/10">
          <CheckCircle2 aria-hidden />
          <AlertTitle>{t("typeAlreadyCompletedTitle")}</AlertTitle>
          <AlertDescription>{t("typeAlreadyCompletedBody")}</AlertDescription>
        </Alert>
      ) : null}

      {selectedType === "multiple_choice" ? (
        <MultipleChoiceExercises
          key={`mc-${sessionNonce}`}
          exercises={filtered as MultipleChoiceExercise[]}
          initialIndex={savedMultipleChoice?.index ?? 0}
          initialSlots={savedMultipleChoice?.slots.map((slot) => ({
            selected: slot.selected,
            checked: slot.checked,
          }))}
          showHint={showHints}
          onSessionChange={(session) =>
            persistPracticeSession("multiple_choice", session)
          }
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
          onBackToTypes={backToExerciseTypePicker}
        />
      ) : null}

      {selectedType === "true_false" ? (
        <MultipleChoiceExercises
          key={`tf-${sessionNonce}`}
          exercises={trueFalseAsMultipleChoice(filtered as TrueFalseExercise[])}
          initialIndex={savedTrueFalse?.index ?? 0}
          initialSlots={savedTrueFalse?.slots.map((slot) => ({
            selected: slot.selected,
            checked: slot.checked,
          }))}
          showHint={showHints}
          onSessionChange={(session) =>
            persistPracticeSession("true_false", session)
          }
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
          onBackToTypes={backToExerciseTypePicker}
        />
      ) : null}

      {selectedType === "fill_blank" ? (
        <FillBlankExercises
          key={`fb-${sessionNonce}`}
          exercises={filtered as FillBlankExercise[]}
          initialIndex={savedFillBlank?.index ?? 0}
          initialSlots={savedFillBlank?.slots.map((slot) => ({
            answer: slot.answer,
            checked: slot.checked,
          }))}
          showHint={showHints}
          onSessionChange={(session) =>
            persistPracticeSession("fill_blank", session)
          }
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
          onBackToTypes={backToExerciseTypePicker}
        />
      ) : null}

      {selectedType === "crossword" ? (
        <CrosswordExerciseView
          key={`cw-${sessionNonce}`}
          exercises={filtered as CrosswordExercise[]}
          draftKey={crosswordDraftKey(topicId, filtered as CrosswordExercise[])}
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
          onBackToTypes={backToExerciseTypePicker}
        />
      ) : null}

      {selectedType === "matching" ? (
        <MatchingExercises
          key={`match-${sessionNonce}`}
          exercises={filtered as MatchingExercise[]}
          initialIndex={
            savedPracticeSession("matching", filtered.length)?.index ?? 0
          }
          initialSlots={
            savedPracticeSession("matching", filtered.length)
              ? matchingSlotsFromSaved(
                  savedPracticeSession("matching", filtered.length)!,
                )
              : undefined
          }
          showHint={showHints}
          onSessionChange={(session) =>
            persistPracticeSession("matching", session)
          }
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
          onBackToTypes={backToExerciseTypePicker}
        />
      ) : null}

      {selectedType === "listening" ? (
        <ListeningExercises
          key={`listen-${sessionNonce}`}
          exercises={filtered as ListeningExercise[]}
          initialIndex={savedListening?.index ?? 0}
          initialSlots={savedListening?.slots.map((slot) => ({
            englishSelected: slot.englishSelected,
            turkishSelected: slot.turkishSelected,
            v2Selected: slot.v2Selected,
            verbRows: slot.verbRows,
            checked: slot.checked,
          }))}
          onSessionChange={(session) =>
            persistPracticeSession("listening", session)
          }
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
          onBackToTypes={backToExerciseTypePicker}
        />
      ) : null}
    </div>
  );
}
