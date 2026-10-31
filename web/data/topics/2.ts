import type { TopicContent } from "@/data/topics/types";

export const topicContent2: TopicContent = {
  topicId: "2",
  lesson: {
    intro:
      '"Selamlaşma, Günler ve Saat" konusu A0 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.',
    sections: [
      {
        subtopicId: "2-1",
        title: "Selamlaşma ve Tanışma",
        paragraphs: [
          '"Selamlaşma ve Tanışma" başlığında Selamlaşma, Günler ve Saat konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A0 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "This is a useful example.",
            tr: "Bu faydalı bir örnek.",
            note: "Selamlaşma ve Tanışma — örnek 1",
          },
          {
            en: "Topic focus: Selamlaşma, Günler ve Saat",
            tr: "Konu odağı: Selamlaşma, Günler ve Saat",
          },
          {
            en: "Subtopic: Selamlaşma ve Tanışma",
            tr: "Alt konu: Selamlaşma ve Tanışma",
          },
        ],
      },
      {
        subtopicId: "2-2",
        title: "Günler ve Aylar",
        paragraphs: [
          '"Günler ve Aylar" başlığında Selamlaşma, Günler ve Saat konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A0 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "Can you repeat that?",
            tr: "Tekrar eder misin?",
            note: "Günler ve Aylar — örnek 2",
          },
          {
            en: "Topic focus: Selamlaşma, Günler ve Saat",
            tr: "Konu odağı: Selamlaşma, Günler ve Saat",
          },
          {
            en: "Subtopic: Günler ve Aylar",
            tr: "Alt konu: Günler ve Aylar",
          },
        ],
      },
      {
        subtopicId: "2-3",
        title: "Saat Söyleme",
        paragraphs: [
          '"Saat Söyleme" başlığında Selamlaşma, Günler ve Saat konusunun önemli noktalarını adım adım görürsün.',
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. A0 seviyesinde düzenli tekrar yeterlidir.",
          "Kısa not: Anlamadığın bir örneği işaretleyip alıştırmada yeniden dene.",
        ],
        examples: [
          {
            en: "I use this every day.",
            tr: "Bunu her gün kullanırım.",
            note: "Saat Söyleme — örnek 3",
          },
          {
            en: "Topic focus: Selamlaşma, Günler ve Saat",
            tr: "Konu odağı: Selamlaşma, Günler ve Saat",
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
      id: "2-ex-2-1-1",
      subtopicId: "2-1",
      type: "multiple_choice",
      prompt: '"Selamlaşma ve Tanışma" alt konusu hangi ana konuya aittir?',
      options: [
        "Selamlaşma, Günler ve Saat",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Selamlaşma, Günler ve Saat" başlığı altındadır.',
    },
    {
      id: "2-ex-2-1-2",
      subtopicId: "2-1",
      type: "multiple_choice",
      prompt:
        'A0 seviyesindeki "Selamlaşma ve Tanışma" için doğru yaklaşım hangisidir?',
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
      id: "2-ex-2-2-1",
      subtopicId: "2-2",
      type: "multiple_choice",
      prompt: '"Günler ve Aylar" alt konusu hangi ana konuya aittir?',
      options: [
        "Selamlaşma, Günler ve Saat",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Selamlaşma, Günler ve Saat" başlığı altındadır.',
    },
    {
      id: "2-ex-2-2-2",
      subtopicId: "2-2",
      type: "multiple_choice",
      prompt:
        'A0 seviyesindeki "Günler ve Aylar" için doğru yaklaşım hangisidir?',
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
      id: "2-ex-2-3-1",
      subtopicId: "2-3",
      type: "multiple_choice",
      prompt: '"Saat Söyleme" alt konusu hangi ana konuya aittir?',
      options: [
        "Selamlaşma, Günler ve Saat",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri",
      ],
      correctIndex: 0,
      explanation:
        'Bu alt konu "Selamlaşma, Günler ve Saat" başlığı altındadır.',
    },
    {
      id: "2-ex-2-3-2",
      subtopicId: "2-3",
      type: "multiple_choice",
      prompt: 'A0 seviyesindeki "Saat Söyleme" için doğru yaklaşım hangisidir?',
      options: [
        "Örnekleri okuyup kısa pratik yapmak",
        "Konuyu tamamen atlamak",
        "Sadece çeviri yapmadan ezberlemek",
        "Hiç alıştırma çözmemek",
      ],
      correctIndex: 0,
      explanation: "Örnek + kısa pratik, kalıcı öğrenmeye yardımcı olur.",
    },
  ],
};
