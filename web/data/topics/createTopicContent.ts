import type { DashboardTopic } from "@/data/dashboardTopics";
import type { TopicContent, TopicExercise } from "@/data/topics/types";

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

function buildExercises(topic: DashboardTopic): TopicExercise[] {
  const exercises: TopicExercise[] = [];

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

    exercises.push({
      id: `${topic.id}-fb-${subtopic.id}-1`,
      subtopicId: subtopic.id,
      type: "fill_blank",
      prompt: `"${subtopic.title}" konusu _____ seviyesine uygundur.`,
      answer: topic.level,
      explanation: `Bu konu ${topic.level} seviyesindedir.`,
    });
  }

  const firstSubtopic = topic.subtopics[0];
  if (firstSubtopic) {
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

export function createTopicContent(topic: DashboardTopic): TopicContent {
  const samples = pickSamples(topic.id, 3);

  return {
    topicId: topic.id,
    lesson: {
      intro: `"${topic.title}" konusu ${topic.level} seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.`,
      sections: topic.subtopics.map((subtopic, sectionIndex) => {
        const sample = samples[sectionIndex % samples.length];

        return {
          subtopicId: subtopic.id,
          title: subtopic.title,
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
    exercises: buildExercises(topic),
  };
}
