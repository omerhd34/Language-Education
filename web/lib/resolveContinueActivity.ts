import { getCombinedExerciseById } from "@/data/combinedExercises";
import { getDashboardTopicById } from "@/data/dashboardTopics";
import { getListeningSectionById } from "@/data/listenings";
import { getReadingSectionById } from "@/data/readings";
import { getWritingSectionById } from "@/data/writings";
import { getVocabularyCategoryById } from "@/data/vocabulary";
import type {
  ContinueActivity,
  ContinueActivityKind,
  ContinueActivitySkill,
} from "@/lib/continueActivityStorage";
import { LISTENING_SECTION_ANCHORS } from "@/lib/listeningSectionTab";
import { READING_SECTION_ANCHORS } from "@/lib/readingSectionTab";
import { WRITING_SECTION_ANCHORS } from "@/lib/writingSectionTab";

const VOCABULARY_STATIC_SEGMENTS = new Set([
  "sinav",
  "bugun-calisilan",
  "bilinen",
]);

const PANEL_HUB_BY_HASH: Record<string, ContinueActivitySkill> = {
  dilbilgisi: "topics",
  kelimeler: "vocabulary",
  okuma: "reading",
  dinleme: "listening",
  yazma: "writing",
  konusma: "speaking",
};

const PANEL_HASH_BY_SKILL: Record<ContinueActivitySkill, string> = {
  topics: "dilbilgisi",
  vocabulary: "kelimeler",
  reading: "okuma",
  listening: "dinleme",
  writing: "yazma",
  speaking: "konusma",
};

function hashIdFrom(hash: string): string {
  return hash.replace(/^#/, "");
}

function isReadingPractice(hash: string, search: string): boolean {
  const hashId = hashIdFrom(hash);
  if (
    hashId === READING_SECTION_ANCHORS.practice ||
    hashId === "reading-sinav"
  ) {
    return true;
  }

  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const tab = params.get("tab");
  return tab === "practice" || tab === "exam";
}

function parseReadingActivity(
  sectionId: string,
  hash: string,
  search: string,
): Omit<ContinueActivity, "updatedAt"> | null {
  if (!getReadingSectionById(sectionId)) {
    return null;
  }

  const isPractice = isReadingPractice(hash, search);
  return {
    kind: isPractice ? "reading_exercises" : "reading_text",
    href: isPractice
      ? `/panel/okuma/${sectionId}#${READING_SECTION_ANCHORS.practice}`
      : `/panel/okuma/${sectionId}`,
    readingId: sectionId,
  };
}

export function parseContinueActivityFromPath(
  pathname: string,
  search = "",
  hash = "",
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

  const readingNestedMatch = path.match(
    /^\/panel\/okuma\/([^/]+)\/(metin|alistirmalar|sinav)$/,
  );
  if (readingNestedMatch) {
    const nestedHash =
      readingNestedMatch[2] === "metin"
        ? ""
        : `#${READING_SECTION_ANCHORS.practice}`;
    return parseReadingActivity(readingNestedMatch[1], nestedHash, "");
  }

  const readingMatch = path.match(/^\/panel\/okuma\/([^/]+)$/);
  if (readingMatch) {
    return parseReadingActivity(readingMatch[1], hash, search);
  }

  const listeningMatch = path.match(/^\/panel\/dinleme\/([^/]+)$/);
  if (listeningMatch) {
    const sectionId = listeningMatch[1];
    if (!getListeningSectionById(sectionId)) {
      return null;
    }
    const hashId = hash.replace(/^#/, "");
    const isPractice = hashId === LISTENING_SECTION_ANCHORS.practice;
    return {
      kind: isPractice ? "listening_exercises" : "listening_audio",
      href: isPractice
        ? `/panel/dinleme/${sectionId}#${LISTENING_SECTION_ANCHORS.practice}`
        : `/panel/dinleme/${sectionId}`,
      listeningId: sectionId,
    };
  }

  const writingMatch = path.match(/^\/panel\/yazma\/([^/]+)$/);
  if (writingMatch) {
    const sectionId = writingMatch[1];
    if (!getWritingSectionById(sectionId)) {
      return null;
    }
    const hashId = hash.replace(/^#/, "");
    const isPractice = hashId === WRITING_SECTION_ANCHORS.practice;
    return {
      kind: isPractice ? "writing_exercises" : "writing_model",
      href: isPractice
        ? `/panel/yazma/${sectionId}#${WRITING_SECTION_ANCHORS.practice}`
        : `/panel/yazma/${sectionId}`,
      writingId: sectionId,
    };
  }

  if (path === "/panel" || path === "/") {
    const skill = PANEL_HUB_BY_HASH[hashIdFrom(hash)];
    if (skill) {
      return {
        kind: "skill_hub",
        href: `/panel#${PANEL_HASH_BY_SKILL[skill]}`,
        skill,
      };
    }
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
  readingText: string;
  readingExercises: string;
  listeningAudio: string;
  listeningExercises: string;
  writingModel: string;
  writingExercises: string;
  sectionKind: string;
  skillReading: string;
  skillListening: string;
  skillWriting: string;
  skillSpeaking: string;
  skillTopics: string;
  skillVocabulary: string;
  fallbackTitle: string;
};

function skillHubTitle(
  skill: ContinueActivitySkill | undefined,
  labels: ContinueActivityLabels,
): string {
  switch (skill) {
    case "reading":
      return labels.skillReading;
    case "listening":
      return labels.skillListening;
    case "writing":
      return labels.skillWriting;
    case "speaking":
      return labels.skillSpeaking;
    case "topics":
      return labels.skillTopics;
    case "vocabulary":
      return labels.skillVocabulary;
    default:
      return labels.fallbackTitle;
  }
}

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
    case "reading_text":
    case "reading_exercises": {
      const section = activity.readingId
        ? getReadingSectionById(activity.readingId)
        : null;
      return {
        title: section?.title ?? labels.fallbackTitle,
        kindLabel:
          activity.kind === "reading_exercises"
            ? labels.readingExercises
            : labels.readingText,
      };
    }
    case "listening_audio":
    case "listening_exercises": {
      const section = activity.listeningId
        ? getListeningSectionById(activity.listeningId)
        : null;
      return {
        title: section?.title ?? labels.fallbackTitle,
        kindLabel:
          activity.kind === "listening_exercises"
            ? labels.listeningExercises
            : labels.listeningAudio,
      };
    }
    case "writing_model":
    case "writing_exercises": {
      const section = activity.writingId
        ? getWritingSectionById(activity.writingId)
        : null;
      return {
        title: section?.title ?? labels.fallbackTitle,
        kindLabel:
          activity.kind === "writing_exercises"
            ? labels.writingExercises
            : labels.writingModel,
      };
    }
    case "skill_hub":
      return {
        title: skillHubTitle(activity.skill, labels),
        kindLabel: labels.sectionKind,
      };
  }
}
