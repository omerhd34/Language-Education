import type {
  SpeakingPromptItem,
  SpeakingSection,
} from "@/data/speakings/types";

const A1_SPEAKING_PROMPTS: SpeakingPromptItem[] = [
  {
    id: "p1",
    prompt: "your hobbies",
    promptTr: "Hobilerin hakkında konuş.",
  },
  {
    id: "p2",
    prompt: "a city you love",
    promptTr: "Sevdiğin bir şehir hakkında konuş.",
  },
  {
    id: "p3",
    prompt: "things you do to relax after a hard day",
    promptTr: "Zor bir günün ardından rahatlamak için yaptıkların.",
  },
  {
    id: "p4",
    prompt: "going on holiday in your country or going on holiday abroad?",
    promptTr: "Kendi ülkende tatil mi, yurt dışında tatil mi?",
  },
  {
    id: "p5",
    prompt:
      "watching a film in your language or watching a film with subtitles?",
    promptTr: "Filmi kendi dilinde mi, altyazılı mı izlersin?",
  },
  {
    id: "p6",
    prompt: "the best way(s) to learn a language",
    promptTr: "Bir dil öğrenmenin en iyi yolu/yolları.",
  },
];

const A1_BOX_PROMPTS: SpeakingPromptItem[] = [
  {
    id: "b1",
    prompt: "somebody you would like to meet",
    promptTr: "Tanışmak istediğin biri.",
  },
  {
    id: "b2",
    prompt: "a person you admire",
    promptTr: "Hayran olduğun bir kişi.",
  },
  {
    id: "b3",
    prompt: "the best holiday you've ever had",
    promptTr: "Şimdiye kadarki en iyi tatilin.",
  },
  {
    id: "b4",
    prompt: "things that are important to do if you go for a job interview",
    promptTr: "İş görüşmesine giderken önemli olan şeyler.",
  },
  {
    id: "b5",
    prompt: "a time when you ate something really horrible",
    promptTr: "Gerçekten kötü bir şey yediğin bir an.",
  },
  {
    id: "b6",
    prompt: "what do you want to do this weekend?",
    promptTr: "Bu hafta sonu ne yapmak istiyorsun?",
  },
];

const A1_CARD_PROMPTS: SpeakingPromptItem[] = [
  {
    id: "c1",
    prompt: "buying things in a shop or buying things online?",
    promptTr: "Mağazadan mı, internetten mi alışveriş?",
  },
  {
    id: "c2",
    prompt: "something important to teach children",
    promptTr: "Çocuklara öğretilmesi önemli bir şey.",
  },
  {
    id: "c3",
    prompt: "a time you found something in the street",
    promptTr: "Sokakta bir şey bulduğun bir an.",
  },
  {
    id: "c4",
    prompt: "your favourite food and why you like it",
    promptTr: "En sevdiğin yemek ve neden sevdiğin.",
  },
  {
    id: "c5",
    prompt: "a sport you enjoy watching or playing",
    promptTr: "İzlemeyi veya oynamayı sevdiğin bir spor.",
  },
  {
    id: "c6",
    prompt: "how you usually spend your evenings",
    promptTr: "Akşamlarını genelde nasıl geçirirsin?",
  },
];

export const a1SpeakingSections: SpeakingSection[] = [
  {
    id: "a1-speaking-activity",
    level: "A1",
    title: "Konuşma etkinliği",
    titleEn: "Speaking activity",
    summary:
      "Plan an evening English speaking practice with a friend in a short chat.",
    summaryTr:
      "Bir arkadaşınla akşam İngilizce konuşma pratiğini mesajla planlama.",
    model: {
      contactName: "Ömer Halis",
      contactStatus: "online",
      messages: [
        {
          id: "m1",
          sender: "them",
          time: "18:02",
          text: "Hi! Are you free to practise speaking tonight?",
          textTr: "Selam! Bu akşam konuşma pratiği yapmak ister misin?",
        },
        {
          id: "m2",
          sender: "me",
          time: "18:03",
          text: "Yes, sure. What should we talk about?",
          textTr: "Evet, tabii. Ne hakkında konuşalım?",
        },
        {
          id: "m3",
          sender: "them",
          time: "18:04",
          text: "Let's pick a random topic. Take two minutes to think, then speak for two minutes.",
          textTr:
            "Rastgele bir konu seçelim. İki dakika düşün, sonra iki dakika konuş.",
        },
        {
          id: "m4",
          sender: "me",
          time: "18:05",
          text: "OK. I'll try to use simple sentences and speak clearly.",
          textTr: "Tamam. Basit cümleler kurup net konuşmaya çalışacağım.",
        },
        {
          id: "m5",
          sender: "them",
          time: "18:06",
          text: "Great! Don't worry about small mistakes. Just keep going.",
          textTr: "Harika! Küçük hatalar için endişelenme. Konuşmaya devam et.",
        },
        {
          id: "m6",
          sender: "me",
          time: "18:07",
          text: "Thanks. Ready when you are!",
          textTr: "Teşekkürler. Hazırım!",
        },
      ],
    },
    practice: {
      wheel: {
        id: "wheel-1",
        instruction:
          "Spin the wheel and speak about the topic for two minutes.",
        instructionTr: "Çarkı çevir ve çıkan konu hakkında iki dakika konuş.",
        items: A1_SPEAKING_PROMPTS,
        hint: "Her konu için önce kısa not al, sonra yüksek sesle konuş.",
      },
      openBox: {
        id: "box-1",
        instruction: "Open a box, read the question and answer it aloud.",
        instructionTr: "Bir kutuya dokun, soruyu oku ve yüksek sesle yanıtla.",
        items: A1_BOX_PROMPTS,
        hint: "Kutuları sırayla veya rastgele açabilirsin.",
      },
      randomCards: {
        id: "cards-1",
        instruction:
          "Shuffle the deck, deal a card and speak about the prompt.",
        instructionTr: "Desteyi karıştır, kart çek ve konu hakkında konuş.",
        items: A1_CARD_PROMPTS,
        hint: "Tüm kartlar bitene kadar devam et.",
      },
      anagram: [
        {
          id: "anagram-1",
          hint: "Kelime sırasını çöz; oluşan cümle konuşma konusun olsun.",
          speakWhenDone: "What do you want to do this weekend?",
          words: [
            { answer: "what", letters: ["t", "a", "h", "w"] },
            { answer: "do", letters: ["o", "d"] },
            { answer: "you", letters: ["u", "o", "y"] },
            { answer: "want", letters: ["n", "t", "a", "w"] },
            { answer: "to", letters: ["t", "o"] },
            { answer: "do", letters: ["d", "o"] },
            { answer: "this", letters: ["s", "h", "t", "i"] },
            { answer: "weekend", letters: ["k", "e", "e", "n", "w", "e", "d"] },
          ],
        },
        {
          id: "anagram-2",
          hint: "Öğrenmek için kullanabileceğin yöntemleri anlat.",
          speakWhenDone: "the best ways to learn a language",
          words: [
            { answer: "the", letters: ["h", "t", "e"] },
            { answer: "best", letters: ["s", "b", "t", "e"] },
            { answer: "ways", letters: ["w", "a", "s", "y"] },
            { answer: "to", letters: ["o", "t"] },
            { answer: "learn", letters: ["l", "r", "n", "a", "e"] },
            { answer: "a", letters: ["a"] },
            {
              answer: "language",
              letters: ["g", "n", "a", "g", "u", "a", "e", "l"],
            },
          ],
        },
        {
          id: "anagram-3",
          hint: "Rahatlamak için neler yaptığını anlat.",
          speakWhenDone: "things you do to relax",
          words: [
            { answer: "things", letters: ["s", "t", "h", "n", "i", "g"] },
            { answer: "you", letters: ["y", "o", "u"] },
            { answer: "do", letters: ["d", "o"] },
            { answer: "to", letters: ["t", "o"] },
            { answer: "relax", letters: ["x", "e", "r", "a", "l"] },
          ],
        },
      ],
    },
  },
];
