import type { TopicContent } from "@/data/topics/types";

export const topicContent127: TopicContent = {
  topicId: "127",
  lesson: {
    intro:
      '"C1 Yeterlilik Sınavı" konusu C1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "127-1",
        title: "C1 Yeterlilik Sınavı",
        titleEn: "C1 Proficiency Exam",
        paragraphs: [
          '"C1 Yeterlilik Sınavı" başlığında C1 Yeterlilik Sınavı konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. C1 seviyesinde düzenli tekrar yeterlidir.",
          "Bu bir yeterlilik sınavı bölümüdür: önceki konuları hatırlayarak ilerlemeyi hedefle.",
        ],
        examples: [
          {
            en: "Let's practice together.",
            tr: "Birlikte pratik yapalım.",
            note: "C1 Yeterlilik Sınavı — örnek 1",
          },
          {
            en: "Topic focus: C1 Yeterlilik Sınavı",
            tr: "Konu odağı: C1 Yeterlilik Sınavı",
          },
          {
            en: "Subtopic: C1 Yeterlilik Sınavı",
            tr: "Alt konu: C1 Yeterlilik Sınavı",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "127-ex-127-1-1",
      subtopicId: "127-1",
      type: "multiple_choice",
      prompt: '"C1 Yeterlilik Sınavı" alt konusu hangi ana konuya aittir?',
      options: [
        "C1 Yeterlilik Sınavı",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "C1 Yeterlilik Sınavı" başlığı altındadır.',
    },
    {
      id: "127-ex-127-1-2",
      subtopicId: "127-1",
      type: "multiple_choice",
      prompt:
        'C1 seviyesindeki "C1 Yeterlilik Sınavı" için doğru yaklaşım hangisidir?',
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
      id: "127-fb-127-1-1",
      subtopicId: "127-1",
      type: "fill_blank",
      prompt: '"C1 Yeterlilik Sınavı" konusu _____ seviyesine uygundur.',
      answer: "C1",
      explanation: "Bu konu C1 seviyesindedir.",
    },
    {
      id: "127-cw-1",
      subtopicId: "127-1",
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
    },
  ],
};
