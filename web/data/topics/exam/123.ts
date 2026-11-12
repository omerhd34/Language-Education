import type { TopicContent } from "@/data/topics/types";

export const topicContent123: TopicContent = {
  topicId: "123",
  lesson: {
    intro:
      '"A1 Yeterlilik Sınavı" konusu A1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "123-1",
        title: "A1 Yeterlilik Sınavı",
        titleEn: "A1 Proficiency Exam",
        paragraphs: [
          '"A1 Yeterlilik Sınavı" başlığında A1 Yeterlilik Sınavı konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A1 seviyesinde düzenli tekrar yeterlidir.",
          "Bu bir yeterlilik sınavı bölümüdür: önceki konuları hatırlayarak ilerlemeyi hedefle.",
        ],
        examples: [
          {
            en: "Can you repeat that?",
            tr: "Tekrar eder misin?",
            note: "A1 Yeterlilik Sınavı — örnek 1",
          },
          {
            en: "Topic focus: A1 Yeterlilik Sınavı",
            tr: "Konu odağı: A1 Yeterlilik Sınavı",
          },
          {
            en: "Subtopic: A1 Yeterlilik Sınavı",
            tr: "Alt konu: A1 Yeterlilik Sınavı",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "123-ex-123-1-1",
      subtopicId: "123-1",
      type: "multiple_choice",
      prompt: "\"A1 Yeterlilik Sınavı\" alt konusu hangi ana konuya aittir?",
      options: [
        "A1 Yeterlilik Sınavı",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"A1 Yeterlilik Sınavı\" başlığı altındadır.",
    },
    {
      id: "123-ex-123-1-2",
      subtopicId: "123-1",
      type: "multiple_choice",
      prompt: "A1 seviyesindeki \"A1 Yeterlilik Sınavı\" için doğru yaklaşım hangisidir?",
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
      id: "123-tf-123-1-1",
      subtopicId: "123-1",
      type: "true_false",
      prompt: "\"A1 Yeterlilik Sınavı\" başlığı \"A1 Yeterlilik Sınavı\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"A1 Yeterlilik Sınavı\" konusu altında işlenir.",
    },
    {
      id: "123-fb-123-1-1",
      subtopicId: "123-1",
      type: "fill_blank",
      prompt: "\"A1 Yeterlilik Sınavı\" konusu _____ seviyesine uygundur.",
      answer: "A1",
      explanation: "Bu konu A1 seviyesindedir.",
    },
    {
      id: "123-match-1",
      subtopicId: "123-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "A1 Proficiency Exam",
          right: "A1 Yeterlilik Sınavı",
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
      id: "123-cw-1",
      subtopicId: "123-1",
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
