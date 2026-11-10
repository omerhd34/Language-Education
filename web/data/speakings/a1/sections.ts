import type {
  SpeakingPromptItem,
  SpeakingSection,
} from "@/data/speakings/types";
import { A1_ANAGRAM_QUESTIONS } from "@/data/speakings/a1/anagrams";

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
  {
    id: "p7",
    prompt: "a person you admire",
    promptTr: "Hayran olduğun bir kişi.",
  },
  {
    id: "p8",
    prompt: "somebody you would like to meet",
    promptTr: "Tanışmak istediğin biri.",
  },
  {
    id: "p9",
    prompt: "the best holiday you've ever had",
    promptTr: "Şimdiye kadarki en iyi tatilin.",
  },
  {
    id: "p10",
    prompt: "things that are important to do if you go for a job interview",
    promptTr: "İş görüşmesinde önemli olan şeyler.",
  },
  {
    id: "p11",
    prompt: "your favourite food or drink",
    promptTr: "En sevdiğin yemek veya içecek.",
  },
  {
    id: "p12",
    prompt: "what do you want to do this weekend?",
    promptTr: "Bu hafta sonu ne yapmak istiyorsun?",
  },
];

const A1_BOX_PROMPTS: SpeakingPromptItem[] = [
  {
    id: "b1",
    prompt: "buying things in a shop or buying things online?",
    promptTr: "Mağazadan mı, internetten mi alışveriş?",
  },
  {
    id: "b2",
    prompt: "something important to teach children",
    promptTr: "Çocuklara öğretilmesi önemli bir şey.",
  },
  {
    id: "b3",
    prompt: "a time you found something in the street",
    promptTr: "Sokakta bir şey bulduğun bir an.",
  },
  {
    id: "b4",
    prompt: "a sport you enjoy watching or playing",
    promptTr: "İzlemeyi veya oynamayı sevdiğin bir spor.",
  },
  {
    id: "b5",
    prompt: "how you usually spend your evenings",
    promptTr: "Akşamlarını genelde nasıl geçirirsin?",
  },
  {
    id: "b6",
    prompt: "a time when you ate something really horrible",
    promptTr: "Gerçekten kötü bir şey yediğin bir an.",
  },
  {
    id: "b7",
    prompt: "your favourite food and why you like it",
    promptTr: "En sevdiğin yemek ve neden sevdiğin.",
  },
  {
    id: "b8",
    prompt: "your family or the people you live with",
    promptTr: "Ailen veya birlikte yaşadığın kişiler.",
  },
  {
    id: "b9",
    prompt: "a song, film or book you really like",
    promptTr: "Gerçekten sevdiğin bir şarkı, film veya kitap.",
  },
  {
    id: "b10",
    prompt: "your morning routine on a typical day",
    promptTr: "Tipik bir günde sabah rutinin.",
  },
  {
    id: "b11",
    prompt: "public transport or driving — which do you prefer?",
    promptTr: "Toplu taşıma mı, araba mı tercih edersin?",
  },
  {
    id: "b12",
    prompt: "a skill you would like to learn in the future",
    promptTr: "Gelecekte öğrenmek istediğin bir beceri.",
  },
];

const A1_CARD_PROMPTS: SpeakingPromptItem[] = [
  {
    id: "c1",
    prompt: "a place you would like to visit",
    promptTr: "Gitmek istediğin bir yer.",
  },
  {
    id: "c2",
    prompt: "your best friend and what you do together",
    promptTr: "En iyi arkadaşın ve birlikte neler yaptığınız.",
  },
  {
    id: "c3",
    prompt: "weather you like and why",
    promptTr: "Sevdiğin hava durumu ve nedeni.",
  },
  {
    id: "c4",
    prompt: "using phones too much — good or bad?",
    promptTr: "Telefonu çok kullanmak — iyi mi, kötü mü?",
  },
  {
    id: "c5",
    prompt: "living in a big city or a small town?",
    promptTr: "Büyük şehirde mi, küçük kasabada mı yaşamak?",
  },
  {
    id: "c6",
    prompt: "a tradition in your country",
    promptTr: "Ülkende bir gelenek.",
  },
  {
    id: "c7",
    prompt: "pets — do you have one or want one?",
    promptTr: "Evcil hayvan — var mı, istiyor musun?",
  },
  {
    id: "c8",
    prompt: "your last birthday or a celebration",
    promptTr: "Son doğum günün veya bir kutlama.",
  },
  {
    id: "c9",
    prompt: "studying alone or in a group?",
    promptTr: "Yalnız mı, grupla mı çalışmak?",
  },
  {
    id: "c10",
    prompt: "music you listen to when you work or study",
    promptTr: "Çalışırken veya ders çalışırken dinlediğin müzik.",
  },
  {
    id: "c11",
    prompt: "a famous person from your country",
    promptTr: "Ülkenden ünlü bir kişi.",
  },
  {
    id: "c12",
    prompt: "something you bought recently and why",
    promptTr: "Yakın zamanda aldığın bir şey ve nedeni.",
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
        instructionTr: "Çarkı çevir ve çıkan konu hakkında 2 dakika konuş.",
        items: A1_SPEAKING_PROMPTS,
        hint: "Her konu için önce kısa not al, sonra yüksek sesle konuş.",
      },
      openBox: {
        id: "box-1",
        instruction: "Open a box and speak about the topic for two minutes.",
        instructionTr:
          "Bir kutuya dokun; çıkan konuda mikrofonla 2 dakika konuş.",
        items: A1_BOX_PROMPTS,
        hint: "Kutuları sırayla veya rastgele açabilirsin.",
      },
      randomCards: {
        id: "cards-1",
        instruction:
          "Shuffle the deck, deal a card and speak about the prompt.",
        instructionTr: "Desteye dokun; çıkan konuda mikrofonla 2 dakika konuş.",
        items: A1_CARD_PROMPTS,
        hint: "Tüm kartlar bitene kadar devam et.",
      },
      anagram: A1_ANAGRAM_QUESTIONS,
    },
  },
];
