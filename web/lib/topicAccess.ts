import {
  dashboardTopics,
  type CefrLevel,
  type DashboardTopic,
} from "@/data/dashboardTopics";

export const CEFR_LEVEL_ORDER: CefrLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const CEFR_LEVEL_BADGE_CLASS: Record<CefrLevel, string> = {
  A1: "bg-sky-500/15 text-sky-700 dark:bg-sky-400/30 dark:text-sky-200",
  A2: "bg-teal-500/15 text-teal-700 dark:bg-teal-400/30 dark:text-teal-200",
  B1: "bg-yellow-500/20 text-yellow-800 dark:bg-yellow-400/30 dark:text-yellow-200",
  B2: "bg-orange-500/15 text-orange-800 dark:bg-orange-400/30 dark:text-orange-200",
  C1: "bg-rose-500/15 text-rose-700 dark:bg-rose-400/30 dark:text-rose-200",
  C2: "bg-violet-500/15 text-violet-800 dark:bg-violet-400/30 dark:text-violet-200",
};

export const CEFR_LEVEL_FILTER_IDLE_CLASS: Record<CefrLevel, string> = {
  A1: "border-sky-500/40 bg-sky-500/15 text-sky-700 hover:bg-sky-500/25 dark:border-sky-300/50 dark:bg-sky-400/20 dark:text-sky-100 dark:hover:bg-sky-400/30",
  A2: "border-teal-500/40 bg-teal-500/15 text-teal-700 hover:bg-teal-500/25 dark:border-teal-300/50 dark:bg-teal-400/20 dark:text-teal-100 dark:hover:bg-teal-400/30",
  B1: "border-yellow-500/50 bg-yellow-500/20 text-yellow-800 hover:bg-yellow-500/30 dark:border-yellow-300/50 dark:bg-yellow-400/20 dark:text-yellow-100 dark:hover:bg-yellow-400/30",
  B2: "border-orange-500/40 bg-orange-500/15 text-orange-800 hover:bg-orange-500/25 dark:border-orange-300/50 dark:bg-orange-400/20 dark:text-orange-100 dark:hover:bg-orange-400/30",
  C1: "border-rose-500/40 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:border-rose-300/50 dark:bg-rose-400/20 dark:text-rose-100 dark:hover:bg-rose-400/30",
  C2: "border-violet-500/40 bg-violet-500/15 text-violet-800 hover:bg-violet-500/25 dark:border-violet-300/50 dark:bg-violet-400/20 dark:text-violet-100 dark:hover:bg-violet-400/30",
};

export const CEFR_LEVEL_FILTER_ACTIVE_CLASS: Record<CefrLevel, string> = {
  A1: "border-sky-500 bg-sky-600 text-white hover:bg-sky-500 dark:border-sky-300 dark:bg-sky-400 dark:text-sky-950 dark:hover:bg-sky-300",
  A2: "border-teal-500 bg-teal-600 text-white hover:bg-teal-500 dark:border-teal-300 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300",
  B1: "border-yellow-500 bg-yellow-500 text-yellow-950 hover:bg-yellow-400 dark:border-yellow-300 dark:bg-yellow-400 dark:text-yellow-950 dark:hover:bg-yellow-300",
  B2: "border-orange-500 bg-orange-600 text-white hover:bg-orange-500 dark:border-orange-300 dark:bg-orange-400 dark:text-orange-950 dark:hover:bg-orange-300",
  C1: "border-rose-500 bg-rose-600 text-white hover:bg-rose-500 dark:border-rose-300 dark:bg-rose-400 dark:text-rose-950 dark:hover:bg-rose-300",
  C2: "border-violet-500 bg-violet-700 text-white hover:bg-violet-600 dark:border-violet-300 dark:bg-violet-400 dark:text-violet-950 dark:hover:bg-violet-300",
};

export function getCefrLevelBadgeClass(level: CefrLevel): string {
  return CEFR_LEVEL_BADGE_CLASS[level];
}

export function getTopicProgress(topic: DashboardTopic): number {
  if (topic.subtopics.length === 0) {
    return 0;
  }
  const total = topic.subtopics.reduce((sum, item) => sum + item.progress, 0);
  return Math.round(total / topic.subtopics.length);
}

export function getLevelExamTopic(
  level: CefrLevel,
): DashboardTopic | undefined {
  return dashboardTopics.find((topic) => topic.level === level && topic.isExam);
}

export function getNextLevel(level: CefrLevel): CefrLevel | null {
  const index = CEFR_LEVEL_ORDER.indexOf(level);
  if (index < 0 || index >= CEFR_LEVEL_ORDER.length - 1) {
    return null;
  }
  return CEFR_LEVEL_ORDER[index + 1] ?? null;
}

export function isLevelExamPassed(
  level: CefrLevel,
  passedExams: readonly CefrLevel[] = [],
): boolean {
  return passedExams.includes(level);
}

export function isLevelComplete(
  level: CefrLevel,
  passedExams: readonly CefrLevel[] = [],
): boolean {
  if (!getLevelExamTopic(level)) {
    return true;
  }
  return isLevelExamPassed(level, passedExams);
}

export function getPreviousLevel(level: CefrLevel): CefrLevel | null {
  const index = CEFR_LEVEL_ORDER.indexOf(level);
  if (index <= 0) {
    return null;
  }
  return CEFR_LEVEL_ORDER[index - 1] ?? null;
}

export function canAccessLevel(
  level: CefrLevel,
  passedExams: readonly CefrLevel[] = [],
): boolean {
  const previous = getPreviousLevel(level);
  if (!previous) {
    return true;
  }
  return isLevelComplete(previous, passedExams);
}

export function getRequiredLevelToUnlock(level: CefrLevel): CefrLevel | null {
  return getPreviousLevel(level);
}
