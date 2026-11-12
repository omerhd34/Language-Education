import type { DashboardTopic } from "@/data/grammar/dashboardTopics";
import type {
  MultipleChoiceExercise,
  TopicContent,
  TopicExercise,
  TrueFalseExercise,
} from "@/data/grammar/types";
import {
  TOPIC_EXAM_QUESTION_COUNT,
  ensureExamOptionCount,
} from "@/lib/topicExam";

const SAMPLE_PHRASES = [
  { en: "I understand this topic.", tr: "Bu konuyu anlıyorum." },
  { en: "Let's practice together.", tr: "Birlikte pratik yapalım." },
  { en: "This is a useful example.", tr: "Bu faydalı bir örnek." },
  { en: "Can you repeat that?", tr: "Tekrar eder misin?" },
  { en: "I use this every day.", tr: "Bunu her gün kullanırım." },
  { en: "That sounds correct.", tr: "Kulağa doğru geliyor." },
];

function pickSamples(topicId: string, count: number) {
  const start = Number.parseInt(topicId, 10) || 0;
  return Array.from({ length: count }, (_, index) => {
    return SAMPLE_PHRASES[(start + index) % SAMPLE_PHRASES.length];
  });
}

function tsLiteral(value: unknown, indent = 0): string {
  const pad = " ".repeat(indent);
  if (value === null) {
    return "null";
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    const lines = value.map(
      (item) => `${" ".repeat(indent + 2)}${tsLiteral(item, indent + 2)},`,
    );
    return `[\n${lines.join("\n")}\n${pad}]`;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const lines = Object.entries(record)
      .filter(([, item]) => item !== undefined)
      .map(
        ([key, item]) =>
          `${" ".repeat(indent + 2)}${key}: ${tsLiteral(item, indent + 2)},`,
      );
    return `{\n${lines.join("\n")}\n${pad}}`;
  }
  return "undefined";
}

export function buildPracticeExercises(
  topic: DashboardTopic,
  options?: { includeCrossword?: boolean },
): TopicExercise[] {
  const includeCrossword = options?.includeCrossword ?? topic.id !== "1";
  const exercises: TopicExercise[] = [];
  const firstSubtopic = topic.subtopics[0];

  for (const subtopic of topic.subtopics) {
    exercises.push({
      id: `${topic.id}-ex-${subtopic.id}-1`,
      subtopicId: subtopic.id,
      type: "multiple_choice",
      prompt: `"${subtopic.title}" alt konusu hangi ana konuya aittir?`,
      options: [
        topic.title,
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: `Bu alt konu "${topic.title}" başlığı altındadır.`,
    });

    exercises.push({
      id: `${topic.id}-ex-${subtopic.id}-2`,
      subtopicId: subtopic.id,
      type: "multiple_choice",
      prompt: `${topic.level} seviyesindeki "${subtopic.title}" için doğru yaklaşım hangisidir?`,
      options: [
        "Örnekleri okuyup kısa pratik yapmak",
        "Konuyu tamamen atlamak",
        "Sadece çeviri yapmadan ezberlemek",
        "Hiç alıştırma çözmemek",
      ],
      correctIndex: 0,
      explanation: "Örnek + kısa pratik, kalıcı öğrenmeye yardımcı olur.",
    });

    const trueFalse: TrueFalseExercise = {
      id: `${topic.id}-tf-${subtopic.id}-1`,
      subtopicId: subtopic.id,
      type: "true_false",
      prompt: `"${subtopic.title}" başlığı "${topic.title}" konusunun bir parçasıdır.`,
      options: ["Doğru", "Yanlış"],
      correctIndex: 0,
      explanation: `Bu alt başlık "${topic.title}" konusu altında işlenir.`,
    };
    exercises.push(trueFalse);

    exercises.push({
      id: `${topic.id}-fb-${subtopic.id}-1`,
      subtopicId: subtopic.id,
      type: "fill_blank",
      prompt: `"${subtopic.title}" konusu _____ seviyesine uygundur.`,
      answer: topic.level,
      explanation: `Bu konu ${topic.level} seviyesindedir.`,
    });
  }

  if (firstSubtopic) {
    const pairs =
      topic.subtopics.length > 1
        ? topic.subtopics.slice(0, 6).map((subtopic) => ({
            left: subtopic.titleEng || subtopic.titleEx,
            right: subtopic.title,
          }))
        : [
            {
              left: topic.titleEng || topic.titleEx,
              right: topic.title,
            },
            {
              left: `${topic.level} level`,
              right: `${topic.level} seviyesi`,
            },
            { left: "Practice", right: "Alıştırma" },
            { left: "Example", right: "Örnek" },
            { left: "Lesson", right: "Konu anlatımı" },
            { left: "Quiz", right: "Quiz" },
          ];

    exercises.push({
      id: `${topic.id}-match-1`,
      subtopicId: firstSubtopic.id,
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs,
    });
  }

  if (includeCrossword && firstSubtopic) {
    exercises.push({
      id: `${topic.id}-cw-1`,
      subtopicId: firstSubtopic.id,
      type: "crossword",
      rows: 3,
      cols: 5,
      clues: [
        {
          number: 1,
          direction: "across",
          text: "3 sayısı İngilizcede",
          answer: "THREE",
          row: 0,
          col: 0,
        },
        {
          number: 2,
          direction: "down",
          text: "10 sayısı İngilizcede",
          answer: "TEN",
          row: 0,
          col: 0,
        },
        {
          number: 3,
          direction: "across",
          text: "9 sayısı İngilizcede",
          answer: "NINE",
          row: 2,
          col: 0,
        },
      ],
    });
  }

  return exercises;
}

export function formatExercisesBlock(exercises: TopicExercise[]): string {
  const items = exercises
    .map((item) => `    ${tsLiteral(item, 4)}`)
    .join(",\n");
  return `  exercises: [\n${items},\n  ],`;
}

function buildExercises(topic: DashboardTopic): TopicExercise[] {
  return buildPracticeExercises(topic);
}

function buildQuizExercises(topic: DashboardTopic): MultipleChoiceExercise[] {
  const pool = [
    topic.title,
    "Tamamen farklı bir konu",
    "Sadece kelime listesi",
    "Hiçbiri",
    "Yalnızca dinleme",
    "Sadece yazım",
    "Konu dışı örnek",
    "Belirsiz başlık",
    "Örnekleri okuyup kısa pratik yapmak",
    "Konuyu tamamen atlamak",
    "Sadece çeviri yapmadan ezberlemek",
    "Hiç alıştırma çözmemek",
  ];

  const built = topic.subtopics.flatMap((subtopic, index) => {
    const base: MultipleChoiceExercise[] = [
      {
        id: `quiz-${topic.id}-${subtopic.id}-1`,
        subtopicId: subtopic.id,
        type: "multiple_choice",
        prompt: `"${subtopic.title}" alt konusu hangi ana konuya aittir?`,
        options: [
          topic.title,
          "Tamamen farklı bir konu",
          "Sadece kelime listesi",
          "Hiçbiri",
        ],
        correctIndex: 0,
        explanation: `Bu alt konu "${topic.title}" başlığı altındadır.`,
      },
      {
        id: `quiz-${topic.id}-${subtopic.id}-2`,
        subtopicId: subtopic.id,
        type: "multiple_choice",
        prompt: `${topic.level} seviyesindeki "${subtopic.title}" için doğru yaklaşım hangisidir?`,
        options: [
          "Örnekleri okuyup kısa pratik yapmak",
          "Konuyu tamamen atlamak",
          "Sadece çeviri yapmadan ezberlemek",
          "Hiç alıştırma çözmemek",
        ],
        correctIndex: 0,
        explanation: "Örnek + kısa pratik, kalıcı öğrenmeye yardımcı olur.",
      },
      {
        id: `quiz-${topic.id}-${subtopic.id}-3`,
        subtopicId: subtopic.id,
        type: "multiple_choice",
        prompt: `"${subtopic.title}" çalışırken hangisi doğrudur?`,
        options: [
          "Anlamadığın örneği işaretleyip tekrar etmek",
          "Hiç örnek okumamak",
          "Konuyu tamamen atlamak",
          "Sadece dinleyip bırakmak",
        ],
        correctIndex: 0,
        explanation: "Tekrar ve işaretleme öğrenmeyi güçlendirir.",
      },
    ];

    if (index === 0) {
      base.push({
        id: `quiz-${topic.id}-level`,
        subtopicId: subtopic.id,
        type: "multiple_choice",
        prompt: `"${topic.title}" konusu hangi seviyeye aittir?`,
        options: [topic.level, "Yanlış seviye", "Belirsiz", "Seviye yok"],
        correctIndex: 0,
        explanation: `Bu konu ${topic.level} seviyesindedir.`,
      });
    }

    return base.map((item) => ensureExamOptionCount(item, pool));
  });

  return built.slice(0, TOPIC_EXAM_QUESTION_COUNT);
}

export function createTopicContent(topic: DashboardTopic): TopicContent {
  const samples = pickSamples(topic.id, 3);
  const exercises = buildExercises(topic);

  return {
    topicId: topic.id,
    lesson: {
      intro: `"${topic.title}" konusu ${topic.level} seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.`,
      sections: topic.subtopics.map((subtopic, sectionIndex) => {
        const sample = samples[sectionIndex % samples.length];

        return {
          subtopicId: subtopic.id,
          title: subtopic.title,
          titleEn: subtopic.titleEx ?? topic.titleEx,
          paragraphs: [
            `"${subtopic.title}" başlığında ${topic.title} konusunun önemli noktalarını adım adım görürsün.`,
            `Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. ${topic.level} seviyesinde düzenli tekrar yeterlidir.`,
            topic.isExam
              ? "Bu bir yeterlilik sınavı bölümüdür: önceki konuları hatırlayarak ilerlemeyi hedefle."
              : "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
          ],
          examples: [
            {
              en: sample.en,
              tr: sample.tr,
              note: `${subtopic.title} — örnek ${sectionIndex + 1}`,
            },
            {
              en: `Topic focus: ${topic.title}`,
              tr: `Konu odağı: ${topic.title}`,
            },
            {
              en: `Subtopic: ${subtopic.title}`,
              tr: `Alt konu: ${subtopic.title}`,
            },
          ],
        };
      }),
    },
    exercises,
    quiz: topic.isExam ? undefined : buildQuizExercises(topic),
  };
}
