import type { TopicContent } from "@/data/topics/types";

export const topicContent122: TopicContent = {
  topicId: "122",
  lesson: {
    intro:
      '"Başlangıç Yeterlilik Sınavı" bu seviyenin konularını ölçer. Alfabe, selamlaşma, günler ve saat bilgilerini hatırlayarak ilerle.',
    sections: [
      {
        subtopicId: "122-1",
        title: "Başlangıç Yeterlilik Sınavı",
        paragraphs: [
          "Bu sınav Başlangıç seviyesindeki konuları pekiştirir.",
          "Önceki konuları gözden geçir, ardından alıştırmalara geç.",
          "Sınavı geçince A1 seviyesi açılır.",
        ],
        examples: [
          {
            en: "Hello, my name is Ali.",
            tr: "Merhaba, benim adım Ali.",
            note: "Başlangıç Yeterlilik Sınavı — örnek 1",
          },
          {
            en: "What time is it?",
            tr: "Saat kaç?",
          },
          {
            en: "Today is Monday.",
            tr: "Bugün Pazartesi.",
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
      prompt: "İngilizcede \"Merhaba\" karşılığı hangisidir?",
      options: ["Hello", "Goodbye", "Thanks", "Please"],
      correctIndex: 0,
      explanation: "Hello = Merhaba.",
    },
    {
      id: "122-ex-122-1-2",
      subtopicId: "122-1",
      type: "multiple_choice",
      prompt: "\"What is your name?\" ne anlama gelir?",
      options: [
        "Adın ne?",
        "Nerelisin?",
        "Kaç yaşındasın?",
        "Nasılsın?",
      ],
      correctIndex: 0,
      explanation: "What is your name? = Adın ne?",
    },
    {
      id: "122-ex-122-1-3",
      subtopicId: "122-1",
      type: "multiple_choice",
      prompt: "3 sayısı İngilizcede nasıl yazılır?",
      options: ["three", "tree", "free", "there"],
      correctIndex: 0,
      explanation: "3 = three.",
    },
    {
      id: "122-fb-122-1-1",
      subtopicId: "122-1",
      type: "fill_blank",
      prompt: "\"Günaydın\" İngilizcede _____ demektir.",
      answer: "Good morning",
      explanation: "Good morning = Günaydın.",
    },
    {
      id: "122-fb-122-1-2",
      subtopicId: "122-1",
      type: "fill_blank",
      prompt: "Pazartesi İngilizcede _____ olarak yazılır.",
      answer: "Monday",
      explanation: "Monday = Pazartesi.",
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
