import type { TopicContent } from "@/data/grammar/types";

export const topicContent24: TopicContent = {
  topicId: "24",
  viewMinutes: 10,
  lesson: {
    intro:
      '"İsim Fiiller ve Mastarlar" konusu B1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "24-1",
        title: "İsim Fiiller ve Mastarlar",
        titleEn: "Gerunds & Infinitives",
        paragraphs: [
          '"İsim Fiiller ve Mastarlar" başlığında İsim Fiiller ve Mastarlar konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. B1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I understand this topic.",
            tr: "Bu konuyu anlıyorum.",
            note: "İsim Fiiller ve Mastarlar — örnek 1",
          },
          {
            en: "Topic focus: İsim Fiiller ve Mastarlar",
            tr: "Konu odağı: İsim Fiiller ve Mastarlar",
          },
          {
            en: "Subtopic: İsim Fiiller ve Mastarlar",
            tr: "Alt konu: İsim Fiiller ve Mastarlar",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "24-ex-24-1-1",
      subtopicId: "24-1",
      type: "multiple_choice",
      prompt: "\"İsim Fiiller & Mastarlar\" alt konusu hangi ana konuya aittir?",
      options: [
        "İsim Fiiller & Mastarlar",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"İsim Fiiller & Mastarlar\" başlığı altındadır.",
    },
    {
      id: "24-ex-24-1-2",
      subtopicId: "24-1",
      type: "multiple_choice",
      prompt: "B1 seviyesindeki \"İsim Fiiller & Mastarlar\" için doğru yaklaşım hangisidir?",
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
      id: "24-tf-24-1-1",
      subtopicId: "24-1",
      type: "true_false",
      prompt: "\"İsim Fiiller & Mastarlar\" başlığı \"İsim Fiiller & Mastarlar\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"İsim Fiiller & Mastarlar\" konusu altında işlenir.",
    },
    {
      id: "24-fb-24-1-1",
      subtopicId: "24-1",
      type: "fill_blank",
      prompt: "\"İsim Fiiller & Mastarlar\" konusu _____ seviyesine uygundur.",
      answer: "B1",
      explanation: "Bu konu B1 seviyesindedir.",
    },
    {
      id: "24-match-1",
      subtopicId: "24-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Gerunds & Infinitives",
          right: "İsim Fiiller & Mastarlar",
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
      id: "24-cw-1",
      subtopicId: "24-1",
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
      id: "quiz-24-24-1-1",
      subtopicId: "24-1",
      type: "multiple_choice",
      prompt: '"İsim Fiiller ve Mastarlar" alt konusu hangi ana konuya aittir?',
      options: [
        "İsim Fiiller ve Mastarlar",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "İsim Fiiller ve Mastarlar" başlığı altındadır.',
    },
    {
      id: "quiz-24-24-1-2",
      subtopicId: "24-1",
      type: "multiple_choice",
      prompt:
        'B1 seviyesindeki "İsim Fiiller ve Mastarlar" için doğru yaklaşım hangisidir?',
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
      id: "quiz-24-24-1-3",
      subtopicId: "24-1",
      type: "multiple_choice",
      prompt: '"İsim Fiiller ve Mastarlar" çalışırken hangisi doğrudur?',
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
      id: "quiz-24-level",
      subtopicId: "24-1",
      type: "multiple_choice",
      prompt: '"İsim Fiiller ve Mastarlar" konusu hangi seviyeye aittir?',
      options: ["B1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu B1 seviyesindedir.",
    },
  ],
};
