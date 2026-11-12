import type { TopicContent } from "@/data/topics/types";

export const topicContent124: TopicContent = {
  topicId: "124",
  lesson: {
    intro:
      '"A2 Yeterlilik Sınavı" konusu A2 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "124-1",
        title: "A2 Yeterlilik Sınavı",
        titleEn: "A2 Proficiency Exam",
        paragraphs: [
          '"A2 Yeterlilik Sınavı" başlığında A2 Yeterlilik Sınavı konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A2 seviyesinde düzenli tekrar yeterlidir.",
          "Bu bir yeterlilik sınavı bölümüdür: önceki konuları hatırlayarak ilerlemeyi hedefle.",
        ],
        examples: [
          {
            en: "I use this every day.",
            tr: "Bunu her gün kullanırım.",
            note: "A2 Yeterlilik Sınavı — örnek 1",
          },
          {
            en: "Topic focus: A2 Yeterlilik Sınavı",
            tr: "Konu odağı: A2 Yeterlilik Sınavı",
          },
          {
            en: "Subtopic: A2 Yeterlilik Sınavı",
            tr: "Alt konu: A2 Yeterlilik Sınavı",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "124-ex-124-1-1",
      subtopicId: "124-1",
      type: "multiple_choice",
      prompt: "\"A2 Yeterlilik Sınavı\" alt konusu hangi ana konuya aittir?",
      options: [
        "A2 Yeterlilik Sınavı",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"A2 Yeterlilik Sınavı\" başlığı altındadır.",
    },
    {
      id: "124-ex-124-1-2",
      subtopicId: "124-1",
      type: "multiple_choice",
      prompt: "A2 seviyesindeki \"A2 Yeterlilik Sınavı\" için doğru yaklaşım hangisidir?",
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
      id: "124-tf-124-1-1",
      subtopicId: "124-1",
      type: "true_false",
      prompt: "\"A2 Yeterlilik Sınavı\" başlığı \"A2 Yeterlilik Sınavı\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"A2 Yeterlilik Sınavı\" konusu altında işlenir.",
    },
    {
      id: "124-fb-124-1-1",
      subtopicId: "124-1",
      type: "fill_blank",
      prompt: "\"A2 Yeterlilik Sınavı\" konusu _____ seviyesine uygundur.",
      answer: "A2",
      explanation: "Bu konu A2 seviyesindedir.",
    },
    {
      id: "124-match-1",
      subtopicId: "124-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "A2 Proficiency Exam",
          right: "A2 Yeterlilik Sınavı",
        },
        {
          left: "A2 level",
          right: "A2 seviyesi",
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
      id: "124-cw-1",
      subtopicId: "124-1",
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
