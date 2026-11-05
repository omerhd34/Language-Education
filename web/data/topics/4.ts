import type { TopicContent } from "@/data/topics/types";

export const topicContent4: TopicContent = {
  topicId: "4",
  viewMinutes: 5,
  lesson: {
    intro:
      '"Özne Zamirleri ve Olmak Fiili" konusu A1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "4-1",
        title: "Özne Zamirleri ve Olmak Fiili",
        titleEn: "Subject Pronouns & 'To Be'",
        paragraphs: [
          '"Özne Zamirleri ve Olmak Fiili" başlığında Özne Zamirleri ve Olmak Fiili konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I use this every day.",
            tr: "Bunu her gün kullanırım.",
            note: "Özne Zamirleri ve Olmak Fiili — örnek 1",
          },
          {
            en: "Topic focus: Özne Zamirleri ve Olmak Fiili",
            tr: "Konu odağı: Özne Zamirleri ve Olmak Fiili",
          },
          {
            en: "Subtopic: Özne Zamirleri ve Olmak Fiili",
            tr: "Alt konu: Özne Zamirleri ve Olmak Fiili",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "4-ex-4-1-1",
      subtopicId: "4-1",
      type: "multiple_choice",
      prompt:
        '"Özne Zamirleri ve Olmak Fiili" alt konusu hangi ana konuya aittir?',
      options: [
        "Özne Zamirleri ve Olmak Fiili",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Özne Zamirleri ve Olmak Fiili" başlığı altındadır.',
    },
    {
      id: "4-ex-4-1-2",
      subtopicId: "4-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "Özne Zamirleri ve Olmak Fiili" için doğru yaklaşım hangisidir?',
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
      id: "4-fb-4-1-1",
      subtopicId: "4-1",
      type: "fill_blank",
      prompt:
        '"Özne Zamirleri ve Olmak Fiili" konusu _____ seviyesine uygundur.',
      answer: "A1",
      explanation: "Bu konu A1 seviyesindedir.",
    },
    {
      id: "4-cw-1",
      subtopicId: "4-1",
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
      id: "exam-4-4-1-1",
      subtopicId: "4-1",
      type: "multiple_choice",
      prompt:
        '"Özne Zamirleri ve Olmak Fiili" alt konusu hangi ana konuya aittir?',
      options: [
        "Özne Zamirleri ve Olmak Fiili",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Özne Zamirleri ve Olmak Fiili" başlığı altındadır.',
    },
    {
      id: "exam-4-4-1-2",
      subtopicId: "4-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "Özne Zamirleri ve Olmak Fiili" için doğru yaklaşım hangisidir?',
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
      id: "exam-4-4-1-3",
      subtopicId: "4-1",
      type: "multiple_choice",
      prompt: '"Özne Zamirleri ve Olmak Fiili" çalışırken hangisi doğrudur?',
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
      id: "exam-4-level",
      subtopicId: "4-1",
      type: "multiple_choice",
      prompt: '"Özne Zamirleri ve Olmak Fiili" konusu hangi seviyeye aittir?',
      options: ["A1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A1 seviyesindedir.",
    },
  ],
};
