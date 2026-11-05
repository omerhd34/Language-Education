import type { TopicContent } from "@/data/topics/types";

export const topicContent38: TopicContent = {
  topicId: "38",
  viewMinutes: 10,
  lesson: {
    intro:
      '"İleri Düzey İsimleştirme" konusu C2 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "38-1",
        title: "İleri Düzey İsimleştirme",
        titleEn: "Advanced Nominalization",
        paragraphs: [
          '"İleri Düzey İsimleştirme" başlığında İleri Düzey İsimleştirme konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. C2 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "This is a useful example.",
            tr: "Bu faydalı bir örnek.",
            note: "İleri Düzey İsimleştirme — örnek 1",
          },
          {
            en: "Topic focus: İleri Düzey İsimleştirme",
            tr: "Konu odağı: İleri Düzey İsimleştirme",
          },
          {
            en: "Subtopic: İleri Düzey İsimleştirme",
            tr: "Alt konu: İleri Düzey İsimleştirme",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "38-ex-38-1-1",
      subtopicId: "38-1",
      type: "multiple_choice",
      prompt: '"İleri Düzey İsimleştirme" alt konusu hangi ana konuya aittir?',
      options: [
        "İleri Düzey İsimleştirme",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "İleri Düzey İsimleştirme" başlığı altındadır.',
    },
    {
      id: "38-ex-38-1-2",
      subtopicId: "38-1",
      type: "multiple_choice",
      prompt:
        'C2 seviyesindeki "İleri Düzey İsimleştirme" için doğru yaklaşım hangisidir?',
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
      id: "38-fb-38-1-1",
      subtopicId: "38-1",
      type: "fill_blank",
      prompt: '"İleri Düzey İsimleştirme" konusu _____ seviyesine uygundur.',
      answer: "C2",
      explanation: "Bu konu C2 seviyesindedir.",
    },
    {
      id: "38-cw-1",
      subtopicId: "38-1",
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
  examExercises: [
    {
      id: "exam-38-38-1-1",
      subtopicId: "38-1",
      type: "multiple_choice",
      prompt: '"İleri Düzey İsimleştirme" alt konusu hangi ana konuya aittir?',
      options: [
        "İleri Düzey İsimleştirme",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "İleri Düzey İsimleştirme" başlığı altındadır.',
    },
    {
      id: "exam-38-38-1-2",
      subtopicId: "38-1",
      type: "multiple_choice",
      prompt:
        'C2 seviyesindeki "İleri Düzey İsimleştirme" için doğru yaklaşım hangisidir?',
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
      id: "exam-38-38-1-3",
      subtopicId: "38-1",
      type: "multiple_choice",
      prompt: '"İleri Düzey İsimleştirme" çalışırken hangisi doğrudur?',
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
      id: "exam-38-level",
      subtopicId: "38-1",
      type: "multiple_choice",
      prompt: '"İleri Düzey İsimleştirme" konusu hangi seviyeye aittir?',
      options: ["C2", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu C2 seviyesindedir.",
    },
  ],
};
