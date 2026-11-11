import type { TopicContent } from "@/data/topics/types";

export const topicContent22: TopicContent = {
  topicId: "22",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Edilgen Çatı - Temel" konusu B1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "22-1",
        title: "Edilgen Çatı - Temel",
        titleEn: "Passive Voice",
        paragraphs: [
          '"Edilgen Çatı - Temel" başlığında Edilgen Çatı - Temel konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. B1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I use this every day.",
            tr: "Bunu her gün kullanırım.",
            note: "Edilgen Çatı - Temel — örnek 1",
          },
          {
            en: "Topic focus: Edilgen Çatı - Temel",
            tr: "Konu odağı: Edilgen Çatı - Temel",
          },
          {
            en: "Subtopic: Edilgen Çatı - Temel",
            tr: "Alt konu: Edilgen Çatı - Temel",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "22-ex-22-1-1",
      subtopicId: "22-1",
      type: "multiple_choice",
      prompt: '"Edilgen Çatı - Temel" alt konusu hangi ana konuya aittir?',
      options: [
        "Edilgen Çatı - Temel",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Edilgen Çatı - Temel" başlığı altındadır.',
    },
    {
      id: "22-ex-22-1-2",
      subtopicId: "22-1",
      type: "multiple_choice",
      prompt:
        'B1 seviyesindeki "Edilgen Çatı - Temel" için doğru yaklaşım hangisidir?',
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
      id: "22-fb-22-1-1",
      subtopicId: "22-1",
      type: "fill_blank",
      prompt: '"Edilgen Çatı - Temel" konusu _____ seviyesine uygundur.',
      answer: "B1",
      explanation: "Bu konu B1 seviyesindedir.",
    },
    {
      id: "22-cw-1",
      subtopicId: "22-1",
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
  quizExercises: [
    {
      id: "quiz-22-22-1-1",
      subtopicId: "22-1",
      type: "multiple_choice",
      prompt: '"Edilgen Çatı - Temel" alt konusu hangi ana konuya aittir?',
      options: [
        "Edilgen Çatı - Temel",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Edilgen Çatı - Temel" başlığı altındadır.',
    },
    {
      id: "quiz-22-22-1-2",
      subtopicId: "22-1",
      type: "multiple_choice",
      prompt:
        'B1 seviyesindeki "Edilgen Çatı - Temel" için doğru yaklaşım hangisidir?',
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
      id: "quiz-22-22-1-3",
      subtopicId: "22-1",
      type: "multiple_choice",
      prompt: '"Edilgen Çatı - Temel" çalışırken hangisi doğrudur?',
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
      id: "quiz-22-level",
      subtopicId: "22-1",
      type: "multiple_choice",
      prompt: '"Edilgen Çatı - Temel" konusu hangi seviyeye aittir?',
      options: ["B1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu B1 seviyesindedir.",
    },
  ],
};
