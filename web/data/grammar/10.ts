import type { TopicContent } from "@/data/grammar/types";

export const topicContent10: TopicContent = {
  topicId: "10",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Kipler: Yapabilmek" konusu A1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "10-1",
        title: "Kipler: Yapabilmek",
        titleEn: "Modals: Can / Can't",
        paragraphs: [
          '"Kipler: Yapabilmek" başlığında Kipler: Yapabilmek konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I use this every day.",
            tr: "Bunu her gün kullanırım.",
            note: "Kipler: Yapabilmek — örnek 1",
          },
          {
            en: "Topic focus: Kipler: Yapabilmek",
            tr: "Konu odağı: Kipler: Yapabilmek",
          },
          {
            en: "Subtopic: Kipler: Yapabilmek",
            tr: "Alt konu: Kipler: Yapabilmek",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "10-ex-10-1-1",
      subtopicId: "10-1",
      type: "multiple_choice",
      prompt: "\"Kipler: Yapabilmek\" alt konusu hangi ana konuya aittir?",
      options: [
        "Kipler: Yapabilmek",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"Kipler: Yapabilmek\" başlığı altındadır.",
    },
    {
      id: "10-ex-10-1-2",
      subtopicId: "10-1",
      type: "multiple_choice",
      prompt: "A1 seviyesindeki \"Kipler: Yapabilmek\" için doğru yaklaşım hangisidir?",
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
      id: "10-tf-10-1-1",
      subtopicId: "10-1",
      type: "true_false",
      prompt: "\"Kipler: Yapabilmek\" başlığı \"Kipler: Yapabilmek\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"Kipler: Yapabilmek\" konusu altında işlenir.",
    },
    {
      id: "10-fb-10-1-1",
      subtopicId: "10-1",
      type: "fill_blank",
      prompt: "\"Kipler: Yapabilmek\" konusu _____ seviyesine uygundur.",
      answer: "A1",
      explanation: "Bu konu A1 seviyesindedir.",
    },
    {
      id: "10-match-1",
      subtopicId: "10-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Modals: Can / Can't",
          right: "Kipler: Yapabilmek",
        },
        {
          left: "A1 level",
          right: "A1 seviyesi",
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
      id: "10-cw-1",
      subtopicId: "10-1",
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
      id: "quiz-10-10-1-1",
      subtopicId: "10-1",
      type: "multiple_choice",
      prompt: '"Kipler: Yapabilmek" alt konusu hangi ana konuya aittir?',
      options: [
        "Kipler: Yapabilmek",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Kipler: Yapabilmek" başlığı altındadır.',
    },
    {
      id: "quiz-10-10-1-2",
      subtopicId: "10-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "Kipler: Yapabilmek" için doğru yaklaşım hangisidir?',
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
      id: "quiz-10-10-1-3",
      subtopicId: "10-1",
      type: "multiple_choice",
      prompt: '"Kipler: Yapabilmek" çalışırken hangisi doğrudur?',
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
      id: "quiz-10-level",
      subtopicId: "10-1",
      type: "multiple_choice",
      prompt: '"Kipler: Yapabilmek" konusu hangi seviyeye aittir?',
      options: ["A1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A1 seviyesindedir.",
    },
  ],
};
