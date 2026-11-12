import type { TopicContent } from "@/data/topics/types";

export const topicContent11: TopicContent = {
  topicId: "11",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri" konusu A1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "11-1",
        title: "Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri",
        titleEn: "Countable / Uncountable & Quantifiers",
        paragraphs: [
          '"Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri" başlığında Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "That sounds correct.",
            tr: "Kulağa doğru geliyor.",
            note: "Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri — örnek 1",
          },
          {
            en: "Topic focus: Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri",
            tr: "Konu odağı: Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri",
          },
          {
            en: "Subtopic: Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri",
            tr: "Alt konu: Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "11-ex-11-1-1",
      subtopicId: "11-1",
      type: "multiple_choice",
      prompt: "\"Sayılabilen/Sayılamayan İsimler & Miktar Belirteçleri\" alt konusu hangi ana konuya aittir?",
      options: [
        "Sayılabilen/Sayılamayan İsimler & Miktar Belirteçleri",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"Sayılabilen/Sayılamayan İsimler & Miktar Belirteçleri\" başlığı altındadır.",
    },
    {
      id: "11-ex-11-1-2",
      subtopicId: "11-1",
      type: "multiple_choice",
      prompt: "A1 seviyesindeki \"Sayılabilen/Sayılamayan İsimler & Miktar Belirteçleri\" için doğru yaklaşım hangisidir?",
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
      id: "11-tf-11-1-1",
      subtopicId: "11-1",
      type: "true_false",
      prompt: "\"Sayılabilen/Sayılamayan İsimler & Miktar Belirteçleri\" başlığı \"Sayılabilen/Sayılamayan İsimler & Miktar Belirteçleri\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"Sayılabilen/Sayılamayan İsimler & Miktar Belirteçleri\" konusu altında işlenir.",
    },
    {
      id: "11-fb-11-1-1",
      subtopicId: "11-1",
      type: "fill_blank",
      prompt: "\"Sayılabilen/Sayılamayan İsimler & Miktar Belirteçleri\" konusu _____ seviyesine uygundur.",
      answer: "A1",
      explanation: "Bu konu A1 seviyesindedir.",
    },
    {
      id: "11-match-1",
      subtopicId: "11-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Countable / Uncountable & Quantifiers",
          right: "Sayılabilen/Sayılamayan İsimler & Miktar Belirteçleri",
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
      id: "11-cw-1",
      subtopicId: "11-1",
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
      id: "quiz-11-11-1-1",
      subtopicId: "11-1",
      type: "multiple_choice",
      prompt:
        '"Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri" alt konusu hangi ana konuya aittir?',
      options: [
        "Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri" başlığı altındadır.',
    },
    {
      id: "quiz-11-11-1-2",
      subtopicId: "11-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri" için doğru yaklaşım hangisidir?',
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
      id: "quiz-11-11-1-3",
      subtopicId: "11-1",
      type: "multiple_choice",
      prompt:
        '"Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri" çalışırken hangisi doğrudur?',
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
      id: "quiz-11-level",
      subtopicId: "11-1",
      type: "multiple_choice",
      prompt:
        '"Sayılabilen/Sayılamayan İsimler ve Miktar Belirteçleri" konusu hangi seviyeye aittir?',
      options: ["A1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A1 seviyesindedir.",
    },
  ],
};
