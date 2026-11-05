import type { TopicContent } from "@/data/topics/types";

export const topicContent122: TopicContent = {
  topicId: "122",
  lesson: {
    intro:
      '"Başlangıç Yeterlilik Sınavı" konusu Başlangıç seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "122-1",
        title: "Başlangıç Yeterlilik Sınavı",
        titleEn: "Starter Proficiency Exam",
        paragraphs: [
          '"Başlangıç Yeterlilik Sınavı" başlığında Başlangıç Yeterlilik Sınavı konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. Başlangıç seviyesinde düzenli tekrar yeterlidir.",
          "Bu bir yeterlilik sınavı bölümüdür: önceki konuları hatırlayarak ilerlemeyi hedefle.",
        ],
        examples: [
          {
            en: "This is a useful example.",
            tr: "Bu faydalı bir örnek.",
            note: "Başlangıç Yeterlilik Sınavı — örnek 1",
          },
          {
            en: "Topic focus: Başlangıç Yeterlilik Sınavı",
            tr: "Konu odağı: Başlangıç Yeterlilik Sınavı",
          },
          {
            en: "Subtopic: Başlangıç Yeterlilik Sınavı",
            tr: "Alt konu: Başlangıç Yeterlilik Sınavı",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "122-ex-122-1-1",
      subtopicId: "122-1",
      type: "multiple_choice",
      prompt:
        '"Başlangıç Yeterlilik Sınavı" alt konusu hangi ana konuya aittir?',
      options: [
        "Başlangıç Yeterlilik Sınavı",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Başlangıç Yeterlilik Sınavı" başlığı altındadır.',
    },
    {
      id: "122-ex-122-1-2",
      subtopicId: "122-1",
      type: "multiple_choice",
      prompt:
        'Başlangıç seviyesindeki "Başlangıç Yeterlilik Sınavı" için doğru yaklaşım hangisidir?',
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
      id: "122-fb-122-1-1",
      subtopicId: "122-1",
      type: "fill_blank",
      prompt: '"Başlangıç Yeterlilik Sınavı" konusu _____ seviyesine uygundur.',
      answer: "Başlangıç",
      explanation: "Bu konu Başlangıç seviyesindedir.",
    },
    {
      id: "122-cw-1",
      subtopicId: "122-1",
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
