import type { TopicContent } from "@/data/topics/types";

export const topicContent20: TopicContent = {
  topicId: "20",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Miş\'li Geçmiş Zaman" konusu B1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "20-1",
        title: "Miş'li Geçmiş Zaman",
        titleEn: "Past Perfect Simple",
        paragraphs: [
          "\"Miş'li Geçmiş Zaman\" başlığında Miş'li Geçmiş Zaman konusunun önemli noktalarını adım adım görürsün.",
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. B1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "This is a useful example.",
            tr: "Bu faydalı bir örnek.",
            note: "Miş'li Geçmiş Zaman — örnek 1",
          },
          {
            en: "Topic focus: Miş'li Geçmiş Zaman",
            tr: "Konu odağı: Miş'li Geçmiş Zaman",
          },
          {
            en: "Subtopic: Miş'li Geçmiş Zaman",
            tr: "Alt konu: Miş'li Geçmiş Zaman",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "20-ex-20-1-1",
      subtopicId: "20-1",
      type: "multiple_choice",
      prompt: "\"Miş'li Geçmiş Zaman\" alt konusu hangi ana konuya aittir?",
      options: [
        "Miş'li Geçmiş Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"Miş'li Geçmiş Zaman\" başlığı altındadır.",
    },
    {
      id: "20-ex-20-1-2",
      subtopicId: "20-1",
      type: "multiple_choice",
      prompt: "B1 seviyesindeki \"Miş'li Geçmiş Zaman\" için doğru yaklaşım hangisidir?",
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
      id: "20-tf-20-1-1",
      subtopicId: "20-1",
      type: "true_false",
      prompt: "\"Miş'li Geçmiş Zaman\" başlığı \"Miş'li Geçmiş Zaman\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"Miş'li Geçmiş Zaman\" konusu altında işlenir.",
    },
    {
      id: "20-fb-20-1-1",
      subtopicId: "20-1",
      type: "fill_blank",
      prompt: "\"Miş'li Geçmiş Zaman\" konusu _____ seviyesine uygundur.",
      answer: "B1",
      explanation: "Bu konu B1 seviyesindedir.",
    },
    {
      id: "20-match-1",
      subtopicId: "20-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Past Perfect Simple",
          right: "Miş'li Geçmiş Zaman",
        },
        {
          left: "B1 level",
          right: "B1 seviyesi",
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
      id: "20-cw-1",
      subtopicId: "20-1",
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
      id: "quiz-20-20-1-1",
      subtopicId: "20-1",
      type: "multiple_choice",
      prompt: '"Miş\'li Geçmiş Zaman" alt konusu hangi ana konuya aittir?',
      options: [
        "Miş'li Geçmiş Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Miş\'li Geçmiş Zaman" başlığı altındadır.',
    },
    {
      id: "quiz-20-20-1-2",
      subtopicId: "20-1",
      type: "multiple_choice",
      prompt:
        'B1 seviyesindeki "Miş\'li Geçmiş Zaman" için doğru yaklaşım hangisidir?',
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
      id: "quiz-20-20-1-3",
      subtopicId: "20-1",
      type: "multiple_choice",
      prompt: '"Miş\'li Geçmiş Zaman" çalışırken hangisi doğrudur?',
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
      id: "quiz-20-level",
      subtopicId: "20-1",
      type: "multiple_choice",
      prompt: '"Miş\'li Geçmiş Zaman" konusu hangi seviyeye aittir?',
      options: ["B1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu B1 seviyesindedir.",
    },
  ],
};
