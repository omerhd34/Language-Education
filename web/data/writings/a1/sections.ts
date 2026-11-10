import type { WritingSection } from "@/data/writings/types";

export const a1WritingSections: WritingSection[] = [
  {
    id: "a1-late-message",
    level: "A1",
    title: "Geç kalacağını haber veren mesaj",
    titleEn: "A message to say you're late",
    summary:
      "Learn how to write text messages to tell a friend you're going to be late.",
    summaryTr:
      "Bir arkadaşına geç kalacağını yazılı olarak nasıl haber vereceğini öğren.",
    model: {
      contactName: "Ömer Halis",
      contactStatus: "online",
      messages: [
        {
          id: "m1",
          sender: "them",
          time: "15:57",
          text: "I'm running 10 mins late, sorry!",
          textTr: "10 dk geç kalıyorum, kusura bakma!",
        },
        {
          id: "m2",
          sender: "me",
          time: "15:58",
          text: "No problem!",
          textTr: "Sorun değil!",
        },
        {
          id: "m3",
          sender: "them",
          time: "16:07",
          text: "Aargh! Traffic is really bad. I'll be more than 10 mins late now, sorry again!!",
          textTr:
            "Trafik çok kötü. Artık 10 dakikadan fazla geç kalacağım, yine özür dilerim!!",
        },
        {
          id: "m4",
          sender: "me",
          time: "16:08",
          text: "It's OK, don't worry. I'm in the café already so it's fine.",
          textTr: "Tamam, merak etme. Zaten kafedeyim, sorun yok.",
        },
        {
          id: "m5",
          sender: "them",
          time: "16:09",
          text: "This is not my day! I'm here but can't find a place to park. I'm looking for a different car park. Not sure how long I'll be.",
          textTr:
            "Bugün hiç şansım yok! Buradayım ama park yeri bulamıyorum. Başka bir otopark arıyorum. Ne kadar süreceğinden emin değilim.",
        },
        {
          id: "m6",
          sender: "me",
          time: "16:11",
          text: "OK, LMK when you find a place",
          textTr: "Tamam, yer bulunca haber ver",
        },
        {
          id: "m7",
          sender: "me",
          time: "16:11",
          text: "I might get something to eat tho",
          textTr: "Belki bir şeyler yerim",
        },
        {
          id: "m8",
          sender: "them",
          time: "16:13",
          text: "Of course! I'll be as quick as I can",
          textTr: "Tabii ki! Elimden geldiğince çabuk olurum",
        },
        {
          id: "m9",
          sender: "me",
          time: "16:13",
          text: "OK!",
          textTr: "Tamam!",
        },
        {
          id: "m10",
          sender: "them",
          time: "16:16",
          text: "Found one! Be there in 10 mins",
          textTr: "Buldum! 10 dk içinde orada olurum",
        },
        {
          id: "m11",
          sender: "me",
          time: "16:16",
          text: "Well done! See you soon",
          textTr: "Aferin! Yakında görüşürüz",
        },
        {
          id: "m12",
          sender: "them",
          time: "16:17",
          text: "Thx for waiting",
          textTr: "Beklediğin için sağ ol",
        },
      ],
    },
    practice: {
      categorize: {
        id: "prep-late-phrases",
        instruction: "Put the phrases in the correct groups.",
        instructionTr: "İfadeleri doğru gruplara yerleştir.",
        groups: [
          {
            id: "late",
            title: "Phrases for somebody who is late",
            titleTr: "Geç kalan biri için ifadeler",
          },
          {
            id: "waiting",
            title: "Phrases for somebody who is waiting",
            titleTr: "Bekleyen biri için ifadeler",
          },
        ],
        phrases: [
          { id: "p1", text: "Sorry!", groupIndex: 0 },
          { id: "p2", text: "No problem.", groupIndex: 1 },
          { id: "p3", text: "I'll be there in 10 minutes.", groupIndex: 0 },
          { id: "p4", text: "It's fine.", groupIndex: 1 },
          { id: "p5", text: "I'm running late.", groupIndex: 0 },
          { id: "p6", text: "Don't worry.", groupIndex: 1 },
          { id: "p7", text: "It's OK.", groupIndex: 1 },
          { id: "p8", text: "This is not my day.", groupIndex: 0 },
        ],
        hint: "Geç kalan özür diler veya ne zaman geleceğini söyler; bekleyen ise rahatlatır.",
      },
      tips: [
        {
          en: "You don't need to write complete sentences for text messages.",
          tr: "Mesajlarda tam cümle kurmak zorunda değilsin.",
        },
        {
          en: "Use abbreviations like LMK (= let me know) or use emojis to save time writing.",
          tr: "Zaman kazanmak için LMK (= haber ver) gibi kısaltmalar veya emoji kullan.",
        },
        {
          en: "You don't need to use full stops (.) at the end of messages.",
          tr: "Mesajların sonunda nokta (.) koymak zorunda değilsin.",
        },
        {
          en: "Say how many minutes you think you'll need, e.g. I'm running 10 minutes late.",
          tr: "Kaç dakika gecikeceğini yaz; örn. I'm running 10 minutes late.",
        },
        {
          en: "It's good to say sorry and sorry again, but you don't need to say sorry in every message.",
          tr: "Özür dilemek iyidir; ama her mesajda özür dilemek zorunda değilsin.",
        },
      ],
      task1: [
        {
          id: "t1-q1",
          prompt: "What is 'mins' short for?",
          options: ["minimum", "minute", "minutes"],
          correctIndex: 2,
          hint: "İpucu bölümünde ve örnek mesajlarda 'mins' = minutes.",
        },
        {
          id: "t1-q2",
          prompt: "What does 'LMK' mean?",
          options: ["let me know", "look me up", "love my kids"],
          correctIndex: 0,
          hint: "İpucu 2: LMK = let me know.",
        },
        {
          id: "t1-q3",
          prompt: "What does 'Thx' mean in a text message?",
          options: ["thanks", "think", "through"],
          correctIndex: 0,
          hint: "Örnek konuşmanın son mesajına bak.",
        },
        {
          id: "t1-q4",
          prompt:
            "In text messages, do you always need a full stop (.) at the end?",
          options: [
            "Yes, always",
            "No, you don't need to",
            "Only in formal emails",
          ],
          correctIndex: 1,
          hint: "İpucu 3.",
        },
        {
          id: "t1-q5",
          prompt: "Which message is typical when you're late?",
          options: [
            "See you tomorrow",
            "I'm running 10 mins late, sorry!",
            "The weather is nice",
          ],
          correctIndex: 1,
          hint: "Örnek mesajda Ömer Halis ne yazıyor?",
        },
        {
          id: "t1-q6",
          prompt: "'Sorry again!!' suggests the person…",
          options: ["is happy", "is apologising again", "is angry with you"],
          correctIndex: 1,
          hint: "Trafik yüzünden tekrar gecikince ne yazıyor?",
        },
      ],
      task2: [
        {
          id: "t2-q1",
          prompt: "I'm running a bit late, sorry!",
          options: ["Sorry!", "No problem!", "Yes."],
          correctIndex: 1,
          hint: "Bekleyen kişi genelde rahatlatır.",
        },
        {
          id: "t2-q2",
          prompt: "I'll be more than 10 mins late now, sorry again!!",
          options: [
            "It's OK, don't worry.",
            "How old are you?",
            "I don't like coffee.",
          ],
          correctIndex: 0,
          hint: "Örnek konuşmadaki yanıtı hatırla.",
        },
        {
          id: "t2-q3",
          prompt: "Not sure how long I'll be",
          options: [
            "OK, LMK when you find a place",
            "Good night",
            "I'm at school",
          ],
          correctIndex: 0,
          hint: "Park yeri bulunca haber vermesini iste.",
        },
        {
          id: "t2-q4",
          prompt: "Found one! Be there in 10 mins",
          options: ["Well done! See you soon", "See you yesterday", "I'm sad"],
          correctIndex: 0,
          hint: "Örnek konuşmadaki kısa olumlu yanıt.",
        },
        {
          id: "t2-q5",
          prompt: "Thx for waiting",
          options: ["OK!", "Goodbye forever", "Who is Ömer Halis?"],
          correctIndex: 0,
          hint: "Teşekküre kısa bir karşılık yeterli.",
        },
      ],
      task3: [
        {
          id: "t3-q1",
          words: ["10", "late", "mins", "I'm", "running"],
          answer: ["I'm", "running", "10", "mins", "late"],
          hint: "Özne + fiil + süre: I'm running … mins late.",
        },
        {
          id: "t3-q2",
          words: ["there", "Be", "10", "mins", "in"],
          answer: ["Be", "there", "in", "10", "mins"],
          hint: "10 dakika içinde orada olacağını söyle.",
        },
        {
          id: "t3-q3",
          words: ["problem", "No"],
          answer: ["No", "problem"],
          hint: "Bekleyenin kısa rahatlatıcı yanıtı.",
        },
        {
          id: "t3-q4",
          words: ["my", "not", "day", "This", "is"],
          answer: ["This", "is", "not", "my", "day"],
          hint: "Ömer Halis park yeri bulamazken ne diyor?",
        },
        {
          id: "t3-q5",
          words: ["worry", "don't", "It's", "OK,"],
          answer: ["It's", "OK,", "don't", "worry"],
          hint: "Tam günün kötü geçtiği değil; rahatlatma cümlesi.",
        },
        {
          id: "t3-q6",
          words: ["when", "LMK", "OK,", "you", "place", "find", "a"],
          answer: ["OK,", "LMK", "when", "you", "find", "a", "place"],
          hint: "Örnek mesajdaki kısa istek.",
        },
      ],
    },
  },
];
