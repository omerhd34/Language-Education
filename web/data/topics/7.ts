import type { TopicContent } from "@/data/topics/types";

export const topicContent7: TopicContent = {
  topicId: "7",
  viewMinutes: 5,
  lesson: {
    intro:
      '"Zaman ve Yer Edatları" konusu A1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "7-1",
        title: "Zaman ve Yer Edatları",
        titleEn: "Prepositions of Time & Place",
        paragraphs: [
          '"Zaman ve Yer Edatları" başlığında Zaman ve Yer Edatları konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "Let's practice together.",
            tr: "Birlikte pratik yapalım.",
            note: "Zaman ve Yer Edatları — örnek 1",
          },
          {
            en: "Topic focus: Zaman ve Yer Edatları",
            tr: "Konu odağı: Zaman ve Yer Edatları",
          },
          {
            en: "Subtopic: Zaman ve Yer Edatları",
            tr: "Alt konu: Zaman ve Yer Edatları",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "7-ex-7-1-1",
      subtopicId: "7-1",
      type: "multiple_choice",
      prompt: '"Zaman ve Yer Edatları" alt konusu hangi ana konuya aittir?',
      options: [
        "Zaman ve Yer Edatları",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Zaman ve Yer Edatları" başlığı altındadır.',
    },
    {
      id: "7-ex-7-1-2",
      subtopicId: "7-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "Zaman ve Yer Edatları" için doğru yaklaşım hangisidir?',
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
      id: "7-fb-7-1-1",
      subtopicId: "7-1",
      type: "fill_blank",
      prompt: '"Zaman ve Yer Edatları" konusu _____ seviyesine uygundur.',
      answer: "A1",
      explanation: "Bu konu A1 seviyesindedir.",
    },
    {
      id: "7-cw-1",
      subtopicId: "7-1",
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
      id: "quiz-7-7-1-1",
      subtopicId: "7-1",
      type: "multiple_choice",
      prompt: '"Zaman ve Yer Edatları" alt konusu hangi ana konuya aittir?',
      options: [
        "Zaman ve Yer Edatları",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Zaman ve Yer Edatları" başlığı altındadır.',
    },
    {
      id: "quiz-7-7-1-2",
      subtopicId: "7-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "Zaman ve Yer Edatları" için doğru yaklaşım hangisidir?',
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
      id: "quiz-7-7-1-3",
      subtopicId: "7-1",
      type: "multiple_choice",
      prompt: '"Zaman ve Yer Edatları" çalışırken hangisi doğrudur?',
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
      id: "quiz-7-level",
      subtopicId: "7-1",
      type: "multiple_choice",
      prompt: '"Zaman ve Yer Edatları" konusu hangi seviyeye aittir?',
      options: ["A1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A1 seviyesindedir.",
    },
  ],
};
