import type { TopicContent } from "@/data/topics/types";

export const topicContent120: TopicContent = {
  "topicId": "120",
  "lesson": {
    "intro": "\"C2 Yeterlilik Sınavı\" konusu C2 seviyesine uygundur. Aşağıdaki alt başlıklarda temel kuralları, örnekleri ve kısa notları bulursun. İçerik geçicidir; ileride zenginleştirilebilir.",
    "sections": [
      {
        "subtopicId": "120-1",
        "title": "C2 Yeterlilik Sınavı",
        "paragraphs": [
          "\"C2 Yeterlilik Sınavı\" başlığında C2 Yeterlilik Sınavı konusunun önemli noktalarını adım adım görürsün.",
          "Bu bölümde kalıpları tanı, örnekleri sesli tekrarla ve ardından alıştırmalara geç. C2 seviyesinde düzenli tekrar yeterlidir.",
          "Bu bir yeterlilik sınavı bölümüdür: önceki konuları hatırlayarak ilerlemeyi hedefle."
        ],
        "examples": [
          {
            "en": "I understand this topic.",
            "tr": "Bu konuyu anlıyorum.",
            "note": "C2 Yeterlilik Sınavı — örnek 1"
          },
          {
            "en": "Topic focus: C2 Yeterlilik Sınavı",
            "tr": "Konu odağı: C2 Yeterlilik Sınavı"
          },
          {
            "en": "Subtopic: C2 Yeterlilik Sınavı",
            "tr": "Alt konu: C2 Yeterlilik Sınavı"
          }
        ]
      }
    ]
  },
  "exercises": [
    {
      "id": "120-ex-120-1-1",
      "subtopicId": "120-1",
      "type": "multiple_choice",
      "prompt": "\"C2 Yeterlilik Sınavı\" alt konusu hangi ana konuya aittir?",
      "options": [
        "C2 Yeterlilik Sınavı",
        "Tamamen farklı bir konu",
        "Sadece kelime listesi",
        "Hiçbiri"
      ],
      "correctIndex": 0,
      "explanation": "Bu alt konu \"C2 Yeterlilik Sınavı\" başlığı altındadır."
    },
    {
      "id": "120-ex-120-1-2",
      "subtopicId": "120-1",
      "type": "multiple_choice",
      "prompt": "C2 seviyesindeki \"C2 Yeterlilik Sınavı\" için doğru yaklaşım hangisidir?",
      "options": [
        "Örnekleri okuyup kısa pratik yapmak",
        "Konuyu tamamen atlamak",
        "Sadece çeviri yapmadan ezberlemek",
        "Hiç alıştırma çözmemek"
      ],
      "correctIndex": 0,
      "explanation": "Örnek + kısa pratik, kalıcı öğrenmeye yardımcı olur."
    },
    {
      "id": "120-fb-120-1-1",
      "subtopicId": "120-1",
      "type": "fill_blank",
      "prompt": "\"C2 Yeterlilik Sınavı\" konusu _____ seviyesine uygundur.",
      "answer": "C2",
      "explanation": "Bu konu C2 seviyesindedir."
    },
    {
      "id": "120-cw-1",
      "subtopicId": "120-1",
      "type": "crossword",
      "rows": 3,
      "cols": 5,
      "clues": [
        {
          "number": 1,
          "direction": "across",
          "text": "3 sayısı İngilizcede",
          "answer": "THREE",
          "row": 0,
          "col": 0
        },
        {
          "number": 2,
          "direction": "down",
          "text": "10 sayısı İngilizcede",
          "answer": "TEN",
          "row": 0,
          "col": 0
        },
        {
          "number": 3,
          "direction": "across",
          "text": "9 sayısı İngilizcede",
          "answer": "NINE",
          "row": 2,
          "col": 0
        }
      ]
    }
  ]
};
