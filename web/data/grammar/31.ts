import type { TopicContent } from "@/data/grammar/types";

export const topicContent31: TopicContent = {
  topicId: "31",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Bölünmüş / Vurgu Cümleleri" konusu C1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "31-1",
        title: "Bölünmüş / Vurgu Cümleleri",
        titleEn: "Cleft Sentences",
        paragraphs: [
          '"Bölünmüş / Vurgu Cümleleri" başlığında Bölünmüş / Vurgu Cümleleri konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. C1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "Let's practice together.",
            tr: "Birlikte pratik yapalım.",
            note: "Bölünmüş / Vurgu Cümleleri — örnek 1",
          },
          {
            en: "Topic focus: Bölünmüş / Vurgu Cümleleri",
            tr: "Konu odağı: Bölünmüş / Vurgu Cümleleri",
          },
          {
            en: "Subtopic: Bölünmüş / Vurgu Cümleleri",
            tr: "Alt konu: Bölünmüş / Vurgu Cümleleri",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "31-ex-31-1-1",
      subtopicId: "31-1",
      type: "multiple_choice",
      prompt: "\"Bölünmüş & Vurgu Cümleleri\" alt konusu hangi ana konuya aittir?",
      options: [
        "Bölünmüş & Vurgu Cümleleri",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"Bölünmüş & Vurgu Cümleleri\" başlığı altındadır.",
    },
    {
      id: "31-ex-31-1-2",
      subtopicId: "31-1",
      type: "multiple_choice",
      prompt: "C1 seviyesindeki \"Bölünmüş & Vurgu Cümleleri\" için doğru yaklaşım hangisidir?",
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
      id: "31-tf-31-1-1",
      subtopicId: "31-1",
      type: "true_false",
      prompt: "\"Bölünmüş & Vurgu Cümleleri\" başlığı \"Bölünmüş & Vurgu Cümleleri\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"Bölünmüş & Vurgu Cümleleri\" konusu altında işlenir.",
    },
    {
      id: "31-fb-31-1-1",
      subtopicId: "31-1",
      type: "fill_blank",
      prompt: "\"Bölünmüş & Vurgu Cümleleri\" konusu _____ seviyesine uygundur.",
      answer: "C1",
      explanation: "Bu konu C1 seviyesindedir.",
    },
    {
      id: "31-match-1",
      subtopicId: "31-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "Cleft Sentences",
          right: "Bölünmüş & Vurgu Cümleleri",
        },
        {
          left: "C1 level",
          right: "C1 seviyesi",
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
      id: "31-cw-1",
      subtopicId: "31-1",
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
      id: "quiz-31-31-1-1",
      subtopicId: "31-1",
      type: "multiple_choice",
      prompt:
        '"Bölünmüş / Vurgu Cümleleri" alt konusu hangi ana konuya aittir?',
      options: [
        "Bölünmüş / Vurgu Cümleleri",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Bölünmüş / Vurgu Cümleleri" başlığı altındadır.',
    },
    {
      id: "quiz-31-31-1-2",
      subtopicId: "31-1",
      type: "multiple_choice",
      prompt:
        'C1 seviyesindeki "Bölünmüş / Vurgu Cümleleri" için doğru yaklaşım hangisidir?',
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
      id: "quiz-31-31-1-3",
      subtopicId: "31-1",
      type: "multiple_choice",
      prompt: '"Bölünmüş / Vurgu Cümleleri" çalışırken hangisi doğrudur?',
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
      id: "quiz-31-level",
      subtopicId: "31-1",
      type: "multiple_choice",
      prompt: '"Bölünmüş / Vurgu Cümleleri" konusu hangi seviyeye aittir?',
      options: ["C1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu C1 seviyesindedir.",
    },
  ],
};
