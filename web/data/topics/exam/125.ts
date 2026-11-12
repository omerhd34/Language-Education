import type { TopicContent } from "@/data/topics/types";

export const topicContent125: TopicContent = {
  topicId: "125",
  lesson: {
    intro:
      '"B1 Yeterlilik Sınavı" konusu B1 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "125-1",
        title: "B1 Yeterlilik Sınavı",
        titleEn: "B1 Proficiency Exam",
        paragraphs: [
          '"B1 Yeterlilik Sınavı" başlığında B1 Yeterlilik Sınavı konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. B1 seviyesinde düzenli tekrar yeterlidir.",
          "Bu bir yeterlilik sınavı bölümüdür: önceki konuları hatırlayarak ilerlemeyi hedefle.",
        ],
        examples: [
          {
            en: "That sounds correct.",
            tr: "Kulağa doğru geliyor.",
            note: "B1 Yeterlilik Sınavı — örnek 1",
          },
          {
            en: "Topic focus: B1 Yeterlilik Sınavı",
            tr: "Konu odağı: B1 Yeterlilik Sınavı",
          },
          {
            en: "Subtopic: B1 Yeterlilik Sınavı",
            tr: "Alt konu: B1 Yeterlilik Sınavı",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "125-ex-125-1-1",
      subtopicId: "125-1",
      type: "multiple_choice",
      prompt: "\"B1 Yeterlilik Sınavı\" alt konusu hangi ana konuya aittir?",
      options: [
        "B1 Yeterlilik Sınavı",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"B1 Yeterlilik Sınavı\" başlığı altındadır.",
    },
    {
      id: "125-ex-125-1-2",
      subtopicId: "125-1",
      type: "multiple_choice",
      prompt: "B1 seviyesindeki \"B1 Yeterlilik Sınavı\" için doğru yaklaşım hangisidir?",
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
      id: "125-tf-125-1-1",
      subtopicId: "125-1",
      type: "true_false",
      prompt: "\"B1 Yeterlilik Sınavı\" başlığı \"B1 Yeterlilik Sınavı\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"B1 Yeterlilik Sınavı\" konusu altında işlenir.",
    },
    {
      id: "125-fb-125-1-1",
      subtopicId: "125-1",
      type: "fill_blank",
      prompt: "\"B1 Yeterlilik Sınavı\" konusu _____ seviyesine uygundur.",
      answer: "B1",
      explanation: "Bu konu B1 seviyesindedir.",
    },
    {
      id: "125-match-1",
      subtopicId: "125-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "B1 Proficiency Exam",
          right: "B1 Yeterlilik Sınavı",
        },
        {
          left: "B1 level",
          right: "B1 seviyesi",
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
      id: "125-cw-1",
      subtopicId: "125-1",
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
