import { dashboardTopics, type CefrLevel } from "@/data/dashboardTopics";
import { getTopicContent } from "@/data/topics";
import type {
  CrosswordExercise,
  MultipleChoiceExercise,
  TopicContent,
} from "@/data/topics/types";
import { getLevelExamClues } from "@/data/levelExamClues";
import {
  buildCrosswordFromCandidates,
  type CrosswordCandidate,
} from "@/lib/crosswordBuilder";

/** Konu sınavı: yalnızca çoktan seçmeli. */
export const TOPIC_EXAM_OPTION_COUNT = 4;
export const TOPIC_EXAM_QUESTION_COUNT = 10;

/** Yeterlilik sınavı: tek bulmaca, 20 ipucu/soru. */
export const LEVEL_EXAM_CROSSWORD_COUNT = 1;
export const LEVEL_EXAM_CLUE_COUNT = 20;

export const TOPIC_EXAM_PASS_RATIO = 0.75;

const FALLBACK_DISTRACTORS = [
  "Hiçbiri",
  "Hepsi doğru",
  "Belirsiz",
  "Konu dışı",
  "Yanlış kalıp",
  "Eş anlamlı değil",
  "Atlanır",
  "Örnek yok",
  "Tamamen farklı",
  "Sadece ezber",
];

function uniquePush(options: string[], value: string): void {
  const trimmed = value.trim();
  if (!trimmed) {
    return;
  }
  if (
    options.some(
      (item) =>
        item.toLocaleLowerCase("tr") === trimmed.toLocaleLowerCase("tr"),
    )
  ) {
    return;
  }
  options.push(trimmed);
}

export function ensureExamOptionCount(
  exercise: MultipleChoiceExercise,
  distractorPool: string[] = [],
  count: number = TOPIC_EXAM_OPTION_COUNT,
): MultipleChoiceExercise {
  const correct =
    exercise.options[exercise.correctIndex] ?? exercise.options[0] ?? "";
  const options: string[] = [];

  uniquePush(options, correct);
  for (const option of exercise.options) {
    if (options.length >= count) {
      break;
    }
    uniquePush(options, option);
  }
  for (const distractor of distractorPool) {
    if (options.length >= count) {
      break;
    }
    uniquePush(options, distractor);
  }
  for (const distractor of FALLBACK_DISTRACTORS) {
    if (options.length >= count) {
      break;
    }
    uniquePush(options, distractor);
  }

  let filler = 1;
  while (options.length < count) {
    uniquePush(options, `Seçenek ${filler}`);
    filler += 1;
  }

  const finalOptions = options.slice(0, count);
  const correctIndex = Math.max(0, finalOptions.indexOf(correct));

  return {
    ...exercise,
    type: "multiple_choice",
    options: finalOptions,
    correctIndex,
  };
}

function practiceMultipleChoice(
  content: TopicContent,
): MultipleChoiceExercise[] {
  return content.exercises.filter(
    (item): item is MultipleChoiceExercise => item.type === "multiple_choice",
  );
}

function pushUniqueQuestion(
  target: MultipleChoiceExercise[],
  seen: Set<string>,
  item: MultipleChoiceExercise,
): void {
  const key = item.prompt.trim().toLocaleLowerCase("tr");
  if (seen.has(key)) {
    return;
  }
  seen.add(key);
  target.push(item);
}

function buildExtraTopicQuestions(
  content: TopicContent,
  needed: number,
  distractorPool: string[],
): MultipleChoiceExercise[] {
  if (needed <= 0) {
    return [];
  }

  const topic = dashboardTopics.find((item) => item.id === content.topicId);
  const extras: MultipleChoiceExercise[] = [];
  const subtopics = topic?.subtopics ?? [];

  for (const subtopic of subtopics) {
    if (extras.length >= needed) {
      break;
    }
    extras.push(
      ensureExamOptionCount(
        {
          id: `exam-extra-${content.topicId}-${subtopic.id}-1`,
          subtopicId: subtopic.id,
          type: "multiple_choice",
          prompt: `"${subtopic.title}" hangi konunun parçasıdır?`,
          options: [
            topic?.title ?? content.topicId,
            "Farklı bir konu",
            "Kelime listesi",
            "Hiçbiri",
          ],
          correctIndex: 0,
          explanation: `"${subtopic.title}" bu konuya aittir.`,
        },
        distractorPool,
      ),
    );
    if (extras.length >= needed) {
      break;
    }
    extras.push(
      ensureExamOptionCount(
        {
          id: `exam-extra-${content.topicId}-${subtopic.id}-2`,
          subtopicId: subtopic.id,
          type: "multiple_choice",
          prompt: `"${subtopic.title}" için en iyi çalışma yolu hangisidir?`,
          options: [
            "Örnekleri okuyup pratik yapmak",
            "Konuyu atlamak",
            "Hiç tekrar etmemek",
            "Sadece ezberlemek",
          ],
          correctIndex: 0,
          explanation: "Örnek + pratik kalıcı öğrenmeye yardımcı olur.",
        },
        distractorPool,
      ),
    );
  }

  let index = extras.length;
  while (extras.length < needed) {
    index += 1;
    extras.push(
      ensureExamOptionCount(
        {
          id: `exam-extra-${content.topicId}-pad-${index}`,
          subtopicId: subtopics[0]?.id ?? content.topicId,
          type: "multiple_choice",
          prompt: `Bu konuyla ilgili doğru ifade hangisidir? (${index})`,
          options: [
            "Düzenli pratik ilerlemeyi hızlandırır",
            "Hiç alıştırma çözmemek yeterlidir",
            "Konuyu tamamen atlamak gerekir",
            "Örnekleri okumamak daha iyidir",
          ],
          correctIndex: 0,
          explanation: "Düzenli pratik öğrenmeyi pekiştirir.",
        },
        distractorPool,
      ),
    );
  }

  return extras.slice(0, needed);
}

export function resolveTopicExamExercises(
  content: TopicContent,
): MultipleChoiceExercise[] {
  const practice = practiceMultipleChoice(content);
  const pool = [
    ...practice.flatMap((item) => item.options),
    ...FALLBACK_DISTRACTORS,
  ];
  const seen = new Set<string>();
  const source: MultipleChoiceExercise[] = [];

  for (const item of content.examExercises ?? []) {
    pushUniqueQuestion(source, seen, item);
  }
  for (const item of practice) {
    pushUniqueQuestion(source, seen, {
      ...item,
      id: `exam-${item.id}`,
    });
  }

  if (source.length < TOPIC_EXAM_QUESTION_COUNT) {
    for (const item of buildExtraTopicQuestions(
      content,
      TOPIC_EXAM_QUESTION_COUNT - source.length,
      pool,
    )) {
      pushUniqueQuestion(source, seen, item);
    }
  }

  return source
    .slice(0, TOPIC_EXAM_QUESTION_COUNT)
    .map((item) => ensureExamOptionCount(item, pool, TOPIC_EXAM_OPTION_COUNT));
}

function collectLevelCrosswordCandidates(
  level: CefrLevel,
): CrosswordCandidate[] {
  const levelTopics = dashboardTopics.filter(
    (topic) => topic.level === level && !topic.isExam,
  );
  const candidates: CrosswordCandidate[] = [];
  const seenAnswers = new Set<string>();

  function pushCandidate(answer: string, text: string) {
    const normalized = answer.replace(/[^a-zA-Z]/g, "").toUpperCase();
    if (normalized.length < 2 || normalized.length > 14) {
      return;
    }
    if (seenAnswers.has(normalized)) {
      return;
    }
    seenAnswers.add(normalized);
    candidates.push({ answer: normalized, text: text.trim() });
  }

  // 1) Bu seviyenin konularına özel ipuçlar
  for (const item of getLevelExamClues(level)) {
    pushCandidate(item.answer, item.text);
  }

  // 2) Konu içeriklerinden (ders örnekleri + alıştırmalar)
  for (const topic of levelTopics) {
    const content = getTopicContent(topic.id);
    if (!content) {
      continue;
    }

    for (const section of content.lesson.sections) {
      for (const example of section.examples ?? []) {
        const en = example.en.trim();
        const tr = example.tr.trim();

        // "1" → "one" gibi sayı örnekleri
        if (/^\d/.test(en) && /^[a-zA-Z][a-zA-Z\s-]*$/.test(tr)) {
          const word = tr.split(/[\s/]/)[0] ?? tr;
          pushCandidate(word, `${topic.title}: ${en}`);
          continue;
        }

        // Tek kelimelik İngilizce örnek
        if (/^[a-zA-Z]+(?:-[a-zA-Z]+)?$/.test(en) && en.length >= 2) {
          pushCandidate(en, `${topic.title}: ${tr}`);
        }
      }
    }

    for (const item of content.exercises) {
      if (item.type === "crossword") {
        for (const clue of item.clues) {
          pushCandidate(clue.answer, `${topic.title}: ${clue.text}`);
        }
      }
      if (item.type === "fill_blank" && /^[a-zA-Z\s-]+$/.test(item.answer)) {
        pushCandidate(
          item.answer,
          `${topic.title}: ${item.prompt.replace(/_+/g, "…")}`,
        );
      }
      if (item.type === "listening") {
        pushCandidate(item.speakText, `${topic.title}: ${item.prompt}`);
      }
      if (item.type === "multiple_choice") {
        const correct = item.options[item.correctIndex];
        if (
          correct &&
          /^[a-zA-Z]+(?:-[a-zA-Z]+)?$/.test(correct) &&
          correct.length >= 2 &&
          correct.length <= 12
        ) {
          pushCandidate(correct, `${topic.title}: ${item.prompt}`);
        }
      }
    }
  }

  return candidates;
}

function createLevelExamCrossword(level: CefrLevel): CrosswordExercise {
  const candidates = collectLevelCrosswordCandidates(level);
  const built = buildCrosswordFromCandidates(candidates, {
    id: `level-exam-cw-${level}`,
    subtopicId: `level-exam-${level}`,
    targetClues: LEVEL_EXAM_CLUE_COUNT,
    minClues: Math.min(8, LEVEL_EXAM_CLUE_COUNT),
  });

  if (built) {
    return built;
  }

  // Son çare: yine seviye bankası (ortak banka yok)
  const levelOnly = buildCrosswordFromCandidates(getLevelExamClues(level), {
    id: `level-exam-cw-${level}-bank`,
    subtopicId: `level-exam-${level}`,
    targetClues: LEVEL_EXAM_CLUE_COUNT,
    minClues: 3,
  });

  if (levelOnly) {
    return levelOnly;
  }

  throw new Error(`Yeterlilik bulmacası üretilemedi: ${level}`);
}

/** Tek yeterlilik bulmacası (hedef: 20 ipucu). */
export function resolveLevelExamCrosswords(
  level: CefrLevel,
): CrosswordExercise[] {
  return [createLevelExamCrossword(level)].slice(0, LEVEL_EXAM_CROSSWORD_COUNT);
}

export function didPassTopicExamScore(correct: number, total: number): boolean {
  if (total <= 0) {
    return false;
  }
  return correct / total >= TOPIC_EXAM_PASS_RATIO;
}
