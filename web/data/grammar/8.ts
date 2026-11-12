import type { TopicContent } from "@/data/grammar/types";

export const topicContent8: TopicContent = {
  topicId: "8",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Geniş Zaman" konusu A1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "8-1",
        title: "Geniş Zaman",
        titleEn: "Present Simple",
        paragraphs: [
          '"Geniş Zaman" başlığında Geniş Zaman konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "This is a useful example.",
            tr: "Bu faydalı bir örnek.",
            note: "Geniş Zaman — örnek 1",
          },
          {
            en: "Topic focus: Geniş Zaman",
            tr: "Konu odağı: Geniş Zaman",
          },
          {
            en: "Subtopic: Geniş Zaman",
            tr: "Alt konu: Geniş Zaman",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "8-ex-8-1-1",
      subtopicId: "8-1",
      type: "multiple_choice",
      prompt: "\"Geniş Zaman\" alt konusu hangi ana konuya aittir?",
      options: [
        "Geniş Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"Geniş Zaman\" başlığı altındadır.",
    },
    {
      id: "8-ex-8-1-2",
      subtopicId: "8-1",
      type: "multiple_choice",
      prompt: "A1 seviyesindeki \"Geniş Zaman\" için doğru yaklaşım hangisidir?",
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
      id: "8-tf-8-1-1",
      subtopicId: "8-1",
      type: "true_false",
      prompt: "\"Geniş Zaman\" başlığı \"Geniş Zaman\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"Geniş Zaman\" konusu altında işlenir.",
    },
    {
      id: "8-fb-8-1-1",
      subtopicId: "8-1",
      type: "fill_blank",
      prompt: "\"Geniş Zaman\" konusu _____ seviyesine uygundur.",
      answer: "A1",
      explanation: "Bu konu A1 seviyesindedir.",
    },
    {
      id: "8-match-1",
      subtopicId: "8-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Present Simple",
          right: "Geniş Zaman",
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
      id: "8-cw-1",
      subtopicId: "8-1",
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
      id: "quiz-8-8-1-1",
      subtopicId: "8-1",
      type: "multiple_choice",
      prompt: '"Geniş Zaman" alt konusu hangi ana konuya aittir?',
      options: [
        "Geniş Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Geniş Zaman" başlığı altındadır.',
    },
    {
      id: "quiz-8-8-1-2",
      subtopicId: "8-1",
      type: "multiple_choice",
      prompt: 'A1 seviyesindeki "Geniş Zaman" için doğru yaklaşım hangisidir?',
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
      id: "quiz-8-8-1-3",
      subtopicId: "8-1",
      type: "multiple_choice",
      prompt: '"Geniş Zaman" çalışırken hangisi doğrudur?',
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
      id: "quiz-8-level",
      subtopicId: "8-1",
      type: "multiple_choice",
      prompt: '"Geniş Zaman" konusu hangi seviyeye aittir?',
      options: ["A1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A1 seviyesindedir.",
    },
  ],
};
