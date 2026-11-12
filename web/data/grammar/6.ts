import type { TopicContent } from "@/data/grammar/types";

export const topicContent6: TopicContent = {
  topicId: "6",
  viewMinutes: 5,
  lesson: {
    intro:
      '"İşaret ve İyelik Zamirleri/Sıfatları" konusu A1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "6-1",
        title: "İşaret ve İyelik Zamirleri/Sıfatları",
        titleEn: "Demonstratives & Possessives",
        paragraphs: [
          '"İşaret ve İyelik Zamirleri/Sıfatları" başlığında İşaret ve İyelik Zamirleri/Sıfatları konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I understand this topic.",
            tr: "Bu konuyu anlıyorum.",
            note: "İşaret ve İyelik Zamirleri/Sıfatları — örnek 1",
          },
          {
            en: "Topic focus: İşaret ve İyelik Zamirleri/Sıfatları",
            tr: "Konu odağı: İşaret ve İyelik Zamirleri/Sıfatları",
          },
          {
            en: "Subtopic: İşaret ve İyelik Zamirleri/Sıfatları",
            tr: "Alt konu: İşaret ve İyelik Zamirleri/Sıfatları",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "6-ex-6-1-1",
      subtopicId: "6-1",
      type: "multiple_choice",
      prompt: "\"İşaret & İyelik Zamirleri/Sıfatları\" alt konusu hangi ana konuya aittir?",
      options: [
        "İşaret & İyelik Zamirleri/Sıfatları",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"İşaret & İyelik Zamirleri/Sıfatları\" başlığı altındadır.",
    },
    {
      id: "6-ex-6-1-2",
      subtopicId: "6-1",
      type: "multiple_choice",
      prompt: "A1 seviyesindeki \"İşaret & İyelik Zamirleri/Sıfatları\" için doğru yaklaşım hangisidir?",
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
      id: "6-tf-6-1-1",
      subtopicId: "6-1",
      type: "true_false",
      prompt: "\"İşaret & İyelik Zamirleri/Sıfatları\" başlığı \"İşaret & İyelik Zamirleri/Sıfatları\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"İşaret & İyelik Zamirleri/Sıfatları\" konusu altında işlenir.",
    },
    {
      id: "6-fb-6-1-1",
      subtopicId: "6-1",
      type: "fill_blank",
      prompt: "\"İşaret & İyelik Zamirleri/Sıfatları\" konusu _____ seviyesine uygundur.",
      answer: "A1",
      explanation: "Bu konu A1 seviyesindedir.",
    },
    {
      id: "6-match-1",
      subtopicId: "6-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Demonstratives & Possessives",
          right: "İşaret & İyelik Zamirleri/Sıfatları",
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
      id: "6-cw-1",
      subtopicId: "6-1",
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
      id: "quiz-6-6-1-1",
      subtopicId: "6-1",
      type: "multiple_choice",
      prompt:
        '"İşaret ve İyelik Zamirleri/Sıfatları" alt konusu hangi ana konuya aittir?',
      options: [
        "İşaret ve İyelik Zamirleri/Sıfatları",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "İşaret ve İyelik Zamirleri/Sıfatları" başlığı altındadır.',
    },
    {
      id: "quiz-6-6-1-2",
      subtopicId: "6-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "İşaret ve İyelik Zamirleri/Sıfatları" için doğru yaklaşım hangisidir?',
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
      id: "quiz-6-6-1-3",
      subtopicId: "6-1",
      type: "multiple_choice",
      prompt:
        '"İşaret ve İyelik Zamirleri/Sıfatları" çalışırken hangisi doğrudur?',
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
      id: "quiz-6-level",
      subtopicId: "6-1",
      type: "multiple_choice",
      prompt:
        '"İşaret ve İyelik Zamirleri/Sıfatları" konusu hangi seviyeye aittir?',
      options: ["A1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A1 seviyesindedir.",
    },
  ],
};
