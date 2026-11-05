import type { TopicContent } from "@/data/topics/types";

export const topicContent23: TopicContent = {
  topicId: "23",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Dolaylı Anlatım - Temel" konusu B1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "23-1",
        title: "Dolaylı Anlatım - Temel",
        titleEn: "Reported Speech",
        paragraphs: [
          '"Dolaylı Anlatım - Temel" başlığında Dolaylı Anlatım - Temel konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. B1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "That sounds correct.",
            tr: "Kulağa doğru geliyor.",
            note: "Dolaylı Anlatım - Temel — örnek 1",
          },
          {
            en: "Topic focus: Dolaylı Anlatım - Temel",
            tr: "Konu odağı: Dolaylı Anlatım - Temel",
          },
          {
            en: "Subtopic: Dolaylı Anlatım - Temel",
            tr: "Alt konu: Dolaylı Anlatım - Temel",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "23-ex-23-1-1",
      subtopicId: "23-1",
      type: "multiple_choice",
      prompt: '"Dolaylı Anlatım - Temel" alt konusu hangi ana konuya aittir?',
      options: [
        "Dolaylı Anlatım - Temel",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Dolaylı Anlatım - Temel" başlığı altındadır.',
    },
    {
      id: "23-ex-23-1-2",
      subtopicId: "23-1",
      type: "multiple_choice",
      prompt:
        'B1 seviyesindeki "Dolaylı Anlatım - Temel" için doğru yaklaşım hangisidir?',
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
      id: "23-fb-23-1-1",
      subtopicId: "23-1",
      type: "fill_blank",
      prompt: '"Dolaylı Anlatım - Temel" konusu _____ seviyesine uygundur.',
      answer: "B1",
      explanation: "Bu konu B1 seviyesindedir.",
    },
    {
      id: "23-cw-1",
      subtopicId: "23-1",
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
      id: "exam-23-23-1-1",
      subtopicId: "23-1",
      type: "multiple_choice",
      prompt: '"Dolaylı Anlatım - Temel" alt konusu hangi ana konuya aittir?',
      options: [
        "Dolaylı Anlatım - Temel",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Dolaylı Anlatım - Temel" başlığı altındadır.',
    },
    {
      id: "exam-23-23-1-2",
      subtopicId: "23-1",
      type: "multiple_choice",
      prompt:
        'B1 seviyesindeki "Dolaylı Anlatım - Temel" için doğru yaklaşım hangisidir?',
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
      id: "exam-23-23-1-3",
      subtopicId: "23-1",
      type: "multiple_choice",
      prompt: '"Dolaylı Anlatım - Temel" çalışırken hangisi doğrudur?',
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
      id: "exam-23-level",
      subtopicId: "23-1",
      type: "multiple_choice",
      prompt: '"Dolaylı Anlatım - Temel" konusu hangi seviyeye aittir?',
      options: ["B1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu B1 seviyesindedir.",
    },
  ],
};
