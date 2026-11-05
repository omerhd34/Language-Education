import type { TopicContent } from "@/data/topics/types";

export const topicContent30: TopicContent = {
  topicId: "30",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Devrik Cümleler" konusu C1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "30-1",
        title: "Devrik Cümleler",
        titleEn: "Inversion",
        paragraphs: [
          '"Devrik Cümleler" başlığında Devrik Cümleler konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. C1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I understand this topic.",
            tr: "Bu konuyu anlıyorum.",
            note: "Devrik Cümleler — örnek 1",
          },
          {
            en: "Topic focus: Devrik Cümleler",
            tr: "Konu odağı: Devrik Cümleler",
          },
          {
            en: "Subtopic: Devrik Cümleler",
            tr: "Alt konu: Devrik Cümleler",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "30-ex-30-1-1",
      subtopicId: "30-1",
      type: "multiple_choice",
      prompt: '"Devrik Cümleler" alt konusu hangi ana konuya aittir?',
      options: [
        "Devrik Cümleler",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Devrik Cümleler" başlığı altındadır.',
    },
    {
      id: "30-ex-30-1-2",
      subtopicId: "30-1",
      type: "multiple_choice",
      prompt:
        'C1 seviyesindeki "Devrik Cümleler" için doğru yaklaşım hangisidir?',
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
      id: "30-fb-30-1-1",
      subtopicId: "30-1",
      type: "fill_blank",
      prompt: '"Devrik Cümleler" konusu _____ seviyesine uygundur.',
      answer: "C1",
      explanation: "Bu konu C1 seviyesindedir.",
    },
    {
      id: "30-cw-1",
      subtopicId: "30-1",
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
      id: "exam-30-30-1-1",
      subtopicId: "30-1",
      type: "multiple_choice",
      prompt: '"Devrik Cümleler" alt konusu hangi ana konuya aittir?',
      options: [
        "Devrik Cümleler",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Devrik Cümleler" başlığı altındadır.',
    },
    {
      id: "exam-30-30-1-2",
      subtopicId: "30-1",
      type: "multiple_choice",
      prompt:
        'C1 seviyesindeki "Devrik Cümleler" için doğru yaklaşım hangisidir?',
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
      id: "exam-30-30-1-3",
      subtopicId: "30-1",
      type: "multiple_choice",
      prompt: '"Devrik Cümleler" çalışırken hangisi doğrudur?',
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
      id: "exam-30-level",
      subtopicId: "30-1",
      type: "multiple_choice",
      prompt: '"Devrik Cümleler" konusu hangi seviyeye aittir?',
      options: ["C1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu C1 seviyesindedir.",
    },
  ],
};
