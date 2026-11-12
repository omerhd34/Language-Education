import type { TopicContent } from "@/data/grammar/types";

export const topicContent17: TopicContent = {
  topicId: "17",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Kipler: Zorunluluk ve Tavsiye" konusu A2 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "17-1",
        title: "Kipler: Zorunluluk ve Tavsiye",
        titleEn: "Modals: Must, Should, Have to",
        paragraphs: [
          '"Kipler: Zorunluluk ve Tavsiye" başlığında Kipler: Zorunluluk ve Tavsiye konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A2 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "That sounds correct.",
            tr: "Kulağa doğru geliyor.",
            note: "Kipler: Zorunluluk ve Tavsiye — örnek 1",
          },
          {
            en: "Topic focus: Kipler: Zorunluluk ve Tavsiye",
            tr: "Konu odağı: Kipler: Zorunluluk ve Tavsiye",
          },
          {
            en: "Subtopic: Kipler: Zorunluluk ve Tavsiye",
            tr: "Alt konu: Kipler: Zorunluluk ve Tavsiye",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "17-ex-17-1-1",
      subtopicId: "17-1",
      type: "multiple_choice",
      prompt: "\"Kipler: Zorunluluk & Tavsiye\" alt konusu hangi ana konuya aittir?",
      options: [
        "Kipler: Zorunluluk & Tavsiye",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"Kipler: Zorunluluk & Tavsiye\" başlığı altındadır.",
    },
    {
      id: "17-ex-17-1-2",
      subtopicId: "17-1",
      type: "multiple_choice",
      prompt: "A2 seviyesindeki \"Kipler: Zorunluluk & Tavsiye\" için doğru yaklaşım hangisidir?",
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
      id: "17-tf-17-1-1",
      subtopicId: "17-1",
      type: "true_false",
      prompt: "\"Kipler: Zorunluluk & Tavsiye\" başlığı \"Kipler: Zorunluluk & Tavsiye\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"Kipler: Zorunluluk & Tavsiye\" konusu altında işlenir.",
    },
    {
      id: "17-fb-17-1-1",
      subtopicId: "17-1",
      type: "fill_blank",
      prompt: "\"Kipler: Zorunluluk & Tavsiye\" konusu _____ seviyesine uygundur.",
      answer: "A2",
      explanation: "Bu konu A2 seviyesindedir.",
    },
    {
      id: "17-match-1",
      subtopicId: "17-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Modals: Must, Should, Have to",
          right: "Kipler: Zorunluluk & Tavsiye",
        },
        {
          left: "A2 level",
          right: "A2 seviyesi",
        },
        {
          left: "Practice",
          right: "Alıştırma",
        },
        {
          left: "Example",
          right: "Örnek",
        },
        {
          left: "Lesson",
          right: "Konu anlatımı",
        },
        {
          left: "Quiz",
          right: "Quiz",
        },
      ],
    },
    {
      id: "17-cw-1",
      subtopicId: "17-1",
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
  quiz: [
    {
      id: "quiz-17-17-1-1",
      subtopicId: "17-1",
      type: "multiple_choice",
      prompt:
        '"Kipler: Zorunluluk ve Tavsiye" alt konusu hangi ana konuya aittir?',
      options: [
        "Kipler: Zorunluluk ve Tavsiye",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Kipler: Zorunluluk ve Tavsiye" başlığı altındadır.',
    },
    {
      id: "quiz-17-17-1-2",
      subtopicId: "17-1",
      type: "multiple_choice",
      prompt:
        'A2 seviyesindeki "Kipler: Zorunluluk ve Tavsiye" için doğru yaklaşım hangisidir?',
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
      id: "quiz-17-17-1-3",
      subtopicId: "17-1",
      type: "multiple_choice",
      prompt: '"Kipler: Zorunluluk ve Tavsiye" çalışırken hangisi doğrudur?',
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
      id: "quiz-17-level",
      subtopicId: "17-1",
      type: "multiple_choice",
      prompt: '"Kipler: Zorunluluk ve Tavsiye" konusu hangi seviyeye aittir?',
      options: ["A2", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A2 seviyesindedir.",
    },
  ],
};
