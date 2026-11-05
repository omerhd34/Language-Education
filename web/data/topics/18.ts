import type { TopicContent } from "@/data/topics/types";

export const topicContent18: TopicContent = {
  topicId: "18",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Temel Sıfat Cümlecikleri" konusu A2 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "18-1",
        title: "Temel Sıfat Cümlecikleri",
        titleEn: "Basic Relative Clauses",
        paragraphs: [
          '"Temel Sıfat Cümlecikleri" başlığında Temel Sıfat Cümlecikleri konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A2 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I understand this topic.",
            tr: "Bu konuyu anlıyorum.",
            note: "Temel Sıfat Cümlecikleri — örnek 1",
          },
          {
            en: "Topic focus: Temel Sıfat Cümlecikleri",
            tr: "Konu odağı: Temel Sıfat Cümlecikleri",
          },
          {
            en: "Subtopic: Temel Sıfat Cümlecikleri",
            tr: "Alt konu: Temel Sıfat Cümlecikleri",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "18-ex-18-1-1",
      subtopicId: "18-1",
      type: "multiple_choice",
      prompt: '"Temel Sıfat Cümlecikleri" alt konusu hangi ana konuya aittir?',
      options: [
        "Temel Sıfat Cümlecikleri",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Temel Sıfat Cümlecikleri" başlığı altındadır.',
    },
    {
      id: "18-ex-18-1-2",
      subtopicId: "18-1",
      type: "multiple_choice",
      prompt:
        'A2 seviyesindeki "Temel Sıfat Cümlecikleri" için doğru yaklaşım hangisidir?',
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
      id: "18-fb-18-1-1",
      subtopicId: "18-1",
      type: "fill_blank",
      prompt: '"Temel Sıfat Cümlecikleri" konusu _____ seviyesine uygundur.',
      answer: "A2",
      explanation: "Bu konu A2 seviyesindedir.",
    },
    {
      id: "18-cw-1",
      subtopicId: "18-1",
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
      id: "exam-18-18-1-1",
      subtopicId: "18-1",
      type: "multiple_choice",
      prompt: '"Temel Sıfat Cümlecikleri" alt konusu hangi ana konuya aittir?',
      options: [
        "Temel Sıfat Cümlecikleri",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Temel Sıfat Cümlecikleri" başlığı altındadır.',
    },
    {
      id: "exam-18-18-1-2",
      subtopicId: "18-1",
      type: "multiple_choice",
      prompt:
        'A2 seviyesindeki "Temel Sıfat Cümlecikleri" için doğru yaklaşım hangisidir?',
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
      id: "exam-18-18-1-3",
      subtopicId: "18-1",
      type: "multiple_choice",
      prompt: '"Temel Sıfat Cümlecikleri" çalışırken hangisi doğrudur?',
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
      id: "exam-18-level",
      subtopicId: "18-1",
      type: "multiple_choice",
      prompt: '"Temel Sıfat Cümlecikleri" konusu hangi seviyeye aittir?',
      options: ["A2", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A2 seviyesindedir.",
    },
  ],
};
