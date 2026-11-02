import type { TopicContent } from "@/data/topics/types";

export const topicContent121: TopicContent = {
  topicId: "121",
  lesson: {
    intro:
      '"Günler ve Saat" konusu Başlangıç seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "121-1",
        title: "Günler ve Aylar",
        paragraphs: [
          '"Günler ve Aylar" başlığında Günler ve Saat konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. Başlangıç seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "Can you repeat that?",
            tr: "Tekrar eder misin?",
            note: "Günler ve Aylar — örnek 1",
          },
          {
            en: "Topic focus: Günler ve Saat",
            tr: "Konu odağı: Günler ve Saat",
          },
          {
            en: "Subtopic: Günler ve Aylar",
            tr: "Alt konu: Günler ve Aylar",
          },
        ],
      },
      {
        subtopicId: "121-2",
        title: "Saat Söyleme",
        paragraphs: [
          '"Saat Söyleme" başlığında Günler ve Saat konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. Başlangıç seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I use this every day.",
            tr: "Bunu her gün kullanırım.",
            note: "Saat Söyleme — örnek 2",
          },
          {
            en: "Topic focus: Günler ve Saat",
            tr: "Konu odağı: Günler ve Saat",
          },
          {
            en: "Subtopic: Saat Söyleme",
            tr: "Alt konu: Saat Söyleme",
          },
        ],
      },
    ],
  },
  exercises: [
    {
      id: "121-ex-121-1-1",
      subtopicId: "121-1",
      type: "multiple_choice",
      prompt: '"Günler ve Aylar" alt konusu hangi ana konuya aittir?',
      options: [
        "Günler ve Saat",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Günler ve Saat" başlığı altındadır.',
    },
    {
      id: "121-ex-121-1-2",
      subtopicId: "121-1",
      type: "multiple_choice",
      prompt:
        'Başlangıç seviyesindeki "Günler ve Aylar" için doğru yaklaşım hangisidir?',
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
      id: "121-fb-121-1-1",
      subtopicId: "121-1",
      type: "fill_blank",
      prompt: '"Günler ve Aylar" konusu _____ seviyesine uygundur.',
      answer: "Başlangıç",
      explanation: "Bu konu Başlangıç seviyesindedir.",
    },
    {
      id: "121-ex-121-2-1",
      subtopicId: "121-2",
      type: "multiple_choice",
      prompt: '"Saat Söyleme" alt konusu hangi ana konuya aittir?',
      options: [
        "Günler ve Saat",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation: 'Bu alt konu "Günler ve Saat" başlığı altındadır.',
    },
    {
      id: "121-ex-121-2-2",
      subtopicId: "121-2",
      type: "multiple_choice",
      prompt:
        'Başlangıç seviyesindeki "Saat Söyleme" için doğru yaklaşım hangisidir?',
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
      id: "121-fb-121-2-1",
      subtopicId: "121-2",
      type: "fill_blank",
      prompt: '"Saat Söyleme" konusu _____ seviyesine uygundur.',
      answer: "Başlangıç",
      explanation: "Bu konu Başlangıç seviyesindedir.",
    },
  ],
};
