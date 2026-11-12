import type { TopicContent } from "@/data/grammar/types";

export const topicContent5: TopicContent = {
  topicId: "5",
  viewMinutes: 5,
  lesson: {
    intro:
      '"Tanımlıklar ve Çoğul İsimler" konusu A1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "5-1",
        title: "Tanımlıklar ve Çoğul İsimler",
        titleEn: "Articles & Plural Nouns",
        paragraphs: [
          "**Tanımlıklar** ve **Çoğul İsimler** başlığında Tanımlıklar ve Çoğul İsimler konusunun önemli noktalarını adım adım görürsün.",
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "That sounds correct.",
            tr: "Kulağa doğru geliyor.",
            note: "Tanımlıklar ve Çoğul İsimler — örnek 1",
          },
          {
            en: "Topic focus: Tanımlıklar ve Çoğul İsimler",
            tr: "Konu odağı: Tanımlıklar ve Çoğul İsimler",
          },
          {
            en: "Subtopic: Tanımlıklar ve Çoğul İsimler",
            tr: "Alt konu: Tanımlıklar ve Çoğul İsimler",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "5-ex-5-1-1",
      subtopicId: "5-1",
      type: "multiple_choice",
      prompt: "\"Tanımlıklar & Çoğul İsimler\" alt konusu hangi ana konuya aittir?",
      options: [
        "Tanımlıklar & Çoğul İsimler",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"Tanımlıklar & Çoğul İsimler\" başlığı altındadır.",
    },
    {
      id: "5-ex-5-1-2",
      subtopicId: "5-1",
      type: "multiple_choice",
      prompt: "A1 seviyesindeki \"Tanımlıklar & Çoğul İsimler\" için doğru yaklaşım hangisidir?",
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
      id: "5-tf-5-1-1",
      subtopicId: "5-1",
      type: "true_false",
      prompt: "\"Tanımlıklar & Çoğul İsimler\" başlığı \"Tanımlıklar & Çoğul İsimler\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"Tanımlıklar & Çoğul İsimler\" konusu altında işlenir.",
    },
    {
      id: "5-fb-5-1-1",
      subtopicId: "5-1",
      type: "fill_blank",
      prompt: "\"Tanımlıklar & Çoğul İsimler\" konusu _____ seviyesine uygundur.",
      answer: "A1",
      explanation: "Bu konu A1 seviyesindedir.",
    },
    {
      id: "5-match-1",
      subtopicId: "5-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Articles & Plural Nouns",
          right: "Tanımlıklar & Çoğul İsimler",
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
      id: "5-cw-1",
      subtopicId: "5-1",
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
      id: "quiz-5-5-1-1",
      subtopicId: "5-1",
      type: "multiple_choice",
      prompt:
        '"Tanımlıklar ve Çoğul İsimler" alt konusu hangi ana konuya aittir?',
      options: [
        "Tanımlıklar ve Çoğul İsimler",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Tanımlıklar ve Çoğul İsimler" başlığı altındadır.',
    },
    {
      id: "quiz-5-5-1-2",
      subtopicId: "5-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "Tanımlıklar ve Çoğul İsimler" için doğru yaklaşım hangisidir?',
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
      id: "quiz-5-5-1-3",
      subtopicId: "5-1",
      type: "multiple_choice",
      prompt: '"Tanımlıklar ve Çoğul İsimler" çalışırken hangisi doğrudur?',
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
      id: "quiz-5-level",
      subtopicId: "5-1",
      type: "multiple_choice",
      prompt: '"Tanımlıklar ve Çoğul İsimler" konusu hangi seviyeye aittir?',
      options: ["A1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A1 seviyesindedir.",
    },
  ],
};
