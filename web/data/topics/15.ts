import type { TopicContent } from "@/data/topics/types";

export const topicContent15: TopicContent = {
  topicId: "15",
  viewMinutes: 10,
  lesson: {
    intro:
      '"Yakın Geçmiş Zaman" konusu A2 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "15-1",
        title: "Yakın Geçmiş Zaman",
        titleEn: "Present Perfect Simple",
        paragraphs: [
          '"Yakın Geçmiş Zaman" başlığında Yakın Geçmiş Zaman konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A2 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "Can you repeat that?",
            tr: "Tekrar eder misin?",
            note: "Yakın Geçmiş Zaman — örnek 1",
          },
          {
            en: "Topic focus: Yakın Geçmiş Zaman",
            tr: "Konu odağı: Yakın Geçmiş Zaman",
          },
          {
            en: "Subtopic: Yakın Geçmiş Zaman",
            tr: "Alt konu: Yakın Geçmiş Zaman",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "15-ex-15-1-1",
      subtopicId: "15-1",
      type: "multiple_choice",
      prompt: '"Yakın Geçmiş Zaman" alt konusu hangi ana konuya aittir?',
      options: [
        "Yakın Geçmiş Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Yakın Geçmiş Zaman" başlığı altındadır.',
    },
    {
      id: "15-ex-15-1-2",
      subtopicId: "15-1",
      type: "multiple_choice",
      prompt:
        'A2 seviyesindeki "Yakın Geçmiş Zaman" için doğru yaklaşım hangisidir?',
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
      id: "15-fb-15-1-1",
      subtopicId: "15-1",
      type: "fill_blank",
      prompt: '"Yakın Geçmiş Zaman" konusu _____ seviyesine uygundur.',
      answer: "A2",
      explanation: "Bu konu A2 seviyesindedir.",
    },
    {
      id: "15-cw-1",
      subtopicId: "15-1",
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
  quizExercises: [
    {
      id: "quiz-15-15-1-1",
      subtopicId: "15-1",
      type: "multiple_choice",
      prompt: '"Yakın Geçmiş Zaman" alt konusu hangi ana konuya aittir?',
      options: [
        "Yakın Geçmiş Zaman",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Yakın Geçmiş Zaman" başlığı altındadır.',
    },
    {
      id: "quiz-15-15-1-2",
      subtopicId: "15-1",
      type: "multiple_choice",
      prompt:
        'A2 seviyesindeki "Yakın Geçmiş Zaman" için doğru yaklaşım hangisidir?',
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
      id: "quiz-15-15-1-3",
      subtopicId: "15-1",
      type: "multiple_choice",
      prompt: '"Yakın Geçmiş Zaman" çalışırken hangisi doğrudur?',
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
      id: "quiz-15-level",
      subtopicId: "15-1",
      type: "multiple_choice",
      prompt: '"Yakın Geçmiş Zaman" konusu hangi seviyeye aittir?',
      options: ["A2", "Yanlış seviye", "Belirsiz", "Seviye yok"],
      correctIndex: 0,
      explanation: "Bu konu A2 seviyesindedir.",
    },
  ],
};
