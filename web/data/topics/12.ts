import type { TopicContent } from "@/data/topics/types";

export const topicContent12: TopicContent = {
  topicId: "12",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Di\'li Geçmiş Zaman" konusu A2 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "12-1",
        title: "Di'li Geçmiş Zaman",
        titleEn: "Past Simple",
        paragraphs: [
          "\"Di'li Geçmiş Zaman\" başlığında Di'li Geçmiş Zaman konusunun önemli noktalarını adım adım görürsün.",
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A2 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I understand this topic.",
            tr: "Bu konuyu anlıyorum.",
            note: "Di'li Geçmiş Zaman — örnek 1",
          },
          {
            en: "Topic focus: Di'li Geçmiş Zaman",
            tr: "Konu odağı: Di'li Geçmiş Zaman",
          },
          {
            en: "Subtopic: Di'li Geçmiş Zaman",
            tr: "Alt konu: Di'li Geçmiş Zaman",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "12-ex-12-1-1",
      subtopicId: "12-1",
      type: "multiple_choice",
      prompt: "\"Di'li Geçmiş Zaman\" alt konusu hangi ana konuya aittir?",
      options: [
        "Di'li Geçmiş Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"Di'li Geçmiş Zaman\" başlığı altındadır.",
    },
    {
      id: "12-ex-12-1-2",
      subtopicId: "12-1",
      type: "multiple_choice",
      prompt: "A2 seviyesindeki \"Di'li Geçmiş Zaman\" için doğru yaklaşım hangisidir?",
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
      id: "12-tf-12-1-1",
      subtopicId: "12-1",
      type: "true_false",
      prompt: "\"Di'li Geçmiş Zaman\" başlığı \"Di'li Geçmiş Zaman\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"Di'li Geçmiş Zaman\" konusu altında işlenir.",
    },
    {
      id: "12-fb-12-1-1",
      subtopicId: "12-1",
      type: "fill_blank",
      prompt: "\"Di'li Geçmiş Zaman\" konusu _____ seviyesine uygundur.",
      answer: "A2",
      explanation: "Bu konu A2 seviyesindedir.",
    },
    {
      id: "12-match-1",
      subtopicId: "12-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Past Simple",
          right: "Di'li Geçmiş Zaman",
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
      id: "12-cw-1",
      subtopicId: "12-1",
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
      id: "quiz-12-12-1-1",
      subtopicId: "12-1",
      type: "multiple_choice",
      prompt: '"Di\'li Geçmiş Zaman" alt konusu hangi ana konuya aittir?',
      options: [
        "Di'li Geçmiş Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Di\'li Geçmiş Zaman" başlığı altındadır.',
    },
    {
      id: "quiz-12-12-1-2",
      subtopicId: "12-1",
      type: "multiple_choice",
      prompt:
        'A2 seviyesindeki "Di\'li Geçmiş Zaman" için doğru yaklaşım hangisidir?',
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
      id: "quiz-12-12-1-3",
      subtopicId: "12-1",
      type: "multiple_choice",
      prompt: '"Di\'li Geçmiş Zaman" çalışırken hangisi doğrudur?',
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
      id: "quiz-12-level",
      subtopicId: "12-1",
      type: "multiple_choice",
      prompt: '"Di\'li Geçmiş Zaman" konusu hangi seviyeye aittir?',
      options: ["A2", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A2 seviyesindedir.",
    },
  ],
};
