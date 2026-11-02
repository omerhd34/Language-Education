import type { TopicContent } from "@/data/topics/types";

export const topicContent2: TopicContent = {
  topicId: "2",
  lesson: {
    intro:
      '"Selamlaşma" konusu Başlangıç seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "2-1",
        title: "Selamlaşma ve Tanışma",
        paragraphs: [
          '"Selamlaşma ve Tanışma" başlığında Selamlaşma konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. Başlangıç seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "This is a useful example.",
            tr: "Bu faydalı bir örnek.",
            note: "Selamlaşma ve Tanışma — örnek 1",
          },
          {
            en: "Topic focus: Selamlaşma",
            tr: "Konu odağı: Selamlaşma",
          },
          {
            en: "Subtopic: Selamlaşma ve Tanışma",
            tr: "Alt konu: Selamlaşma ve Tanışma",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "2-ex-2-1-1",
      subtopicId: "2-1",
      type: "multiple_choice",
      prompt: '"Selamlaşma ve Tanışma" alt konusu hangi ana konuya aittir?',
      options: [
        "Selamlaşma",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Selamlaşma" başlığı altındadır.',
    },
    {
      id: "2-ex-2-1-2",
      subtopicId: "2-1",
      type: "multiple_choice",
      prompt:
        'Başlangıç seviyesindeki "Selamlaşma ve Tanışma" için doğru yaklaşım hangisidir?',
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
      id: "2-fb-2-1-1",
      subtopicId: "2-1",
      type: "fill_blank",
      prompt: '"Selamlaşma ve Tanışma" konusu _____ seviyesine uygundur.',
      answer: "Başlangıç",
      explanation: "Bu konu Başlangıç seviyesindedir.",
    },
    {
      id: "2-cw-1",
      subtopicId: "2-1",
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
};
