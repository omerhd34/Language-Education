import type { TopicContent } from "@/data/grammar/types";

export const topicContent126: TopicContent = {
  topicId: "126",
  lesson: {
    intro:
      '"B2 Yeterlilik Sınavı" konusu B2 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "126-1",
        title: "B2 Yeterlilik Sınavı",
        titleEn: "B2 Proficiency Exam",
        paragraphs: [
          '"B2 Yeterlilik Sınavı" başlığında B2 Yeterlilik Sınavı konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. B2 seviyesinde düzenli tekrar yeterlidir.",
          "Bu bir yeterlilik sınavı bölümüdür: önceki konuları hatırlayarak ilerlemeyi hedefle.",
        ],
        examples: [
          {
            en: "I understand this topic.",
            tr: "Bu konuyu anlıyorum.",
            note: "B2 Yeterlilik Sınavı — örnek 1",
          },
          {
            en: "Topic focus: B2 Yeterlilik Sınavı",
            tr: "Konu odağı: B2 Yeterlilik Sınavı",
          },
          {
            en: "Subtopic: B2 Yeterlilik Sınavı",
            tr: "Alt konu: B2 Yeterlilik Sınavı",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "126-ex-126-1-1",
      subtopicId: "126-1",
      type: "multiple_choice",
      prompt: "\"B2 Yeterlilik Sınavı\" alt konusu hangi ana konuya aittir?",
      options: [
        "B2 Yeterlilik Sınavı",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: "Bu alt konu \"B2 Yeterlilik Sınavı\" başlığı altındadır.",
    },
    {
      id: "126-ex-126-1-2",
      subtopicId: "126-1",
      type: "multiple_choice",
      prompt: "B2 seviyesindeki \"B2 Yeterlilik Sınavı\" için doğru yaklaşım hangisidir?",
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
      id: "126-tf-126-1-1",
      subtopicId: "126-1",
      type: "true_false",
      prompt: "\"B2 Yeterlilik Sınavı\" başlığı \"B2 Yeterlilik Sınavı\" konusunun bir parçasıdır.",
      options: [
        "Doğru",
        "Yanlış",
      ],
      correctIndex: 0,
      explanation: "Bu alt başlık \"B2 Yeterlilik Sınavı\" konusu altında işlenir.",
    },
    {
      id: "126-fb-126-1-1",
      subtopicId: "126-1",
      type: "fill_blank",
      prompt: "\"B2 Yeterlilik Sınavı\" konusu _____ seviyesine uygundur.",
      answer: "B2",
      explanation: "Bu konu B2 seviyesindedir.",
    },
    {
      id: "126-match-1",
      subtopicId: "126-1",
      type: "matching",
      prompt: "İngilizce ifadeleri Türkçe karşılıklarıyla eşleştir.",
      pairs: [
        {
          left: "B2 Proficiency Exam",
          right: "B2 Yeterlilik Sınavı",
        },
        {
          left: "B2 level",
          right: "B2 seviyesi",
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
      id: "126-cw-1",
      subtopicId: "126-1",
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
