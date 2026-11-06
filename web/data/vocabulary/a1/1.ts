import type { VocabularyCategory } from "@/data/vocabulary/types";

export const vocabularyCategory1: VocabularyCategory = {
  id: "1",
  title: "Selamlaşma & Vedalaşma",
  words: [
    {
      id: "1-1",
      en: "Hello",
      tr: "Merhaba",
      // image: "/vocabulary/a1/hello.webp",
      similar: [
        {
          en: "hi",
          tr: "selam",
          example: {
            en: "Hi! How are you?",
            tr: "Selam! Nasılsın?",
          },
        },
        {
          en: "hey",
          tr: "hey",
          example: {
            en: "Hey, wait for me!",
            tr: "Hey, beni bekle!",
          },
        },
      ],
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
      similar: [
        {
          en: "hello",
          tr: "merhaba",
          example: {
            en: "Hello, nice to meet you.",
            tr: "Merhaba, tanıştığımıza memnun oldum.",
          },
        },
        {
          en: "hey",
          tr: "hey",
          example: {
            en: "Hey, are you ready?",
            tr: "Hey, hazır mısın?",
          },
        },
      ],
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
      en: "Goodbye",
      tr: "Hoşça kal",
      similar: [
        {
          en: "bye",
          tr: "hoşça kal",
          example: {
            en: "Bye! See you tomorrow.",
            tr: "Hoşça kal! Yarın görüşürüz.",
          },
        },
        {
          en: "see you",
          tr: "görüşürüz",
          example: {
            en: "I have to go. See you!",
            tr: "Gitmem lazım. Görüşürüz!",
          },
        },
      ],
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
      id: "1-10",
      en: "Bye",
      tr: "Hoşça kal / Güle güle",
      similar: [
        {
          en: "goodbye",
          tr: "hoşça kal",
          example: {
            en: "Goodbye, and take care.",
            tr: "Hoşça kal, kendine iyi bak.",
          },
        },
        {
          en: "see you",
          tr: "görüşürüz",
          example: {
            en: "See you at school!",
            tr: "Okulda görüşürüz!",
          },
        },
      ],
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
      id: "1-11",
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
      id: "1-12",
      en: "Thank you",
      tr: "Teşekkür ederim",
      similar: [
        {
          en: "thanks",
          tr: "teşekkürler",
          example: {
            en: "Thanks for your help.",
            tr: "Yardımın için teşekkürler.",
          },
        },
      ],
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
      id: "1-13",
      en: "Thanks",
      tr: "Teşekkürler",
      similar: [
        {
          en: "thank you",
          tr: "teşekkür ederim",
          example: {
            en: "Thank you for the gift.",
            tr: "Hediye için teşekkür ederim.",
          },
        },
      ],
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
      id: "1-14",
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
      id: "1-15",
      en: "OK",
      tr: "Tamam",
      similar: [
        {
          en: "okay",
          tr: "tamam",
          example: {
            en: "Okay, I understand.",
            tr: "Tamam, anladım.",
          },
        },
        {
          en: "alright",
          tr: "peki",
          example: {
            en: "Alright, let's go.",
            tr: "Peki, gidelim.",
          },
        },
      ],
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
      id: "1-16",
      en: "Yes",
      tr: "Evet",
      similar: [
        {
          en: "yeah",
          tr: "evet",
          example: {
            en: "Yeah, that sounds good.",
            tr: "Evet, kulağa iyi geliyor.",
          },
        },
        {
          en: "sure",
          tr: "tabii",
          example: {
            en: "Sure, I can help you.",
            tr: "Tabii, sana yardım edebilirim.",
          },
        },
      ],
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
      id: "1-17",
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
      id: "1-18",
      en: "Sorry",
      tr: "Özür dilerim",
      similar: [
        {
          en: "excuse me",
          tr: "affedersiniz",
          example: {
            en: "Excuse me, where is the station?",
            tr: "Affedersiniz, istasyon nerede?",
          },
        },
        {
          en: "apologies",
          tr: "özürler",
          example: {
            en: "Apologies for the delay.",
            tr: "Gecikme için özürler.",
          },
        },
      ],
      examples: [
        { en: "Sorry, I am late.", tr: "Özür dilerim, geç kaldım." },
        { en: "Sorry for the mistake.", tr: "Hata için özür dilerim." },
        { en: "I am sorry if I hurt you.", tr: "Seni üzdüysem özür dilerim." },
      ],
    },
  ],
};
