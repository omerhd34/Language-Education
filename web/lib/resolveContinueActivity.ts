import { getCombinedExerciseById } from "@/data/combinedExercises";
import { getDashboardTopicById } from "@/data/dashboardTopics";
import { getVocabularyCategoryById } from "@/data/vocabulary";
import type {
  ContinueActivity,
  ContinueActivityKind,
} from "@/lib/continueActivityStorage";

const VOCABULARY_STATIC_SEGMENTS = new Set([
  "sinav",
  "bugun-calisilan",
  "bilinen",
]);

export function parseContinueActivityFromPath(
  pathname: string,
  search = "",
): Omit<ContinueActivity, "updatedAt"> | null {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/panel/kelime/sinav") {
    return {
      kind: "vocabulary_quiz",
      href: "/panel/kelime/sinav",
    };
  }

  const vocabularyMatch = path.match(/^\/panel\/kelime\/([^/]+)$/);
  if (vocabularyMatch) {
    const categoryId = vocabularyMatch[1];
    if (!VOCABULARY_STATIC_SEGMENTS.has(categoryId)) {
      const params = new URLSearchParams(
        search.startsWith("?") ? search.slice(1) : search,
      );
      const tab = params.get("tab");
      const isExercises = tab === "exercises";
      const href = isExercises
        ? `/panel/kelime/${categoryId}?tab=exercises`
        : `/panel/kelime/${categoryId}`;

      return {
        kind: isExercises ? "vocabulary_exercises" : "vocabulary_category",
        href,
        categoryId,
      };
    }
  }

  const combinedMatch = path.match(/^\/panel\/konular\/birlesik\/([^/]+)$/);
  if (combinedMatch) {
    return {
      kind: "combined_exercise",
      href: `/panel/konular/birlesik/${combinedMatch[1]}`,
      combinedId: combinedMatch[1],
    };
  }

  const topicMatch = path.match(
    /^\/panel\/konular\/([^/]+)\/(anlatim|alistirmalar|sinav)$/,
  );
  if (topicMatch) {
    const topicId = topicMatch[1];
    const section = topicMatch[2];
    const kind: ContinueActivityKind =
      section === "anlatim"
        ? "topic_lesson"
        : section === "alistirmalar"
          ? "topic_exercises"
          : "topic_exam";

    return {
      kind,
      href: `/panel/konular/${topicId}/${section}`,
      topicId,
    };
  }

  return null;
}

export type ContinueActivityDisplay = {
  title: string;
  kindLabel: string;
};

type ContinueActivityLabels = {
  vocabularyQuiz: string;
  vocabularyCategory: string;
  vocabularyExercises: string;
  topicLesson: string;
  topicExercises: string;
  topicExam: string;
  exam: string;
  combinedExercise: string;
  fallbackTitle: string;
};

export function resolveContinueActivityDisplay(
  activity: ContinueActivity,
  labels: ContinueActivityLabels,
): ContinueActivityDisplay {
  switch (activity.kind) {
    case "vocabulary_quiz":
      return {
        title: labels.vocabularyQuiz,
        kindLabel: labels.exam,
      };
    case "vocabulary_category":
    case "vocabulary_exercises": {
      const category = activity.categoryId
        ? getVocabularyCategoryById(activity.categoryId)
        : undefined;
      return {
        title: category?.title ?? labels.fallbackTitle,
        kindLabel:
          activity.kind === "vocabulary_exercises"
            ? labels.vocabularyExercises
            : labels.vocabularyCategory,
      };
    }
    case "topic_lesson":
    case "topic_exercises":
    case "topic_exam": {
      const topic = activity.topicId
        ? getDashboardTopicById(activity.topicId)
        : undefined;
      const kindLabel =
        activity.kind === "topic_lesson"
          ? labels.topicLesson
          : activity.kind === "topic_exercises"
            ? labels.topicExercises
            : labels.topicExam;
      return {
        title: topic?.title ?? labels.fallbackTitle,
        kindLabel,
      };
    }
    case "combined_exercise": {
      const combined = activity.combinedId
        ? getCombinedExerciseById(activity.combinedId)
        : undefined;
      return {
        title: combined
          ? `${combined.level} · ${labels.combinedExercise}`
          : labels.combinedExercise,
        kindLabel: labels.combinedExercise,
      };
    }
  }
}
