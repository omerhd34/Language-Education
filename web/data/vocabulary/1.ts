import type { VocabularyCategory } from "@/data/vocabulary/types";

export const vocabularyCategory1: VocabularyCategory = {
  id: "1",
  title: "Selamlaşma ve Vedalaşma",
  words: [
    {
      id: "1-1",
      en: "Hello",
      tr: "Merhaba",
      // image: "/vocabulary/hello.webp",
      similar: ["hi", "what's up", "greetings"],
      examples: [
        { en: "Hello! How are you today?", tr: "Merhaba! Bugün nasılsın?" },
        {
          en: "She said hello to everyone in the room.",
          tr: "Odadaki herkese merhaba dedi.",
        },
        { en: "Hello, my name is Anna.", tr: "Merhaba, benim adım Anna." },
      ],
    },
    {
      id: "1-2",
      en: "Hi",
      tr: "Selam",
      similar: ["hello", "what's up", "greetings"],
      examples: [
        { en: "Hi! Nice to see you.", tr: "Selam! Seni görmek güzel." },
        {
          en: "Hi, are you free this evening?",
          tr: "Selam, bu akşam müsait misin?",
        },
        { en: "He waved and said hi.", tr: "El sallayıp selam dedi." },
      ],
    },
    {
      id: "1-3",
      en: "Greetings",
      tr: "Selamlar",
      similar: ["hi", "hello", "what's up"],
      examples: [
        {
          en: "Greetings from Istanbul!",
          tr: "İstanbul'dan selamlar!",
        },
        {
          en: "Please send my greetings to your family.",
          tr: "Lütfen aileme selamlarımı ilet.",
        },
        {
          en: "He began his speech with warm greetings.",
          tr: "Konuşmasına sıcak selamlarla başladı.",
        },
      ],
    },
    {
      id: "1-4",
      en: "What's up",
      tr: "Naber?",
      similar: ["hi", "hello", "greetings"],
      examples: [
        {
          en: "Hey! What's up?",
          tr: "Hey! Ne haber?",
        },
        {
          en: "What's up with the meeting today?",
          tr: "Bugünkü toplantıda ne haber?",
        },
        {
          en: "Nothing much. What's up with you?",
          tr: "Bir şey yok. Sende ne haber?",
        },
      ],
    },
    {
      id: "1-5",
      en: "Good morning",
      tr: "Günaydın",
      examples: [
        {
          en: "Good morning! Did you sleep well?",
          tr: "Günaydın! İyi uyudun mu?",
        },
        {
          en: "I always say good morning to my neighbors.",
          tr: "Komşularıma her zaman günaydın derim.",
        },
        {
          en: "Good morning, class. Please sit down.",
          tr: "Günaydın sınıf. Lütfen oturun.",
        },
      ],
    },
    {
      id: "1-6",
      en: "Good afternoon",
      tr: "İyi günler",
      examples: [
        {
          en: "Good afternoon! How may I help you?",
          tr: "İyi günler! Size nasıl yardımcı olabilirim?",
        },
        {
          en: "Good afternoon, I have an appointment at two.",
          tr: "İyi günler, saat ikide randevum var.",
        },
        { en: "Good afternoon, everyone.", tr: "Herkese iyi günler." },
      ],
    },
    {
      id: "1-7",
      en: "Good evening",
      tr: "İyi akşamlar",
      examples: [
        {
          en: "Good evening! Welcome to our restaurant.",
          tr: "İyi akşamlar! Restoranımıza hoş geldiniz.",
        },
        {
          en: "Good evening, ladies and gentlemen.",
          tr: "İyi akşamlar, bayanlar ve baylar.",
        },
        {
          en: "They greeted us with a warm good evening.",
          tr: "Bizi sıcak bir iyi akşamlar ile karşıladılar.",
        },
      ],
    },
    {
      id: "1-8",
      en: "Good night",
      tr: "İyi geceler",
      examples: [
        { en: "Good night! Sleep well.", tr: "İyi geceler! İyi uyu." },
        {
          en: "She kissed her child and said good night.",
          tr: "Çocuğunu öptü ve iyi geceler dedi.",
        },
        {
          en: "Good night, see you tomorrow.",
          tr: "İyi geceler, yarın görüşürüz.",
        },
      ],
    },
    {
      id: "1-9",
      en: "How are you?",
      tr: "Nasılsın?",
      examples: [
        { en: "Hi Tom, how are you?", tr: "Merhaba Tom, nasılsın?" },
        {
          en: "How are you after the long trip?",
          tr: "Uzun yolculuktan sonra nasılsın?",
        },
        {
          en: "How are you? I missed you.",
          tr: "Nasılsın? Seni özledim.",
        },
      ],
    },
    {
      id: "1-10",
      en: "I'm fine",
      tr: "İyiyim",
      examples: [
        {
          en: "Thanks for asking — I'm fine.",
          tr: "Sorduğun için teşekkürler — iyiyim.",
        },
        {
          en: "I'm fine, just a little tired.",
          tr: "İyiyim, sadece biraz yorgunum.",
        },
        { en: "Tell your mom I'm fine.", tr: "Annene iyiyim de." },
      ],
    },
    {
      id: "1-11",
      en: "Nice to meet you",
      tr: "Tanıştığımıza memnun oldum",
      examples: [
        {
          en: "Nice to meet you, Sarah.",
          tr: "Tanıştığımıza memnun oldum, Sarah.",
        },
        {
          en: "It was nice to meet you at the conference.",
          tr: "Konferansta tanıştığımıza memnun oldum.",
        },
        {
          en: "Nice to meet you too!",
          tr: "Ben de tanıştığımıza memnun oldum!",
        },
      ],
    },
    {
      id: "1-12",
      en: "See you",
      tr: "Görüşürüz",
      examples: [
        {
          en: "I have to go now. See you!",
          tr: "Şimdi gitmem lazım. Görüşürüz!",
        },
        { en: "See you at school tomorrow.", tr: "Yarın okulda görüşürüz." },
        { en: "Okay, see you!", tr: "Tamam, görüşürüz!" },
      ],
    },
    {
      id: "1-13",
      en: "See you later",
      tr: "Sonra görüşürüz",
      examples: [
        {
          en: "I am busy now. See you later.",
          tr: "Şu an meşgulüm. Sonra görüşürüz.",
        },
        { en: "See you later at the café.", tr: "Sonra kafede görüşürüz." },
        { en: "Alright, see you later!", tr: "Peki, sonra görüşürüz!" },
      ],
    },
    {
      id: "1-14",
      en: "Goodbye",
      tr: "Hoşça kal",
      similar: ["bye", "later", "see you", "take care"],
      examples: [
        { en: "Goodbye! Have a safe trip.", tr: "Hoşça kal! İyi yolculuklar." },
        {
          en: "They said goodbye at the station.",
          tr: "İstasyonda hoşça kal dediler.",
        },
        { en: "Goodbye for now.", tr: "Şimdilik hoşça kal." },
      ],
    },
    {
      id: "1-15",
      en: "Bye",
      tr: "Hoşça kal / Güle güle",
      examples: [
        { en: "Bye! Call me tonight.", tr: "Hoşça kal! Bu gece beni ara." },
        {
          en: "She shouted bye from the car.",
          tr: "Arabadan güle güle diye bağırdı.",
        },
        {
          en: "Bye everyone, I am leaving.",
          tr: "Herkese hoşça kal, gidiyorum.",
        },
      ],
    },
    {
      id: "1-16",
      en: "Take care",
      tr: "Kendine iyi bak",
      examples: [
        {
          en: "It is cold outside. Take care!",
          tr: "Dışarısı soğuk. Kendine iyi bak!",
        },
        {
          en: "Take care of yourself during the exams.",
          tr: "Sınavlar sırasında kendine iyi bak.",
        },
        { en: "Bye, take care!", tr: "Hoşça kal, kendine iyi bak!" },
      ],
    },
    {
      id: "1-17",
      en: "Welcome",
      tr: "Hoş geldin",
      examples: [
        { en: "Welcome to our home!", tr: "Evimize hoş geldin!" },
        {
          en: "You are always welcome here.",
          tr: "Burada her zaman hoş geldin.",
        },
        { en: "Welcome back to class.", tr: "Sınıfa tekrar hoş geldin." },
      ],
    },
    {
      id: "1-18",
      en: "Thank you",
      tr: "Teşekkür ederim",
      examples: [
        {
          en: "Thank you for your help.",
          tr: "Yardımın için teşekkür ederim.",
        },
        { en: "Thank you so much!", tr: "Çok teşekkür ederim!" },
        {
          en: "I want to say thank you to my teacher.",
          tr: "Öğretmenime teşekkür ederim demek istiyorum.",
        },
      ],
    },
    {
      id: "1-19",
      en: "Thanks",
      tr: "Teşekkürler",
      examples: [
        { en: "Thanks for the coffee.", tr: "Kahve için teşekkürler." },
        {
          en: "Thanks, that was kind of you.",
          tr: "Teşekkürler, çok naziktin.",
        },
        {
          en: "Many thanks for the invitation.",
          tr: "Davet için çok teşekkürler.",
        },
      ],
    },
    {
      id: "1-20",
      en: "Please",
      tr: "Lütfen",
      examples: [
        { en: "Please open the window.", tr: "Lütfen pencereyi aç." },
        {
          en: "Can you help me, please?",
          tr: "Lütfen bana yardım edebilir misin?",
        },
        {
          en: "Please wait here for a moment.",
          tr: "Lütfen bir dakika burada bekle.",
        },
      ],
    },
    {
      id: "1-21",
      en: "OK",
      tr: "Tamam",
      examples: [
        {
          en: "OK, I will meet you at five.",
          tr: "Tamam, seninle saat beşte buluşacağım.",
        },
        { en: "Is everything OK?", tr: "Her şey tamam mı?" },
        { en: "OK, let's start the lesson.", tr: "Tamam, derse başlayalım." },
      ],
    },
    {
      id: "1-22",
      en: "Yes",
      tr: "Evet",
      examples: [
        {
          en: "Yes, I understand the question.",
          tr: "Evet, soruyu anlıyorum.",
        },
        { en: "Yes, she is my sister.", tr: "Evet, o benim kız kardeşim." },
        {
          en: "Would you like tea? Yes, please.",
          tr: "Çay ister misin? Evet, lütfen.",
        },
      ],
    },
    {
      id: "1-23",
      en: "No",
      tr: "Hayır",
      examples: [
        { en: "No, I do not need help.", tr: "Hayır, yardıma ihtiyacım yok." },
        { en: "No, thank you.", tr: "Hayır, teşekkürler." },
        {
          en: "Is it raining? No, it is sunny.",
          tr: "Yağmur yağıyor mu? Hayır, güneşli.",
        },
      ],
    },
    {
      id: "1-24",
      en: "Sorry",
      tr: "Özür dilerim",
      examples: [
        { en: "Sorry, I am late.", tr: "Özür dilerim, geç kaldım." },
        { en: "Sorry for the mistake.", tr: "Hata için özür dilerim." },
        { en: "I am sorry if I hurt you.", tr: "Seni üzdüysem özür dilerim." },
      ],
    },
  ],
};
