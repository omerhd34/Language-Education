import type { VocabularyCategory } from "@/data/vocabulary/types";

export const vocabularyCategory8: VocabularyCategory = {
  id: "8",
  title: "Kişisel Bilgiler",
  words: [
    {
      id: "8-1",
      en: "Name",
      tr: "İsim",
      examples: [
        { en: "What is your name?", tr: "Adın ne?" },
        { en: "My name is Emre.", tr: "Benim adım Emre." },
        {
          en: "Please write your name on the form.",
          tr: "Lütfen formda adınızı yazın.",
        },
      ],
    },
    {
      id: "8-2",
      en: "Surname",
      tr: "Soyisim",
      similar: [
        {
          en: "last name",
          tr: "soyisim",
          example: {
            en: "Please spell your last name.",
            tr: "Lütfen soyadınızı harf harf söyleyin.",
          },
        },
      ],
      examples: [
        { en: "What is your surname?", tr: "Soyadın ne?" },
        {
          en: "Her surname starts with a capital letter.",
          tr: "Soyadı büyük harfle başlar.",
        },
        {
          en: "I cannot remember his surname.",
          tr: "Soyadını hatırlayamıyorum.",
        },
      ],
    },
    {
      id: "8-3",
      en: "Last name",
      tr: "Soyisim",
      similar: [
        {
          en: "surname",
          tr: "soyisim",
          example: {
            en: "What is your surname?",
            tr: "Soyadın ne?",
          },
        },
      ],
      examples: [
        {
          en: "Please spell your last name.",
          tr: "Lütfen soyadınızı harf harf söyleyin.",
        },
        { en: "My last name is Yilmaz.", tr: "Soyadım Yılmaz." },
        {
          en: "The teacher called my last name.",
          tr: "Öğretmen soyadımı söyledi.",
        },
      ],
    },
    {
      id: "8-4",
      en: "Age",
      tr: "Yaş",
      examples: [
        { en: "What is your age?", tr: "Kaç yaşındasın?" },
        {
          en: "Children under six years of age ride free.",
          tr: "Altı yaşından küçük çocuklar ücretsiz biner.",
        },
        { en: "Age is just a number.", tr: "Yaş sadece bir sayıdır." },
      ],
    },
    {
      id: "8-5",
      en: "Address",
      tr: "Adres",
      examples: [
        { en: "What is your home address?", tr: "Ev adresin nedir?" },
        {
          en: "Please write your address clearly.",
          tr: "Lütfen adresinizi okunaklı yazın.",
        },
        {
          en: "The letter was sent to the wrong address.",
          tr: "Mektup yanlış adrese gönderildi.",
        },
      ],
    },
    {
      id: "8-6",
      en: "Phone",
      tr: "Telefon",
      similar: [
        {
          en: "mobile",
          tr: "cep telefonu",
          example: {
            en: "I left my mobile at home.",
            tr: "Cep telefonumu evde unuttum.",
          },
        },
        {
          en: "cellphone",
          tr: "cep telefonu",
          example: {
            en: "Her cellphone needs a charger.",
            tr: "Her cep telefonunun şarj cihazına ihtiyacı vardır.",
          },
        },
      ],
      examples: [
        { en: "My phone is on the table.", tr: "Telefonum masanın üzerinde." },
        { en: "Can I use your phone?", tr: "Telefonunu kullanabilir miyim?" },
        { en: "She left her phone at home.", tr: "Telefonunu evde unuttu." },
      ],
    },
    {
      id: "8-7",
      en: "Phone number",
      tr: "Telefon numarası",
      examples: [
        { en: "What is your phone number?", tr: "Telefon numaran nedir?" },
        { en: "I saved your phone number.", tr: "Telefon numaranı kaydettim." },
        {
          en: "Please give me your phone number.",
          tr: "Lütfen telefon numaranı ver.",
        },
      ],
    },
    {
      id: "8-8",
      en: "Email",
      tr: "E-posta",
      similar: [
        {
          en: "e-mail",
          tr: "e-posta",
          example: {
            en: "Send me an e-mail, please.",
            tr: "Lütfen bana bir e-posta gönder.",
          },
        },
      ],
      examples: [
        {
          en: "Send me an email, please.",
          tr: "Lütfen bana bir e-posta gönder.",
        },
        { en: "What is your email address?", tr: "E-posta adresin nedir?" },
        {
          en: "I check my email every morning.",
          tr: "Her sabah e-postamı kontrol ederim.",
        },
      ],
    },
    {
      id: "8-9",
      en: "Country",
      tr: "Ülke",
      similar: [
        {
          en: "nation",
          tr: "ulus / ülke",
          example: {
            en: "Every nation has its own culture.",
            tr: "Her ulusun kendine özgü bir kültürü vardır.",
          },
        },
      ],
      examples: [
        {
          en: "Turkey is a beautiful country.",
          tr: "Türkiye güzel bir ülkedir.",
        },
        { en: "Which country are you from?", tr: "Hangi ülkedensin?" },
        {
          en: "I want to visit another country someday.",
          tr: "Bir gün başka bir ülkeyi ziyaret etmek istiyorum.",
        },
      ],
    },
    {
      id: "8-10",
      en: "City",
      tr: "Şehir",
      similar: [
        {
          en: "town",
          tr: "kasaba / şehir",
          example: {
            en: "I grew up in a small town.",
            tr: "Küçük bir kasabada büyüdüm.",
          },
        },
      ],
      examples: [
        { en: "Istanbul is a big city.", tr: "İstanbul büyük bir şehirdir." },
        { en: "Which city do you live in?", tr: "Hangi şehirde yaşıyorsun?" },
        { en: "The city is quiet at night.", tr: "Şehir gece sessizdir." },
      ],
    },
    {
      id: "8-11",
      en: "Nationality",
      tr: "Uyruk",
      similar: [
        {
          en: "citizenship",
          tr: "vatandaşlık",
          example: {
            en: "She applied for citizenship last year.",
            tr: "Geçen yıl vatandaşlık başvurusu yaptı.",
          },
        },
      ],
      examples: [
        { en: "What is your nationality?", tr: "Uyruğun nedir?" },
        {
          en: "Nationality is written on the passport.",
          tr: "Uyruk pasaportta yazılıdır.",
        },
        { en: "She has dual nationality.", tr: "Çifte uyruğu var." },
      ],
    },
    {
      id: "8-12",
      en: "Job / Occupation",
      tr: "Meslek",
      similar: [
        {
          en: "job",
          tr: "iş",
          example: {
            en: "He changed his job last year.",
            tr: "Geçen yıl işini değiştirdi.",
          },
        },
        {
          en: "work",
          tr: "iş / çalışma",
          example: {
            en: "She enjoys her work.",
            tr: "İşinden hoşlanıyor.",
          },
        },
      ],
      examples: [
        { en: "What is your job?", tr: "Mesleğin ne?" },
        {
          en: "Teaching is a rewarding occupation.",
          tr: "Öğretmenlik ödüllendirici bir meslektir.",
        },
        {
          en: "He changed his job last year.",
          tr: "Geçen yıl işini değiştirdi.",
        },
      ],
    },
    {
      id: "8-13",
      en: "Hobby",
      tr: "Hobi",
      similar: [
        {
          en: "pastime",
          tr: "uğraşı / hobi",
          example: {
            en: "Reading is a relaxing pastime.",
            tr: "Okumak rahatlatıcı bir uğraştır.",
          },
        },
      ],
      examples: [
        {
          en: "Reading is my favorite hobby.",
          tr: "Okumak en sevdiğim hobim.",
        },
        { en: "What hobbies do you have?", tr: "Hobilerin neler?" },
        {
          en: "She started a new hobby: painting.",
          tr: "Yeni bir hobiye başladı: resim.",
        },
      ],
    },
    {
      id: "8-14",
      en: "Birthday",
      tr: "Doğum günü",
      similar: [
        {
          en: "birthdate",
          tr: "doğum tarihi",
          example: {
            en: "Please enter your birthdate.",
            tr: "Lütfen doğum tarihinizi girin.",
          },
        },
      ],
      examples: [
        { en: "When is your birthday?", tr: "Doğum günün ne zaman?" },
        {
          en: "We sang happy birthday to her.",
          tr: "Ona doğum günü şarkısı söyledik.",
        },
        { en: "My birthday is in May.", tr: "Doğum günüm mayısta." },
      ],
    },
    {
      id: "8-15",
      en: "Birthdate",
      tr: "Doğum tarihi",
      similar: [
        {
          en: "birthday",
          tr: "doğum günü",
          example: {
            en: "When is your birthday?",
            tr: "Doğum günün ne zaman?",
          },
        },
      ],
      examples: [
        {
          en: "Please enter your birthdate.",
          tr: "Lütfen doğum tarihinizi girin.",
        },
        {
          en: "My birthdate is March 12, 2000.",
          tr: "Doğum tarihim 12 Mart 2000.",
        },
        {
          en: "The form asks for your birthdate.",
          tr: "Form doğum tarihinizi soruyor.",
        },
      ],
    },
    {
      id: "8-16",
      en: "Married",
      tr: "Evli",
      examples: [
        { en: "Are you married?", tr: "Evli misin?" },
        { en: "They got married last summer.", tr: "Geçen yaz evlendiler." },
        {
          en: "She is married with two children.",
          tr: "Evli ve iki çocuğu var.",
        },
      ],
    },
    {
      id: "8-17",
      en: "Single",
      tr: "Bekar",
      similar: [
        {
          en: "unmarried",
          tr: "evli olmayan / bekar",
          example: {
            en: "She is unmarried and lives alone.",
            tr: "Evli değil ve yalnız yaşıyor.",
          },
        },
      ],
      examples: [
        { en: "He is single and lives alone.", tr: "Bekar ve yalnız yaşıyor." },
        { en: "Are you single or married?", tr: "Bekar mısın yoksa evli mi?" },
        { en: "She enjoys being single.", tr: "Bekar olmaktan hoşlanıyor." },
      ],
    },
    {
      id: "8-18",
      en: "Height",
      tr: "Boy",
      examples: [
        { en: "What is your height?", tr: "Boyun kaç?" },
        { en: "He is tall for his height.", tr: "Boyuna göre uzundur." },
        {
          en: "Please write your height in centimeters.",
          tr: "Lütfen boyunuzu santimetre olarak yazın.",
        },
      ],
    },
    {
      id: "8-19",
      en: "Weight",
      tr: "Kilo",
      examples: [
        { en: "What is your weight?", tr: "Kilon kaç?" },
        {
          en: "The doctor checked my weight.",
          tr: "Doktor kilomu kontrol etti.",
        },
        {
          en: "This bag is too heavy in weight.",
          tr: "Bu çanta kilo olarak çok ağır.",
        },
      ],
    },
  ],
};
