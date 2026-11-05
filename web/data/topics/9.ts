import type { TopicContent } from "@/data/topics/types";

export const topicContent9: TopicContent = {
  topicId: "9",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Şimdiki Zaman" konusu A1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "9-1",
        title: "Şimdiki Zaman",
        titleEn: "Present Continuous",
        paragraphs: [
          '"Şimdiki Zaman" başlığında Şimdiki Zaman konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A1 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "Can you repeat that?",
            tr: "Tekrar eder misin?",
            note: "Şimdiki Zaman — örnek 1",
          },
          {
            en: "Topic focus: Şimdiki Zaman",
            tr: "Konu odağı: Şimdiki Zaman",
          },
          {
            en: "Subtopic: Şimdiki Zaman",
            tr: "Alt konu: Şimdiki Zaman",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "9-ex-9-1-1",
      subtopicId: "9-1",
      type: "multiple_choice",
      prompt: '"Şimdiki Zaman" alt konusu hangi ana konuya aittir?',
      options: [
        "Şimdiki Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Şimdiki Zaman" başlığı altındadır.',
    },
    {
      id: "9-ex-9-1-2",
      subtopicId: "9-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "Şimdiki Zaman" için doğru yaklaşım hangisidir?',
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
      id: "9-fb-9-1-1",
      subtopicId: "9-1",
      type: "fill_blank",
      prompt: '"Şimdiki Zaman" konusu _____ seviyesine uygundur.',
      answer: "A1",
      explanation: "Bu konu A1 seviyesindedir.",
    },
    {
      id: "9-cw-1",
      subtopicId: "9-1",
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
      id: "exam-9-9-1-1",
      subtopicId: "9-1",
      type: "multiple_choice",
      prompt: '"Şimdiki Zaman" alt konusu hangi ana konuya aittir?',
      options: [
        "Şimdiki Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Şimdiki Zaman" başlığı altındadır.',
    },
    {
      id: "exam-9-9-1-2",
      subtopicId: "9-1",
      type: "multiple_choice",
      prompt:
        'A1 seviyesindeki "Şimdiki Zaman" için doğru yaklaşım hangisidir?',
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
      id: "exam-9-9-1-3",
      subtopicId: "9-1",
      type: "multiple_choice",
      prompt: '"Şimdiki Zaman" çalışırken hangisi doğrudur?',
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
      id: "exam-9-level",
      subtopicId: "9-1",
      type: "multiple_choice",
      prompt: '"Şimdiki Zaman" konusu hangi seviyeye aittir?',
      options: ["A1", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A1 seviyesindedir.",
    },
  ],
};
