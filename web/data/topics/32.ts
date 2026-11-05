import type { TopicContent } from "@/data/topics/types";

export const topicContent32: TopicContent = {
  topicId: "32",
  viewMinutes: 10,
  lesson: {
    intro:
      '"İstek / Dilek Kipi" konusu C1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "32-1",
        title: "İstek / Dilek Kipi",
        titleEn: "Subjunctive Mood",
        paragraphs: [
          '"İstek / Dilek Kipi" başlığında İstek / Dilek Kipi konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. C1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "This is a useful example.",
            tr: "Bu faydalı bir örnek.",
            note: "İstek / Dilek Kipi — örnek 1",
          },
          {
            en: "Topic focus: İstek / Dilek Kipi",
            tr: "Konu odağı: İstek / Dilek Kipi",
          },
          {
            en: "Subtopic: İstek / Dilek Kipi",
            tr: "Alt konu: İstek / Dilek Kipi",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "32-ex-32-1-1",
      subtopicId: "32-1",
      type: "multiple_choice",
      prompt: '"İstek / Dilek Kipi" alt konusu hangi ana konuya aittir?',
      options: [
        "İstek / Dilek Kipi",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "İstek / Dilek Kipi" başlığı altındadır.',
    },
    {
      id: "32-ex-32-1-2",
      subtopicId: "32-1",
      type: "multiple_choice",
      prompt:
        'C1 seviyesindeki "İstek / Dilek Kipi" için doğru yaklaşım hangisidir?',
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
      id: "32-fb-32-1-1",
      subtopicId: "32-1",
      type: "fill_blank",
      prompt: '"İstek / Dilek Kipi" konusu _____ seviyesine uygundur.',
      answer: "C1",
      explanation: "Bu konu C1 seviyesindedir.",
    },
    {
      id: "32-cw-1",
      subtopicId: "32-1",
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
      id: "exam-32-32-1-1",
      subtopicId: "32-1",
      type: "multiple_choice",
      prompt: '"İstek / Dilek Kipi" alt konusu hangi ana konuya aittir?',
      options: [
        "İstek / Dilek Kipi",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "İstek / Dilek Kipi" başlığı altındadır.',
    },
    {
      id: "exam-32-32-1-2",
      subtopicId: "32-1",
      type: "multiple_choice",
      prompt:
        'C1 seviyesindeki "İstek / Dilek Kipi" için doğru yaklaşım hangisidir?',
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
      id: "exam-32-32-1-3",
      subtopicId: "32-1",
      type: "multiple_choice",
      prompt: '"İstek / Dilek Kipi" çalışırken hangisi doğrudur?',
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
      id: "exam-32-level",
      subtopicId: "32-1",
      type: "multiple_choice",
      prompt: '"İstek / Dilek Kipi" konusu hangi seviyeye aittir?',
      options: ["C1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu C1 seviyesindedir.",
    },
  ],
};
