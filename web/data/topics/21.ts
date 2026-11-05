import type { TopicContent } from "@/data/topics/types";

export const topicContent21: TopicContent = {
  topicId: "21",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Koşul Cümleleri - Tip 0, 1, 2" konusu B1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "21-1",
        title: "Koşul Cümleleri - Tip 0, 1, 2",
        titleEn: "Conditionals (Type 0, 1, 2)",
        paragraphs: [
          '"Koşul Cümleleri - Tip 0, 1, 2" başlığında Koşul Cümleleri - Tip 0, 1, 2 konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. B1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "Can you repeat that?",
            tr: "Tekrar eder misin?",
            note: "Koşul Cümleleri - Tip 0, 1, 2 — örnek 1",
          },
          {
            en: "Topic focus: Koşul Cümleleri - Tip 0, 1, 2",
            tr: "Konu odağı: Koşul Cümleleri - Tip 0, 1, 2",
          },
          {
            en: "Subtopic: Koşul Cümleleri - Tip 0, 1, 2",
            tr: "Alt konu: Koşul Cümleleri - Tip 0, 1, 2",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "21-ex-21-1-1",
      subtopicId: "21-1",
      type: "multiple_choice",
      prompt:
        '"Koşul Cümleleri - Tip 0, 1, 2" alt konusu hangi ana konuya aittir?',
      options: [
        "Koşul Cümleleri - Tip 0, 1, 2",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Koşul Cümleleri - Tip 0, 1, 2" başlığı altındadır.',
    },
    {
      id: "21-ex-21-1-2",
      subtopicId: "21-1",
      type: "multiple_choice",
      prompt:
        'B1 seviyesindeki "Koşul Cümleleri - Tip 0, 1, 2" için doğru yaklaşım hangisidir?',
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
      id: "21-fb-21-1-1",
      subtopicId: "21-1",
      type: "fill_blank",
      prompt:
        '"Koşul Cümleleri - Tip 0, 1, 2" konusu _____ seviyesine uygundur.',
      answer: "B1",
      explanation: "Bu konu B1 seviyesindedir.",
    },
    {
      id: "21-cw-1",
      subtopicId: "21-1",
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
  examExercises: [
    {
      id: "exam-21-21-1-1",
      subtopicId: "21-1",
      type: "multiple_choice",
      prompt:
        '"Koşul Cümleleri - Tip 0, 1, 2" alt konusu hangi ana konuya aittir?',
      options: [
        "Koşul Cümleleri - Tip 0, 1, 2",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Koşul Cümleleri - Tip 0, 1, 2" başlığı altındadır.',
    },
    {
      id: "exam-21-21-1-2",
      subtopicId: "21-1",
      type: "multiple_choice",
      prompt:
        'B1 seviyesindeki "Koşul Cümleleri - Tip 0, 1, 2" için doğru yaklaşım hangisidir?',
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
      id: "exam-21-21-1-3",
      subtopicId: "21-1",
      type: "multiple_choice",
      prompt: '"Koşul Cümleleri - Tip 0, 1, 2" çalışırken hangisi doğrudur?',
      options: [
        "Anlamadığın örneği işaretleyip tekrar etmek",
        "Hiç örnek okumamak",
        "Konuyu tamamen atlamak",
        "Sadece dinleyip bırakmak",
      ],
      correctIndex: 0,
      explanation: "Tekrar ve işaretleme öğrenmeyi güçlendirir.",
    },
    {
      id: "exam-21-level",
      subtopicId: "21-1",
      type: "multiple_choice",
      prompt: '"Koşul Cümleleri - Tip 0, 1, 2" konusu hangi seviyeye aittir?',
      options: ["B1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu B1 seviyesindedir.",
    },
  ],
};
