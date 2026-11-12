import type { TopicContent } from "@/data/topics/types";

export const topicContent14: TopicContent = {
  topicId: "14",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Gelecek Zaman" konusu A2 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "14-1",
        title: "Gelecek Zaman",
        titleEn: "Future: Will vs. Going to",
        paragraphs: [
          '"Gelecek Zaman" başlığında Gelecek Zaman konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A2 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "This is a useful example.",
            tr: "Bu faydalı bir örnek.",
            note: "Gelecek Zaman — örnek 1",
          },
          {
            en: "Topic focus: Gelecek Zaman",
            tr: "Konu odağı: Gelecek Zaman",
          },
          {
            en: "Subtopic: Gelecek Zaman",
            tr: "Alt konu: Gelecek Zaman",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "14-ex-14-1-1",
      subtopicId: "14-1",
      type: "multiple_choice",
      prompt: "\"Gelecek Zaman\" alt konusu hangi ana konuya aittir?",
      options: [
        "Gelecek Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"Gelecek Zaman\" başlığı altındadır.",
    },
    {
      id: "14-ex-14-1-2",
      subtopicId: "14-1",
      type: "multiple_choice",
      prompt: "A2 seviyesindeki \"Gelecek Zaman\" için doğru yaklaşım hangisidir?",
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
      id: "14-tf-14-1-1",
      subtopicId: "14-1",
      type: "true_false",
      prompt: "\"Gelecek Zaman\" başlığı \"Gelecek Zaman\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"Gelecek Zaman\" konusu altında işlenir.",
    },
    {
      id: "14-fb-14-1-1",
      subtopicId: "14-1",
      type: "fill_blank",
      prompt: "\"Gelecek Zaman\" konusu _____ seviyesine uygundur.",
      answer: "A2",
      explanation: "Bu konu A2 seviyesindedir.",
    },
    {
      id: "14-match-1",
      subtopicId: "14-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Future: Will vs. Going to",
          right: "Gelecek Zaman",
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
      id: "14-cw-1",
      subtopicId: "14-1",
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
      id: "quiz-14-14-1-1",
      subtopicId: "14-1",
      type: "multiple_choice",
      prompt: '"Gelecek Zaman" alt konusu hangi ana konuya aittir?',
      options: [
        "Gelecek Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Gelecek Zaman" başlığı altındadır.',
    },
    {
      id: "quiz-14-14-1-2",
      subtopicId: "14-1",
      type: "multiple_choice",
      prompt:
        'A2 seviyesindeki "Gelecek Zaman" için doğru yaklaşım hangisidir?',
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
      id: "quiz-14-14-1-3",
      subtopicId: "14-1",
      type: "multiple_choice",
      prompt: '"Gelecek Zaman" çalışırken hangisi doğrudur?',
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
      id: "quiz-14-level",
      subtopicId: "14-1",
      type: "multiple_choice",
      prompt: '"Gelecek Zaman" konusu hangi seviyeye aittir?',
      options: ["A2", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A2 seviyesindedir.",
    },
  ],
};
