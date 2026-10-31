export type CefrLevel = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type DashboardSubtopic = {
  id: string;
  title: string;
  progress: number;
};

export type DashboardTopic = {
  id: string;
  title: string;
  level: CefrLevel;
  isExam?: boolean;
  subtopics: DashboardSubtopic[];
};

export const dashboardTopics: DashboardTopic[] = [
  {
    id: "1",
    title: "Alfabe ve Sayılar",
    level: "A0",
    subtopics: [
      { id: "1-1", title: "Alfabe ve Harflerin Okunuşu", progress: 0 },
      { id: "1-2", title: "Sayılar", progress: 0 },
      { id: "1-3", title: "Telefon Numarası", progress: 0 },
      { id: "1-4", title: "Yaş Söyleme", progress: 0 },
    ],
  },
  {
    id: "2",
    title: "Selamlaşma, Günler ve Saat",
    level: "A0",
    subtopics: [
      { id: "2-1", title: "Selamlaşma ve Tanışma", progress: 0 },
      { id: "2-2", title: "Günler ve Aylar", progress: 0 },
      { id: "2-3", title: "Saat Söyleme", progress: 0 },
    ],
  },
  {
    id: "3",
    title: "Zamirler ve İyelik Sıfatları",
    level: "A1",
    subtopics: [
      { id: "3-1", title: "Özne Zamirleri (I, you, he...)", progress: 0 },
      { id: "3-2", title: "İyelik Sıfatları (my, your, his...)", progress: 0 },
      {
        id: "3-3",
        title: "Zamirler ve İyelik Sıfatları Karışık Alıştırma",
        progress: 0,
      },
    ],
  },
  {
    id: "4",
    title: "To Be (am / is / are)",
    level: "A1",
    subtopics: [
      { id: "4-1", title: "To Be - Olumlu Cümleler", progress: 0 },
      { id: "4-2", title: "To Be - Olumsuz Cümleler", progress: 0 },
      { id: "4-3", title: "To Be - Soru ve Kısa Cevaplar", progress: 0 },
    ],
  },
  {
    id: "5",
    title: "Tanımlıklar: a, an, the",
    level: "A1",
    subtopics: [
      { id: "5-1", title: "A ve An Kullanımı", progress: 0 },
      { id: "5-2", title: "The Kullanımı", progress: 0 },
      { id: "5-3", title: "Tanımlık Kullanılmayan Durumlar", progress: 0 },
    ],
  },
  {
    id: "6",
    title: "Çoğul İsimler",
    level: "A1",
    subtopics: [
      {
        id: "6-1",
        title: "Düzenli Çoğul Kuralları (-s, -es, -ies)",
        progress: 0,
      },
      {
        id: "6-2",
        title: "Düzensiz Çoğullar (man - men, child - children)",
        progress: 0,
      },
      { id: "6-3", title: "Çoğul İsimlerle To Be Kullanımı", progress: 0 },
    ],
  },
  {
    id: "7",
    title: "İşaret Sıfatları (This / That / These / Those)",
    level: "A1",
    subtopics: [
      { id: "7-1", title: "This ve That", progress: 0 },
      { id: "7-2", title: "These ve Those", progress: 0 },
      { id: "7-3", title: "İşaret Sıfatlarıyla Soru ve Cevap", progress: 0 },
    ],
  },
  {
    id: "8",
    title: "Soru Kelimeleri",
    level: "A1",
    subtopics: [
      { id: "8-1", title: "What / Where / Who", progress: 0 },
      { id: "8-2", title: "When / Why / Which", progress: 0 },
      {
        id: "8-3",
        title: "How ve Kalıpları (How old, How much...)",
        progress: 0,
      },
    ],
  },
  {
    id: "9",
    title: "Sahiplik Yapıları",
    level: "A1",
    subtopics: [
      { id: "9-1", title: "Tamlama 's (Tom's book)", progress: 0 },
      { id: "9-2", title: "Whose ve Sahiplik Soruları", progress: 0 },
      {
        id: "9-3",
        title: "Sahiplik Zamirleri (mine, yours, his...)",
        progress: 0,
      },
    ],
  },
  {
    id: "10",
    title: "Sahip Olmak (Have got / Has got)",
    level: "A1",
    subtopics: [
      { id: "10-1", title: "Have got / Has got - Olumlu", progress: 0 },
      { id: "10-2", title: "Have got / Has got - Olumsuz", progress: 0 },
      { id: "10-3", title: "Have got / Has got - Soru ve Cevap", progress: 0 },
    ],
  },
  {
    id: "11",
    title: "Var ve Yok (There is / There are)",
    level: "A1",
    subtopics: [
      { id: "11-1", title: "There is / There are - Olumlu", progress: 0 },
      {
        id: "11-2",
        title: "There isn't / There aren't - Olumsuz",
        progress: 0,
      },
      {
        id: "11-3",
        title: "Is there / Are there - Soru ve Cevap",
        progress: 0,
      },
    ],
  },
  {
    id: "12",
    title: "Yer Edatları",
    level: "A1",
    subtopics: [
      { id: "12-1", title: "In / On / At (Yer ve Konum)", progress: 0 },
      { id: "12-2", title: "Under / Next to / Between", progress: 0 },
      { id: "12-3", title: "Behind / In front of / Opposite", progress: 0 },
    ],
  },
  {
    id: "13",
    title: "Emir ve Teklif (Imperatives & Let's)",
    level: "A1",
    subtopics: [
      { id: "13-1", title: "Emir Cümleleri", progress: 0 },
      { id: "13-2", title: "Olumsuz Emir (Don't)", progress: 0 },
      { id: "13-3", title: "Let's ile Teklif Etme", progress: 0 },
    ],
  },
  {
    id: "14",
    title: "Geniş Zaman (Present Simple)",
    level: "A1",
    subtopics: [
      { id: "14-1", title: "Geniş Zaman - Olumlu Cümleler", progress: 0 },
      { id: "14-2", title: "Geniş Zaman - Olumsuz Cümleler", progress: 0 },
      {
        id: "14-3",
        title: "Geniş Zaman - Soru ve Cevap Cümleleri",
        progress: 0,
      },
    ],
  },
  {
    id: "15",
    title: "Sıklık Zarfları",
    level: "A1",
    subtopics: [
      { id: "15-1", title: "Always / Usually / Often", progress: 0 },
      { id: "15-2", title: "Sometimes / Rarely / Never", progress: 0 },
      { id: "15-3", title: "Sıklık Zarflarının Cümledeki Yeri", progress: 0 },
    ],
  },
  {
    id: "16",
    title: "Zaman Edatları",
    level: "A1",
    subtopics: [
      {
        id: "16-1",
        title: "In - Zaman (aylar, mevsimler, yıllar)",
        progress: 0,
      },
      { id: "16-2", title: "On - Zaman (günler, tarihler)", progress: 0 },
      { id: "16-3", title: "At - Zaman (saatler, özel zamanlar)", progress: 0 },
    ],
  },
  {
    id: "17",
    title: "Nesne Zamirleri",
    level: "A1",
    subtopics: [
      { id: "17-1", title: "Nesne Zamirleri (me, you, him...)", progress: 0 },
      { id: "17-2", title: "Özne ve Nesne Zamirleri Farkı", progress: 0 },
      {
        id: "17-3",
        title: "Fiil ve Edat Sonrası Nesne Zamirleri",
        progress: 0,
      },
    ],
  },
  {
    id: "18",
    title: "Yetenek ve İzin (Can / Can't)",
    level: "A1",
    subtopics: [
      { id: "18-1", title: "Can ile Yetenek", progress: 0 },
      { id: "18-2", title: "Can ile İzin ve Rica", progress: 0 },
      { id: "18-3", title: "Can / Can't - Soru ve Cevap", progress: 0 },
    ],
  },
  {
    id: "19",
    title: "Şimdiki Zaman (Present Continuous)",
    level: "A1",
    subtopics: [
      { id: "19-1", title: "Şimdiki Zaman - Olumlu Cümleler", progress: 0 },
      { id: "19-2", title: "Şimdiki Zaman - Olumsuz Cümleler", progress: 0 },
      {
        id: "19-3",
        title: "Şimdiki Zaman - Soru ve Cevap Cümleleri",
        progress: 0,
      },
    ],
  },
  {
    id: "20",
    title: "Geniş Zaman ve Şimdiki Zaman Karşılaştırması",
    level: "A1",
    subtopics: [
      { id: "20-1", title: "Kullanım Farkları", progress: 0 },
      {
        id: "20-2",
        title: "Zaman Belirteçleri (now, every day...)",
        progress: 0,
      },
      { id: "20-3", title: "Karışık Alıştırmalar", progress: 0 },
    ],
  },
  {
    id: "21",
    title: "Sayılabilir ve Sayılamayan İsimler",
    level: "A1",
    subtopics: [
      { id: "21-1", title: "Sayılabilir İsimler", progress: 0 },
      { id: "21-2", title: "Sayılamayan İsimler", progress: 0 },
      {
        id: "21-3",
        title: "Kap ve Ölçü Birimleri (a glass of, a piece of)",
        progress: 0,
      },
    ],
  },
  {
    id: "22",
    title: "Some / Any",
    level: "A1",
    subtopics: [
      { id: "22-1", title: "Olumlu Cümlelerde Some", progress: 0 },
      { id: "22-2", title: "Olumsuz ve Soru Cümlelerinde Any", progress: 0 },
      { id: "22-3", title: "Some / Any ile Teklif ve Rica", progress: 0 },
    ],
  },
  {
    id: "23",
    title: "Miktar Belirteçleri (Much / Many / A lot of)",
    level: "A1",
    subtopics: [
      { id: "23-1", title: "Many ve Much", progress: 0 },
      { id: "23-2", title: "A lot of / Lots of", progress: 0 },
      { id: "23-3", title: "How much / How many Soruları", progress: 0 },
    ],
  },
  {
    id: "24",
    title: "Sevgi Fiilleri + -ing (Like / Love / Hate)",
    level: "A1",
    subtopics: [
      { id: "24-1", title: "Like / Love / Hate + -ing", progress: 0 },
      { id: "24-2", title: "Olumsuz ve Soru Yapıları", progress: 0 },
      { id: "24-3", title: "Hobiler ve İlgi Alanları", progress: 0 },
    ],
  },
  {
    id: "25",
    title: "Temel Edatlar (From / To / With / Without)",
    level: "A1",
    subtopics: [
      { id: "25-1", title: "From ve To", progress: 0 },
      { id: "25-2", title: "With ve Without", progress: 0 },
      { id: "25-3", title: "Edatlarla Karışık Alıştırma", progress: 0 },
    ],
  },
  {
    id: "26",
    title: "Sıfatlar",
    level: "A1",
    subtopics: [
      { id: "26-1", title: "Temel Sıfatlar ve Zıt Anlamlılar", progress: 0 },
      { id: "26-2", title: "Sıfatın Cümledeki Yeri", progress: 0 },
      { id: "26-3", title: "Renkler, Boyut ve Duygu Sıfatları", progress: 0 },
    ],
  },
  {
    id: "27",
    title: "A1 Yeterlilik Sınavı",
    level: "A1",
    isExam: true,
    subtopics: [{ id: "27-1", title: "A1 Yeterlilik Sınavı", progress: 0 }],
  },
  {
    id: "28",
    title: "Geçmişte Olmak (Was / Were)",
    level: "A2",
    subtopics: [
      { id: "28-1", title: "Was / Were - Olumlu", progress: 0 },
      { id: "28-2", title: "Was / Were - Olumsuz", progress: 0 },
      { id: "28-3", title: "Was / Were - Soru ve Cevap", progress: 0 },
    ],
  },
  {
    id: "29",
    title: "Düzenli Fiiller (Past Simple: Regular)",
    level: "A2",
    subtopics: [
      { id: "29-1", title: "-ed Eki Kuralları", progress: 0 },
      { id: "29-2", title: "Past Simple - Olumsuz (didn't)", progress: 0 },
      { id: "29-3", title: "Past Simple - Soru ve Cevap (Did)", progress: 0 },
    ],
  },
  {
    id: "30",
    title: "Düzensiz Fiiller (Past Simple: Irregular)",
    level: "A2",
    subtopics: [
      { id: "30-1", title: "Sık Kullanılan Düzensiz Fiiller", progress: 0 },
      { id: "30-2", title: "Düzensiz Fiillerde Olumsuz ve Soru", progress: 0 },
      {
        id: "30-3",
        title: "Geçmiş Zaman Belirteçleri (yesterday, ago, last)",
        progress: 0,
      },
    ],
  },
  {
    id: "31",
    title: "Geçmişte Devam Eden Eylem (Past Continuous)",
    level: "A2",
    subtopics: [
      { id: "31-1", title: "Past Continuous - Olumlu", progress: 0 },
      { id: "31-2", title: "Past Continuous - Olumsuz", progress: 0 },
      { id: "31-3", title: "Past Continuous - Soru ve Cevap", progress: 0 },
    ],
  },
  {
    id: "32",
    title: "Past Simple ve Past Continuous Karşılaştırması",
    level: "A2",
    subtopics: [
      { id: "32-1", title: "When ve While Kullanımı", progress: 0 },
      { id: "32-2", title: "Kesilen Eylemler", progress: 0 },
      { id: "32-3", title: "Karışık Alıştırmalar", progress: 0 },
    ],
  },
  {
    id: "33",
    title: "Karşılaştırma Dereceleri (Comparatives)",
    level: "A2",
    subtopics: [
      { id: "33-1", title: "Kısa Sıfatlarda -er", progress: 0 },
      { id: "33-2", title: "Uzun Sıfatlarda more", progress: 0 },
      {
        id: "33-3",
        title: "Düzensiz Karşılaştırmalar ve as ... as",
        progress: 0,
      },
    ],
  },
  {
    id: "34",
    title: "Üstünlük Derecesi (Superlatives)",
    level: "A2",
    subtopics: [
      { id: "34-1", title: "Kısa Sıfatlarda -est", progress: 0 },
      { id: "34-2", title: "Uzun Sıfatlarda the most", progress: 0 },
      { id: "34-3", title: "Düzensiz Üstünlükler (best, worst)", progress: 0 },
    ],
  },
  {
    id: "35",
    title: "Fazlalık ve Yeterlilik (Too / Enough / Very)",
    level: "A2",
    subtopics: [
      { id: "35-1", title: "Too ve Very Farkı", progress: 0 },
      { id: "35-2", title: "Enough Kullanımı", progress: 0 },
      { id: "35-3", title: "Too / Enough + To Yapısı", progress: 0 },
    ],
  },
  {
    id: "36",
    title: "Tarz Zarfları (Adverbs of Manner)",
    level: "A2",
    subtopics: [
      { id: "36-1", title: "Zarf Yapımı (-ly)", progress: 0 },
      { id: "36-2", title: "Düzensiz Zarflar (fast, hard, well)", progress: 0 },
      { id: "36-3", title: "Sıfat ve Zarf Farkı", progress: 0 },
    ],
  },
  {
    id: "37",
    title: "Yakın Gelecek (Be going to)",
    level: "A2",
    subtopics: [
      { id: "37-1", title: "Be going to - Olumlu", progress: 0 },
      { id: "37-2", title: "Be going to - Olumsuz", progress: 0 },
      { id: "37-3", title: "Be going to - Soru ve Cevap", progress: 0 },
    ],
  },
  {
    id: "38",
    title: "Basit Gelecek (Will)",
    level: "A2",
    subtopics: [
      { id: "38-1", title: "Will - Olumlu ve Olumsuz", progress: 0 },
      { id: "38-2", title: "Will - Soru ve Cevap", progress: 0 },
      { id: "38-3", title: "Karar, Tahmin ve Söz Verme", progress: 0 },
    ],
  },
  {
    id: "39",
    title: "Gelecek Zaman Karşılaştırması (Future Forms)",
    level: "A2",
    subtopics: [
      { id: "39-1", title: "Will ve Be going to Farkı", progress: 0 },
      { id: "39-2", title: "Present Continuous ile Gelecek", progress: 0 },
      { id: "39-3", title: "Karışık Alıştırmalar", progress: 0 },
    ],
  },
  {
    id: "40",
    title: "Rica ve İstekler (Would Like & Requests)",
    level: "A2",
    subtopics: [
      { id: "40-1", title: "Would like - Olumlu ve Olumsuz", progress: 0 },
      { id: "40-2", title: "Would like - Soru ve Teklif", progress: 0 },
      {
        id: "40-3",
        title: "Rica ve İstek Kalıpları (I'd like, Can I have)",
        progress: 0,
      },
    ],
  },
  {
    id: "41",
    title: "Zorunluluk ve Tavsiye (Must / Have to / Should)",
    level: "A2",
    subtopics: [
      { id: "41-1", title: "Must ve Mustn't", progress: 0 },
      { id: "41-2", title: "Have to / Don't have to", progress: 0 },
      { id: "41-3", title: "Should / Shouldn't ile Tavsiye", progress: 0 },
    ],
  },
  {
    id: "42",
    title: "Olasılık ve İzin (Could / May / Might)",
    level: "A2",
    subtopics: [
      { id: "42-1", title: "Could / May ile İzin İsteme", progress: 0 },
      { id: "42-2", title: "Might / May ile Olasılık", progress: 0 },
      { id: "42-3", title: "Could ile Geçmişte Yetenek", progress: 0 },
    ],
  },
  {
    id: "43",
    title: "Belgisiz Zamirler (Indefinite Pronouns)",
    level: "A2",
    subtopics: [
      {
        id: "43-1",
        title: "Some- / Any- / No- (somebody, anything)",
        progress: 0,
      },
      { id: "43-2", title: "Every- (everyone, everything)", progress: 0 },
      { id: "43-3", title: "Olumlu, Olumsuz ve Soru Kullanımı", progress: 0 },
    ],
  },
  {
    id: "44",
    title: "Dönüşlü Zamirler (Reflexive Pronouns)",
    level: "A2",
    subtopics: [
      { id: "44-1", title: "myself, yourself, himself...", progress: 0 },
      { id: "44-2", title: "By oneself Kullanımı", progress: 0 },
      { id: "44-3", title: "Dönüşlü ve Nesne Zamiri Farkı", progress: 0 },
    ],
  },
  {
    id: "45",
    title: "Miktar Belirleyiciler (Quantifiers)",
    level: "A2",
    subtopics: [
      { id: "45-1", title: "Few / A few", progress: 0 },
      { id: "45-2", title: "Little / A little", progress: 0 },
      { id: "45-3", title: "All / Most / Some / None", progress: 0 },
    ],
  },
  {
    id: "46",
    title: "Hareket Edatları (Prepositions of Movement)",
    level: "A2",
    subtopics: [
      { id: "46-1", title: "Into / Out of / Through", progress: 0 },
      { id: "46-2", title: "Across / Along / Over", progress: 0 },
      { id: "46-3", title: "Up / Down / Around / Past", progress: 0 },
    ],
  },
  {
    id: "47",
    title: "Temel Bağlaçlar (Basic Conjunctions)",
    level: "A2",
    subtopics: [
      { id: "47-1", title: "And / But / Or", progress: 0 },
      { id: "47-2", title: "Because / So", progress: 0 },
      { id: "47-3", title: "Bağlaçlarla Cümle Birleştirme", progress: 0 },
    ],
  },
  {
    id: "48",
    title: "Eskiden Yapardım (Used to)",
    level: "A2",
    subtopics: [
      { id: "48-1", title: "Used to - Olumlu", progress: 0 },
      { id: "48-2", title: "Used to - Olumsuz ve Soru", progress: 0 },
      { id: "48-3", title: "Used to ve Past Simple Farkı", progress: 0 },
    ],
  },
  {
    id: "49",
    title: "Gerçek Koşullar (Zero & First Conditional)",
    level: "A2",
    subtopics: [
      { id: "49-1", title: "Zero Conditional", progress: 0 },
      { id: "49-2", title: "First Conditional", progress: 0 },
      { id: "49-3", title: "If ve Unless", progress: 0 },
    ],
  },
  {
    id: "50",
    title: "Yakın Geçmiş (Present Perfect: Introduction)",
    level: "A2",
    subtopics: [
      { id: "50-1", title: "Have / Has + Past Participle", progress: 0 },
      { id: "50-2", title: "Olumsuz ve Soru Cümleleri", progress: 0 },
      { id: "50-3", title: "Ever / Never / Already / Yet / Just", progress: 0 },
    ],
  },
  {
    id: "51",
    title: "A2 Yeterlilik Sınavı",
    level: "A2",
    isExam: true,
    subtopics: [{ id: "51-1", title: "A2 Yeterlilik Sınavı", progress: 0 }],
  },
  {
    id: "52",
    title: "Süreklilik (Present Perfect: For / Since)",
    level: "B1",
    subtopics: [
      { id: "52-1", title: "For ile Süre", progress: 0 },
      { id: "52-2", title: "Since ile Başlangıç Noktası", progress: 0 },
      { id: "52-3", title: "How long Soruları", progress: 0 },
    ],
  },
  {
    id: "53",
    title: "Present Perfect ve Past Simple Karşılaştırması",
    level: "B1",
    subtopics: [
      { id: "53-1", title: "Bitmiş ve Devam Eden Zaman", progress: 0 },
      {
        id: "53-2",
        title: "Zaman Belirteçleri (yesterday, ever, since)",
        progress: 0,
      },
      { id: "53-3", title: "Karışık Alıştırmalar", progress: 0 },
    ],
  },
  {
    id: "54",
    title: "Geçmişten Bugüne (Present Perfect Continuous)",
    level: "B1",
    subtopics: [
      { id: "54-1", title: "Present Perfect Continuous - Olumlu", progress: 0 },
      { id: "54-2", title: "Olumsuz ve Soru Cümleleri", progress: 0 },
      {
        id: "54-3",
        title: "Present Perfect ve Present Perfect Continuous Farkı",
        progress: 0,
      },
    ],
  },
  {
    id: "55",
    title: "Süre Edatları (For / During / Since)",
    level: "B1",
    subtopics: [
      { id: "55-1", title: "For ve During Farkı", progress: 0 },
      { id: "55-2", title: "Since ve From ... to", progress: 0 },
      { id: "55-3", title: "Karışık Alıştırmalar", progress: 0 },
    ],
  },
  {
    id: "56",
    title: "Edilgen Çatı (Passive Voice)",
    level: "B1",
    subtopics: [
      { id: "56-1", title: "Present ve Past Simple Passive", progress: 0 },
      { id: "56-2", title: "Passive - Olumsuz ve Soru", progress: 0 },
      { id: "56-3", title: "By ile Fail Belirtme", progress: 0 },
    ],
  },
  {
    id: "57",
    title: "Edilgen Çatı Devamı (Passive: Future & Modals)",
    level: "B1",
    subtopics: [
      { id: "57-1", title: "Will ile Passive", progress: 0 },
      { id: "57-2", title: "Modal Fiillerle Passive", progress: 0 },
      { id: "57-3", title: "Present Perfect Passive", progress: 0 },
    ],
  },
  {
    id: "58",
    title: "Tanımlayıcı İlgi Cümleleri (Defining Relative Clauses)",
    level: "B1",
    subtopics: [
      { id: "58-1", title: "Who / Which / That", progress: 0 },
      { id: "58-2", title: "Whose / Where / When", progress: 0 },
      { id: "58-3", title: "Relative Pronoun'un Düşmesi", progress: 0 },
    ],
  },
  {
    id: "59",
    title: "Ek Bilgi Cümleleri (Non-defining Relative Clauses)",
    level: "B1",
    subtopics: [
      { id: "59-1", title: "Virgül Kullanımı", progress: 0 },
      { id: "59-2", title: "Which ile Cümlenin Tamamına Atıf", progress: 0 },
      { id: "59-3", title: "Defining ve Non-defining Farkı", progress: 0 },
    ],
  },
  {
    id: "60",
    title: "İsim-Fiiller (Gerunds)",
    level: "B1",
    subtopics: [
      { id: "60-1", title: "Özne ve Nesne Olarak Gerund", progress: 0 },
      { id: "60-2", title: "Gerund Alan Fiiller (enjoy, avoid)", progress: 0 },
      { id: "60-3", title: "Edatlardan Sonra Gerund", progress: 0 },
    ],
  },
  {
    id: "61",
    title: "Mastarlar (Infinitives)",
    level: "B1",
    subtopics: [
      { id: "61-1", title: "To + Fiil Kullanımı", progress: 0 },
      { id: "61-2", title: "Amaç Bildiren Infinitive", progress: 0 },
      {
        id: "61-3",
        title: "Infinitive Alan Fiiller (want, decide)",
        progress: 0,
      },
    ],
  },
  {
    id: "62",
    title: "Fiil Kalıpları (Gerund vs Infinitive)",
    level: "B1",
    subtopics: [
      { id: "62-1", title: "Anlam Değiştirmeyen Fiiller", progress: 0 },
      {
        id: "62-2",
        title: "Anlam Değiştiren Fiiller (stop, remember, try)",
        progress: 0,
      },
      { id: "62-3", title: "Karışık Alıştırmalar", progress: 0 },
    ],
  },
  {
    id: "63",
    title: "Hayali Koşullar (Second Conditional)",
    level: "B1",
    subtopics: [
      { id: "63-1", title: "If + Past Simple", progress: 0 },
      { id: "63-2", title: "Were Kullanımı", progress: 0 },
      { id: "63-3", title: "Tavsiye Verme (If I were you)", progress: 0 },
    ],
  },
  {
    id: "64",
    title: "Zaman Bağlaçları I (Time Conjunctions I)",
    level: "B1",
    subtopics: [
      { id: "64-1", title: "Before ve After", progress: 0 },
      { id: "64-2", title: "When ve Whenever", progress: 0 },
      { id: "64-3", title: "While ve As", progress: 0 },
    ],
  },
  {
    id: "65",
    title: "Zaman Bağlaçları II (Time Conjunctions II)",
    level: "B1",
    subtopics: [
      { id: "65-1", title: "As soon as ve Once", progress: 0 },
      { id: "65-2", title: "Until ve By the time", progress: 0 },
      { id: "65-3", title: "Since ve Ever since", progress: 0 },
    ],
  },
  {
    id: "66",
    title: "Ekleme ve Karşıtlık (Additive & Contrast Words)",
    level: "B1",
    subtopics: [
      { id: "66-1", title: "Also / Too / As well / In addition", progress: 0 },
      { id: "66-2", title: "But / However / Although", progress: 0 },
      { id: "66-3", title: "Despite / In spite of / Whereas", progress: 0 },
    ],
  },
  {
    id: "67",
    title: "Soru Ekleri ve Dolaylı Sorular (Question Tags)",
    level: "B1",
    subtopics: [
      { id: "67-1", title: "Question Tags - Olumlu ve Olumsuz", progress: 0 },
      {
        id: "67-2",
        title: "Özel Durumlar (I am, Let's, Emir Cümleleri)",
        progress: 0,
      },
      {
        id: "67-3",
        title: "Dolaylı Sorular (Could you tell me where...)",
        progress: 0,
      },
    ],
  },
  {
    id: "68",
    title: "Dolaylı Anlatım: Temel (Reported Speech I)",
    level: "B1",
    subtopics: [
      { id: "68-1", title: "Reported Statements", progress: 0 },
      { id: "68-2", title: "Zaman ve Zamir Değişimleri", progress: 0 },
      { id: "68-3", title: "Say ve Tell Farkı", progress: 0 },
    ],
  },
  {
    id: "69",
    title: "Çıkarım Modalları (Modals of Deduction)",
    level: "B1",
    subtopics: [
      { id: "69-1", title: "Must ile Kesin Çıkarım", progress: 0 },
      { id: "69-2", title: "Can't ile Kesin Olumsuz Çıkarım", progress: 0 },
      { id: "69-3", title: "Might / May / Could ile Olasılık", progress: 0 },
    ],
  },
  {
    id: "70",
    title: "Derecelendirme (So / Such)",
    level: "B1",
    subtopics: [
      { id: "70-1", title: "So + Sıfat / Zarf", progress: 0 },
      { id: "70-2", title: "Such + İsim", progress: 0 },
      { id: "70-3", title: "So / Such ... That Yapısı", progress: 0 },
    ],
  },
  {
    id: "71",
    title: "-miş'li Geçmiş Zaman (Past Perfect)",
    level: "B1",
    subtopics: [
      { id: "71-1", title: "Past Perfect - Olumlu", progress: 0 },
      { id: "71-2", title: "Past Perfect - Olumsuz ve Soru", progress: 0 },
      { id: "71-3", title: "Past Perfect ve Past Simple Farkı", progress: 0 },
    ],
  },
  {
    id: "72",
    title: "Gelecekte Devam Eden Eylem (Future Continuous)",
    level: "B1",
    subtopics: [
      { id: "72-1", title: "Future Continuous - Olumlu", progress: 0 },
      { id: "72-2", title: "Olumsuz ve Soru Cümleleri", progress: 0 },
      { id: "72-3", title: "Future Continuous ve Will Farkı", progress: 0 },
    ],
  },
  {
    id: "73",
    title: "Deyimsel Fiiller I (Phrasal Verbs I)",
    level: "B1",
    subtopics: [
      { id: "73-1", title: "Ayrılabilen Deyimsel Fiiller", progress: 0 },
      { id: "73-2", title: "Ayrılamayan Deyimsel Fiiller", progress: 0 },
      { id: "73-3", title: "Günlük Hayatta Sık Kullanılanlar", progress: 0 },
    ],
  },
  {
    id: "74",
    title: "Edat Alan Kelimeler (Dependent Prepositions)",
    level: "B1",
    subtopics: [
      { id: "74-1", title: "Edat Alan Fiiller (listen to)", progress: 0 },
      { id: "74-2", title: "Edat Alan Sıfatlar (afraid of)", progress: 0 },
      { id: "74-3", title: "Edat Alan İsimler (reason for)", progress: 0 },
    ],
  },
  {
    id: "75",
    title: "B1 Yeterlilik Sınavı",
    level: "B1",
    isExam: true,
    subtopics: [{ id: "75-1", title: "B1 Yeterlilik Sınavı", progress: 0 }],
  },
  {
    id: "76",
    title: "Geçmişte Süreklilik (Past Perfect Continuous)",
    level: "B2",
    subtopics: [
      { id: "76-1", title: "Olumlu Cümleler", progress: 0 },
      { id: "76-2", title: "Olumsuz ve Soru Cümleleri", progress: 0 },
      {
        id: "76-3",
        title: "Past Perfect ve Past Perfect Continuous Farkı",
        progress: 0,
      },
    ],
  },
  {
    id: "77",
    title: "Gelecek Bitmiş Zaman (Future Perfect)",
    level: "B2",
    subtopics: [
      { id: "77-1", title: "Olumlu Cümleler", progress: 0 },
      { id: "77-2", title: "Olumsuz ve Soru Cümleleri", progress: 0 },
      { id: "77-3", title: "By + Zaman Belirteçleri", progress: 0 },
    ],
  },
  {
    id: "78",
    title: "Gelecek Bitmiş Süreklilik (Future Perfect Continuous)",
    level: "B2",
    subtopics: [
      { id: "78-1", title: "Olumlu Cümleler", progress: 0 },
      { id: "78-2", title: "Olumsuz ve Soru Cümleleri", progress: 0 },
      {
        id: "78-3",
        title: "Future Perfect ve Future Perfect Continuous Farkı",
        progress: 0,
      },
    ],
  },
  {
    id: "79",
    title: "Geçmişe Dair Koşullar (Third Conditional)",
    level: "B2",
    subtopics: [
      { id: "79-1", title: "If + Past Perfect", progress: 0 },
      { id: "79-2", title: "Would have + V3", progress: 0 },
      { id: "79-3", title: "Pişmanlık ve Eleştiri", progress: 0 },
    ],
  },
  {
    id: "80",
    title: "Dilek Cümleleri (Wish / If only)",
    level: "B2",
    subtopics: [
      { id: "80-1", title: "Şimdiki Zaman Dilekleri", progress: 0 },
      { id: "80-2", title: "Geçmiş Zaman Pişmanlıkları", progress: 0 },
      { id: "80-3", title: "Wish + Would (Şikayet)", progress: 0 },
    ],
  },
  {
    id: "81",
    title: "Dolaylı Anlatım: İleri (Reported Speech II)",
    level: "B2",
    subtopics: [
      { id: "81-1", title: "Reported Questions", progress: 0 },
      {
        id: "81-2",
        title: "Reporting Verbs (suggest, advise, admit)",
        progress: 0,
      },
      { id: "81-3", title: "Reported Commands ve Requests", progress: 0 },
    ],
  },
  {
    id: "82",
    title: "İleri Edilgen Çatı (Advanced Passive)",
    level: "B2",
    subtopics: [
      { id: "82-1", title: "Continuous Passive (is being built)", progress: 0 },
      {
        id: "82-2",
        title: "Causative (have / get something done)",
        progress: 0,
      },
      { id: "82-3", title: "Reporting Passive (It is said that)", progress: 0 },
    ],
  },
  {
    id: "83",
    title: "Geçmişe Dair Modallar (Modals of Past)",
    level: "B2",
    subtopics: [
      { id: "83-1", title: "Should have / Shouldn't have", progress: 0 },
      { id: "83-2", title: "Must have / Can't have / Might have", progress: 0 },
      { id: "83-3", title: "Could have / Needn't have", progress: 0 },
    ],
  },
  {
    id: "84",
    title: "Durum Fiilleri ve Anlam Kayması (Stative Verbs)",
    level: "B2",
    subtopics: [
      { id: "84-1", title: "Durum Fiilleri (know, love, want)", progress: 0 },
      {
        id: "84-2",
        title: "Hem Durum Hem Eylem Fiilleri (think, have)",
        progress: 0,
      },
      { id: "84-3", title: "Continuous Yapılmayan Fiiller", progress: 0 },
    ],
  },
  {
    id: "85",
    title: "İleri Bağlaçlar ve Edatlar (Advanced Conjunctions)",
    level: "B2",
    subtopics: [
      { id: "85-1", title: "Whereas / Even though", progress: 0 },
      { id: "85-2", title: "Provided that / As long as / Unless", progress: 0 },
      { id: "85-3", title: "In case / So that / In order to", progress: 0 },
    ],
  },
  {
    id: "86",
    title: "İleri Tanımlıklar (Advanced Determiners)",
    level: "B2",
    subtopics: [
      { id: "86-1", title: "Both / Either / Neither", progress: 0 },
      { id: "86-2", title: "Each / Every / All / Whole", progress: 0 },
      { id: "86-3", title: "Another / Other / Others", progress: 0 },
    ],
  },
  {
    id: "87",
    title: "Deyimsel Fiiller II (Phrasal Verbs II)",
    level: "B2",
    subtopics: [
      { id: "87-1", title: "Üç Kelimeli Deyimsel Fiiller", progress: 0 },
      { id: "87-2", title: "Konu Bazlı Deyimsel Fiiller", progress: 0 },
      { id: "87-3", title: "Çok Anlamlı Deyimsel Fiiller", progress: 0 },
    ],
  },
  {
    id: "88",
    title: "Bağlayıcı İfadeler (Discourse Markers)",
    level: "B2",
    subtopics: [
      { id: "88-1", title: "Sıralama (firstly, finally)", progress: 0 },
      {
        id: "88-2",
        title: "Neden ve Sonuç (therefore, as a result)",
        progress: 0,
      },
      {
        id: "88-3",
        title: "Karşıtlık ve Düzeltme (on the other hand, actually)",
        progress: 0,
      },
    ],
  },
  {
    id: "89",
    title: "B2 Yeterlilik Sınavı",
    level: "B2",
    isExam: true,
    subtopics: [{ id: "89-1", title: "B2 Yeterlilik Sınavı", progress: 0 }],
  },
  {
    id: "90",
    title: "Karışık Koşullar (Mixed Conditionals)",
    level: "C1",
    subtopics: [
      { id: "90-1", title: "Geçmiş Sebep, Şimdiki Sonuç", progress: 0 },
      { id: "90-2", title: "Şimdiki Sebep, Geçmiş Sonuç", progress: 0 },
      { id: "90-3", title: "Karışık Alıştırmalar", progress: 0 },
    ],
  },
  {
    id: "91",
    title: "Sürekliliği İçeren Koşullar (Conditional Continuous)",
    level: "C1",
    subtopics: [
      { id: "91-1", title: "If + Past Continuous", progress: 0 },
      { id: "91-2", title: "Would be + -ing", progress: 0 },
      { id: "91-3", title: "Anlam Farkları", progress: 0 },
    ],
  },
  {
    id: "92",
    title: "Geçmişte Süren Hayali Koşullar (Conditional Perfect Continuous)",
    level: "C1",
    subtopics: [
      { id: "92-1", title: "If + Past Perfect Continuous", progress: 0 },
      { id: "92-2", title: "Would have been + -ing", progress: 0 },
      { id: "92-3", title: "Third Conditional ile Farkı", progress: 0 },
    ],
  },
  {
    id: "93",
    title: "Devrik Cümleler (Inversion)",
    level: "C1",
    subtopics: [
      {
        id: "93-1",
        title: "Olumsuz Zarflarla Devrik (never, rarely)",
        progress: 0,
      },
      { id: "93-2", title: "Hardly / No sooner / Not only", progress: 0 },
      {
        id: "93-3",
        title: "Koşullarda Devrik (Had I, Should you)",
        progress: 0,
      },
    ],
  },
  {
    id: "94",
    title: "Vurgulu Cümleler (Cleft Sentences)",
    level: "C1",
    subtopics: [
      { id: "94-1", title: "It-Cleft Yapıları", progress: 0 },
      { id: "94-2", title: "Wh-Cleft Yapıları", progress: 0 },
      { id: "94-3", title: "All / The thing that Yapıları", progress: 0 },
    ],
  },
  {
    id: "95",
    title: "Dilek-Gereklilik Kipi (Subjunctive)",
    level: "C1",
    subtopics: [
      { id: "95-1", title: "Suggest / Insist / Demand + that", progress: 0 },
      { id: "95-2", title: "It's important that ...", progress: 0 },
      { id: "95-3", title: "Were Subjunctive", progress: 0 },
    ],
  },
  {
    id: "96",
    title: "Ortaç Yapıları (Participle Clauses)",
    level: "C1",
    subtopics: [
      { id: "96-1", title: "Present Participle (-ing)", progress: 0 },
      { id: "96-2", title: "Past Participle (-ed)", progress: 0 },
      { id: "96-3", title: "Perfect Participle (Having done)", progress: 0 },
    ],
  },
  {
    id: "97",
    title: "Kısaltılmış İlgi Cümleleri (Reduced Relative Clauses)",
    level: "C1",
    subtopics: [
      { id: "97-1", title: "-ing ile Kısaltma", progress: 0 },
      { id: "97-2", title: "-ed ile Kısaltma", progress: 0 },
      { id: "97-3", title: "Kısaltma Kuralları ve Sınırları", progress: 0 },
    ],
  },
  {
    id: "98",
    title: "Geçmişte Gelecek (Future in the Past)",
    level: "C1",
    subtopics: [
      { id: "98-1", title: "Was / Were going to", progress: 0 },
      { id: "98-2", title: "Would ile Geçmişte Gelecek", progress: 0 },
      { id: "98-3", title: "Was about to / Was to", progress: 0 },
    ],
  },
  {
    id: "99",
    title: "Eksiltme ve Vurgu (Ellipsis & Emphasis)",
    level: "C1",
    subtopics: [
      { id: "99-1", title: "Eksiltme (Ellipsis)", progress: 0 },
      { id: "99-2", title: "Do ile Vurgu", progress: 0 },
      { id: "99-3", title: "Vurgu Zarfları", progress: 0 },
    ],
  },
  {
    id: "100",
    title: "Resmi ve Günlük Dil (Formal & Informal English)",
    level: "C1",
    subtopics: [
      { id: "100-1", title: "Kelime Seçimi", progress: 0 },
      { id: "100-2", title: "Dil Bilgisi Farkları", progress: 0 },
      { id: "100-3", title: "E-posta ve Konuşma Örnekleri", progress: 0 },
    ],
  },
  {
    id: "101",
    title: "Kalıplar ve Deyimler (Collocations & Idioms)",
    level: "C1",
    subtopics: [
      { id: "101-1", title: "Fiil + İsim Kalıpları", progress: 0 },
      { id: "101-2", title: "Sıfat + İsim Kalıpları", progress: 0 },
      { id: "101-3", title: "Günlük Deyimler", progress: 0 },
    ],
  },
  {
    id: "102",
    title: "C1 Yeterlilik Sınavı",
    level: "C1",
    isExam: true,
    subtopics: [{ id: "102-1", title: "C1 Yeterlilik Sınavı", progress: 0 }],
  },
  {
    id: "103",
    title: "İleri Devrik Cümleler (Advanced Inversion)",
    level: "C2",
    subtopics: [
      { id: "103-1", title: "Only / Not until ile Devrik", progress: 0 },
      { id: "103-2", title: "So / Such ile Devrik", progress: 0 },
      { id: "103-3", title: "Resmi ve Edebi Devrik Yapılar", progress: 0 },
    ],
  },
  {
    id: "104",
    title: "İsimleştirme (Nominalisation)",
    level: "C2",
    subtopics: [
      { id: "104-1", title: "Fiilden İsim Türetme", progress: 0 },
      { id: "104-2", title: "Akademik Metinde Kullanım", progress: 0 },
      { id: "104-3", title: "Cümle Yoğunlaştırma", progress: 0 },
    ],
  },
  {
    id: "105",
    title: "İnce Anlamlı Modallar (Subtle Modality)",
    level: "C2",
    subtopics: [
      { id: "105-1", title: "Modallerin Anlam Tonları", progress: 0 },
      {
        id: "105-2",
        title: "Will / Would / Shall ile Alışkanlık ve Tahmin",
        progress: 0,
      },
      {
        id: "105-3",
        title: "Modal Olmayan İfadeler (be bound to, be likely to)",
        progress: 0,
      },
    ],
  },
  {
    id: "106",
    title: "Resmi Kipler ve Kalıplar (Formal Subjunctive)",
    level: "C2",
    subtopics: [
      { id: "106-1", title: "Resmi Yazıda Subjunctive", progress: 0 },
      { id: "106-2", title: "Sabit Kalıplar (be that as it may)", progress: 0 },
      { id: "106-3", title: "Hukuki ve Resmi Metinler", progress: 0 },
    ],
  },
  {
    id: "107",
    title: "Öne Alma ve Bütünlük (Fronting & Cohesion)",
    level: "C2",
    subtopics: [
      { id: "107-1", title: "Fronting", progress: 0 },
      { id: "107-2", title: "Referans ve Yerine Koyma", progress: 0 },
      { id: "107-3", title: "Metin Bütünlüğü Araçları", progress: 0 },
    ],
  },
  {
    id: "108",
    title: "İleri Ortaç Yapıları (Advanced Participle Clauses)",
    level: "C2",
    subtopics: [
      { id: "108-1", title: "Zarf Ortaç Yapıları", progress: 0 },
      { id: "108-2", title: "Neden ve Zaman Bildiren Ortaçlar", progress: 0 },
      { id: "108-3", title: "Absolute Ortaç Yapıları", progress: 0 },
    ],
  },
  {
    id: "109",
    title: "Kişisiz Edilgen (Impersonal Passive)",
    level: "C2",
    subtopics: [
      { id: "109-1", title: "It is said / believed that", progress: 0 },
      { id: "109-2", title: "Özne + is said to", progress: 0 },
      {
        id: "109-3",
        title: "Perfect Infinitive ile Kişisiz Edilgen",
        progress: 0,
      },
    ],
  },
  {
    id: "110",
    title: "Tutum ve Hafifletme Dili (Stance & Hedging)",
    level: "C2",
    subtopics: [
      {
        id: "110-1",
        title: "Hedging İfadeleri (seems, tends to)",
        progress: 0,
      },
      { id: "110-2", title: "Tutum Zarfları", progress: 0 },
      { id: "110-3", title: "Kesinlik Derecesini Ayarlama", progress: 0 },
    ],
  },
  {
    id: "111",
    title: "İleri Kelime Birliktelikleri (Advanced Collocations)",
    level: "C2",
    subtopics: [
      { id: "111-1", title: "Akademik Collocations", progress: 0 },
      { id: "111-2", title: "İş ve Medya Collocations", progress: 0 },
      { id: "111-3", title: "Güçlü ve Zayıf Collocations", progress: 0 },
    ],
  },
  {
    id: "112",
    title: "Deyimler ve Atasözleri (Idioms & Proverbs)",
    level: "C2",
    subtopics: [
      { id: "112-1", title: "Yaygın Deyimler", progress: 0 },
      { id: "112-2", title: "Atasözleri ve Anlamları", progress: 0 },
      { id: "112-3", title: "Konuşma ve Yazıda Kullanımı", progress: 0 },
    ],
  },
  {
    id: "113",
    title: "Deyimsel Fiiller III (Phrasal Verbs III)",
    level: "C2",
    subtopics: [
      { id: "113-1", title: "İleri Seviye Deyimsel Fiiller", progress: 0 },
      { id: "113-2", title: "Resmi ve Akademik Karşılıkları", progress: 0 },
      { id: "113-3", title: "Mecazi Kullanımlar", progress: 0 },
    ],
  },
  {
    id: "114",
    title: "Sözcük Türetme (Word Formation)",
    level: "C2",
    subtopics: [
      { id: "114-1", title: "Ön Ekler", progress: 0 },
      { id: "114-2", title: "Son Ekler", progress: 0 },
      { id: "114-3", title: "Kelime Türleri Arası Dönüşüm", progress: 0 },
    ],
  },
  {
    id: "115",
    title: "Akademik Yazım (Academic Writing)",
    level: "C2",
    subtopics: [
      { id: "115-1", title: "Paragraf ve Makale Yapısı", progress: 0 },
      { id: "115-2", title: "Akademik Üslup", progress: 0 },
      { id: "115-3", title: "Argüman Geliştirme", progress: 0 },
    ],
  },
  {
    id: "116",
    title: "Retorik ve İkna Dili (Rhetoric & Persuasion)",
    level: "C2",
    subtopics: [
      { id: "116-1", title: "Retorik Teknikler", progress: 0 },
      { id: "116-2", title: "İkna Edici Yapılar", progress: 0 },
      { id: "116-3", title: "Karşı Argüman Kurma", progress: 0 },
    ],
  },
  {
    id: "117",
    title: "Üslup, Ton ve İma (Register, Tone & Pragmatics)",
    level: "C2",
    subtopics: [
      { id: "117-1", title: "Üslup (Register)", progress: 0 },
      { id: "117-2", title: "Ton ve Tutum", progress: 0 },
      { id: "117-3", title: "İma ve Örtük Anlam", progress: 0 },
    ],
  },
  {
    id: "118",
    title: "İngilizce Çeşitleri ve Lehçeler (English Varieties)",
    level: "C2",
    subtopics: [
      { id: "118-1", title: "İngiliz ve Amerikan İngilizcesi", progress: 0 },
      {
        id: "118-2",
        title: "Diğer Çeşitler (Avustralya, Kanada...)",
        progress: 0,
      },
      { id: "118-3", title: "Telaffuz ve Sözcük Farkları", progress: 0 },
    ],
  },
  {
    id: "119",
    title: "Özetleme ve Yeniden İfade (Summarising & Paraphrasing)",
    level: "C2",
    subtopics: [
      { id: "119-1", title: "Ana Fikri Bulma", progress: 0 },
      { id: "119-2", title: "Paraphrasing Teknikleri", progress: 0 },
      { id: "119-3", title: "Özet Yazma", progress: 0 },
    ],
  },
  {
    id: "120",
    title: "C2 Yeterlilik Sınavı",
    level: "C2",
    isExam: true,
    subtopics: [{ id: "120-1", title: "C2 Yeterlilik Sınavı", progress: 0 }],
  },
];

export function getDashboardTopicById(
  topicId: string,
): DashboardTopic | undefined {
  return dashboardTopics.find((topic) => topic.id === topicId);
}
